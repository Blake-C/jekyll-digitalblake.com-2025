const timelines = document.querySelectorAll('.career-timeline')

if (timelines.length && 'IntersectionObserver' in window) {
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

	timelines.forEach(timeline => {
		timeline.classList.add('js-timeline-animate')

		// Stagger resets per timeline so each section reveals on its own cadence.
		timeline.querySelectorAll('.career-timeline__item').forEach((item, i) => {
			item.style.setProperty('--reveal-delay', `${i * 0.08}s`)
			observer.observe(item)
		})
	})
}
