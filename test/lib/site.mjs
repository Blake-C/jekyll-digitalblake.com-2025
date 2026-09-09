/**
 * Reads the built site in _site for the contract tests.
 *
 * Tags are matched with regexes because the input is markup this repo generated,
 * and a parser would mean another dependency through the release-age gate.
 * _plugins/lazy_images.rb takes the same approach against the same markup.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const SITE_DIR = join(ROOT, '_site')
export const SITE_URL = 'https://digitalblake.com'

/** The home page is the root of a breadcrumb, and 404 has no title of its own,
 *  so jsonld-breadcrumb.html emits nothing for either. */
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

export function urlForFile(file) {
	const rel = relative(SITE_DIR, file).split(sep).join('/')
	if (rel === 'index.html') return '/'
	if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`
	return `/${rel}`
}

let cached = null

export function pages() {
	if (cached) return cached
	requireSite()
	cached = walkHtml(SITE_DIR)
		.map(file => ({ file, url: urlForFile(file), html: readFileSync(file, 'utf8') }))
		.sort((a, b) => a.url.localeCompare(b.url))
	return cached
}

export function attr(tag, name) {
	const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`))
	return match ? match[1] : null
}

/** Attributes in head.html wrap across lines, so this matches newlines inside
 *  the tag. */
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

export function linkHrefs(html, rel) {
	return findByAttr(html, 'link', 'rel', rel).map(tag => attr(tag, 'href'))
}

export function imgTags(html) {
	return tags(html, 'img')
}

export function jsonLdBlocks(html) {
	return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1])
}

/** Flattens arrays and @graph wrappers. Throws on a block that is not valid
 *  JSON, which callers rely on. */
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
