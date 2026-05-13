import MicroModal from 'micromodal'

const hamburger = document.querySelector('.nav-hamburger')
let pendingScrollTarget = null

MicroModal.init({
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
