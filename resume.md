---
layout: content-page
title: Resume
permalink: /resume/
description: 'Resume of Blake Cerecero, Senior Web Developer in San Antonio, Texas: 15 years across WordPress, Drupal, Sitecore, Joomla, and Jekyll, with a focus on large CMS migrations.'
profile_schema: true
---

Senior Web Developer based in San Antonio, Texas, with 15 years building and migrating CMS-driven sites. I lead high-stakes migrations, build custom Gutenberg blocks and API integrations, and document the workflows that let teams work on their own after launch. I regularly experiment with new tools and technologies to create solutions for both clients and myself.

I've redeveloped my [starter framework](/coding-projects/) for building WordPress websites, built an exit-intent popup plugin for capturing leads that would leave a request-a-demo form, and built a Claude Code overwrite extension to optimize features to work the way I need. You can find my thoughts on LLM writing, challenges building with Sanity and Next.js, and what to look out for when building sites that need to be WCAG conformant on the [articles](/articles/) page.

My former colleagues have written [recommendations](/recommendations/) about working with me. I've used Claude Code across several integrations and projects, including the Teleport Atlas coding challenge, and I continue to research this tool chain in preparation for my next role.

Please feel free to download the PDF version of my resume below or read it here on the page.

<p class="resume-actions">
	<a class="button button--primary" href="{{ site.resume_url }}" target="_blank" rel="noopener">Download PDF resume</a>
</p>

## Technical skills

<div class="skills-list">
	<div class="skills-list__group">
		<p class="skills-list__label">Content Management</p>
		<p class="skills-list__items">WordPress, Sanity, Sitecore, Joomla, Drupal, Sitefinity</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Languages</p>
		<p class="skills-list__items">PHP, JavaScript, SCSS, CSS, HTML, JSON</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Static Sites</p>
		<p class="skills-list__items">Jekyll, Liquid, GitHub Pages, static site generators</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Accessibility</p>
		<p class="skills-list__items">WCAG 2.1 AA, axe, Lighthouse, HTML validation</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Design</p>
		<p class="skills-list__items">Figma, Adobe CC (Photoshop, Illustrator)</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Tooling</p>
		<p class="skills-list__items">Docker, Git, webpack, npm, pnpm, Composer, WP-CLI, PHPCS</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Build and CI</p>
		<p class="skills-list__items">GitHub Actions, HTMLProofer, Snyk, gitleaks, Dependabot</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">AI-Assisted Development</p>
		<p class="skills-list__items">Claude Code, AI-assisted build and review workflows</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Currently Building With</p>
		<p class="skills-list__items">React, Next.js, TypeScript, Sanity</p>
	</div>
</div>

## Projects

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Teleport Atlas (coding challenge) <span class="career-timeline__dates"><a href="https://teleport-atlas.vercel.app/" target="_blank" rel="noopener">teleport-atlas.vercel.app</a></span></p>
		<ul class="career-timeline__bullets">
			<li><strong>In about 12 hours</strong>, built Teleport's Atlas product landing page from a Figma spec in Next.js (App Router), going from nothing to a working page with Canvas product animations.</li>
			<li><strong>100 Lighthouse score</strong> in all four categories on mobile, with zero axe WCAG 2.1 AA issues.</li>
			<li><strong>62% page weight reduction</strong> from 2.5MB to roughly 950KB, including an 89% drop in the font payload from subsetting with fonttools and Brotli.</li>
			<li>Secured the build and supply chain with SHA-pinned GitHub Actions, a pnpm 7-day release-age gate and allowlist against a frozen lockfile, and escaped JSON-LD.</li>
			<li>Integrated Sanity as a headless CMS, with visual editing and a publish webhook. Source is public on <a href="https://github.com/Blake-C/teleport-web-eng-coding-challenge" target="_blank" rel="noopener">GitHub</a>.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates"><a href="/case-studies/seismic/">Seismic case study</a></span></p>
		<ul class="career-timeline__bullets">
			<li><strong>Two 1,000-page rebuilds</strong> of seismic.com, a phased WordPress to WordPress rebuild in 2022 that launched with about 40 pages and a rebuild in Sitecore in 2025, keeping the site live through each cutover.</li>
			<li><strong>50% increase</strong> in site visitors after the 2022 relaunch.</li>
			<li><strong>33% improvement</strong> in page load times, from roughly 3 seconds to 2 seconds across both rebuilds.</li>
			<li>Served as QA triage lead across a cross-functional team of 20+ during a high-pressure rebrand sprint.</li>
			<li>Migrated seismic.com from TranslatePress to WPML for multilingual support and trained 3 agency content producers and the French and German page content editors on the new workflow.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Republic Ranches <span class="career-timeline__dates"><a href="/case-studies/republic-ranches/">Republic Ranches case study</a></span></p>
		<ul class="career-timeline__bullets">
			<li><strong>60% reduction</strong> in image library size, from 20GB to 8GB, by automating WebP conversion and compression on every upload.</li>
			<li><strong>10% more property tour bookings</strong> after cutting page loads from roughly 3 to 5 seconds down to 1 to 2 seconds.</li>
			<li>Integrated the Google Maps JavaScript API to build an interactive property map for filtering and searching.</li>
			<li>Added real estate schema markup to property detail pages for greater search engine relevance.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Core WP <span class="career-timeline__dates"><a href="https://github.com/Blake-C/core-wp" target="_blank" rel="noopener">github.com/Blake-C/core-wp</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Built a WordPress starter framework for Full Site Editing block themes with a Docker-first local workflow and modern build tooling.</li>
			<li>Standardizes local PHP, NGINX, and MariaDB services via Docker so development matches production from day one.</li>
			<li>Integrates ESLint, Prettier, and PHPCS to enforce code quality across projects.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Exit Intent Popup Plugin <span class="career-timeline__dates"><a href="https://github.com/Blake-C/wp-exit-intent-popups" target="_blank" rel="noopener">github.com/Blake-C/wp-exit-intent-popups</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Built a WordPress plugin for exit-intent and timed popups with A/B testing, GA4 impression tracking, and a per-popup conversion dashboard with CSV export.</li>
			<li>Implemented exit-intent detection for desktop (cursor exit via mouseleave) and mobile (scroll-reversal trigger), with 6 configurable position modes including cursor-relative modal placement.</li>
			<li>Built the front end in vanilla JavaScript to WCAG 2.1 AA, with ARIA dialog attributes, a keyboard focus trap, ESC key support, and a reduced-motion animation fallback.</li>
		</ul>
	</div>
