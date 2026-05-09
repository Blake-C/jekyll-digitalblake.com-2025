const timeline = document.querySelector('.career-timeline')

if (timeline && 'IntersectionObserver' in window) {
	timeline.classList.add('js-timeline-animate')

	const items = timeline.querySelectorAll('.career-timeline__item')

	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible')
					observer.unobserve(entry.target)
				}
			})
		},
		{ threshold: 0.15 },
	)

	items.forEach((item, i) => {
		item.style.setProperty('--reveal-delay', `${i * 0.08}s`)
		observer.observe(item)
	})
}
