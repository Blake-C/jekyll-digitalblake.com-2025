import './modules/_skip-link-focus-fix.js'
import './modules/_animate-header'
import './modules/_animate-timeline'
import './modules/_smooth-scroll'
import './modules/_table-wrapper'
import { initNavModal, showNavModal } from './modules/_nav-modal'
import initPrefetchCaseStudy from './modules/_prefetch-case-study'
import initYoutubeFacade from './modules/_youtube-facade'
import initPrefetchYoutubeThumbnail from './modules/_prefetch-youtube-thumbnail'
import initReadingProgress from './modules/_reading-progress'
import initRecommendationModal from './modules/_recommendation-modal'

const hamburger = document.querySelector('.nav-hamburger')
if (hamburger) {
	// mouseenter and focusin only warm the listeners up. The click handler has to
	// call both, because focusin fires before click on a button press, so by the
	// time click arrives initNavModal has already run and reports nothing to do.
	hamburger.addEventListener('mouseenter', initNavModal, { once: true })
	hamburger.addEventListener('focusin', initNavModal, { once: true })
	hamburger.addEventListener('click', () => {
		initNavModal()
		showNavModal()
	})
}

initPrefetchCaseStudy()
initYoutubeFacade()
initPrefetchYoutubeThumbnail()
initReadingProgress()
initRecommendationModal()
