const prefetched = new Set()

function prefetch(url) {
	if (prefetched.has(url)) return
	prefetched.add(url)
	const link = document.createElement('link')
	link.rel = 'prefetch'
	link.as = 'image'
	link.href = url
	document.head.appendChild(link)
}

export default function initPrefetchCaseStudy() {
	document.querySelectorAll('.case-studies__card[data-prefetch]').forEach(card => {
		const handler = () => prefetch(card.dataset.prefetch)
		card.addEventListener('mouseenter', handler, { once: true })
		card.addEventListener('focusin', handler, { once: true })
	})
}
