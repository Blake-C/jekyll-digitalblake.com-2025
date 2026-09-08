import { test, expect } from '@playwright/test'

/**
 * The DevTools Issues panel, read over CDP.
 *
 * Issues are not console messages, so console.spec.mjs cannot see them. This is
 * where Chrome reports Content Security Policy violations, deprecated API use,
 * mixed content, cookie problems, and low-contrast text: the class of defect
 * that is silent unless someone happens to open DevTools.
 *
 * That makes it a useful pair to the CSP meta assertion in
 * test/site-contract.test.mjs. The static test checks the header is present and
 * shaped right; this one catches the header actually blocking something.
 *
 * The set of checks Chrome ships grows with each release, so this gets stricter
 * over time on its own. It is pinned to whatever Chromium the Playwright version
 * bundles, which lags stable Chrome: a warning visible in a current browser may
 * not appear here for some months.
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
		// CDP is Chromium only.
		test.skip(browserName !== 'chromium', 'the Audits domain is a Chromium protocol')

		const cdp = await page.context().newCDPSession(page)
		const issues = []
		cdp.on('Audits.issueAdded', event => issues.push(event.issue))
		await cdp.send('Audits.enable')

		await page.goto(path, { waitUntil: 'networkidle' })
		// Lazy images and anything below the fold only report once reached.
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
		await page.waitForTimeout(1000)

		const found = issues.map(issue => `${issue.code}: ${JSON.stringify(issue.details).slice(0, 200)}`)
		expect(found, `DevTools reported issues on ${path}`).toEqual([])
	})
}
