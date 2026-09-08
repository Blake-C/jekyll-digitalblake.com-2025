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

/**
 * Waits for the Prism toolbar to stop moving before anything measures colour.
 *
 * Prism injects the toolbar after load, and prism-toolbar.css transitions it to
 * `opacity: 0` over 0.3s. For those 300ms the toolbar is partly visible, and
 * axe computes contrast against that blend: a run caught mid-fade reports
 * figures like 1.53:1 that correspond to no state a user ever sees. Without
 * this wait the case study check failed about four runs in ten, and passed the
 * rest because axe got there before Prism did.
 */
async function settleCodeToolbar(page) {
	const block = page.locator('div.code-toolbar').first()
	if ((await block.count()) === 0) return

	const toolbar = page.locator('div.code-toolbar > .toolbar').first()
	await toolbar.waitFor({ state: 'attached' })
	await expect
		.poll(() => toolbar.evaluate(element => getComputedStyle(element).opacity), {
			message: 'the Prism toolbar never settled to its resting opacity',
		})
		.toBe('0')
}

const summarise = violations => violations.map(v => `${v.id} (${v.impact}) on ${v.nodes.length}: ${v.help}`)

for (const [name, url] of Object.entries(PAGES)) {
	test(`the ${name} page has no WCAG 2.1 AA violations`, async ({ page }) => {
		await page.goto(url)
		await settleCodeToolbar(page)

		const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
		expect(summarise(violations), `axe violations on ${url}`).toEqual([])
	})
}

test('the code block toolbar meets contrast in the state that shows it', async ({ page }) => {
	// The resting state is invisible, so the check above says nothing about the
	// colours a user actually reads. This is the state that carried the real
	// defect: the plugin ships #bbb, which measures 4.44:1 here.
	await page.goto('/case-studies/teleport-atlas/')
	await settleCodeToolbar(page)

	await page.locator('div.code-toolbar').first().hover()
	const toolbar = page.locator('div.code-toolbar > .toolbar').first()
	await expect.poll(() => toolbar.evaluate(element => getComputedStyle(element).opacity)).toBe('1')

	const { violations } = await new AxeBuilder({ page }).withTags(TAGS).include('div.code-toolbar').analyze()
	expect(summarise(violations), 'axe violations on the visible code toolbar').toEqual([])
})

test('the open nav modal has no WCAG 2.1 AA violations', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto('/')
	await page.locator('.nav-hamburger').click()
	await expect(page.locator('#nav-modal')).toBeVisible()

	const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
	expect(summarise(violations)).toEqual([])
})
