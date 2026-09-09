import { test, expect } from '@playwright/test'

const POST_WITH_TABLE = '/2026/04/28/swiftui-vs-appkit-macos-ui-performance/'
const POST_WITH_VIDEO = '/2026/05/15/supply-chain-attacks-got-smarter/'

test('tables in article bodies are wrapped so they can scroll', async ({ page }) => {
	await page.goto(POST_WITH_TABLE)

	const tables = page.locator('.entry-content table')
	await expect(tables.first()).toBeAttached()

	const unwrapped = await page.evaluate(
		() =>
			[...document.querySelectorAll('.entry-content table')].filter(
				table => !table.parentElement?.classList.contains('table-wrapper'),
			).length,
	)
	expect(unwrapped, 'a table has no .table-wrapper parent, so it overflows the page').toBe(0)
})

test('the reading progress bar fills as the article is scrolled', async ({ page }) => {
	await page.goto(POST_WITH_TABLE)

	const bar = page.locator('.reading-progress__bar')
	await expect(bar).toBeAttached()

	const width = () => bar.evaluate(element => element.getBoundingClientRect().width)
	const before = await width()

	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

	await expect.poll(width, { message: 'the bar never grew after scrolling' }).toBeGreaterThan(before)
})

test('the YouTube facade stays a still image until it is activated', async ({ page }) => {
	await page.goto(POST_WITH_VIDEO)

	const facade = page.locator('.youtube-facade[data-video-id]').first()
	await expect(facade).toBeAttached()

	// No iframe means no request to YouTube until someone asks for the video.
	await expect(page.locator('iframe')).toHaveCount(0)

	await facade.click()

	const iframe = page.locator('iframe').first()
	await expect(iframe).toBeAttached()
	await expect(iframe).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//)
})

test('the YouTube facade is operable from the keyboard', async ({ page }) => {
	await page.goto(POST_WITH_VIDEO)

	const facade = page.locator('.youtube-facade[data-video-id]').first()
	await facade.focus()
	await page.keyboard.press('Enter')

	await expect(page.locator('iframe').first()).toBeAttached()
})

test('the skip link moves focus to the main content', async ({ page }) => {
	await page.goto('/')

	await page.keyboard.press('Tab')
	const skip = page.locator('.skip-link')
	await expect(skip).toBeFocused()

	await page.keyboard.press('Enter')

	const focusedId = await page.evaluate(() => document.activeElement?.id)
	expect(focusedId, 'focus did not land on the content target').toBe('content')
})
