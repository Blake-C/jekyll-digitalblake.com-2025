function loadFacade(facade) {
	const id = facade.dataset.videoId
	const title = facade.getAttribute('aria-label') || 'YouTube video'
	const iframe = document.createElement('iframe')
	iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`
	iframe.title = title
	iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
	iframe.allowFullscreen = true
	iframe.height = '100%'
	iframe.width = '100%'
	facade.replaceWith(iframe)
}

export default function initYoutubeFacade() {
	document.querySelectorAll('.youtube-facade[data-video-id]').forEach(facade => {
		facade.addEventListener('click', () => loadFacade(facade))
		facade.addEventListener('keydown', e => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				loadFacade(facade)
			}
		})
	})
}
