import './modules/_skip-link-focus-fix.js'
import './modules/_animate-header'
import './modules/_smooth-scroll'
import MicroModal from 'micromodal'

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

/*************** Gallery modal lazy-render ***************/
document.querySelectorAll('.js_sites-gallery__button').forEach(button => {
	button.addEventListener('click', () => {
		const modalId = button.getAttribute('data-micromodal-trigger')

		if (!modalId) {
			return
		}

		if (!document.getElementById(modalId)) {
			const template = document.getElementById(`${modalId}-template`)

			if (!template) {
				return
			}

			document.body.appendChild(template.content.cloneNode(true))
		}

		MicroModal.show(modalId, {
			disableScroll: true,
			onShow: modal => {
				modal.querySelectorAll('img[data-src]').forEach(image => {
					image.setAttribute('src', image.dataset.src)
					image.removeAttribute('data-src')
				})
			},
		})
	})
})
