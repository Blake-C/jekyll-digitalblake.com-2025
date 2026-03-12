/**
 * Smooth Scroll
 *
 * @link https://www.sitepoint.com/smooth-scrolling-vanilla-javascript/
 */
import jump from 'jump.js'

let duration = 400

let pageUrl = location.hash ? stripHash(location.href) : location.href
delegatedLinkHijacking()

function delegatedLinkHijacking() {
	document.body.addEventListener('click', onClick, false)

	function onClick(event) {
		if (!isInPageLink(event.target)) return

		event.stopPropagation()
		event.preventDefault()

		jump(event.target.hash, {
			duration: duration,
			callback: function () {
				setFocus(event.target.hash)
			},
		})
	}
}

function isInPageLink(n) {
	return n.tagName.toLowerCase() === 'a' && n.hash.length > 0 && stripHash(n.href) === pageUrl
}

function stripHash(url) {
	return url.slice(0, url.lastIndexOf('#'))
}

// Adapted from:
// https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
function setFocus(hash) {
	var element = document.getElementById(hash.substring(1))

	if (element) {
		if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
			element.tabIndex = -1
		}

		element.focus()
	}
}
