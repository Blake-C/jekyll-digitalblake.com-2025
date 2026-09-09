import { test, expect } from '@playwright/test'

/**
 * Proves the setup before any behavior is asserted: the Playwright image runs,
 * node_modules resolves across the bind mount, and serve.mjs serves the build.
 */
test('the home page loads and renders its own stylesheet', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(/DigitalBlake/)

	// Critical CSS alone leaves this unset, so a color proves the deferred
	// stylesheet swapped in.
	const background = await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor)
	expect(background).not.toBe('rgba(0, 0, 0, 0)')
})

test('a missing URL serves the 404 page', async ({ page }) => {
	const response = await page.goto('/definitely-not-a-real-page/')
	expect(response?.status()).toBe(404)
})
