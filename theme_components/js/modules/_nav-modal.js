import MicroModal from 'micromodal'

const hamburger = document.querySelector('.nav-hamburger')

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
	},
})
