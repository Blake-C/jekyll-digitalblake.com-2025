/**
 * Smooth scroll to in-page anchors and move focus for keyboard users.
 */

document.body.addEventListener('click', event => {
	const link = event.target.closest('a[href]')

	if (!link || !isInPageLink(link)) {
		return
	}

	const target = document.getElementById(decodeURIComponent(link.hash.substring(1)))

	if (!target) {
		return
	}

	event.preventDefault()
	target.scrollIntoView({ behavior: 'smooth', block: 'start' })
	setFocus(target)
})

function isInPageLink(node) {
	if (!node.hash || node.hash.length < 2) {
		return false
	}

	return node.origin === location.origin && node.pathname === location.pathname
}

function setFocus(element) {
	if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
		element.tabIndex = -1
	}

	element.focus({ preventScroll: true })
}
