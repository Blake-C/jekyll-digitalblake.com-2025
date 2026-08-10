#!/usr/bin/env node
/**
 * Bundles the two front-end entry points with esbuild.
 *
 * Replaced webpack in August 2026. The webpack cluster (webpack, webpack-cli,
 * terser-webpack-plugin) pulled in 79 packages that nothing else needed, to do
 * this: bundle roughly 16 KB of first-party ESM plus prismjs, with no loaders,
 * no code splitting, and no dev server. Those 79 packages were also the source
 * of repeated high-severity audit failures that blocked the deploy.
 *
 * The output filenames are a contract: script/hash-assets.mjs discovers
 * assets/js/*.min.js and the templates read the manifest it writes. Note that
 * global-scripts.js builds to main.min.js, so the names do not match.
 *
 * Usage:
 *   node script/build-scripts.mjs           # one-off production build
 *   node script/build-scripts.mjs --watch   # rebuild on change (pnpm run dev)
 */
import { context, build } from 'esbuild'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const isWatch = process.argv.includes('--watch')

/**
 * The `browserslist` query in package.json resolves to chrome 109 as its oldest
 * real target, which supports all of ES2020. esbuild does not read browserslist,
 * so this is set by hand. If that query changes, re-run `npx browserslist` and
 * check the oldest entry against https://esbuild.github.io/api/#target before
 * moving this.
 */
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
	// Matched the old terser config: drop_console plus comments/extractComments false.
	drop: ['console'],
	legalComments: 'none',
	sourcemap: false,
	logLevel: 'info',
}

if (isWatch) {
	const ctx = await context(options)
	await ctx.watch()
	console.log('Watching theme_components/js for changes...')
} else {
	await build(options)
}
