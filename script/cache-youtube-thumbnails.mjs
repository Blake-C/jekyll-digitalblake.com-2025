#!/usr/bin/env node
/**
 * Caches YouTube thumbnails locally as optimized WebP files.
 *
 * Scans _posts for `youtube_id` front matter, downloads each video's thumbnail
 * (maxresdefault, falling back to hqdefault), resizes it to the post content
 * max width and converts it to WebP via ImageMagick. Prunes thumbnails whose
 * video is no longer referenced by any post.
 *
 * Usage:
 *   node script/cache-youtube-thumbnails.mjs            # cache missing thumbnails, prune orphans
 *   node script/cache-youtube-thumbnails.mjs --force    # re-download and regenerate every thumbnail
 */
import { execFileSync } from 'child_process'
import { readdirSync, readFileSync, existsSync, mkdirSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const POSTS_DIR = join(ROOT, '_posts')
const OUT_DIR = join(ROOT, 'assets/uploads/youtube')
const QUALITY = '80'
const MAX_WIDTH = '830' // post content max width in px
const ID_RE = /^[A-Za-z0-9_-]{11}$/
const force = process.argv.includes('--force')

// Collect the set of YouTube video ids referenced by posts.
function collectIds() {
	const ids = new Set()
	let entries
	try {
		entries = readdirSync(POSTS_DIR)
	} catch {
		return ids
	}
	for (const entry of entries) {
		if (!/\.(md|markdown)$/i.test(entry)) continue
		const content = readFileSync(join(POSTS_DIR, entry), 'utf8')
		// Front matter is the block between the first two `---` fences.
		const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
		if (!fm) continue
		const match = fm[1].match(/^youtube_id:\s*['"]?([^'"\s]+)['"]?\s*$/m)
		if (!match) continue
		const id = match[1]
		if (!ID_RE.test(id)) {
			console.warn(`  ! ${entry}: invalid youtube_id "${id}" (skipped)`)
			continue
		}
		ids.add(id)
	}
	return ids
}

// Download a URL to a Buffer, or null on any non-200 / network error.
async function download(url) {
	try {
		const res = await fetch(url)
		if (!res.ok) return null
		return Buffer.from(await res.arrayBuffer())
	} catch {
		return null
	}
}

async function cacheThumbnail(id) {
	const outPath = join(OUT_DIR, `${id}.webp`)
	if (existsSync(outPath) && !force) {
		console.log(`  ✓ ${id}.webp (cached)`)
		return { created: 0, skipped: 1, errored: 0 }
	}

	let buffer = await download(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
	if (!buffer) buffer = await download(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
	if (!buffer) {
		console.error(`  ! ${id}: could not download maxresdefault or hqdefault`)
		return { created: 0, skipped: 0, errored: existsSync(outPath) ? 0 : 1 }
	}

	// Resize (only shrink) and convert to WebP. Args as array, no shell, and
	// outPath is built from an id already validated by ID_RE.
	execFileSync(
		'magick',
		['jpg:-', '-strip', '-resize', `${MAX_WIDTH}x>`, '-quality', QUALITY, `webp:${outPath}`],
		{ input: buffer, stdio: ['pipe', 'pipe', 'pipe'] }
	)
	console.log(`  + ${id}.webp (created)`)
	return { created: 1, skipped: 0, errored: 0 }
}

// Delete cached thumbnails whose video is no longer referenced by a post.
function pruneOrphans(ids) {
	let removed = 0
	let existing
	try {
		existing = readdirSync(OUT_DIR)
	} catch {
		return removed
	}
	for (const file of existing) {
		const id = file.replace(/\.webp$/i, '')
		if (file === id) continue // not a .webp
		if (ids.has(id)) continue
		rmSync(join(OUT_DIR, file))
		console.log(`  - ${file} (orphan removed)`)
		removed++
	}
	return removed
}

const ids = collectIds()
mkdirSync(OUT_DIR, { recursive: true })

console.log('Caching YouTube thumbnails...\n')

let created = 0
let skipped = 0
let errors = 0

for (const id of ids) {
	const result = await cacheThumbnail(id)
	created += result.created
	skipped += result.skipped
	errors += result.errored
}

const removed = pruneOrphans(ids)

console.log(`\nDone: ${created} created, ${skipped} cached, ${removed} removed, ${errors} errors`)

if (errors > 0) process.exit(1)
