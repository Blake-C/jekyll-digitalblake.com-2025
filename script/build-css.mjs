#!/usr/bin/env node
/**
 * Runs autoprefixer over the three compiled stylesheets, in place.
 *
 * Sits between sass and script/rewrite-critical-urls.mjs in `build:styles`. The
 * dev watcher calls the same transform from script/lib/styles.mjs in process
 * rather than shelling out here.
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
