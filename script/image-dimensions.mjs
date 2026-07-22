#!/usr/bin/env node
/**
 * Builds a manifest of intrinsic pixel dimensions for every raster image under
 * assets/, so `_plugins/lazy_images.rb` can inject width/height onto markdown
 * content images at Jekyll build time (prevents layout shift / CLS).
 *
 * Reads dimensions with the ImageMagick already used by the build (no new dep),
 * and writes `_data/image_dimensions.json` keyed by site-absolute path:
 *   { "/assets/uploads/2021/01/foo.webp": { "width": 1200, "height": 800 }, ... }
 *
 * This output is committed and consumed as-is by CI (which does not run image
 * build steps), matching how optimized images and cached thumbnails are handled.
 *
 * Usage: node script/image-dimensions.mjs
 */
import { execFileSync } from 'child_process'
import { readdirSync, statSync, writeFileSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = [join(ROOT, 'assets/images'), join(ROOT, 'assets/uploads')]
const OUT = join(ROOT, '_data/image_dimensions.json')
const IMAGE_EXTS = ['.webp', '.jpg', '.jpeg', '.png', '.gif']

function walkDir(dir) {
	const results = []
	try {
		for (const entry of readdirSync(dir)) {
			const fullPath = join(dir, entry)
			if (statSync(fullPath).isDirectory()) {
				results.push(...walkDir(fullPath))
			} else {
				results.push(fullPath)
			}
		}
	} catch {
		// Skip unreadable/missing dirs
	}
	return results
}

function readDimensions(filePath) {
	// [0] selects the first frame (animated webp/gif return one line per frame).
	const out = execFileSync('magick', ['identify', '-format', '%w %h', `${filePath}[0]`], {
		stdio: ['ignore', 'pipe', 'ignore'],
	})
		.toString()
		.trim()
	const [w, h] = out.split(/\s+/).map(Number)
	if (!Number.isInteger(w) || !Number.isInteger(h) || w <= 0 || h <= 0) return null
	return { width: w, height: h }
}

const files = DIRS.flatMap(walkDir).filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()))

const manifest = {}
let ok = 0
let errors = 0

console.log('Reading image dimensions...\n')

for (const filePath of files.sort()) {
	const key = filePath.replace(ROOT, '').split('\\').join('/')
	try {
		const dims = readDimensions(filePath)
		if (dims) {
			manifest[key] = dims
			ok++
		} else {
			console.error(`  ! ${key}: could not parse dimensions`)
			errors++
		}
	} catch (err) {
		console.error(`  ! ${key}: ${err.message}`)
		errors++
	}
}

writeFileSync(OUT, `${JSON.stringify(manifest, null, '\t')}\n`)

console.log(`\nDone: ${ok} images measured, ${errors} errors → _data/image_dimensions.json`)
