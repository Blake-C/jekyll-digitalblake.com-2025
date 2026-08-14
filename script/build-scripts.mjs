#!/usr/bin/env node
/**
 * Bundles the two front-end entry points with esbuild.
 *
 * The output filenames are a contract: script/hash-assets.mjs discovers
 * assets/js/*.min.js and the templates read the manifest it writes. Note that
 * global-scripts.js builds to main.min.js, so the names do not match.
 */
import { context, build } from 'esbuild'
import { spawnSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const isWatch = process.argv.includes('--watch')

// esbuild does not read browserslist, so this tracks the package.json query by
// hand. That query's oldest target is chrome 109, which supports all of ES2020.
// If it changes, re-run `npx browserslist` before moving this.
const TARGET = 'es2020'

const options = {
	absWorkingDir: ROOT,
	entryPoints: {
		main: 'theme_components/js/global-scripts.js',
		prism: 'theme_components/js/prism-scripts.js',
	},
	entryNames: '[name].min',
	outdir: 'assets/js',
	bundle: true,
	format: 'iife',
	target: TARGET,
	minify: true,
	drop: ['console'],
	legalComments: 'none',
	sourcemap: false,
	logLevel: 'info',
}

// Resets the manifest to unhashed filenames after each watch rebuild, undoing a
// production build that ran while the dev server was up. Same on the CSS side,
// in script/watch-styles.mjs.
const devManifestPlugin = {
	name: 'dev-manifest',
	setup(pluginBuild) {
		pluginBuild.onEnd(result => {
			if (result.errors.length > 0) return
			spawnSync(process.execPath, [join(ROOT, 'script/hash-assets.mjs'), '--dev'], {
				cwd: ROOT,
				stdio: ['ignore', 'ignore', 'inherit'],
			})
		})
	},
}

if (isWatch) {
	const ctx = await context({ ...options, plugins: [devManifestPlugin] })
	await ctx.watch()
	console.log('Watching theme_components/js for changes...')
} else {
	await build(options)
}
