import { test, expect } from '@playwright/test'

/**
 * The DevTools Issues panel, read over CDP. Issues are not console messages, so
 * console.spec.mjs cannot see them. Chrome reports Content Security Policy
 * violations, deprecated API use, mixed content, cookie problems, and
 * low-contrast text here, and none of it surfaces unless DevTools is open.
 *
 * The checks come from whatever Chromium the pinned Playwright version bundles,
 * which lags stable Chrome by some months.
 */
const PAGES = {
	home: '/',
	post: '/2026/04/28/swiftui-vs-appkit-macos-ui-performance/',
	'post with video': '/2026/05/15/supply-chain-attacks-got-smarter/',
	'case study': '/case-studies/teleport-atlas/',
	guide: '/guides/building-with-claude-code/',
	recommendations: '/recommendations/',
}

for (const [name, path] of Object.entries(PAGES)) {
	test(`the ${name} page reports no DevTools issues`, async ({ page, browserName }) => {
		test.skip(browserName !== 'chromium', 'the Audits domain is a Chromium protocol')

		const cdp = await page.context().newCDPSession(page)
		const issues = []
		cdp.on('Audits.issueAdded', event => issues.push(event.issue))
		await cdp.send('Audits.enable')

		await page.goto(path, { waitUntil: 'networkidle' })
		// Lazy images and anything below the fold only report once reached.
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
		await page.waitForTimeout(1000)

		// Chromium 153 reports LazyLoadImageIssue for any lazy image styled with
		// `height: auto`, even when its width and height attributes already reserve
		// the box before it loads. An image missing either attribute is still a
		// failure.
		const sized = new Set(
			await page.$$eval('img[loading=lazy][width][height]', imgs => imgs.map(img => img.getAttribute('src'))),
		)
		const found = issues
			.filter(
				issue =>
					!(issue.code === 'LazyLoadImageIssue' && sized.has(issue.details.lazyLoadImageIssueDetails.url)),
			)
			.map(issue => `${issue.code}: ${JSON.stringify(issue.details).slice(0, 200)}`)
		expect(found, `DevTools reported issues on ${path}`).toEqual([])
	})
}
