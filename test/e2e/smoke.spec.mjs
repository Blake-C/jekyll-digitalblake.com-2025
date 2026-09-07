import { test, expect } from '@playwright/test'

/**
 * Proves the setup itself before any behaviour is asserted: the arm64 Playwright
 * image runs, node_modules resolves across the bind mount from the app service,
 * and serve.mjs serves the build.
 */
test('the home page loads and renders its own stylesheet', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(/DigitalBlake/)

	// Proves the deferred stylesheet actually swapped in. Critical CSS alone
	// would leave this unset.
	const background = await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor)
	expect(background).not.toBe('rgba(0, 0, 0, 0)')
})

test('a missing URL serves the 404 page', async ({ page }) => {
	const response = await page.goto('/definitely-not-a-real-page/')
	expect(response?.status()).toBe(404)
})
