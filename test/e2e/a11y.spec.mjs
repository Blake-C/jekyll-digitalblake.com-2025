import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * WCAG 2.1 AA, one page of each type. The global rule is that new UI gets an
 * accessibility check; this makes the check automatic for the page types that
 * already exist.
 *
 * axe finds roughly a third of accessibility defects, so a pass here is a floor
 * and not a conformance claim. The keyboard paths in nav-modal.spec.mjs and
 * modules.spec.mjs cover what it cannot see.
 */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

const PAGES = {
	home: '/',
	post: '/2026/04/28/swiftui-vs-appkit-macos-ui-performance/',
	'case study': '/case-studies/teleport-atlas/',
	guide: '/guides/building-with-claude-code/',
	archive: '/category/articles/',
	404: '/definitely-not-a-real-page/',
}

for (const [name, url] of Object.entries(PAGES)) {
	test(`the ${name} page has no WCAG 2.1 AA violations`, async ({ page }) => {
		await page.goto(url)
		const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()

		const summary = violations.map(v => `${v.id} (${v.impact}) on ${v.nodes.length}: ${v.help}`)
		expect(summary, `axe violations on ${url}`).toEqual([])
	})
}

test('the open nav modal has no WCAG 2.1 AA violations', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto('/')
	await page.locator('.nav-hamburger').click()
	await expect(page.locator('#nav-modal')).toBeVisible()

	const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
	expect(violations.map(v => `${v.id} (${v.impact}): ${v.help}`)).toEqual([])
})
