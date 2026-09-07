/**
 * Reads the built site in _site and pulls out the pieces the contract tests
 * assert on.
 *
 * Tags are matched with regexes rather than parsed, which is the same approach
 * _plugins/lazy_images.rb already takes against this same markup. A real parser
 * would be a dependency, and every dependency here has to clear the 7-day
 * minimumReleaseAge gate and the audit split for no gain: the input is output
 * this repo generated, not arbitrary HTML from the network.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const SITE_DIR = join(ROOT, '_site')
export const SITE_URL = 'https://digitalblake.com'

/** Pages that carry no breadcrumb by design: the home page is the root of one,
 *  and 404 has no title of its own so jsonld-breadcrumb.html emits nothing. */
export const NO_BREADCRUMB = new Set(['/', '/404.html'])

export function requireSite() {
	if (existsSync(SITE_DIR)) return
	throw new Error(
		`_site not found. These tests read the built site, so run a build first:\n` +
			`  docker compose run --rm app pnpm run build`,
	)
}

function walkHtml(dir, found = []) {
	for (const entry of readdirSync(dir)) {
		const abs = join(dir, entry)
		if (statSync(abs).isDirectory()) walkHtml(abs, found)
		else if (entry.endsWith('.html')) found.push(abs)
	}
	return found
}

/** Site path for a built file: index.html at the root is `/`, a nested
 *  index.html is its directory, anything else keeps its filename. */
export function urlForFile(file) {
	const rel = relative(SITE_DIR, file).split(sep).join('/')
	if (rel === 'index.html') return '/'
	if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`
	return `/${rel}`
}

let cached = null

/** Every rendered HTML page, as { file, url, html }. */
export function pages() {
	if (cached) return cached
	requireSite()
	cached = walkHtml(SITE_DIR)
		.map(file => ({ file, url: urlForFile(file), html: readFileSync(file, 'utf8') }))
		.sort((a, b) => a.url.localeCompare(b.url))
	return cached
}

/** Read one attribute off a single tag string. */
export function attr(tag, name) {
	const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`))
	return match ? match[1] : null
}

/** All tags of one element name. Attributes in head.html wrap across lines, so
 *  this deliberately matches newlines inside the tag. */
export function tags(html, element) {
	return html.match(new RegExp(`<${element}\\b[^>]*>`, 'g')) ?? []
}

function findByAttr(html, element, key, value) {
	return tags(html, element).filter(tag => attr(tag, key) === value)
}

export function metaName(html, name) {
	const found = findByAttr(html, 'meta', 'name', name)
	return found.length ? attr(found[0], 'content') : null
}

export function metaProperty(html, property) {
	const found = findByAttr(html, 'meta', 'property', property)
	return found.length ? attr(found[0], 'content') : null
}

/** Every href for a given rel, so duplicates are visible to the caller. */
export function linkHrefs(html, rel) {
	return findByAttr(html, 'link', 'rel', rel).map(tag => attr(tag, 'href'))
}

export function imgTags(html) {
	return tags(html, 'img')
}

/** Raw contents of each ld+json block, unparsed. */
export function jsonLdBlocks(html) {
	return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1])
}

/** Every schema.org @type on a page, flattening arrays and @graph wrappers.
 *  Throws if a block is not valid JSON, which is the point of the check. */
export function jsonLdTypes(html) {
	const types = []
	const collect = node => {
		if (Array.isArray(node)) return node.forEach(collect)
		if (!node || typeof node !== 'object') return
		if (node['@graph']) collect(node['@graph'])
		if (node['@type']) types.push(...[node['@type']].flat())
	}
	for (const block of jsonLdBlocks(html)) collect(JSON.parse(block))
	return types
}
