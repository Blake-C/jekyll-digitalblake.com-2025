/**
 * The build scripts are meant to be deterministic. These run the real scripts,
 * so this is the slow file, and a dirty tree afterwards is the failure.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { ROOT } from './lib/site.mjs'

const HASHED = /\.([0-9a-f]{8})(\.min)?\.(css|js|woff2)$/

const run = (command, args) =>
	execFileSync(command, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

const pnpm = script => run('pnpm', ['run', script])

const dirty = (...paths) =>
	run('git', ['status', '--porcelain', '--', ...paths])
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean)

test('build:fonts leaves the tree clean when its inputs have not changed', () => {
	// Compared against the state going in, since asserting an empty list would
	// fail on any unrelated uncommitted edit.
	const before = dirty('assets/fonts')
	pnpm('build:fonts')
	pnpm('build:fonts')
	assert.deepEqual(
		dirty('assets/fonts'),
		before,
		'build:fonts rewrote a font. SOURCE_DATE_EPOCH in script/build-fonts.mjs is what keeps ' +
			'fonttools from stamping the current time into head.modified, which would change the ' +
			'hashed URL on every build and make every visitor re-download the font.',
	)
})

test('build:images leaves the tree clean when its inputs have not changed', () => {
	const before = dirty('assets/images', 'assets/uploads')
	pnpm('build:images')
	assert.deepEqual(dirty('assets/images', 'assets/uploads'), before, 'build:images re-encoded an unchanged image')
})

test('the style watcher and build:styles produce identical bytes', () => {
	pnpm('build:styles')
	const output = run('node', ['script/watch-styles.mjs', '--once'])

	assert.match(
		output,
		/no output changed/,
		'script/watch-styles.mjs wrote a file straight after build:styles, so the two pipelines ' +
			`disagree and dev CSS no longer matches production. It reported:\n${output.trim()}`,
	)
})

test('asset hashes are the content hash of the file they name', () => {
	const manifest = JSON.parse(readFileSync(join(ROOT, '_data/asset_manifest.json'), 'utf8'))
	const checked = []

	for (const [key, url] of Object.entries(manifest)) {
		const match = url.match(HASHED)
		if (!match) continue

		const file = join(ROOT, url.replace(/^\//, ''))
		assert.ok(existsSync(file), `${key}: manifest points at a missing file: ${url}`)

		const hash = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8)
		assert.equal(match[1], hash, `${key}: filename hash does not match the file's content`)
		checked.push(key)
	}

	assert.ok(checked.length > 0, 'no hashed assets in the manifest; was this a --dev build?')
})

test('every image dimension entry points at a file that exists', () => {
	const dimensions = JSON.parse(readFileSync(join(ROOT, '_data/image_dimensions.json'), 'utf8'))
	const entries = Object.entries(dimensions)
	assert.ok(entries.length > 0, 'image_dimensions.json is empty')

	for (const [sitePath, size] of entries) {
		assert.ok(existsSync(join(ROOT, sitePath.replace(/^\//, ''))), `no file for dimension entry ${sitePath}`)
		assert.ok(size?.width > 0 && size?.height > 0, `${sitePath}: bad dimensions ${JSON.stringify(size)}`)
	}
})
