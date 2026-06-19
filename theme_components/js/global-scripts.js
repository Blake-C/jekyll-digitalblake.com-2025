import './modules/_skip-link-focus-fix.js'
import './modules/_animate-header'
import './modules/_animate-timeline'
import './modules/_smooth-scroll'
import './modules/_table-wrapper'
import { initNavModal, showNavModal } from './modules/_nav-modal'
import initPrefetchCaseStudy from './modules/_prefetch-case-study'
import initYoutubeFacade from './modules/_youtube-facade'
import initPrefetchYoutubeThumbnail from './modules/_prefetch-youtube-thumbnail'

const hamburger = document.querySelector('.nav-hamburger')
if (hamburger) {
	hamburger.addEventListener('mouseenter', initNavModal, { once: true })
	hamburger.addEventListener('focusin', initNavModal, { once: true })
	hamburger.addEventListener('click', () => {
		if (initNavModal()) showNavModal()
	})
}

initPrefetchCaseStudy()
initYoutubeFacade()
initPrefetchYoutubeThumbnail()
