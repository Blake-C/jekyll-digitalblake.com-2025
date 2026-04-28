import './modules/_skip-link-focus-fix.js'
import './modules/_animate-header'
import './modules/_smooth-scroll'
import './modules/_table-wrapper'
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
				const overlay = modal.querySelector('.modal__overlay')
				if (overlay) overlay.scrollTop = 0
				modal.querySelectorAll('img[data-src]').forEach(image => {
					image.setAttribute('src', image.dataset.src)
					image.removeAttribute('data-src')
				})
				// Override Micromodal's auto-focus so the modal doesn't scroll
				// to the first button on open. Focus the container instead so
				// the tab trap still works when the user starts tabbing.
				requestAnimationFrame(() => {
					const container = modal.querySelector('.modal__container')
					if (container) {
						if (!container.hasAttribute('tabindex')) {
							container.setAttribute('tabindex', '-1')
						}
						container.focus({ preventScroll: true })
					}
				})
			},
		})
	})
})
