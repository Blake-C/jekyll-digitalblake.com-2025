/**
 * Fills the bar under the sticky header as the article body is read.
 *
 * The bar lives inside the header, so its position tracks the scroll-shrink
 * with no measuring here. Progress runs against .entry-content alone, so it
 * reads full at the end of the article rather than the end of the page.
 */

export default function initReadingProgress() {
	const bar = document.querySelector('.reading-progress__bar')
	const content = document.querySelector('.main-content-block .entry-content')

	if (!bar || !content) {
		return
	}

	let last = null
	let queued = false

	function update() {
		queued = false

		// Read fresh each frame: lazy images, embeds and the font swap all change
		// the article's height after load.
		const rect = content.getBoundingClientRect()

		if (rect.height <= 0) {
			return
		}

		// Empty at the top of the page, full at the scroll position where the last
		// line of the body meets the bottom of the window. Everything after that
		// (the CTA, related posts, the footer) sits past 100%.
		const scrolled = window.scrollY
		const end = scrolled + rect.bottom - window.innerHeight
		const raw = end > 0 ? scrolled / end : 1
		const progress = Math.round(Math.min(Math.max(raw, 0), 1) * 1000) / 1000

		if (progress === last) {
			return
		}

		last = progress
		bar.style.setProperty('--reading-progress', progress)
	}

	function schedule() {
		if (queued) {
			return
		}

		queued = true
		requestAnimationFrame(update)
	}

	window.addEventListener('scroll', schedule, { passive: true })
	window.addEventListener('resize', schedule, { passive: true })

	update()
}
