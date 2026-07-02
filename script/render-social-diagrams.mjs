#!/usr/bin/env node
/**
 * Renders the inline SVG diagrams from _includes/diagrams/ into shareable
 * WebP images (article title + digitalblake.com credit) for social media.
 *
 * On-demand, not part of the build:
 *   docker compose run --rm app node script/render-social-diagrams.mjs
 */
import { execFileSync } from 'child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Resvg } from '@resvg/resvg-js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FONT_DIR = join(ROOT, 'assets/fonts')
const OUT_DIR = join(ROOT, 'assets/uploads/2026/06')

const NAVY = '#191936'
const BLUE = '#0072bc'
const WHITE = '#fefefe'
const PAD = 56
const TITLE_SIZE = 30
const TITLE_LINE_HEIGHT = 42
const CREDIT_SIZE = 18
const RENDER_WIDTH = 1600

const DIAGRAMS = [
	{
		include: '_includes/diagrams/lead-scoring-flow.svg',
		title: 'An Idea for Better Rating of Sales Leads in the Age of AI',
		out: 'lead-scoring-flow-social.webp',
	},
	{
		include: '_includes/diagrams/lead-legitimacy-pipeline.svg',
		title: 'Identity Is Not Legitimacy: Vetting a Sales Lead Is an Arms Race',
		out: 'lead-legitimacy-pipeline-social.webp',
	},
]

// Rough width estimate for bold Montserrat; only used to wrap the title.
function wrapTitle(title, maxWidth) {
	const charWidth = TITLE_SIZE * 0.66
	const maxChars = Math.floor(maxWidth / charWidth)
	const lines = []
	let line = ''
	for (const word of title.split(' ')) {
		const candidate = line ? `${line} ${word}` : word
		if (candidate.length > maxChars && line) {
			lines.push(line)
			line = word
		} else {
			line = candidate
		}
	}
	if (line) lines.push(line)
	return lines
}

function escapeXml(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function composeSocialSvg(diagramSvg, title) {
	const viewBox = diagramSvg.match(/viewBox="0 0 (\d+) (\d+)"/)
	if (!viewBox) throw new Error('Diagram SVG has no viewBox')
	const diagramWidth = Number(viewBox[1])
	const diagramHeight = Number(viewBox[2])
	const width = diagramWidth + PAD * 2

	const titleLines = wrapTitle(title, diagramWidth)
	let y = PAD + TITLE_SIZE
	const titleText = titleLines
		.map(line => {
			const tspan = `<text x="${width / 2}" y="${y}" text-anchor="middle" font-size="${TITLE_SIZE}" font-weight="800" fill="${NAVY}">${escapeXml(line)}</text>`
			y += TITLE_LINE_HEIGHT
			return tspan
		})
		.join('\n\t')

	const ruleY = y - TITLE_LINE_HEIGHT + 22
	const diagramY = ruleY + 36
	const creditY = diagramY + diagramHeight + 44
	const height = creditY + PAD - CREDIT_SIZE

	// Nest the diagram at 1:1 scale below the title.
	const nested = diagramSvg.replace('<svg ', `<svg x="${PAD}" y="${diagramY}" width="${diagramWidth}" height="${diagramHeight}" `)

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family="Montserrat">
	<rect width="${width}" height="${height}" fill="${WHITE}"/>
	<rect x="0" y="0" width="${width}" height="8" fill="${NAVY}"/>
	${titleText}
	<rect x="${width / 2 - 32}" y="${ruleY}" width="64" height="4" rx="2" fill="${BLUE}"/>
	${nested}
	<text x="${width / 2}" y="${creditY}" text-anchor="middle" font-size="${CREDIT_SIZE}" font-weight="700" fill="${BLUE}">digitalblake.com</text>
</svg>`
}

console.log('Rendering social diagrams...\n')

for (const { include, title, out } of DIAGRAMS) {
	const diagramSvg = readFileSync(join(ROOT, include), 'utf8')
	const socialSvg = composeSocialSvg(diagramSvg, title)

	const resvg = new Resvg(socialSvg, {
		fitTo: { mode: 'width', value: RENDER_WIDTH },
		font: {
			fontFiles: [
				join(FONT_DIR, 'Montserrat-Regular.ttf'),
				join(FONT_DIR, 'Montserrat-Bold.ttf'),
				join(FONT_DIR, 'Montserrat-ExtraBold.ttf'),
			],
			loadSystemFonts: false,
			defaultFontFamily: 'Montserrat',
		},
	})

	const pngPath = join(OUT_DIR, out.replace(/\.webp$/, '.png'))
	const webpPath = join(OUT_DIR, out)
	writeFileSync(pngPath, resvg.render().asPng())
	execFileSync('magick', [pngPath, '-strip', '-quality', '95', webpPath], { stdio: 'pipe' })
	unlinkSync(pngPath)
	console.log(`  + ${webpPath.replace(ROOT, '')}`)
}

console.log('\nDone')
