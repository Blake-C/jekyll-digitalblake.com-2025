---
layout: content-page
title: Recommendations
permalink: /recommendations/
description: 'LinkedIn recommendations for Blake Cerecero from colleagues and managers at Seismic, Gray Digital Group, and Northwest Vista College, reproduced in full.'
---

<p>These are recommendations written for me on LinkedIn, reproduced in full. I want to thank my former colleagues for these recommendations and the kind words. I've listed each person's position and company from when I worked with them. This list is in reverse chronological order.</p>

<div class="testimonial-list">
	{%- for testimonial in site.data.testimonials -%}
		<figure class="testimonial-list__item">
			<blockquote class="testimonial-list__quote">
				<p>{{ testimonial.quote }}</p>
			</blockquote>
			<figcaption class="testimonial-list__attribution">
				{%- include testimonial-avatar.html testimonial=testimonial -%}
				<div class="testimonials__meta">
					<cite class="testimonials__name"
						><a href="{{ testimonial.linkedin }}" target="_blank" rel="noopener">{{ testimonial.name }}</a></cite
					>
					<span class="testimonials__role">{{ testimonial.role }} &middot; {{ testimonial.company }}</span>
					<span class="testimonials__role"
						><time datetime="{{ testimonial.date | date: '%Y-%m-%d' }}"
							>{{ testimonial.date | date: '%B %-d, %Y' }}</time
						></span
					>
				</div>
			</figcaption>
		</figure>
	{%- endfor -%}
</div>