</div>

## Professional experience

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">DigitalBlake.com (Self-Employed) <span class="career-timeline__dates">January 2026 to Present</span></p>
		<p class="career-timeline__role">Senior Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Researched and published on <a href="{% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}">WCAG 2.1 AA conformance testing</a> and on <a href="{% post_url 2026-07-24-web-accessibility-standards-and-law-wcag-eaa-us %}">which WCAG version the European Accessibility Act, ADA Title II and III, and Section 508 each require</a>.</li>
			<li>Built and maintain digitalblake.com on Jekyll with a Docker-isolated toolchain, esbuild, inlined critical CSS, and subset WOFF2 fonts, deployed by GitHub Actions running HTMLProofer and Snyk.</li>
			<li>Added Playwright and Node test runner <a href="{% post_url 2026-09-08-the-impacts-of-regression-testing %}">regression tests</a> to digitalblake.com, finding 14 case studies missing their CreativeWork JSON-LD, a layout shift from styles missing in the critical CSS, an SVG that dropped the mobile Lighthouse performance score to 57, and two accessibility violations that Lighthouse caught and axe skipped.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates">February 2022 to July 2025</span></p>
		<p class="career-timeline__role">Web Developer, promoted to Senior Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Served as internal development lead for the WordPress to Sitecore migration, working with an external agency's developers and designers, and audited <strong>200+ components</strong> to decide what to rebuild in Sitecore, migrate as static content, or leave in WordPress behind a reverse proxy set up with IT.</li>
			<li>Stepped in to code when the agency could not deliver all the work, ramped up on Sitecore, TypeScript, GraphQL, and Tailwind under a live deadline, and built several blog components in Sitecore, reworking the agency's version over a weekend and again the next day so it would stay flexible long term.</li>
			<li>Explained to our agency partner that our design team needed to review Sitecore components in context on the page, because components delivered one by one led to changes after they were already built.</li>
			<li>Documented 200+ Advanced Custom Fields components, development standards, analytics, and production workflows for clean handoffs to <strong>3 agency partners</strong>, and trained the incoming team of <strong>6</strong>.</li>
			<li>Partnered with the security team to identify vulnerabilities, implemented monitoring to detect and block malicious traffic, and introduced automated alerting.</li>
			<li>Led after-hours code deployments and QA for seismic.com with <strong>zero downtime</strong> from a deployment.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Gray Digital Group <span class="career-timeline__dates">January 2014 to February 2022</span></p>
		<p class="career-timeline__role">Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Launched <strong>30+ client sites</strong> across WordPress, Joomla, Drupal, Sitefinity, and other CMSs, handling each from estimates and wireframes through development and testing.</li>
			<li>Stabilized projects brought in from other agencies, then built on them to deliver enterprise-level security and performance.</li>
			<li>Consulted with account executives, senior developers, and partners to solve problems no one else wanted to touch.</li>
			<li>Led client trainings for groups of 1 to 30 on the WordPress, Joomla, Drupal, and Sitefinity admin.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">DigitalBlake.com (Freelance) <span class="career-timeline__dates">January 2013 to February 2022</span></p>
		<p class="career-timeline__role">Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Built a WP Foundation 6 coding library to keep code consistent across teams.</li>
			<li>Developed a mobile mega-menu plugin that generates a horizontally scrollable navigation.</li>
			<li>Created a JavaScript npm module using the YouTube API for custom embedded playlists.</li>
			<li>Programmed Joomla 3.x social-sharing modules without relying on JavaScript.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">PPDG, Inc. <span class="career-timeline__dates">February 2012 to January 2013</span></p>
		<p class="career-timeline__role">Web Developer and Designer (Webmaster)</p>
		<ul class="career-timeline__bullets">
			<li>Designed and built an employee portal on Joomla 2.5 for <strong>600+ field employees</strong>.</li>
			<li>Trained a corporate office of <strong>30+ employees</strong> on the operation and business rules of the portal.</li>
			<li>Coordinated the migration of all sites to a new server running the latest PHP, MySQL, and Apache.</li>
			<li>Designed and built the Plaza Lecea Event Center website on Joomla 2.5.</li>
		</ul>
	</div>
</div>
