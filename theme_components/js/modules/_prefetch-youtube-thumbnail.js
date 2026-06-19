import { prefetch } from './_prefetch'

export default function initPrefetchYoutubeThumbnail() {
	document.querySelectorAll('[data-youtube-thumbnail]').forEach(link => {
		const handler = () => prefetch(link.dataset.youtubeThumbnail)
		link.addEventListener('mouseenter', handler, { once: true })
		link.addEventListener('focusin', handler, { once: true })
	})
}
