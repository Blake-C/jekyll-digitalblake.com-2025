import { setScrollLock } from './_scroll-lock.js'

const ANIMATION_FALLBACK_MS = 400

// Sub-pixel rounding leaves a fraction of a pixel of overflow on boxes that fit.
const OVERFLOW_TOLERANCE_PX = 4
const SCROLL_HINT_TOLERANCE_PX = 2

let initialized = false
let trigger = null

const dialog = () => document.getElementById('recommendation-modal')

// close() is instant, so the exit animation runs under .is-closing first. The
// timeout covers the case where no animation runs, such as reduced motion.
function closeModal() {
	const modal = dialog()
	if (!modal || !modal.open || modal.classList.contains('is-closing')) return

	let done = false
	const finish = () => {
		if (done) return
		done = true
		modal.classList.remove('is-closing')
		modal.close()
	}

	modal.classList.add('is-closing')
	modal.addEventListener('animationend', finish, { once: true })
	setTimeout(finish, ANIMATION_FALLBACK_MS)
}

function openModal(card, button) {
	const modal = dialog()
	if (!modal || modal.open) return

	const person = modal.querySelector('.recommendation-modal__person')
	const body = modal.querySelector('.recommendation-modal__body')
	if (!person || !body) return

	// The card already holds the full text, clipped by a max-height, so cloning
	// from it keeps the page from shipping every recommendation twice.
	const attribution = card.querySelector('figcaption')
	const quote = card.querySelector('blockquote')
	if (!attribution || !quote) return

	person.replaceChildren(attribution.cloneNode(true))
	body.replaceChildren(quote.cloneNode(true))
	modal.setAttribute('aria-label', button.dataset.recommendationLabel || 'Recommendation')

	trigger = button
	modal.classList.remove('is-closing')
	modal.showModal()
	setScrollLock(true)
	updateScrollHint(modal, body)
	modal.querySelector('.recommendation-modal__close')?.focus()
}

function updateScrollHint(modal, body) {
	const more = body.scrollTop + body.clientHeight < body.scrollHeight - SCROLL_HINT_TOLERANCE_PX
	modal.querySelector('.recommendation-modal__panel')?.classList.toggle('has-more-below', more)
}

// CSS has no way to ask whether a box overflows, and the fade is wrong on a card
// whose text already fits.
function markClampedCards(wall) {
	const measure = () => {
		wall.querySelectorAll('.recommendation-wall__card').forEach(card => {
			const quote = card.querySelector('.recommendation-wall__quote')
			if (!quote) return
			const clamped = quote.scrollHeight - quote.clientHeight > OVERFLOW_TOLERANCE_PX
			card.classList.toggle('is-clamped', clamped)
		})
	}

	measure()

	// Swapping in the webfont reflows every quote.
	document.fonts?.ready.then(measure)

	// Observing is safe from feedback because is-clamped only adds a mask, which
	// changes no layout.
	new ResizeObserver(measure).observe(wall)
}

export default function initRecommendationModal() {
	if (initialized) return
	initialized = true

	const wall = document.querySelector('.recommendation-wall')
	const modal = dialog()
	if (!wall || !modal) return

	markClampedCards(wall)

	wall.addEventListener('click', event => {
		const button = event.target.closest('.recommendation-wall__expand')
		if (!button) return
		openModal(button.closest('.recommendation-wall__card'), button)
	})

	modal.querySelector('.recommendation-modal__close')?.addEventListener('click', closeModal)

	const body = modal.querySelector('.recommendation-modal__body')
	if (body) {
		const hint = () => updateScrollHint(modal, body)
		body.addEventListener('scroll', hint, { passive: true })
		new ResizeObserver(hint).observe(body)
	}

	// The dialog fills the viewport, so a backdrop click arrives on the dialog
	// element itself. ::backdrop is not an event target.
	modal.addEventListener('click', event => {
		if (event.target === modal) closeModal()
	})

	// Esc fires cancel before close. Preventing the default lets the exit
	// animation run instead of the dialog vanishing.
	modal.addEventListener('cancel', event => {
		event.preventDefault()
		closeModal()
	})

	modal.addEventListener('close', () => {
		setScrollLock(false)
		modal.querySelector('.recommendation-modal__person')?.replaceChildren()
		modal.querySelector('.recommendation-modal__body')?.replaceChildren()
		trigger?.focus()
		trigger = null
	})
}
