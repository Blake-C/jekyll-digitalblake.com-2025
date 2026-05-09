import './modules/_skip-link-focus-fix.js'
import './modules/_animate-header'
import './modules/_animate-timeline'
import './modules/_smooth-scroll'
import './modules/_table-wrapper'

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
