import { test, expect } from '@playwright/test'

/**
 * Checks the page is laid out correctly before the deferred stylesheet arrives.
 * A rule missing from critical CSS corrects itself once global-styles loads, so
 * anything measured after load sees nothing wrong.
 *
 * There is no stored baseline. Each page is compared against itself, once with
 * the deferred stylesheet blocked and once normally, so a redesign needs no
 * re-approval here. Blocking the request rather than racing it makes the
 * first-paint state permanent and the measurement deterministic.
 *
 * Height is not compared, because a container's height depends on children below
 * the fold that critical CSS does not style. Vertical movement is still caught,
 * since anything growing above an element pushes that element's y.
 */
const TOLERANCE_PX = 2

const SELECTORS = [
	'header.top-header',
	'.logo-name',
	'.nav-hamburger',
	'main#content',
	'.entry-header',
	'.entry-title',
	'h1',
	'.intro__cta',
	'.intro__headshot',
	'.pillar-toc-col',
	'.recommendation-wall',
	'.case-studies__grid',
	'.entry-content',
]

const PAGES = {
	home: '/',
	post: '/2026/04/28/swiftui-vs-appkit-macos-ui-performance/',
	guide: '/guides/building-with-claude-code/',
	'case study': '/case-studies/teleport-atlas/',
	recommendations: '/recommendations/',
}

// 390 and 1280 sit either side of the 900px hamburger cutoff, and 768 is the
// medium breakpoint.
const WIDTHS = [390, 768, 1280]

/** Accepted first-paint differences, with the reason. Anything not listed here
 *  is a failure. */
const ALLOWED = {
	'/recommendations/': {
		'.recommendation-wall':
			'layout/recommendations is not in critical CSS, so the quote clamp arrives late and the wall ' +
			'renders full height at first paint. Adding it would inline about 7KB into all 200 pages to fix ' +
			'the first paint of this one.',
	},
}

async function geometry(page) {
	return page.evaluate(selectors => {
		const boxes = {}
		for (const selector of selectors) {
			const element = document.querySelector(selector)
			if (!element) continue
			const rect = element.getBoundingClientRect()
			boxes[selector] = {
				x: Math.round(rect.x),
				top: Math.round(rect.top + window.scrollY),
				width: Math.round(rect.width),
			}
		}
		return boxes
	}, SELECTORS)
}

/** Waits for the preloaded stylesheet to be applied, which is later than
 *  fetched. */
async function stylesheetApplied(page) {
	await page.waitForFunction(() =>
		[...document.querySelectorAll('link')].some(
			link => link.href.includes('global-styles') && link.rel === 'stylesheet',
		),
	)
	await page.evaluate(() => document.fonts?.ready)
}

for (const [name, path] of Object.entries(PAGES)) {
	for (const width of WIDTHS) {
		test(`${name} is laid out correctly before the deferred CSS loads, at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 })

			// Fulfilled empty and not aborted, because an aborted subresource stops
			// WebKit firing `load` and page.goto never resolves.
			const blockGlobalCss = route => route.fulfill({ status: 200, contentType: 'text/css', body: '' })
			await page.route(/global-styles.*\.css/, blockGlobalCss)
			await page.goto(path)
			await page.evaluate(() => document.fonts?.ready)
			const firstPaint = await geometry(page)
			await page.unroute(/global-styles.*\.css/, blockGlobalCss)

			await page.goto(path)
			await stylesheetApplied(page)
			const settled = await geometry(page)

			const allowed = ALLOWED[path] ?? {}
			const moved = []

			for (const [selector, after] of Object.entries(settled)) {
				// Critical CSS only covers the first screen, so a late rule moving
				// something below it is expected.
				if (after.top >= 900) continue
				if (selector in allowed) continue

				const before = firstPaint[selector]
				if (!before) {
					moved.push(`${selector} is missing entirely at first paint`)
					continue
				}

				const shift = {
					x: Math.abs(before.x - after.x),
					y: Math.abs(before.top - after.top),
					width: Math.abs(before.width - after.width),
				}

				if (Math.max(shift.x, shift.y, shift.width) > TOLERANCE_PX) {
					moved.push(`${selector} moved dx=${shift.x} dy=${shift.y} dwidth=${shift.width}`)
				}
			}

			expect(
				moved,
				`${path} at ${width}px shifts when the deferred stylesheet lands, so a rule it needs ` +
					`above the fold is missing from critical CSS`,
			).toEqual([])
		})
	}
}
