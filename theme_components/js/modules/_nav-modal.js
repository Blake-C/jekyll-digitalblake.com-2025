import MicroModal from 'micromodal'

let initialized = false
let pendingScrollTarget = null

const modalConfig = hamburger => ({
	openTrigger: 'data-micromodal-trigger',
	closeTrigger: 'data-micromodal-close',
	disableScroll: true,
	awaitOpenAnimation: true,
	awaitCloseAnimation: true,
	onShow() {
		if (hamburger) hamburger.setAttribute('aria-expanded', 'true')
	},
	onClose() {
		if (hamburger) hamburger.setAttribute('aria-expanded', 'false')
		if (pendingScrollTarget) {
			const target = document.querySelector(pendingScrollTarget)
			if (target) target.scrollIntoView({ behavior: 'smooth' })
			pendingScrollTarget = null
		}
	},
})

export function initNavModal() {
	if (initialized) return false
	initialized = true

	const hamburger = document.querySelector('.nav-hamburger')
	MicroModal.init(modalConfig(hamburger))

	const modal = document.getElementById('nav-modal')
	if (modal) {
		modal.addEventListener('click', e => {
			const link = e.target.closest('a[href^="#"]')
			if (!link) return
			e.preventDefault()
			pendingScrollTarget = link.getAttribute('href')
			MicroModal.close('nav-modal')
		})
	}

	return true
}

export function showNavModal() {
	const hamburger = document.querySelector('.nav-hamburger')
	MicroModal.show('nav-modal', modalConfig(hamburger))
}
