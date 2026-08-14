#!/usr/bin/env node
/**
 * Subsets the Montserrat TTF sources in assets/fonts/ into the shipped WOFF2
 * with pyftsubset.
 *
 * Two modes: no flags builds every candidate in a temp dir and prints a size
 * table, touching nothing committed. `--emit` writes the production set into
 * assets/fonts/. Emit takes two overrides:
 *
 *   --strategy=static|variable   font layout (default: variable)
 *   --glyphs=core|core+scan|scan glyph set  (default: core+scan)
 *
 * "core" is a fixed unicode-range robust to future content; "scan" keeps only
 * glyphs found in the current content, so a new post with an unseen character
 * would fall back until the next build.
 */
import { execFileSync } from 'child_process'
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FONTS_DIR = join(ROOT, 'assets/fonts')

// --- Configuration ---------------------------------------------------------

// Static weights: TTF source -> shipped WOFF2 name, with the CSS weight.
const WEIGHTS = [
	{ weight: 400, ttf: 'Montserrat-Regular.ttf', out: 'montserrat-regular-webfont.woff2' },
	{ weight: 500, ttf: 'Montserrat-Medium.ttf', out: 'montserrat-medium-webfont.woff2' },
	{ weight: 700, ttf: 'Montserrat-Bold.ttf', out: 'montserrat-bold-webfont.woff2' },
	{ weight: 800, ttf: 'Montserrat-ExtraBold.ttf', out: 'montserrat-extrabold-webfont.woff2' },
	{ weight: 900, ttf: 'Montserrat-Black.ttf', out: 'montserrat-black-webfont.woff2' },
]

// Variable font source and the weight axis range the site actually uses.
const VARIABLE_TTF = 'Montserrat-Variable.ttf'
const VARIABLE_OUT = 'montserrat-variable-webfont.woff2'
const WGHT_RANGE = '400:900'

// fonttools stamps the current time into OpenType `head.modified` unless
// SOURCE_DATE_EPOCH is set, so every build would emit different bytes. The
// value (2025-01-01T00:00:00Z) is arbitrary but must not change, or every font
// rebuild produces a new file.
const SOURCE_DATE_EPOCH = '1735689600'

// Basic Latin, Latin-1 Supplement, General Punctuation, and Arrows. Latin
// Extended is excluded on purpose: ~600 mostly-unused glyphs that nearly double
// the file, where the few letters the content uses come from the scan instead.
// Keep in sync with the unicode-range in theme_components/sass/helpers/_fonts.scss.
const UNICODE_RANGE = 'U+0020-007E,U+00A0-00FF,U+2000-206F,U+2190-21FF'

// Source trees scanned to derive the "used glyphs" set for --glyphs=scan.
const SCAN_DIRS = ['_posts', '_websites', '_websites_archive', '_coding_projects', '_includes', '_layouts', '_data']
const SCAN_ROOT_EXTS = new Set(['.md', '.markdown', '.html'])
const SCAN_EXTS = new Set(['.md', '.markdown', '.html', '.yml', '.yaml'])

// --- Helpers ---------------------------------------------------------------

const args = process.argv.slice(2)
const flag = name => {
	const hit = args.find(a => a.startsWith(`--${name}=`))
	return hit ? hit.split('=')[1] : null
}

function walk(dir, exts, acc) {
	let entries
	try {
		entries = readdirSync(dir, { withFileTypes: true })
	} catch {
		return acc
	}
	for (const entry of entries) {
		const full = join(dir, entry.name)
		if (entry.isDirectory()) walk(full, exts, acc)
		else if (exts.has(extname(entry.name).toLowerCase())) acc.push(full)
	}
	return acc
}

function collectUsedChars() {
	const files = []
	for (const d of SCAN_DIRS) walk(join(ROOT, d), SCAN_EXTS, files)
	for (const name of readdirSync(ROOT)) {
		if (SCAN_ROOT_EXTS.has(extname(name).toLowerCase())) files.push(join(ROOT, name))
	}
	const chars = new Set()
	for (const f of files) {
		for (const ch of readFileSync(f, 'utf8')) chars.add(ch)
	}
	// Always guarantee the printable ASCII range so navigation/UI never breaks.
	for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCodePoint(c))
	return [...chars].sort().join('')
}

function kb(bytes) {
	return `${(bytes / 1024).toFixed(1)} KB`
}

function fileSize(path) {
	return statSync(path).size
}

