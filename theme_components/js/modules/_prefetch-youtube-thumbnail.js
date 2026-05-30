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

export default function initPrefetchYoutubeThumbnail() {
	document.querySelectorAll('.post-link[data-youtube-thumbnail]').forEach(link => {
		const handler = () => prefetch(link.dataset.youtubeThumbnail)
		link.addEventListener('mouseenter', handler, { once: true })
		link.addEventListener('focusin', handler, { once: true })
	})
}
