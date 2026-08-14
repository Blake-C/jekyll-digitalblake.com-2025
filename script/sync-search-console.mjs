#!/usr/bin/env node
/**
 * Pulls Search Analytics, Sitemaps, and URL Inspection from Google Search
 * Console, derives a flat `issues[]` list from them, and writes both to
 * tmp/search-console/report.{json,md}.
 *
 * That output is private diagnostic data, so it lives under tmp/ (gitignored)
 * and never under _data/, where Jekyll would publish it.
 *
 * Flags: --max=N caps URL Inspection; --no-inspect skips it entirely.
 * Auth and the GSC_* env vars are documented in CLAUDE.md.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { createSign } from 'crypto'
import { setDefaultResultOrder } from 'dns'
import { join, dirname, isAbsolute } from 'path'
import { fileURLToPath } from 'url'

// In the container, IPv6 routes to Google's endpoints hang and time out before falling back, so
// resolve IPv4 first to connect immediately (the fetch retry wrapper covers genuine drops).
setDefaultResultOrder('ipv4first')

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'tmp/search-console')
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

// Search Console data lags ~2 days; look back 28 days ending 2 days ago.
const ANALYTICS_LOOKBACK_DAYS = 28
const ANALYTICS_LAG_DAYS = 2
const ANALYTICS_ROW_LIMIT = 100

// URL Inspection is capped at 2,000/day per property. By default inspect every sitemap URL (up to
// the hard cap); --max=N narrows it. Throttle to respect the 600/min ceiling (250ms is safe).
const INSPECT_HARD_CAP = 1000
const INSPECT_DELAY_MS = 250

// "High impressions, low CTR" opportunity thresholds for the derived issues list.
// Pages aggregate more impressions than individual queries, so they use a higher floor.
const LOW_CTR_MAX_RATE = 0.01
const LOW_CTR_QUERY_MIN_IMPRESSIONS = 20
const LOW_CTR_PAGE_MIN_IMPRESSIONS = 50

const SITE_URL = normalizeSiteUrl(process.env.GSC_SITE_URL || 'https://digitalblake.com/')
const BASE_URL = resolveBaseUrl(process.env.GSC_BASE_URL, SITE_URL)
const KEY_PATH = resolveKeyPath(process.env.GSC_SERVICE_ACCOUNT_KEY || 'secrets/gsc-service-account.json')

const args = process.argv.slice(2)
const noInspect = args.includes('--no-inspect')
const maxArg = args.find(a => a.startsWith('--max='))
const inspectMax = Math.min(maxArg ? Math.max(0, parseInt(maxArg.slice('--max='.length), 10) || 0) : INSPECT_HARD_CAP, INSPECT_HARD_CAP)

function normalizeSiteUrl(url) {
	// URL-prefix properties always carry a trailing slash; the API rejects a mismatch.
	// Domain properties (sc-domain:example.com) are passed through untouched.
	return /^https?:\/\//i.test(url) && !url.endsWith('/') ? `${url}/` : url
}

// The https origin used to fetch the live sitemap and as the inspectionUrl. A Domain property's
// siteUrl (sc-domain:example.com) is not a fetchable URL, so derive https://example.com/ from it.
function resolveBaseUrl(explicit, siteUrl) {
	if (explicit) return explicit.endsWith('/') ? explicit : `${explicit}/`
	if (siteUrl.startsWith('sc-domain:')) return `https://${siteUrl.slice('sc-domain:'.length)}/`
	return siteUrl
}

function resolveKeyPath(p) {
	return isAbsolute(p) ? p : join(ROOT, p)
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// The timeout is deliberately generous: URL Inspection runs real-time analysis
// and legitimately takes several seconds per URL, so a short cap would abort
// valid calls. Cold-start stalls are handled by ipv4first above instead.
const MAX_RETRIES = 6
const REQUEST_TIMEOUT_MS = 25000
async function fetchRetry(url, options = {}, attempt = 1) {
	try {
		const res = await fetch(url, { ...options, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
		if (res.status >= 500 && attempt < MAX_RETRIES) {
			await sleep(attempt * 500)
			return fetchRetry(url, options, attempt + 1)
		}
		return res
	} catch (err) {
		if (attempt >= MAX_RETRIES) throw err
		await sleep(attempt * 500)
		return fetchRetry(url, options, attempt + 1)
	}
}

// UTC, matching GSC's own reporting.
function isoDaysAgo(daysAgo) {
	const d = new Date()
	d.setUTCDate(d.getUTCDate() - daysAgo)
	return d.toISOString().slice(0, 10)
}

const base64url = input => Buffer.from(input).toString('base64url')

// Mint a service-account access token via the JWT-bearer grant using native crypto + fetch.
// (Avoids google-auth-library, whose bundled HTTP client fails on Node 24's fetch with a
// "Premature close" reading the token response.)
let accessToken
async function authorize() {
	if (!existsSync(KEY_PATH)) {
		console.error(`Error: service-account key not found at ${KEY_PATH}`)
		console.error('Set GSC_SERVICE_ACCOUNT_KEY to its path, or place it at secrets/gsc-service-account.json.')
		process.exit(1)
	}

	let key
	try {
		key = JSON.parse(readFileSync(KEY_PATH, 'utf8'))
	} catch (err) {
		console.error(`Error: could not read service-account key at ${KEY_PATH} (${err.message})`)
		process.exit(1)
	}
	if (!key.client_email || !key.private_key) {
		console.error(`Error: ${KEY_PATH} is missing client_email or private_key — is it a service-account key?`)
		process.exit(1)
	}

	const tokenUri = key.token_uri || 'https://oauth2.googleapis.com/token'
	const now = Math.floor(Date.now() / 1000)
	const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
	const claims = base64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: tokenUri, iat: now, exp: now + 3600 }))
	const signingInput = `${header}.${claims}`
	const signature = createSign('RSA-SHA256').update(signingInput).end().sign(key.private_key, 'base64url')
	const assertion = `${signingInput}.${signature}`

	let data
	try {
		const res = await fetchRetry(tokenUri, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ 'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion': assertion }),
		})
		data = await res.json().catch(() => ({}))
		if (!res.ok || !data.access_token) {
			throw new Error(data.error_description || data.error || `HTTP ${res.status}`)
		}
	} catch (err) {
		console.error(`Error: could not obtain an access token (${err.message})`)
		process.exit(1)
	}
	accessToken = data.access_token
}

async function gscFetch(url, { method = 'GET', body } = {}) {
	const res = await fetchRetry(url, {
		method,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			...(body ? { 'Content-Type': 'application/json' } : {}),
		},
		...(body ? { body: JSON.stringify(body) } : {}),
	})
	const text = await res.text()
	const data = text ? JSON.parse(text) : {}
	if (!res.ok) {
		const message = data?.error?.message || res.statusText
		if (res.status === 403) {
			throw new Error(`${message} — confirm the service account is a user on ${SITE_URL} and the URL matches exactly (trailing slash).`)
		}
		throw new Error(`${res.status} ${message}`)
	}
	return data
}

const encodedSite = encodeURIComponent(SITE_URL)

async function fetchSearchAnalytics() {
	const startDate = isoDaysAgo(ANALYTICS_LAG_DAYS + ANALYTICS_LOOKBACK_DAYS)
	const endDate = isoDaysAgo(ANALYTICS_LAG_DAYS)
	const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`

	async function queryBy(dimension) {
		const data = await gscFetch(url, {
			method: 'POST',
			body: { startDate, endDate, dimensions: [dimension], rowLimit: ANALYTICS_ROW_LIMIT },
		})
		return (data.rows || []).map(r => ({
			[dimension]: r.keys[0],
			clicks: r.clicks,
			impressions: r.impressions,
			ctr: r.ctr,
			position: r.position,
		}))
	}

	const [queries, pages] = await Promise.all([queryBy('query'), queryBy('page')])
	console.log(`  ✓ analytics: ${queries.length} queries, ${pages.length} pages (${startDate} → ${endDate})`)
	return { range: { startDate, endDate }, queries, pages }
}

async function fetchSitemaps() {
	const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps`
	const data = await gscFetch(url)
	const sitemaps = (data.sitemap || []).map(s => ({
		path: s.path,
		lastDownloaded: s.lastDownloaded || null,
		lastSubmitted: s.lastSubmitted || null,
		isPending: s.isPending || false,
		errors: Number(s.errors || 0),
		warnings: Number(s.warnings || 0),
	}))
	console.log(`  ✓ sitemaps: ${sitemaps.length} listed`)
	return sitemaps
}

// Pull the canonical URL list from the live sitemap so we inspect real, indexable pages.
async function collectSitemapUrls() {
	try {
		const res = await fetchRetry(`${BASE_URL}sitemap.xml`)
		if (!res.ok) {
			console.warn(`  ! could not fetch ${BASE_URL}sitemap.xml (${res.status}); skipping URL inspection`)
			return []
		}
		const xml = await res.text()
		const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m => m[1])
		return [...new Set(urls)]
	} catch (err) {
		console.warn(`  ! could not fetch sitemap (${err.message}); skipping URL inspection`)
		return []
	}
}

async function inspectUrl(inspectionUrl) {
	const data = await gscFetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
		method: 'POST',
		body: { inspectionUrl, siteUrl: SITE_URL, languageCode: 'en-US' },
	})
	const result = data.inspectionResult || {}
	const index = result.indexStatusResult || {}
	const mobile = result.mobileUsabilityResult || {}
	const rich = result.richResultsResult || {}
	return {
		url: inspectionUrl,
		verdict: index.verdict || null,
		coverageState: index.coverageState || null,
		robotsTxtState: index.robotsTxtState || null,
		indexingState: index.indexingState || null,
		pageFetchState: index.pageFetchState || null,
		lastCrawlTime: index.lastCrawlTime || null,
		googleCanonical: index.googleCanonical || null,
		userCanonical: index.userCanonical || null,
		mobileVerdict: mobile.verdict || null,
		mobileIssues: (mobile.issues || []).map(i => i.message).filter(Boolean),
		richResultsVerdict: rich.verdict || null,
	}
}

async function inspectUrls(urls) {
	const sliced = urls.slice(0, inspectMax)
	if (urls.length > sliced.length) {
		console.log(`  i ${urls.length} URLs in sitemap; inspecting first ${sliced.length} (raise with --max=N, cap ${INSPECT_HARD_CAP})`)
	}
	const results = []
	for (const [i, url] of sliced.entries()) {
		try {
			results.push(await inspectUrl(url))
		} catch (err) {
			console.warn(`  ! inspect failed for ${url} (${err.message})`)
			results.push({ url, error: err.message })
		}
		if (i < sliced.length - 1) await sleep(INSPECT_DELAY_MS)
	}
	console.log(`  ✓ inspected ${results.length} URLs`)
	return results
}

// Ordered most-actionable first.
function deriveIssues({ searchAnalytics, sitemaps, urlInspection }) {
	const issues = []

	for (const s of sitemaps) {
		if (s.errors > 0) issues.push({ type: 'sitemap-error', target: s.path, detail: `${s.errors} error(s)` })
		if (s.warnings > 0) issues.push({ type: 'sitemap-warning', target: s.path, detail: `${s.warnings} warning(s)` })
	}

	for (const r of urlInspection) {
		if (r.error) {
			issues.push({ type: 'inspect-error', target: r.url, detail: r.error })
			continue
		}
		const indexed = r.coverageState === 'Submitted and indexed' || r.verdict === 'PASS'
		if (!indexed) {
			issues.push({ type: 'not-indexed', target: r.url, detail: r.coverageState || r.verdict || 'unknown' })
		}
		if (r.robotsTxtState === 'DISALLOWED') {
			issues.push({ type: 'robots-blocked', target: r.url, detail: 'disallowed by robots.txt' })
		}
		// UNSPECIFIED just means Google hasn't fetched the page yet (already covered by not-indexed);
		// only flag genuine fetch failures (SOFT_404, BLOCKED_ROBOTS_TXT, NOT_FOUND, SERVER_ERROR, etc.).
		if (r.pageFetchState && r.pageFetchState !== 'SUCCESSFUL' && r.pageFetchState !== 'PAGE_FETCH_STATE_UNSPECIFIED') {
			issues.push({ type: 'fetch-problem', target: r.url, detail: r.pageFetchState })
		}
		if (r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical) {
			issues.push({ type: 'canonical-mismatch', target: r.url, detail: `declared ${r.userCanonical}, Google chose ${r.googleCanonical}` })
		}
		if (r.mobileVerdict === 'FAIL') {
			issues.push({ type: 'mobile-usability', target: r.url, detail: r.mobileIssues.join('; ') || 'failed mobile usability' })
		}
	}

	// Pages first: a low-CTR page points directly at a title/meta-description to rewrite.
	for (const p of searchAnalytics.pages) {
		if (p.impressions >= LOW_CTR_PAGE_MIN_IMPRESSIONS && p.ctr < LOW_CTR_MAX_RATE) {
			issues.push({
				type: 'low-ctr-page',
				target: p.page,
				detail: `${p.impressions} impressions, ${(p.ctr * 100).toFixed(1)}% CTR, avg position ${p.position.toFixed(1)}`,
			})
		}
	}

	for (const q of searchAnalytics.queries) {
		if (q.impressions >= LOW_CTR_QUERY_MIN_IMPRESSIONS && q.ctr < LOW_CTR_MAX_RATE) {
			issues.push({
				type: 'low-ctr-query',
				target: q.query,
				detail: `${q.impressions} impressions, ${(q.ctr * 100).toFixed(1)}% CTR, avg position ${q.position.toFixed(1)}`,
			})
		}
	}

	const order = ['inspect-error', 'fetch-problem', 'robots-blocked', 'not-indexed', 'canonical-mismatch', 'sitemap-error', 'mobile-usability', 'low-ctr-page', 'sitemap-warning', 'low-ctr-query']
	issues.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
	return issues
}

function ageInDays(isoTime) {
	if (!isoTime) return null
	const then = Date.parse(isoTime)
	if (Number.isNaN(then)) return null
	return Math.floor((Date.now() - then) / 86400000)
}

function summarizeIndexing(urlInspection) {
	const byCoverage = {}
	let errors = 0
	let canonicalConflicts = 0
	for (const r of urlInspection) {
		if (r.error) {
			errors++
			continue
		}
		const state = r.coverageState || 'unknown'
		byCoverage[state] = (byCoverage[state] || 0) + 1
		if (r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical) canonicalConflicts++
	}
	const indexed = byCoverage['Submitted and indexed'] || 0
	return {
		inspected: urlInspection.length,
		indexed,
		notIndexed: urlInspection.length - indexed - errors,
		errors,
		canonicalConflicts,
		byCoverage,
	}
}

function renderMarkdown(report) {
	const { generatedAt, siteUrl, issues, summary, searchAnalytics, sitemaps, urlInspection } = report
	const lines = []
	lines.push(`# Search Console report — ${siteUrl}`)
	lines.push('')
	lines.push(`Generated ${generatedAt}. This is private diagnostic data; do not publish it.`)
	lines.push('')

	lines.push(`## Issues (${issues.length})`)
	lines.push('')
	if (issues.length === 0) {
		lines.push('No issues derived from the synced data.')
	} else {
		lines.push('| Type | Target | Detail |')
		lines.push('| --- | --- | --- |')
		for (const i of issues) lines.push(`| ${i.type} | ${i.target} | ${i.detail} |`)
	}
	lines.push('')

	lines.push('## Indexing summary')
	lines.push('')
	if (summary.inspected === 0) {
		lines.push('No URLs inspected.')
	} else {
		lines.push(`${summary.indexed} indexed, ${summary.notIndexed} not indexed, ${summary.errors} errored — of ${summary.inspected} inspected. ${summary.canonicalConflicts} canonical conflict(s).`)
		lines.push('')
		lines.push('| Coverage state | Count |')
		lines.push('| --- | --: |')
		for (const [state, count] of Object.entries(summary.byCoverage).sort((a, b) => b[1] - a[1])) {
			lines.push(`| ${state} | ${count} |`)
		}
	}
	lines.push('')

	lines.push(`## Top queries (${searchAnalytics.range.startDate} → ${searchAnalytics.range.endDate})`)
	lines.push('')
	lines.push('| Query | Clicks | Impr. | CTR | Pos. |')
	lines.push('| --- | --: | --: | --: | --: |')
	for (const q of searchAnalytics.queries.slice(0, 25)) {
		lines.push(`| ${q.query} | ${q.clicks} | ${q.impressions} | ${(q.ctr * 100).toFixed(1)}% | ${q.position.toFixed(1)} |`)
	}
	lines.push('')

	lines.push('## Top pages')
	lines.push('')
	lines.push('| Page | Clicks | Impr. | CTR | Pos. |')
	lines.push('| --- | --: | --: | --: | --: |')
	for (const p of searchAnalytics.pages.slice(0, 25)) {
		lines.push(`| ${p.page} | ${p.clicks} | ${p.impressions} | ${(p.ctr * 100).toFixed(1)}% | ${p.position.toFixed(1)} |`)
	}
	lines.push('')

	lines.push(`## Sitemaps (${sitemaps.length})`)
	lines.push('')
	if (sitemaps.length === 0) {
		lines.push('None reported.')
	} else {
		lines.push('| Path | Errors | Warnings | Last downloaded |')
		lines.push('| --- | --: | --: | --- |')
		for (const s of sitemaps) lines.push(`| ${s.path} | ${s.errors} | ${s.warnings} | ${s.lastDownloaded || 'never'} |`)
	}
	lines.push('')

	lines.push(`## URL inspection (${urlInspection.length})`)
	lines.push('')
	if (urlInspection.length === 0) {
		lines.push('Skipped or no URLs inspected.')
	} else {
		lines.push('| URL | Coverage | Robots | Crawl age | Google canonical |')
		lines.push('| --- | --- | --- | --: | --- |')
		for (const r of urlInspection) {
			const age = ageInDays(r.lastCrawlTime)
			const crawl = age === null ? 'never' : `${age}d`
			// Only call out the canonical when Google disagrees with the page's declared one.
			const canonical = r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical ? r.googleCanonical : ''
			lines.push(`| ${r.url} | ${r.coverageState || r.error || '?'} | ${r.robotsTxtState || '?'} | ${crawl} | ${canonical} |`)
		}
	}
	lines.push('')

	return lines.join('\n')
}

async function main() {
	console.log(`Syncing Search Console data for ${SITE_URL}...\n`)
	await authorize()

	const searchAnalytics = await fetchSearchAnalytics()
	const sitemaps = await fetchSitemaps()

	let urlInspection = []
	if (noInspect) {
		console.log('  i URL inspection skipped (--no-inspect)')
	} else {
		const urls = await collectSitemapUrls()
		if (urls.length) urlInspection = await inspectUrls(urls)
	}

	const report = {
		generatedAt: new Date().toISOString(),
		siteUrl: SITE_URL,
		summary: summarizeIndexing(urlInspection),
		searchAnalytics,
		sitemaps,
		urlInspection,
		issues: [],
	}
	report.issues = deriveIssues(report)

	mkdirSync(OUT_DIR, { recursive: true })
	writeFileSync(join(OUT_DIR, 'report.json'), JSON.stringify(report, null, '\t') + '\n')
	writeFileSync(join(OUT_DIR, 'report.md'), renderMarkdown(report) + '\n')

	console.log(`\nDone: ${report.issues.length} issue(s) derived.`)
	console.log('Wrote tmp/search-console/report.json and report.md')
}

main().catch(err => {
	console.error(`\nFailed: ${err.message}`)
	process.exit(1)
})
