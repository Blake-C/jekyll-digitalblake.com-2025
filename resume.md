---
layout: content-page
title: Resume
permalink: /resume/
description: 'Resume of Blake Cerecero, Senior Web Developer in San Antonio, Texas: 15 years across WordPress, Drupal, Sitecore, Joomla, and Jekyll, with a focus on large CMS migrations.'
profile_schema: true
---

Senior Web Developer based in San Antonio, Texas, with 15 years building and migrating CMS-driven sites. I lead high-stakes migrations, build custom Gutenberg blocks and API integrations, and document the workflows that let teams work on their own after launch.

In 2026 I built [Core WP](https://github.com/Blake-C/core-wp) (a WordPress starter framework for Full Site Editing block themes), an exit-intent popup plugin for capturing leads that would leave a request-a-demo form, and a companion VS Code extension that patches five features in Claude Code's extension that didn't match how I work. On the [articles](/articles/) page you can find my thoughts on LLM writing, challenges building with Sanity and Next.js, and what to look out for when building sites that need to be WCAG conformant.

I've used Claude Code across several integrations and projects, including the Teleport Atlas coding challenge, and I continue to research this tool chain. My former colleagues have written [recommendations](/recommendations/) about working with me.

<p class="resume-actions">
	<a class="button button--primary" href="{{ site.resume_url }}" target="_blank" rel="noopener">Download PDF resume</a>
</p>

## Technical skills

<div class="skills-list">
	<div class="skills-list__group">
		<p class="skills-list__label">Content Management Systems</p>
		<p class="skills-list__items">WordPress, Sanity, Sitecore, Joomla, Drupal, Sitefinity</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Programming Technologies</p>
		<p class="skills-list__items">PHP, JavaScript, React, Next.js, TypeScript, Tailwind, SCSS, CSS, HTML</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Development Software</p>
		<p class="skills-list__items">Docker, Git, webpack, pnpm, Composer, WP-CLI, ACF, Gutenberg</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Accessibility and QA</p>
		<p class="skills-list__items">WCAG 2.1 AA, axe, Lighthouse, HTMLProofer, Snyk, Playwright</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Design Software</p>
		<p class="skills-list__items">Figma, Adobe CC (Photoshop, Illustrator)</p>
	</div>
</div>

## Projects

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates"><a href="/case-studies/seismic/">Seismic case study</a></span></p>
		<ul class="career-timeline__bullets">
			<li><strong>Two 1,000-page rebuilds</strong> of seismic.com, a WordPress to WordPress rebuild in 2022 that occurred in 4 phases and a rebuild in Sitecore in 2025, keeping the site live through each cutover.</li>
			<li><strong>50% increase</strong> in site visitors after the 2022 relaunch.</li>
			<li><strong>33% faster page loads</strong> on the 2022 rebuild, from about 3 seconds to 2, then about 1 to 2 seconds after the move to Sitecore.</li>
			<li>Migrated seismic.com from TranslatePress to WPML for multilingual support and trained 3 agency content producers and the French and German page content editors on the new workflow.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Teleport Atlas (coding challenge) <span class="career-timeline__dates"><a href="https://teleport-atlas.vercel.app/" target="_blank" rel="noopener">teleport-atlas.vercel.app</a></span></p>
		<ul class="career-timeline__bullets">
			<li><strong>In about 12 hours</strong>, built Teleport's Atlas product landing page from a Figma spec in Next.js (App Router), going from nothing to a working page with Canvas product animations.</li>
			<li><strong>100 Lighthouse score</strong> in all four categories on mobile, with zero axe WCAG 2.1 AA issues.</li>
			<li><strong>62% page weight reduction</strong> from 2.5MB to roughly 950KB, including roughly an 89% drop in the font payload from subsetting with fonttools and Brotli.</li>
			<li>Secured the build and supply chain with SHA-pinned GitHub Actions, a pnpm 7-day release-age gate and allowlist against a frozen lockfile, and escaped JSON-LD data.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Republic Ranches (Gray Digital Group client) <span class="career-timeline__dates"><a href="/case-studies/republic-ranches/">Republic Ranches case study</a></span></p>
		<ul class="career-timeline__bullets">
			<li><strong>60% reduction</strong> in image library size, from 20GB to 8GB, by automating WebP conversion and compression on all uploads.</li>
			<li><strong>10% more property tour bookings</strong> after cutting page loads from roughly 3 to 5 seconds down to 1 to 2 seconds.</li>
			<li>Integrated the Google Maps JavaScript API to build an interactive property map for filtering and searching.</li>
			<li>Added real estate schema markup on property detail pages for greater search engine relevance.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Exit Intent Popup Plugin <span class="career-timeline__dates"><a href="https://github.com/Blake-C/wp-exit-intent-popups" target="_blank" rel="noopener">github.com/Blake-C/wp-exit-intent-popups</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Built a WordPress plugin for exit-intent and timed popups with A/B testing, GA4 impression tracking, and a per-popup conversion dashboard with CSV export.</li>
			<li>Implemented exit-intent detection for both desktop (cursor exit via mouseleave) and mobile (scroll-reversal trigger), with 6 configurable position modes including cursor-relative modal placement.</li>
			<li>Built the front end in vanilla JavaScript with WCAG 2.1 AA conformance, including ARIA dialog attributes, a keyboard focus trap, ESC key support, and a reduced-motion animation fallback.</li>
		</ul>
	</div>
</div>

## Professional experience

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Independent Work <span class="career-timeline__dates">January 2026 to Present</span></p>
		<p class="career-timeline__role">Senior Web Developer</p>
		<ul class="career-timeline__bullets">
			<li><strong>Integrated Sanity.io as a headless CMS</strong> in the <a href="https://teleport-atlas.vercel.app/" target="_blank" rel="noopener">Teleport Atlas</a> project, with visual editing and a publish webhook, allowing live editing of pages without the need for a new deployment.</li>
			<li><strong>Added Playwright and Node test runner</strong> <a href="{% post_url 2026-09-08-the-impacts-of-regression-testing %}">regression tests</a> to digitalblake.com, finding 14 case studies missing their CreativeWork JSON-LD, a layout shift from styles missing in the critical CSS, an SVG that dropped the mobile Lighthouse performance score to 57, and two accessibility violations that Lighthouse caught and axe skipped.</li>
			<li><strong>87% faster terminal startup</strong>, from about 1 second to 0.13 seconds, by using Claude Code to find what slowed it down and change tab completion and three plugins to load only when needed.</li>
			<li>Researched and published on <a href="{% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}">WCAG 2.1 AA conformance testing</a> and on <a href="{% post_url 2026-07-24-web-accessibility-standards-and-law-wcag-eaa-us %}">which WCAG version the European Accessibility Act, ADA Title II and III, and Section 508 require</a>.</li>
			<li>Built the <a href="https://github.com/Blake-C/core-wp" target="_blank" rel="noopener">Core WP</a> WordPress starter framework for Full Site Editing block themes. It runs on Docker, so every developer gets the same PHP, NGINX, and MariaDB setup, fixing instances of "well it works on my machine" situations.</li>
			<li>Built the <a href="https://github.com/Blake-C/wp-personalization" target="_blank" rel="noopener">WP Personalization</a> plugin, a personalization layer for WordPress block themes. It works out a visitor's market segment and renders the matching layout, so a SaaS company can show one message to finance and another to healthcare.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates">February 2022 to July 2025</span></p>
		<p class="career-timeline__role">Web Developer, promoted to Senior Web Developer in 2023</p>
		<ul class="career-timeline__bullets">
			<li><strong>Served as internal development lead</strong> for the WordPress to Sitecore migration, working with an external agency's developers and designers, and audited 200+ components to decide what to rebuild in Sitecore, migrate as static content, or leave in WordPress behind a reverse proxy set up with IT.</li>
			<li><strong>Built 5 blog components in Sitecore</strong> while ramping up on Sitecore, TypeScript, GraphQL, and Tailwind under a live deadline, stepping in to code after the agency partner could not deliver all components.</li>
			<li><strong>Trained a team of 6 and led handoff to 3 agency partners</strong> on 200+ Advanced Custom Fields components, development standards, analytics, and production workflows.</li>
			<li>Partnered with the security team to identify vulnerabilities, implemented monitoring to detect and block malicious traffic, and introduced automated alerting.</li>
			<li>Led after-hours code deployments and QA for seismic.com with zero downtime from a deployment.</li>
			<li>Served as QA triage lead across a cross-functional team of 20+ during a high-pressure 2022 rebuild.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Gray Digital Group (GDG) <span class="career-timeline__dates">January 2014 to February 2022</span></p>
		<p class="career-timeline__role">Web Developer</p>
		<ul class="career-timeline__bullets">
			<li><strong>Launched 30+ client sites</strong> across WordPress, Joomla, Drupal, Sitefinity, and other CMSs, handling each from estimates and wireframes through development and testing.</li>
			<li><strong>Led client trainings for groups of 1 to 30</strong> on WordPress, Joomla, Drupal, and Sitefinity admin, allowing each team to work independently of the agency, saving them time and money.</li>
			<li><strong>Reduced project initialization by a day</strong> and consistently sped up onboarding new developers by building the WP Foundation 6 starter framework to help standardize our WordPress tooling.</li>
			<li>1 to 2 second page load speed improvement and fewer logged PHP warnings after introducing our team to tools such as SCSS, webpack, ESLint, and PHPCS to improve coding quality and performance.</li>
			<li>Stabilized projects brought in from other agencies, then built on them to deliver enterprise-level security and performance. This included small businesses, hospitals, and law enforcement organizations.</li>
			<li>Trained and mentored colleagues on new development technologies and assisted with problem solving on their own projects, building an environment of collaboration and knowledge sharing.</li>
		</ul>
	</div>
</div>
