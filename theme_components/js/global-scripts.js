import './modules/_skip-link-focus-fix.js'
import './modules/_animate-header'
import './modules/_animate-timeline'
import './modules/_smooth-scroll'
import './modules/_table-wrapper'
import { initNavModal, showNavModal } from './modules/_nav-modal'
import initPrefetchCaseStudy from './modules/_prefetch-case-study'

const hamburger = document.querySelector('.nav-hamburger')
if (hamburger) {
	hamburger.addEventListener('mouseenter', initNavModal, { once: true })
	hamburger.addEventListener('focusin', initNavModal, { once: true })
	hamburger.addEventListener('click', () => {
		if (initNavModal()) showNavModal()
	})
}

initPrefetchCaseStudy()

/*************** Template part region toggle button ***************/
const regions = document.querySelectorAll('.regions')

Array.from(regions).map(regions => {
	regions.addEventListener('click', function (event) {
		event.preventDefault()

		const placeholder = document.querySelectorAll('.placeHolderPosition')

		Array.from(placeholder).map(placeholder => {
			if (placeholder.style.display === 'none') {
				placeholder.style.display = 'block'
			} else {
				placeholder.style.display = 'none'
			}
		})
	})
})
