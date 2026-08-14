/**
 * Moves focus to the fragment target on hashchange, which some browsers scroll
 * to without focusing, leaving a keyboard user's focus back at the skip link.
 *
 * From Automattic/_s: https://github.com/Automattic/_s/pull/136
 */

let is_webkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1
let is_opera = navigator.userAgent.toLowerCase().indexOf('opera') > -1
let is_ie = navigator.userAgent.toLowerCase().indexOf('msie') > -1

if ((is_webkit || is_opera || is_ie) && document.getElementById && window.addEventListener) {
	window.addEventListener(
		'hashchange',
		function () {
			var id = location.hash.substring(1),
				element

			if (!/^[A-z0-9_-]+$/.test(id)) {
				return
			}

			element = document.getElementById(id)

			if (element) {
				if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
					element.tabIndex = -1
				}

				element.focus()
			}
		},
		false,
	)
}
