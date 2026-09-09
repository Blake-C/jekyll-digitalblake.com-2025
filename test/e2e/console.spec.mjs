import { test, expect } from '@playwright/test'

/**
 * Nothing errors in the console and nothing fails to load. The CSP in head.html
 * is a hand-maintained string, and a resource from a host it does not list is
 * blocked in the browser with nothing else in this repo's tooling reporting it.
 */
const PAGES = {
	home: '/',
	post: '/2026/04/28/swiftui-vs-appkit-macos-ui-performance/',
	'post with video': '/2026/05/15/supply-chain-attacks-got-smarter/',
	'case study': '/case-studies/teleport-atlas/',
	guide: '/guides/building-with-claude-code/',
	archive: '/category/articles/',
}

for (const [name, url] of Object.entries(PAGES)) {
	test(`the ${name} page loads with no console errors and no failed requests`, async ({ page }) => {
		const problems = []

		page.on('console', message => {
			if (message.type() === 'error') problems.push(`console error: ${message.text()}`)
		})
		page.on('pageerror', error => problems.push(`uncaught: ${error.message}`))
		page.on('requestfailed', request =>
			problems.push(`request failed: ${request.url()} (${request.failure()?.errorText})`),
		)
		page.on('response', response => {
			if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`)
		})

		await page.goto(url, { waitUntil: 'networkidle' })

		expect(problems, `problems on ${url}`).toEqual([])
	})
}
