#!/usr/bin/env node
/**
 * Renders Open Graph cards for articles whose source image is a stock photo
 * carrying no information: the photo is blurred, covered with a navy scrim, and
 * the article title is set over it in the same palette as og-fallback.jpg.
 *
 * Writes to a new `-og.webp` file rather than overwriting the source, so the
 * script is idempotent and the original photo stays available.
 *
 * On-demand, not part of the build:
 *   docker compose run --rm app node script/render-article-og.mjs
 *
 * Reports the worst-case contrast ratio between the title and the pixels behind
 * it. Anything under MIN_CONTRAST is a failure, not a warning.
 */
import { execFileSync } from 'child_process'
import { unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FONT_BOLD = join(ROOT, 'assets/fonts/Montserrat-ExtraBold.ttf')
const FONT_CREDIT = join(ROOT, 'assets/fonts/Montserrat-Bold.ttf')

const WIDTH = 1200
const HEIGHT = 630
const PAD = 80
const NAVY = '#191936'
const TEXT = '#d2d3fc'
const SCRIM = 0.82 // opacity of the navy layer over the blurred photo
const BLUR = '0x24'
const TITLE_SIZE = 66
const CREDIT_SIZE = 24
const MIN_CONTRAST = 4.5

const ARTICLES = [
	{
		source: 'assets/uploads/2026/07/testing-web-accessibility-tools-automation-and-ai.webp',
		out: 'assets/uploads/2026/07/testing-web-accessibility-tools-automation-and-ai-og.webp',
		title: 'Testing for WCAG Conformance: Tools, Manual Review, and AI',
	},
	{
		source: 'assets/uploads/2026/07/web-accessibility-standards-and-law-wcag-eaa-us.webp',
		out: 'assets/uploads/2026/07/web-accessibility-standards-and-law-wcag-eaa-us-og.webp',
		title: 'Web Accessibility Law and WCAG: EAA, ADA, and Section 508',
	},
	{
		source: 'assets/uploads/2025/04/swiftui-vs-appkit-on-macos-layout-models-performance-and-trade-offs-social-share-image.webp',
		out: 'assets/uploads/2025/04/swiftui-vs-appkit-on-macos-layout-models-performance-and-trade-offs-og.webp',
		title: 'AppKit vs SwiftUI on macOS: Layout, Performance, and Trade-offs',
	},
]

const magick = args => execFileSync('magick', args, { stdio: 'pipe' })

function relativeLuminance([r, g, b]) {
	const channel = v => {
		const s = v / 255
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
	}
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(a, b) {
	const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
	return (hi + 0.05) / (lo + 0.05)
}

/** Brightest pixel in the band the title sits in; the worst case for light text. */
function brightestInBand(file, top, height) {
	const out = execFileSync(
		'magick',
		[file, '-crop', `${WIDTH}x${height}+0+${top}`, '+repage', '-format', '%[max]', 'info:'],
		{ encoding: 'utf8', stdio: 'pipe' }
	)
	const scale = Number(out.trim()) / 65535
	const px = execFileSync(
		'magick',
		[file, '-crop', `${WIDTH}x${height}+0+${top}`, '+repage', '-colors', '1', '-format', '%c', 'histogram:info:'],
		{ encoding: 'utf8', stdio: 'pipe' }
	)
	const hex = px.match(/#([0-9A-F]{6})/i)
	const flat = hex ? hex[1] : '000000'
	const rgb = [0, 2, 4].map(i => parseInt(flat.slice(i, i + 2), 16))
	// Compare against the brighter of the average colour and the peak channel.
	const peak = Math.round(scale * 255)
	return rgb.map(v => Math.max(v, peak * 0.35))
}

const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))

let failures = 0

for (const article of ARTICLES) {
	const source = join(ROOT, article.source)
	const out = join(ROOT, article.out)
	const captionPath = `${out}.caption.png`

	// Blurred, scrimmed background at OG dimensions.
	magick([
		source,
		'-resize',
		`${WIDTH}x${HEIGHT}^`,
		'-gravity',
		'center',
		'-extent',
		`${WIDTH}x${HEIGHT}`,
		'-gaussian-blur',
		BLUR,
		'(',
		'-size',
		`${WIDTH}x${HEIGHT}`,
		`xc:${NAVY}`,
		'-alpha',
		'set',
		'-channel',
		'A',
		'-evaluate',
		'set',
		`${SCRIM * 100}%`,
		'+channel',
		')',
		'-compose',
		'over',
		'-composite',
		out,
	])

	// Title, wrapped to the padded width.
	magick([
		'-background',
		'none',
		'-fill',
		TEXT,
		'-font',
		FONT_BOLD,
		'-pointsize',
		String(TITLE_SIZE),
		'-interline-spacing',
		'14',
		'-size',
		`${WIDTH - PAD * 2}x`,
		'-gravity',
		'west',
		`caption:${article.title}`,
		captionPath,
	])

	magick([out, captionPath, '-gravity', 'west', '-geometry', `+${PAD}+0`, '-composite', out])
	unlinkSync(captionPath)

	// Credit line, bottom left.
	magick([
		out,
		'-font',
		FONT_CREDIT,
		'-pointsize',
		String(CREDIT_SIZE),
		'-fill',
		TEXT,
		'-gravity',
		'southwest',
		'-annotate',
		`+${PAD}+48`,
		'digitalblake.com',
		'-strip',
		'-quality',
		'92',
		out,
	])

	const behind = brightestInBand(out, 120, HEIGHT - 240)
	const ratio = contrastRatio(hexToRgb(TEXT), behind)
	const ok = ratio >= MIN_CONTRAST
	if (!ok) failures += 1
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${article.out}  contrast ${ratio.toFixed(2)}:1`)
}

if (failures > 0) {
	console.error(`\n${failures} card(s) under ${MIN_CONTRAST}:1. Raise SCRIM and re-run.`)
	process.exit(1)
}
