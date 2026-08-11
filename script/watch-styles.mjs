#!/usr/bin/env node
/**
 * Watches theme_components/sass and rebuilds styles on change, writing only the
 * output files whose bytes actually changed.
 *
 * Replaces the bare `sass --watch` that `pnpm run dev` used to run. Sass alone
 * left three problems in development:
 *
 *   1. script/build-css.mjs (autoprefixer) never ran, so dev CSS carried no
 *      vendor prefixes and did not match what production ships.
 *   2. script/rewrite-critical-urls.mjs never ran, so the inlined critical CSS
 *      lost its @font-face manifest lookup on the first rebuild.
 *   3. script/hash-assets.mjs never re-ran. A `pnpm run build` in another
 *      terminal overwrites _data/asset_manifest.json with hashed filenames,
 *      Jekyll watches _data and rebuilds every page pointing at the hashed
 *      copy, and the watchers only ever write the unhashed file. The served
 *      stylesheet then froze at whatever that build produced, which reads as
 *      "live reload is broken" because the reload fires and changes nothing.
 *
 * Two things make this faster than chaining the one-off scripts:
 *
 *   Nothing unchanged is written. Sass recompiles all three entry points on
 *   every run, so editing a partial that only global-styles.scss uses still
 *   rewrote _includes/critical.min.css and _data/asset_manifest.json with
 *   identical bytes. Both invalidate every page in Jekyll, and the writes
 *   landed in two bursts, so one save cost two full site regenerations.
 *
 *   Everything runs in this process against a warm sass compiler. Shelling out
 *   to sass, build-css.mjs and rewrite-critical-urls.mjs cost more in Node
 *   startup and postcss import than the compile itself.
 *
 * Production still runs `pnpm run build:styles`, which writes in place.
 *
 * Usage:
 *   node script/watch-styles.mjs
 */
import { spawnSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, watch, writeFileSync } from 'fs'
import { basename, join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import { initAsyncCompiler } from 'sass'
import { prefix, rewriteCriticalUrls } from './lib/styles.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SASS_DIR = join(ROOT, 'theme_components/sass')
const DEBOUNCE_MS = 150

// Mirrors the entry points in the build:styles script. `critical` marks the
// stylesheet that gets inlined into <head>, which takes the URL rewrite and
// ships without a map.
const ENTRIES = [
	{ src: 'theme_components/sass/global-styles.scss', out: 'assets/css/global-styles.min.css' },
	{ src: 'theme_components/sass/critical-styles.scss', out: '_includes/critical.min.css', critical: true },
	{ src: 'theme_components/sass/prism-styles.scss', out: 'assets/css/prism.min.css' },
]

const compiler = await initAsyncCompiler()

let timer = null
let running = false
let queued = false

/** Writes content to dest only when it differs. Returns true if it wrote. */
function writeIfChanged(dest, content) {
	const next = Buffer.from(content)
	if (existsSync(dest) && readFileSync(dest).equals(next)) return false

	mkdirSync(dirname(dest), { recursive: true })
	writeFileSync(dest, next)
	return true
}

async function buildEntry(entry) {
	const outPath = join(ROOT, entry.out)

	const result = await compiler.compileAsync(join(ROOT, entry.src), {
		loadPaths: [join(ROOT, 'node_modules')],
		style: 'compressed',
		sourceMap: !entry.critical,
		charset: true,
	})

	// The sass JS API returns sources as absolute file:// URLs. Jekyll serves
	// the map next to the CSS, so they have to be relative to that directory.
	if (result.sourceMap) {
		result.sourceMap.sources = result.sourceMap.sources.map(source =>
			relative(dirname(outPath), fileURLToPath(source))
		)
	}

	// The sass CLI appends this annotation to the file it writes, and production
	// runs postcss over that file. The JS API returns the map separately and
	// leaves the CSS unannotated, so it is added here to keep the dev and
	// production bytes identical.
	const annotated = result.sourceMap
		? `${result.css}/*# sourceMappingURL=${basename(outPath)}.map */\n`
		: result.css

	const { css, map } = await prefix(annotated, {
		from: outPath,
		to: outPath,
		prev: result.sourceMap ? JSON.stringify(result.sourceMap) : undefined,
	})

	const written = []

	if (entry.critical) {
		if (writeIfChanged(outPath, rewriteCriticalUrls(css))) written.push(entry.out)
		return written
	}

	// postcss already appended the sourceMappingURL annotation, because `to` is
	// set and the map is external.
	if (writeIfChanged(outPath, css)) written.push(entry.out)
	if (map && writeIfChanged(`${outPath}.map`, map)) written.push(`${entry.out}.map`)

	return written
}

async function rebuild() {
	if (running) {
		queued = true
		return
	}

	running = true
	const started = Date.now()

	try {
		const written = (await Promise.all(ENTRIES.map(buildEntry))).flat()

		// Resets the manifest to unhashed filenames, undoing a production build
		// that ran while the dev server was up. Writes only when it differs.
		spawnSync(process.execPath, [join(ROOT, 'script/hash-assets.mjs'), '--dev'], {
			cwd: ROOT,
			stdio: ['ignore', 'ignore', 'inherit'],
		})

		const ms = Date.now() - started
		console.log(
			written.length > 0
				? `[watch:styles] ${written.join(', ')} in ${ms}ms`
				: `[watch:styles] no output changed in ${ms}ms`
		)
	} catch (error) {
		console.error(`[watch:styles] ${error.message}`)
		console.error('[watch:styles] leaving the previous CSS in place')
	} finally {
		running = false
	}

	if (queued) {
		queued = false
		await rebuild()
	}
}

watch(SASS_DIR, { recursive: true }, (_event, filename) => {
	if (filename && !filename.endsWith('.scss')) return
	clearTimeout(timer)
	timer = setTimeout(rebuild, DEBOUNCE_MS)
})

process.on('SIGTERM', async () => {
	await compiler.dispose()
	process.exit(0)
})

console.log('[watch:styles] watching theme_components/sass for changes...')
