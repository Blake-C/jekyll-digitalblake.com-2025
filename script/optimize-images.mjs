#!/usr/bin/env node
/**
 * Optimizes JPG/PNG images using ImageMagick and creates WebP counterparts.
 *
 * Usage:
 *   node script/optimize-images.mjs                  # process all images in configured dirs
 *   node script/optimize-images.mjs file1.jpg ...    # process specific files (used by lint-staged)
 */
import { execFileSync } from 'child_process'
import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = [join(ROOT, 'assets/images'), join(ROOT, 'assets/uploads')]
const QUALITY = '85'
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png']

function walkDir(dir) {
	const results = []
	try {
		for (const entry of readdirSync(dir)) {
			const fullPath = join(dir, entry)
			const stat = statSync(fullPath)
			if (stat.isDirectory()) {
				results.push(...walkDir(fullPath))
			} else {
				results.push(fullPath)
			}
		}
	} catch {
		// Skip unreadable dirs
	}
	return results
}

function processFile(filePath) {
	const rel = filePath.replace(ROOT, '')

	// Strip metadata and compress in-place — args as array avoids shell injection
	execFileSync('magick', [filePath, '-strip', '-quality', QUALITY, filePath], { stdio: 'pipe' })

	const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp')
	if (!existsSync(webpPath)) {
		execFileSync('magick', [filePath, '-quality', QUALITY, webpPath], { stdio: 'pipe' })
		console.log(`  + ${rel.replace(/\.(jpe?g|png)$/i, '.webp')} (created)`)
		return { optimized: 1, created: 1 }
	}

	console.log(`  ✓ ${rel}`)
	return { optimized: 1, created: 0 }
}

// lint-staged passes staged file paths as arguments
const stagedFiles = process.argv.slice(2).map(f => resolve(f))
const files = stagedFiles.length > 0 ? stagedFiles : DIRS.flatMap(walkDir)

let optimized = 0
let created = 0
let errors = 0

console.log('Optimizing images...\n')

for (const filePath of files) {
	if (!IMAGE_EXTS.includes(extname(filePath).toLowerCase())) continue
	try {
		const result = processFile(filePath)
		optimized += result.optimized
		created += result.created
	} catch (err) {
		console.error(`  ! ${filePath.replace(ROOT, '')}: ${err.message}`)
		errors++
	}
}

console.log(`\nDone: ${optimized} optimized, ${created} WebP created, ${errors} errors`)
