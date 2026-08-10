const ANIMATION_FALLBACK_MS = 400

let initialized = false
let pendingScrollTarget = null

const SCROLL_LOCK_CLASS = 'has-nav-modal-open'

const dialog = () => document.getElementById('nav-modal')
const hamburger = () => document.querySelector('.nav-hamburger')

function setExpanded(state) {
	const button = hamburger()
	if (button) button.setAttribute('aria-expanded', String(state))
}

// showModal() makes the page behind inert, but inert only blocks interaction.
// The page still scrolls under the dialog, which shows through its background.
// This is what micromodal's disableScroll option was doing.
function setScrollLock(locked) {
	document.documentElement.classList.toggle(SCROLL_LOCK_CLASS, locked)
}

// showModal() closes instantly, so the exit animation is driven by .is-closing
// and the dialog is closed once it finishes. The timeout is a fallback for the
// case where no animation runs at all, such as prefers-reduced-motion.
function closeNavModal() {
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

export function initNavModal() {
	if (initialized) return false
	initialized = true

	const modal = dialog()
	if (!modal) return true

	modal.querySelector('.nav-modal__close')?.addEventListener('click', closeNavModal)

	// Clicking the area around the menu deliberately does not close it. A stray
	// tap on a phone should not dismiss the nav; the close button is the way out.

	// Esc fires cancel before close. Preventing the default lets the exit
	// animation run instead of the dialog vanishing.
	modal.addEventListener('cancel', event => {
		event.preventDefault()
		closeNavModal()
	})

	// Scrolling has to wait for close, because the dialog is a top-layer element
	// and the target sits behind it.
	modal.addEventListener('close', () => {
		setExpanded(false)
		setScrollLock(false)

		// Returning focus normally scrolls the hamburger into view. When an
		// in-page link is queued that would fight the smooth scroll below, so
		// suppress it in that case only: with nothing queued, scrolling focus
		// back into view is the accessible behavior and should stay.
		hamburger()?.focus({ preventScroll: Boolean(pendingScrollTarget) })

		if (!pendingScrollTarget) return
		const target = document.querySelector(pendingScrollTarget)
		if (target) target.scrollIntoView({ behavior: 'smooth' })
		pendingScrollTarget = null
	})

	modal.addEventListener('click', event => {
		const link = event.target.closest('a[href^="#"]')
		if (!link) return
		event.preventDefault()
		pendingScrollTarget = link.getAttribute('href')
		closeNavModal()
	})

	return true
}

export function showNavModal() {
	const modal = dialog()
	if (!modal || modal.open) return
	modal.classList.remove('is-closing')
	modal.showModal()
	setExpanded(true)
	setScrollLock(true)
}
