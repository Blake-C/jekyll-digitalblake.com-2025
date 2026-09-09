/**
 * What the build must emit. htmlproofer checks that markup is well formed and
 * that links resolve, so none of these assertions overlap with it.
 *
 * Reads _site, so run a build first.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import yaml from 'js-yaml'
import {
	ROOT,
	SITE_DIR,
	SITE_URL,
	NO_BREADCRUMB,
	pages,
	attr,
	tags,
	metaName,
	metaProperty,
	linkHrefs,
	imgTags,
	jsonLdBlocks,
	jsonLdTypes,
} from './lib/site.mjs'

const INDEXABLE = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const NOINDEX = 'noindex, follow'
const CRITICAL_CSS = join(ROOT, '_includes/critical.min.css')
const FONT_MANIFEST_KEY = "site.data.asset_manifest['montserrat-variable-webfont-woff2']"

const isPost = url => /^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/.test(url)
const isCaseStudy = url => /^\/case-studies\/[^/]+\/$/.test(url)
const isGuide = url => /^\/guides\/[^/]+\/$/.test(url)
const isArchive = url => /^\/(category|tag|author)\//.test(url)
const isPaged = url => url.includes('/page/')

/** Read from source, so adding a profile_schema page does not mean editing this
 *  file. */
const profileUrls = new Set(
	readdirSync(ROOT)
		.filter(name => name.endsWith('.md'))
		.map(name => {
			const match = readFileSync(join(ROOT, name), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
			if (!match) return null
			const data = yaml.load(match[1]) ?? {}
			return data.profile_schema ? data.permalink : null
		})
		.filter(Boolean),
)

const countSource = dir => readdirSync(join(ROOT, dir)).filter(name => name.endsWith('.md')).length

const all = pages()

test('the built site was found and has pages', () => {
	assert.ok(all.length > 50, `only ${all.length} pages in _site; is the build complete?`)
})

test('every source document produced a page', () => {
	assert.equal(all.filter(p => isPost(p.url)).length, countSource('_posts'), 'post count differs from _posts')
	assert.equal(
		all.filter(p => isCaseStudy(p.url)).length,
		countSource('_case_studies'),
		'case study count differs from _case_studies',
	)
})

test('every JSON-LD block is valid JSON', () => {
	for (const { url, html } of all) {
		for (const block of jsonLdBlocks(html)) {
			assert.doesNotThrow(() => JSON.parse(block), `${url}: JSON-LD does not parse`)
		}
	}
})

test('each page type emits its structured data', () => {
	const missing = []
	const expect = (page, type) => {
		if (!jsonLdTypes(page.html).includes(type)) missing.push(`${page.url} is missing ${type}`)
	}

	for (const page of all) {
		if (page.url === '/') expect(page, 'Person')
		else if (isPost(page.url)) expect(page, 'Article')
		else if (isCaseStudy(page.url)) expect(page, 'CreativeWork')
		else if (isGuide(page.url)) expect(page, 'CollectionPage')
		if (profileUrls.has(page.url)) expect(page, 'ProfilePage')
	}

	assert.deepEqual(missing, [], `structured data missing:\n  ${missing.join('\n  ')}`)
})

test('every page except home and 404 emits a breadcrumb', () => {
	for (const { url, html } of all) {
		if (NO_BREADCRUMB.has(url)) continue
		assert.ok(jsonLdTypes(html).includes('BreadcrumbList'), `${url}: no BreadcrumbList`)
	}
})

test('canonical is absolute, production, and matches the page', () => {
	for (const { url, html } of all) {
		const hrefs = linkHrefs(html, 'canonical')
		assert.equal(hrefs.length, 1, `${url}: expected one canonical, found ${hrefs.length}`)
		assert.equal(hrefs[0], `${SITE_URL}${url}`, `${url}: canonical points elsewhere`)
	}
})

test('og:url agrees with canonical', () => {
	for (const { url, html } of all) {
		assert.equal(metaProperty(html, 'og:url'), `${SITE_URL}${url}`, `${url}: og:url disagrees`)
	}
})

test('archives and paginated pages are noindex, everything else is indexable', () => {
	for (const { url, html } of all) {
		const robots = metaName(html, 'robots')
		const shouldHide = isArchive(url) || isPaged(url) || url === '/404.html'
		assert.equal(robots, shouldHide ? NOINDEX : INDEXABLE, `${url}: wrong robots directive`)
	}
})

test('every page has a title, a description, an og:image, and a CSP', () => {
	for (const { url, html } of all) {
		assert.match(html, /<title>[\s\S]*?\S[\s\S]*?<\/title>/, `${url}: empty or missing title`)
		assert.ok(metaName(html, 'description')?.trim(), `${url}: empty or missing description`)
		assert.ok(metaProperty(html, 'og:image')?.startsWith(SITE_URL), `${url}: og:image is not absolute`)

		const csp = tags(html, 'meta').find(tag => attr(tag, 'http-equiv') === 'Content-Security-Policy')
		assert.ok(csp, `${url}: no Content-Security-Policy meta`)
		assert.match(attr(csp, 'content'), /default-src 'self'/, `${url}: CSP lost its default-src`)
	}
})

test('every image carries dimensions and alt text', () => {
	const bad = []
	for (const { url, html } of all) {
		for (const tag of imgTags(html)) {
			const src = attr(tag, 'src') ?? '(no src)'
			for (const name of ['width', 'height', 'alt']) {
				if (attr(tag, name) === null) bad.push(`${url}: ${src} has no ${name}`)
			}
		}
	}
	assert.deepEqual(bad, [], `images missing attributes:\n  ${bad.join('\n  ')}`)
})

test('every referenced asset exists in the build', () => {
	const missing = new Set()
	for (const { html } of all) {
		for (const element of ['link', 'script', 'img', 'source']) {
			for (const tag of tags(html, element)) {
				for (const name of ['href', 'src']) {
					const value = attr(tag, name)
					if (!value?.startsWith('/assets/')) continue
					if (!existsSync(join(SITE_DIR, value.replace(/^\//, '').split('?')[0]))) missing.add(value)
				}
			}
		}
	}
	assert.deepEqual([...missing], [], `assets referenced but not built:\n  ${[...missing].join('\n  ')}`)
})

test('the inlined critical CSS resolves its font through the asset manifest', () => {
	const css = readFileSync(CRITICAL_CSS, 'utf8')
	assert.ok(css.includes(FONT_MANIFEST_KEY), 'critical CSS lost its manifest lookup for the font')
	assert.doesNotMatch(
		css,
		/url\(\s*["']?\/assets\/fonts\//,
		'critical CSS references a font by literal path, so a rebuilt subset keeps the stale URL',
	)
})
