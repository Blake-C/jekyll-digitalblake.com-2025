/**
 * Animated header
 *
 * @link http://callmenick.com/post/animated-resizing-header-on-scroll
 */

window.addEventListener('scroll', () => {
	let distanceY = window.pageYOffset || document.documentElement.scrollTop
	let shrinkOn = 50
	let header = document.getElementById('top_header')

	if (distanceY > shrinkOn) {
		header.classList.add('smaller')
	} else {
		if (header.classList.contains('smaller')) {
			header.classList.remove('smaller')
		}
	}
})