// pyftsubset unions every glyph spec, so passing both `core` and `scanFile`
// keeps the core range and the scanned characters.
function subset({ src, out, glyphs, instanceWght }) {
	const inputTtf = join(FONTS_DIR, src)
	const cmd = []
	let actualInput = inputTtf
	let scratch = null

	// Both steps get the pinned epoch: the instancer writes the intermediate
	// pyftsubset reads, so either one left unpinned reintroduces a live stamp.
	const env = { ...process.env, SOURCE_DATE_EPOCH }

	// Limit the variable weight axis before subsetting. The intermediate goes to
	// a temp dir so a crash cannot strand an untracked TTF in assets/fonts.
	if (instanceWght) {
		scratch = mkdtempSync(join(tmpdir(), 'fontbuild-axis-'))
		const limited = join(scratch, 'axis-limited.ttf')
		execFileSync('fonttools', ['varLib.instancer', inputTtf, `wght=${instanceWght}`, '-o', limited], {
			stdio: 'pipe',
			env,
		})
		actualInput = limited
	}

	cmd.push(actualInput, `--output-file=${out}`, '--flavor=woff2', '--layout-features=*')
	if (glyphs.core) cmd.push(`--unicodes=${UNICODE_RANGE}`)
	if (glyphs.scanFile) cmd.push(`--text-file=${glyphs.scanFile}`)

	try {
		execFileSync('pyftsubset', cmd, { stdio: 'pipe', env })
	} finally {
		if (scratch) rmSync(scratch, { recursive: true, force: true })
	}
}

// --- Build candidates -------------------------------------------------------

function buildStatic(outDir, glyphs) {
	let total = 0
	const rows = []
	for (const w of WEIGHTS) {
		const out = join(outDir, w.out)
		subset({ src: w.ttf, out, glyphs })
		const size = fileSize(out)
		total += size
		rows.push({ name: w.out, size })
	}
	return { rows, total, requests: WEIGHTS.length }
}

function buildVariable(outDir, glyphs) {
	const out = join(outDir, VARIABLE_OUT)
	subset({ src: VARIABLE_TTF, out, glyphs, instanceWght: WGHT_RANGE })
	const size = fileSize(out)
	return { rows: [{ name: VARIABLE_OUT, size }], total: size, requests: 1 }
}

function build(strategy, glyphs, outDir) {
	return strategy === 'variable' ? buildVariable(outDir, glyphs) : buildStatic(outDir, glyphs)
}

// --- Modes ------------------------------------------------------------------

function currentBaseline() {
	let total = 0
	const rows = []
	for (const w of WEIGHTS) {
		const p = join(FONTS_DIR, w.out)
		try {
			const size = fileSize(p)
			total += size
			rows.push({ name: w.out, size })
		} catch {
			/* not present yet */
		}
	}
	return { rows, total, requests: rows.length }
}

function measure() {
	const work = mkdtempSync(join(tmpdir(), 'fontbuild-'))
	const scanFile = join(work, 'used-chars.txt')
	const usedChars = collectUsedChars()
	writeFileSync(scanFile, usedChars)

	console.log(`Glyph scan: ${[...usedChars].length} distinct characters in source content\n`)

	const candidates = []
	const baseline = currentBaseline()
	if (baseline.rows.length) candidates.push(['current (committed WOFF2)', baseline])

	const matrix = [
		['static  · core', 'static', { core: true }],
		['static  · core+scan', 'static', { core: true, scanFile }],
		['variable · core', 'variable', { core: true }],
		['variable · core+scan', 'variable', { core: true, scanFile }],
		['variable · scan-only', 'variable', { scanFile }],
	]

	for (const [label, strategy, glyphs] of matrix) {
		const dir = join(work, label.replace(/[^a-z]+/gi, '-'))
		mkdirSync(dir, { recursive: true })
		try {
			candidates.push([label, build(strategy, glyphs, dir)])
		} catch (err) {
			console.error(`  skipped ${label}: ${err.message.split('\n')[0]}`)
		}
	}

	const w = 28
	console.log('Candidate'.padEnd(w) + 'Total'.padStart(12) + 'Requests'.padStart(12))
	console.log('-'.repeat(w + 24))
	for (const [label, res] of candidates) {
		console.log(label.padEnd(w) + kb(res.total).padStart(12) + String(res.requests).padStart(12))
	}
	console.log('\nPer-file detail:')
	for (const [label, res] of candidates) {
		console.log(`\n  ${label}`)
		for (const r of res.rows) console.log(`    ${r.name.padEnd(40)} ${kb(r.size).padStart(10)}`)
	}

	rmSync(work, { recursive: true, force: true })
}

function emit() {
	const strategy = flag('strategy') || 'variable'
	const glyphsMode = flag('glyphs') || 'core+scan'
	const glyphs = { core: glyphsMode !== 'scan' }
	if (glyphsMode !== 'core') {
		glyphs.scanFile = join(mkdtempSync(join(tmpdir(), 'fontbuild-')), 'used-chars.txt')
		writeFileSync(glyphs.scanFile, collectUsedChars())
	}

	console.log(`Emitting ${strategy} / ${glyphsMode} WOFF2 into assets/fonts/\n`)
	const res = build(strategy, glyphs, FONTS_DIR)
	for (const r of res.rows) console.log(`  ${r.name.padEnd(40)} ${kb(r.size).padStart(10)}`)
	console.log(`\nTotal: ${kb(res.total)} across ${res.requests} file(s)`)
}

if (args.includes('--emit')) emit()
else measure()
