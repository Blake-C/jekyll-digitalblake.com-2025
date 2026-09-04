const SCROLL_LOCK_CLASS = 'has-modal-open'

// showModal() makes the page behind inert, but inert only blocks interaction.
// The page still scrolls under the dialog, which shows through its background.
export function setScrollLock(locked) {
	document.documentElement.classList.toggle(SCROLL_LOCK_CLASS, locked)
}
