import { prefetch } from './_prefetch'

export default function initPrefetchCaseStudy() {
	document.querySelectorAll('.case-studies__card[data-prefetch]').forEach(card => {
		const handler = () => prefetch(card.dataset.prefetch)
		card.addEventListener('mouseenter', handler, { once: true })
		card.addEventListener('focusin', handler, { once: true })
	})
}
