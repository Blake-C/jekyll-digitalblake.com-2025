import { test, expect } from '@playwright/test'

/**
 * The recommendation modal on /recommendations/.
 *
 * It clones content out of the card that opened it rather than the page
 * shipping every recommendation twice, so the assertions here are mostly about
 * the right text arriving and then being cleared again. The clamp and scroll
 * hint exist because CSS cannot ask whether a box overflows, which makes them
 * measurement code, and measurement code is what regresses quietly.
 *
 * Its backdrop closes the dialog. The nav modal's deliberately does not. That
 * difference is asserted in both files so neither drifts onto the other's
 * behavior unnoticed.
 */
const PAGE = '/recommendations/'

const modal = page => page.locator('#recommendation-modal')
const panel = page => page.locator('.recommendation-modal__panel')
const closeButton = page => page.locator('.recommendation-modal__close')
const expanders = page => page.locator('.recommendation-wall__expand')

/** The wall measures itself again once the webfont swaps, so nothing should be
 *  asserted about clamping until fonts have settled. */
async function ready(page) {
	await page.goto(PAGE)
	await page.waitForFunction(() => document.fonts?.status === 'loaded')
	await expect(expanders(page).first()).toBeVisible()
}

test('the wall and its trigger buttons render', async ({ page }) => {
	await ready(page)
	const count = await expanders(page).count()
	expect(count, 'no recommendation cards found, so nothing below proves anything').toBeGreaterThan(1)
})

test('opening a card fills the dialog with that card and labels it', async ({ page }) => {
	await ready(page)

	const first = expanders(page).first()
	const label = await first.getAttribute('data-recommendation-label')

	await first.click()

	await expect(modal(page)).toBeVisible()
	await expect(modal(page)).toHaveAttribute('aria-label', label)
	await expect(page.locator('.recommendation-modal__person figcaption')).toBeAttached()

	// Both sides are read and normalized together. Comparing a card's innerText
	// against the dialog's fails on whitespace alone, because the card clips its
	// quote and the two collapse paragraph breaks differently.
	const quote = await page.evaluate(() => {
		const normalize = text => (text ?? '').replace(/\s+/g, ' ').trim()
		const button = document.querySelector('.recommendation-wall__expand')
		const card = button.closest('.recommendation-wall__card')
		const shown = normalize(document.querySelector('.recommendation-modal__body blockquote')?.textContent)
		return { card: normalize(card.querySelector('blockquote').textContent), shown }
	})

	expect(quote.shown.length, 'the dialog quote is empty, so comparing it proves nothing').toBeGreaterThan(50)
	expect(quote.shown, 'the dialog shows different text from the card that opened it').toBe(quote.card)
})

test('opening moves focus to close and locks scrolling behind', async ({ page }) => {
	await ready(page)
	await expanders(page).first().click()

	await expect(closeButton(page)).toBeFocused()
	await expect(page.locator('html')).toHaveClass(/has-modal-open/)
})

test('the close button clears the dialog and returns focus to the card', async ({ page }) => {
	await ready(page)

	const first = expanders(page).first()
	await first.click()
	await expect(modal(page)).toBeVisible()

	await closeButton(page).click()

	await expect(modal(page)).toBeHidden()
	await expect(page.locator('html')).not.toHaveClass(/has-modal-open/)

	// Asserts the behavior, not the line that implements it. Deleting
	// `trigger?.focus()` from the close handler leaves this passing, because
	// Chromium restores focus to whatever was focused when showModal() ran, and
	// clicking the card focused it. The module's call still matters for browsers
	// this suite does not run, so it is not dead code.
	await expect(first).toBeFocused()

	// Cloned content is dropped on close, so a stale quote cannot flash on the
	// next open before the new one is written.
	await expect(page.locator('.recommendation-modal__body')).toBeEmpty()
	await expect(page.locator('.recommendation-modal__person')).toBeEmpty()
})

test('Escape closes the dialog', async ({ page }) => {
	await ready(page)
	await expanders(page).first().click()
	await expect(modal(page)).toBeVisible()

	await page.keyboard.press('Escape')

	await expect(modal(page)).toBeHidden()
	await expect(page.locator('html')).not.toHaveClass(/has-modal-open/)
})

test('clicking the backdrop closes the dialog', async ({ page }) => {
	await ready(page)
	await expanders(page).first().click()
	await expect(modal(page)).toBeVisible()

	// The dialog fills the viewport and ::backdrop is not an event target, so a
	// backdrop click lands on the dialog element itself. The corner is outside
	// the centred panel.
	await page.mouse.click(5, 5)

	await expect(modal(page)).toBeHidden()
})

test('closing still completes when animations are suppressed', async ({ page }) => {
	// close() is instant, so the exit runs under .is-closing and waits for
	// animationend. With reduced motion no animation fires and only the timeout
	// fallback finishes the close.
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await ready(page)

	await expanders(page).first().click()
	await expect(modal(page)).toBeVisible()
	await closeButton(page).click()

	await expect(modal(page)).toBeHidden()
	await expect(modal(page)).not.toHaveClass(/is-closing/)
})

test('opening a second card replaces the first card content', async ({ page }) => {
	await ready(page)

	const [first, second] = [expanders(page).nth(0), expanders(page).nth(1)]
	const secondLabel = await second.getAttribute('data-recommendation-label')

	await first.click()
	const firstText = await page.locator('.recommendation-modal__body').innerText()
	await closeButton(page).click()
	await expect(modal(page)).toBeHidden()

	await second.click()
	await expect(modal(page)).toBeVisible()
	await expect(modal(page)).toHaveAttribute('aria-label', secondLabel)
	await expect(page.locator('.recommendation-modal__body')).not.toHaveText(firstText)
})

test('is-clamped marks exactly the cards whose quote overflows', async ({ page }) => {
	await ready(page)

	// Compared against a live measurement rather than a fixed count, so the
	// assertion holds at any viewport.
	const wrong = await page.evaluate(() => {
		const TOLERANCE = 4
		return [...document.querySelectorAll('.recommendation-wall__card')]
			.map((card, index) => {
				const quote = card.querySelector('.recommendation-wall__quote')
				if (!quote) return null
				const overflows = quote.scrollHeight - quote.clientHeight > TOLERANCE
				const marked = card.classList.contains('is-clamped')
				return overflows === marked ? null : `card ${index}: overflows=${overflows} is-clamped=${marked}`
			})
			.filter(Boolean)
	})

	expect(wrong, 'is-clamped disagrees with the measured overflow').toEqual([])
})

test('the scroll hint clears once the quote is scrolled to the end', async ({ page }) => {
	await ready(page)
	await expanders(page).first().click()
	await expect(modal(page)).toBeVisible()

	const overflows = await page
		.locator('.recommendation-modal__body')
		.evaluate(element => element.scrollHeight > element.clientHeight + 2)
	test.skip(!overflows, 'this recommendation fits without scrolling')

	await expect(panel(page)).toHaveClass(/has-more-below/)

	await page.locator('.recommendation-modal__body').evaluate(element => element.scrollTo(0, element.scrollHeight))

	await expect(panel(page)).not.toHaveClass(/has-more-below/)
})
