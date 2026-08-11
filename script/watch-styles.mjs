#!/usr/bin/env node
/**
 * Watches theme_components/sass and re-runs the full styles pipeline on change.
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
 *      copy, and sass --watch only ever writes the unhashed file. The served
 *      stylesheet then froze at whatever that build produced, which reads as
 *      "live reload is broken" because the reload fires and changes nothing.
 *
 * Running the whole pipeline per change costs well under a second, and it keeps
 * one definition of how styles are built instead of two that drift.
 *
 * Usage:
 *   node script/watch-styles.mjs
 */
import { spawnSync } from 'child_process'
import { watch } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SASS_DIR = join(ROOT, 'theme_components/sass')
const DEBOUNCE_MS = 150

let timer = null
let running = false
let queued = false

function rebuild() {
	if (running) {
		queued = true
		return
	}

	running = true

	// `build:styles` is the single source of truth for sass args, autoprefixer,
	// and the critical-CSS URL rewrite. Shelling out to it keeps dev and
	// production compiling the same way.
	const styles = spawnSync('pnpm', ['run', 'build:styles'], { cwd: ROOT, stdio: 'inherit' })

	if (styles.status === 0) {
		// Resets the manifest to unhashed filenames, undoing a production build
		// that ran while the dev server was up.
		spawnSync(process.execPath, [join(ROOT, 'script/hash-assets.mjs'), '--dev'], {
			cwd: ROOT,
			stdio: ['ignore', 'ignore', 'inherit'],
		})
		console.log(`[watch:styles] rebuilt at ${new Date().toTimeString().slice(0, 8)}`)
	}

	running = false

	if (queued) {
		queued = false
		rebuild()
	}
}

watch(SASS_DIR, { recursive: true }, (_event, filename) => {
	if (filename && !filename.endsWith('.scss')) return
	clearTimeout(timer)
	timer = setTimeout(rebuild, DEBOUNCE_MS)
})

console.log('[watch:styles] watching theme_components/sass for changes...')
