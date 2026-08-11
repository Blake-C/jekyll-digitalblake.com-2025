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
 * The dev watcher does not shell out to this script. It calls the same
 * transform from script/lib/styles.mjs in process, because three Node startups
 * per save cost more than the compile itself.
 *
 * Usage:
 *   node script/build-css.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { basename, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { prefix } from './lib/styles.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const TARGETS = ['assets/css/global-styles.min.css', 'assets/css/prism.min.css', '_includes/critical.min.css']

for (const target of TARGETS) {
	const file = join(ROOT, target)
	if (!existsSync(file)) {
		console.error(`build-css: missing ${target} — run build:styles, not this script alone`)
		process.exitCode = 1
		continue
	}

	const { css, map } = await prefix(readFileSync(file, 'utf8'), { from: file, to: file })

	writeFileSync(file, css)
	if (map) writeFileSync(`${file}.map`, map)

	console.log(`  ${target}${map ? ` (+ ${basename(file)}.map)` : ''}`)
}
