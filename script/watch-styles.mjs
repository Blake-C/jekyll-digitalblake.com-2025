#!/usr/bin/env node
/**
 * Watches theme_components/sass and rebuilds on change, running the same
 * transforms as `build:styles` (autoprefixer, critical-CSS URL rewrite,
 * hash-assets --dev) in one process against a warm sass compiler.
 *
 * It writes only the files whose bytes changed. Sass recompiles all three entry
 * points every run, and any write to _includes/ or _data/ invalidates every
 * page in Jekyll, so writing identical bytes costs a full site regeneration.
 *
 * Output must stay byte-identical to `build:styles`, maps included.
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

// `critical` marks the stylesheet inlined into <head>: it takes the URL rewrite
// and ships without a map.
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

	// Sass returns sources as absolute file:// URLs, but Jekyll serves the map
	// next to the CSS, so they have to be relative to that directory.
	if (result.sourceMap) {
		result.sourceMap.sources = result.sourceMap.sources.map(source =>
			relative(dirname(outPath), fileURLToPath(source))
		)
	}

	// The sass CLI appends this annotation and the JS API does not, so it is
	// added here to keep the dev and production bytes identical.
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

	// postcss already appended the annotation, since `to` is set and the map is
	// external.
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
		// that ran while the dev server was up.
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
