---
layout: content-page
title: Colleague Recommendations
permalink: /recommendations/
description: 'LinkedIn recommendations for Blake Cerecero from colleagues and managers at Seismic, Gray Digital Group, and Northwest Vista College, reproduced in full.'
---

<p>These are recommendations written for me on LinkedIn, reproduced in full. I want to thank my former colleagues for these recommendations and the kind words. I've listed each person's position and company from when I worked with them. This list is in reverse chronological order.</p>

<div class="recommendation-list">
	{%- for recommendation in site.data.recommendations -%}
		<figure class="recommendation-list__item">
			<blockquote class="recommendation-list__quote">
				<p>{{ recommendation.quote }}</p>
			</blockquote>
			<figcaption class="recommendation-list__attribution">
				{%- include recommendation-avatar.html recommendation=recommendation -%}
				<div class="recommendations__meta">
					<cite class="recommendations__name"
						><a href="{{ recommendation.linkedin }}" target="_blank" rel="noopener">{{ recommendation.name }}</a></cite
					>
					<span class="recommendations__role">{{ recommendation.role }} &middot; {{ recommendation.company }}</span>
					<span class="recommendations__role"
						><time datetime="{{ recommendation.date | date: '%Y-%m-%d' }}"
							>{{ recommendation.date | date: '%B %-d, %Y' }}</time
						></span
					>
				</div>
			</figcaption>
		</figure>
	{%- endfor -%}
</div>
