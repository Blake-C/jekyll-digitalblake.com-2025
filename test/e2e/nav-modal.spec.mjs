import { test, expect } from '@playwright/test'

/**
 * The nav modal, driven through the page so that global-scripts.js wiring the
 * module up is covered along with the module itself.
 *
 * The hamburger only exists below $nav-breakpoint (900px), so these run narrow.
 */
test.use({ viewport: { width: 390, height: 844 } })

const hamburger = page => page.locator('.nav-hamburger')
const modal = page => page.locator('#nav-modal')

test.beforeEach(async ({ page }) => {
	await page.goto('/')
})

test('the hamburger opens the dialog and reports it as expanded', async ({ page }) => {
	await expect(modal(page)).toBeHidden()

	await hamburger(page).click()

	await expect(modal(page)).toBeVisible()
	await expect(hamburger(page)).toHaveAttribute('aria-expanded', 'true')
})

test('opening locks scrolling on the page behind', async ({ page }) => {
	await hamburger(page).click()
	await expect(page.locator('html')).toHaveClass(/has-modal-open/)
})

test('the open dialog is modal, so focus cannot reach the page behind', async ({ page }) => {
	await hamburger(page).click()
	await expect(modal(page)).toBeVisible()

	// Chromium passes through <body> at the wrap point, so the assertion is on
	// focus never landing on a control behind the dialog and not on every stop
	// being inside it.
	const escaped = []
	let landedInside = 0

	for (let i = 0; i < 12; i++) {
		await page.keyboard.press('Tab')
		const outside = await page.evaluate(() => {
			const element = document.activeElement
			if (!element || element === document.body) return null
			const isControl = element.matches('a, button, input, select, textarea, [tabindex]')
			const behind = !document.getElementById('nav-modal').contains(element)
			return isControl && behind ? `${element.tagName} "${element.textContent?.trim().slice(0, 30)}"` : null
		})

		if (outside) escaped.push(`tab ${i + 1}: ${outside}`)
		else landedInside++
	}

	expect(escaped, 'focus reached a control behind the open modal').toEqual([])
	expect(landedInside, 'no tab stop was found, so this proved nothing').toBeGreaterThan(0)
})

test('Escape closes the dialog and returns focus to the hamburger', async ({ page }) => {
	await hamburger(page).click()
	await expect(modal(page)).toBeVisible()

	await page.keyboard.press('Escape')

	await expect(modal(page)).toBeHidden()
	await expect(hamburger(page)).toHaveAttribute('aria-expanded', 'false')
	await expect(page.locator('html')).not.toHaveClass(/has-modal-open/)
	await expect(hamburger(page)).toBeFocused()
})

test('the close button closes the dialog', async ({ page }) => {
	await hamburger(page).click()
	await modal(page).locator('.nav-modal__close').click()
	await expect(modal(page)).toBeHidden()
})

test('an in-page link closes the dialog first, then scrolls to the target', async ({ page }) => {
	await hamburger(page).click()
	await modal(page).locator('a[href="#case-studies"]').click()

	// The dialog is a top-layer element, so the scroll has to wait for close.
	await expect(modal(page)).toBeHidden()

	await expect
		.poll(() => page.evaluate(() => window.scrollY), { message: 'page never scrolled to the section' })
		.toBeGreaterThan(0)

	const heading = page.locator('#case-studies')
	await expect(heading).toBeInViewport()
})

test('a stray click on the backdrop does not dismiss the menu', async ({ page }) => {
	await hamburger(page).click()
	await expect(modal(page)).toBeVisible()

	// A mistaken tap on a phone must not close the nav. The close button is the
	// way out.
	await page.mouse.click(5, 5)
	await expect(modal(page)).toBeVisible()
})
