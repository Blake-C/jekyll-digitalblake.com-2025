#!/usr/bin/env node
/**
 * Optimizes JPG/PNG images using ImageMagick and creates WebP counterparts.
 *
 * Usage:
 *   node script/optimize-images.mjs                  # process all images in configured dirs
 *   node script/optimize-images.mjs file1.jpg ...    # process specific files (used by lint-staged)
 */
import { execFileSync } from 'child_process'
import { readdirSync, statSync, existsSync, mkdtempSync, copyFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join, extname, dirname, resolve, basename } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = [join(ROOT, 'assets/images'), join(ROOT, 'assets/uploads')]
const QUALITY = '95'
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png']

// Minimum size saving required to accept a re-encode of a file that carries no
// metadata. JPEG encoding is lossy, so re-encoding an already-optimized JPEG
// produces different bytes every run without making the file meaningfully
// smaller. Without this gate the script never reaches a fixed point: it dirties
// the working tree on every run and degrades the image a little each time.
const MIN_SAVING = 0.01

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

// True when the image still carries an embedded profile (EXIF, IPTC, XMP, ICC).
// `-strip` removes these, so a stripped file reports none and the size gate
// below takes over. Note %[profiles] is not a valid ImageMagick 7 format
// property, so this reads the verbose dump instead.
function hasMetadata(filePath) {
	const out = execFileSync('magick', ['identify', '-verbose', filePath], { encoding: 'utf8', stdio: 'pipe' })
	return /^\s*Profiles:/m.test(out) || /^\s*Profile-/m.test(out)
}

function processFile(filePath) {
	const rel = filePath.replace(ROOT, '')
	const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp')

	// Encode to a temp file rather than in place, so an already-optimized image
	// can be left byte-identical. Args as array avoids shell injection.
	const work = mkdtempSync(join(tmpdir(), 'imgopt-'))
	const candidate = join(work, basename(filePath))
	let replaced = false
	try {
		const before = statSync(filePath).size
		const stripping = hasMetadata(filePath)

		execFileSync('magick', [filePath, '-strip', '-quality', QUALITY, candidate], { stdio: 'pipe' })
		const after = statSync(candidate).size

		// Metadata removal always wins, since a large photo's EXIF (including GPS)
		// can be well under MIN_SAVING of the total file size. Otherwise the
		// re-encode has to earn its place.
		if (stripping || after < before * (1 - MIN_SAVING)) {
			copyFileSync(candidate, filePath)
			replaced = true
		}
	} finally {
		rmSync(work, { recursive: true, force: true })
	}

	if (!existsSync(webpPath)) {
		execFileSync('magick', [filePath, '-quality', QUALITY, webpPath], { stdio: 'pipe' })
		console.log(`  + ${rel.replace(/\.(jpe?g|png)$/i, '.webp')} (created)`)
		return { optimized: replaced ? 1 : 0, skipped: replaced ? 0 : 1, created: 1 }
	}

	if (replaced) {
		console.log(`  ✓ ${rel} (optimized)`)
		return { optimized: 1, skipped: 0, created: 0 }
	}

	console.log(`  · ${rel} (already optimized)`)
	return { optimized: 0, skipped: 1, created: 0 }
}

// lint-staged passes staged file paths as arguments
const stagedFiles = process.argv.slice(2).map(f => resolve(f))
const files = stagedFiles.length > 0 ? stagedFiles : DIRS.flatMap(walkDir)

let optimized = 0
let skipped = 0
let created = 0
let errors = 0

console.log('Optimizing images...\n')

for (const filePath of files) {
	if (!IMAGE_EXTS.includes(extname(filePath).toLowerCase())) continue
	try {
		const result = processFile(filePath)
		optimized += result.optimized
		skipped += result.skipped
		created += result.created
	} catch (err) {
		console.error(`  ! ${filePath.replace(ROOT, '')}: ${err.message}`)
		errors++
	}
}

console.log(`\nDone: ${optimized} optimized, ${skipped} already optimized, ${created} WebP created, ${errors} errors`)
