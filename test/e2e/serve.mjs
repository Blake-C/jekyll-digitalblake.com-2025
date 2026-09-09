#!/usr/bin/env node
/**
 * Serves _site for the browser tests. The Playwright image carries no Ruby, so
 * `jekyll serve` is unavailable there, and a static-server package would mean
 * another dependency through the release-age gate for twenty lines of work.
 *
 * A directory URL resolves to index.html and a miss returns 404.html, which is
 * what GitHub Pages does with this build.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const SITE = join(ROOT, '_site')
const PORT = Number(process.env.PORT ?? 24210)

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
	'.map': 'application/json; charset=utf-8',
}

async function resolve(urlPath) {
	// normalize collapses any ../ before the path is joined, so a request cannot
	// escape _site.
	const candidate = join(SITE, normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, ''))
	if (!candidate.startsWith(SITE)) return null

	try {
		const info = await stat(candidate)
		if (info.isFile()) return candidate
		if (info.isDirectory()) {
			const index = join(candidate, 'index.html')
			await stat(index)
			return index
		}
	} catch {
		return null
	}
	return null
}

const server = createServer(async (request, response) => {
	const { pathname } = new URL(request.url, `http://localhost:${PORT}`)
	const file = await resolve(pathname)

	if (!file) {
		const notFound = join(SITE, '404.html')
		const body = await readFile(notFound).catch(() => Buffer.from('Not found'))
		response.writeHead(404, { 'content-type': TYPES['.html'] })
		response.end(body)
		return
	}

	response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
	response.end(await readFile(file))
})

server.listen(PORT, () => console.log(`[serve] _site on http://localhost:${PORT}`))
