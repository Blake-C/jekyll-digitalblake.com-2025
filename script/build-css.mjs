#!/usr/bin/env node
/**
 * Runs autoprefixer over the three compiled stylesheets, in place.
 *
 * Replaced postcss-cli in August 2026. That package pulled in 28 dependencies
 * nothing else needed (yargs, chokidar, fs-extra, dependency-graph, tinyglobby
 * and their tails) to provide config discovery, globbing, watching, and
 * dependency graphs, none of which this project used. postcss and autoprefixer
 * are direct dependencies, so the work moves here and nothing is added.
 *
 * Runs after sass and before script/rewrite-critical-urls.mjs, which strips the
 * sourceMappingURL from critical.min.css and deletes its map. The other two keep
 * their external maps, so every file is processed with map.inline false and
 * postcss picks up the map sass just wrote as the previous source.
 *
 * Usage:
 *   node script/build-css.mjs
 */
import autoprefixer from 'autoprefixer'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { basename, join, dirname } from 'path'
import postcss from 'postcss'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const TARGETS = ['assets/css/global-styles.min.css', 'assets/css/prism.min.css', '_includes/critical.min.css']

const processor = postcss([autoprefixer])

for (const target of TARGETS) {
	const file = join(ROOT, target)
	if (!existsSync(file)) {
		console.error(`build-css: missing ${target} — run build:styles, not this script alone`)
		process.exitCode = 1
		continue
	}

	const css = readFileSync(file, 'utf8')
	const result = await processor.process(css, {
		from: file,
		to: file,
		// inline: false keeps the external .map sass produced. prev is left to
		// postcss, which reads the annotation and chains onto that map so the
		// sources still point at the .scss files rather than the compiled CSS.
		map: { inline: false },
	})

	for (const warning of result.warnings()) console.warn(`build-css: ${warning.toString()}`)

	writeFileSync(file, result.css)
	if (result.map) writeFileSync(`${file}.map`, result.map.toString())

	console.log(`  ${target}${result.map ? ` (+ ${basename(file)}.map)` : ''}`)
}
