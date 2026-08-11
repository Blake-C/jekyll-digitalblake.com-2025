#!/usr/bin/env node
/**
 * Generates content-hashed copies of compiled CSS and JS assets plus the
 * shipped WOFF2 fonts, then writes _data/asset_manifest.json so Jekyll
 * templates can reference the correct (cache-busting) filenames.
 *
 * Auto-discovers all *.min.css in assets/css/, *.min.js in assets/js/, and
 * *.woff2 in assets/fonts/ — no manual updates needed when new entry points or
 * fonts are added. Fingerprinting fonts matters because their URL is otherwise
 * stable across subset rebuilds, so browsers/CDNs keep serving a stale file.
 *
 * Usage:
 *   node script/hash-assets.mjs         # production — creates hashed files
 *   node script/hash-assets.mjs --dev   # dev — writes static filenames to manifest
 */
import { readFileSync, writeFileSync, copyFileSync, readdirSync, unlinkSync, existsSync } from 'fs'
import { createHash } from 'crypto'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const isDev = process.argv.includes('--dev')

// Matches a previously hashed file, e.g. global-styles.a1b2c3d4.min.css
const HASHED = /\.[0-9a-f]{8}\.min\.(css|js)$/

// Matches a previously hashed font, e.g. montserrat-variable-webfont.a1b2c3d4.woff2
const HASHED_FONT = /\.[0-9a-f]{8}\.woff2$/

const DIRS = [
	{ dir: 'assets/css', ext: '.css', suffix: '-css' },
	{ dir: 'assets/js', ext: '.js', suffix: '-js' },
]

// Fonts have no `.min.` infix, so they get their own discovery rule.
const FONT_DIR = { dir: 'assets/fonts', ext: '.woff2', suffix: '-woff2' }

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
	// Fonts: static filenames in dev, same as CSS/JS.
	const { dir, ext, suffix } = FONT_DIR
	const absFontDir = join(ROOT, dir)
	for (const file of readdirSync(absFontDir)) {
		if (!file.endsWith(ext) || HASHED_FONT.test(file)) continue
		const key = basename(file, ext) + suffix
		manifest[key] = `/${dir}/${file}`
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

	// Fonts: hash on the bare name (no `.min.` infix) so the URL changes whenever
	// the subset is rebuilt.
	const { dir, ext, suffix } = FONT_DIR
	const absFontDir = join(ROOT, dir)
	const fonts = readdirSync(absFontDir).filter(f => f.endsWith(ext) && !HASHED_FONT.test(f))

	for (const file of fonts) {
		const srcPath = join(absFontDir, file)
		const content = readFileSync(srcPath)
		const hash = createHash('sha256').update(content).digest('hex').slice(0, 8)

		const base = basename(file, ext)
		const hashedName = `${base}.${hash}${ext}`
		const hashedSrc = `${dir}/${hashedName}`

		// Remove stale hashed copies matching this base name
		const stalePattern = new RegExp(`^${base}\\.[0-9a-f]{8}\\${ext}$`)
		for (const existing of readdirSync(absFontDir)) {
			if (stalePattern.test(existing)) unlinkSync(join(absFontDir, existing))
		}

		copyFileSync(srcPath, join(ROOT, hashedSrc))
		manifest[base + suffix] = `/${hashedSrc}`
		console.log(`  ${dir}/${file} → ${hashedSrc}`)
	}
}

// Written only when the contents differ. Jekyll watches _data/, and any write
// there invalidates every page, so rewriting an identical manifest on each dev
// rebuild cost a second full site regeneration per save.
const manifestPath = join(ROOT, '_data/asset_manifest.json')
const next = JSON.stringify(manifest, null, '\t') + '\n'
const current = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : null

if (current === next) {
	console.log(`\nUnchanged: _data/asset_manifest.json`)
} else {
	writeFileSync(manifestPath, next)
	console.log(`\nWritten: _data/asset_manifest.json`)
}
