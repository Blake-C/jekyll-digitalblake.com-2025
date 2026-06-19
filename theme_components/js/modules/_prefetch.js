const prefetched = new Set()

// Append a <link rel="prefetch" as="image"> for url, at most once per url.
export function prefetch(url) {
	if (!url || prefetched.has(url)) return
	prefetched.add(url)
	const link = document.createElement('link')
	link.rel = 'prefetch'
	link.as = 'image'
	link.href = url
	document.head.appendChild(link)
}
