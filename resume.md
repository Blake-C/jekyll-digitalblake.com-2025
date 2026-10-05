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
		<p class="skills-list__label">Content Management</p>
		<p class="skills-list__items">WordPress, Joomla, Drupal, Sitefinity, Sanity</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Coding &amp; Styling</p>
		<p class="skills-list__items">PHP, JavaScript, Next.js, CSS, SCSS, Tailwind, HTML</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Software &amp; Plugins</p>
		<p class="skills-list__items">Docker, Git, webpack, WP-CLI, Advanced Custom Fields, Gutenberg Editor</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Quality Assurance</p>
		<p class="skills-list__items">WCAG 2.1 AA, axe, Lighthouse, Snyk, Playwright</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Design Software</p>
		<p class="skills-list__items">Figma, Adobe CC (Photoshop, Illustrator)</p>
	</div>
</div>

## Professional experience

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Independent Work <span class="career-timeline__dates">January 2026 to Present</span></p>
		<p class="career-timeline__role">Senior Web Developer</p>
		<p class="career-timeline__description">Career break from July 2025 to January 2026. Independent projects since then:</p>
		<ul class="career-timeline__bullets">
			<li>Integrated Sanity.io as a headless CMS into the <a href="https://teleport-atlas.vercel.app/" target="_blank" rel="noopener">Teleport Atlas</a> build after the challenge, with visual editing and a publish webhook, so page edits go live without a redeploy (see Projects).</li>
			<li>Added Playwright and Node test runner <a href="{% post_url 2026-09-08-the-impacts-of-regression-testing %}">regression tests</a> to digitalblake.com, finding 14 case studies missing their schema, a layout shift from styles missing in the critical CSS, an SVG that dropped the mobile Lighthouse performance score to 57, and two accessibility violations.</li>
			<li>Built the <a href="https://github.com/Blake-C/core-wp" target="_blank" rel="noopener">Core WP</a> WordPress starter framework for Full Site Editing block themes. It runs on Docker, so every developer gets the same server setup.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates">February 2022 to July 2025</span></p>
		<p class="career-timeline__role">Web Developer, promoted to Senior Web Developer in 2023</p>
		<ul class="career-timeline__bullets">
			<li>Led internal development for the 2025 WordPress to Sitecore migration (see Projects).</li>
			<li>Built an ROI calculator with an external agency over 2 sprints that turned Marketo form data into a PDF deck through an internal document generation tool, with no PII stored on seismic.com.</li>
			<li>Enhanced site security by enforcing two-factor authentication, restricting login to corporate VPN, and logging all site activity to prevent a vendor security failure from impacting seismic.com.</li>
			<li>Standardized the Marketo multi-step form, reducing the time it takes to build landing pages by about 4 hours per page. Wrote an operating guide for the production team on how to customize the forms.</li>
			<li>Led after-hours code deployments and QA for seismic.com over 4+ releases per month for 3.5 years with zero downtime from a deployment.</li>
			<li>Migrated seismic.com from TranslatePress to WPML for multilingual support and trained 3 agency content producers and the French and German page content editors on the new workflow.</li>
			<li>Served as QA triage lead across a cross-functional team of 20+, closing out 15 to 25 tickets every day.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Gray Digital Group (GDG) <span class="career-timeline__dates">January 2014 to February 2022</span></p>
		<p class="career-timeline__role">Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Launched 30+ client sites across WordPress, Joomla, Drupal, Sitefinity, and other CMSs, handling each from estimates and wireframes through development and testing.</li>
			<li>Led client trainings for groups of 1 to 30 on WordPress, Joomla, Drupal, and Sitefinity admin for small businesses, hospitals, and law enforcement organizations.</li>
			<li>Reduced project initialization by a day and sped up onboarding new developers by building the WP Foundation 6 starter framework to standardize WordPress tooling.</li>
			<li>1 to 2 second page load speed improvement and fewer logged PHP warnings after introducing tools such as SCSS, webpack, ESLint, and PHPCS to improve coding quality and performance.</li>
		</ul>
	</div>
</div>

## Projects

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates"><a href="/case-studies/seismic/">Seismic case study</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Served as internal development lead for the WordPress to Sitecore migration, and audited 200+ components to decide what to rebuild in Sitecore or leave in WordPress behind a reverse proxy.</li>
			<li>Stepped in to code when the agency could not deliver all the work, ramped up on Sitecore, TypeScript, GraphQL, and Tailwind under a live deadline, and built 5 blog components in Sitecore in 5 days.</li>
			<li>Trained a team of 6 from the Seismic India office and led handoff to 2 agency partners on development standards, analytics, and production workflows.</li>
			<li>Observed a 40% decrease in page load times on the headless Next.js and Sitecore stack, going down from 2 to 3 seconds on WordPress to 1 to 2 seconds on Sitecore.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Teleport Atlas (coding challenge) <span class="career-timeline__dates"><a href="https://teleport-atlas.vercel.app/" target="_blank" rel="noopener">teleport-atlas.vercel.app</a></span></p>
		<ul class="career-timeline__bullets">
			<li>In 12 hours, built Teleport's Atlas product landing page from a Figma spec in Next.js (App Router), going from nothing to a working page with Canvas product animations.</li>
			<li>100 Lighthouse score in all four categories on mobile, with zero axe WCAG 2.1 AA issues.</li>
			<li>62% page weight reduction from 2.5MB to 950KB, including roughly an 89% drop in the font payload from subsetting with fonttools and Brotli.</li>
			<li>Secured the build and supply chain with SHA-pinned GitHub Actions, a pnpm 7-day release-age gate and allowlist against a frozen lockfile, and escaped JSON-LD data.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Republic Ranches (Gray Digital Group client) <span class="career-timeline__dates"><a href="/case-studies/republic-ranches/">Republic Ranches case study</a></span></p>
		<ul class="career-timeline__bullets">
			<li>60% reduction in image library size from 20GB to 8GB by automating WebP conversion and compression on all uploads and moving the uploads directory to AWS to reduce load on the production server.</li>
			<li>10% more property tour bookings after cutting page loads from 3 to 5 seconds down to 1 to 2 seconds by optimizing styles and images and reducing the number of third-party plugins used on the site.</li>
			<li>Integrated the Google Maps JavaScript API to build an interactive property map for filtering and searching.</li>
			<li>Added real estate schema markup on property detail pages for greater search engine relevance.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Exit Intent Popup Plugin <span class="career-timeline__dates"><a href="https://github.com/Blake-C/wp-exit-intent-popups" target="_blank" rel="noopener">github.com/Blake-C/wp-exit-intent-popups</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Built a WordPress plugin for exit-intent and timed popups with A/B testing, GA4 impression tracking, and a per-popup conversion dashboard with CSV export.</li>
			<li>Implemented exit-intent detection for both desktop (cursor exit via mouseleave) and mobile (scroll-reversal trigger), with six configurable position modes including cursor-relative modal placement.</li>
			<li>Built the frontend in vanilla JavaScript with WCAG 2.1 AA conformance: ARIA dialog attributes, keyboard focus trap, ESC key support, and reduced-motion animation fallback.</li>
		</ul>
	</div>
</div>
