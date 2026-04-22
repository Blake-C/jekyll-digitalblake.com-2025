#!/usr/bin/env node
/**
 * Generates content-hashed copies of compiled CSS and JS assets, then writes
 * _data/asset_manifest.json so Jekyll templates can reference the correct filenames.
 *
 * Auto-discovers all *.min.css in assets/css/ and *.min.js in assets/js/ —
 * no manual updates needed when new entry points are added.
 *
 * Usage:
 *   node script/hash-assets.mjs         # production — creates hashed files
 *   node script/hash-assets.mjs --dev   # dev — writes static filenames to manifest
 */
import { readFileSync, writeFileSync, copyFileSync, readdirSync, unlinkSync } from 'fs'
import { createHash } from 'crypto'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const isDev = process.argv.includes('--dev')

// Matches a previously hashed file, e.g. global-styles.a1b2c3d4.min.css
const HASHED = /\.[0-9a-f]{8}\.min\.(css|js)$/

const DIRS = [
	{ dir: 'assets/css', ext: '.css', suffix: '-css' },
	{ dir: 'assets/js', ext: '.js', suffix: '-js' },
]

const manifest = {}

if (isDev) {
	for (const { dir, ext, suffix } of DIRS) {
		const absDir = join(ROOT, dir)
		for (const file of readdirSync(absDir)) {
			if (!file.endsWith(`.min${ext}`) || HASHED.test(file)) continue
			const key = basename(file, `.min${ext}`) + suffix
			manifest[key] = `/${dir}/${file}`
		}
	}
	console.log('Dev manifest: using static asset filenames')
} else {
	console.log('Hashing assets...\n')
	for (const { dir, ext, suffix } of DIRS) {
		const absDir = join(ROOT, dir)
		const files = readdirSync(absDir).filter(f => f.endsWith(`.min${ext}`) && !HASHED.test(f))

		for (const file of files) {
			const srcPath = join(absDir, file)
			const content = readFileSync(srcPath)
			const hash = createHash('sha256').update(content).digest('hex').slice(0, 8)

			const hashedName = file.replace('.min.', `.${hash}.min.`)
			const hashedSrc = `${dir}/${hashedName}`

			// Remove stale hashed copies matching this base name
			const base = basename(file, `.min${ext}`)
			const stalePattern = new RegExp(`^${base}\\.[0-9a-f]{8}\\.min\\${ext}$`)
			for (const existing of readdirSync(absDir)) {
				if (stalePattern.test(existing)) unlinkSync(join(absDir, existing))
			}

			copyFileSync(srcPath, join(ROOT, hashedSrc))
			const key = base + suffix
			manifest[key] = `/${hashedSrc}`
			console.log(`  ${dir}/${file} → ${hashedSrc}`)
		}
	}
}

writeFileSync(join(ROOT, '_data/asset_manifest.json'), JSON.stringify(manifest, null, '\t') + '\n')
console.log(`\nWritten: _data/asset_manifest.json`)
