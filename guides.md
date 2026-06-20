---
layout: content-page
title: Guides
permalink: /guides/
description: 'In-depth guides where I collect everything I have built and learned on a topic, with links to every article in the cluster.'
---

<p>These are my topic guides: hubs that pull together everything I have built and written on a single subject, with links into each article. Start here if you want the full picture on a topic rather than a single post.</p>

<ul class="pillar-cards">
	{%- for entry in site.data.pillars -%}
		{%- assign id = entry[0] -%}
		{%- assign guide = entry[1] -%}
		{%- assign count = site.posts | where: 'pillar', id | size -%}
		<li class="pillar-card">
			<p class="pillar-card__date">{{ count }} article{% unless count == 1 %}s{% endunless %}</p>
			<h2 class="pillar-card__title">
				<a class="pillar-card__link" href="{{ guide.url | relative_url }}">{{ guide.title | escape }}</a>
			</h2>
			{%- if guide.description -%}
				<p class="pillar-card__desc">{{ guide.description | escape }}</p>
			{%- endif -%}
		</li>
	{%- endfor -%}
</ul>
