---
layout: content-page
title: Resume
permalink: /resume/
description: 'Resume of Blake Cerecero, Senior Web Developer in San Antonio, Texas: 15 years across WordPress, Drupal, Sitecore, Joomla, and Jekyll, with a focus on large CMS migrations.'
profile_schema: true
---

Senior Web Developer based in San Antonio, Texas, with 15 years building and migrating CMS-driven sites. I lead high-stakes migrations, build custom Gutenberg blocks and API integrations, and document the workflows that let teams work on their own after launch. Regularly experimenting with new tools and technologies, to create solutions for both clients and myself.

After leaving Seismic as part of a reduction in force (RIF) and taking some time to myself, I've been working on coming up to speed on AI tooling using Claude Code for several integrations and projects, and then also utilizing those same skills on a coding challenge. I've continued to do my research in utilizing this new tool chain in preparation for my next role. Please feel free to download the PDF version of my resume below or read it here on the page.

<p class="resume-actions">
	<a class="button button--primary" href="{{ site.resume_url }}" target="_blank" rel="noopener">Download PDF resume</a>
</p>

## Technical skills

<div class="skills-list">
	<div class="skills-list__group">
		<p class="skills-list__label">Content Management</p>
		<p class="skills-list__items">WordPress, Joomla, Drupal, Sitefinity, Sitecore, Sanity</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Languages</p>
		<p class="skills-list__items">HTML5, CSS3, SCSS, JavaScript (ES6+), PHP 8, JSON</p>
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
		<p class="skills-list__items">Adobe CC (Photoshop, Illustrator), Figma, Sketch</p>
	</div>
	<div class="skills-list__group">
		<p class="skills-list__label">Tooling</p>
		<p class="skills-list__items">Git, NPM, pnpm, Composer, Webpack, WP-CLI, Docker, ZSH, PHPCS</p>
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
			<li>Built Teleport's Atlas product landing page from a Figma spec in Next.js (App Router), going from nothing to a working page with Canvas product animations in about twelve hours.</li>
			<li>Scored a perfect axe run with zero WCAG 2.1 AA issues and a 100 Lighthouse mobile result across performance, accessibility, best practices, and SEO.</li>
			<li>Cut page weight from about 2.5MB to roughly 950KB, including roughly an 89% drop in the font payload from subsetting with fonttools and Brotli.</li>
			<li>Hardened the build and supply chain with SHA-pinned GitHub Actions, a pnpm cooldown and allowlist against a frozen lockfile, and escaped JSON-LD.</li>
			<li>Moved the page onto Sanity as a headless CMS afterward, with visual editing and a publish webhook. Source is public on <a href="https://github.com/Blake-C/teleport-web-eng-coding-challenge" target="_blank" rel="noopener">GitHub</a>.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates"><a href="https://seismic.com" target="_blank" rel="noopener">seismic.com</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Two 1,000-page migrations: WordPress to WordPress in 2022 and WordPress to Sitecore in 2025, keeping the site live throughout each cutover.</li>
			<li>Served as QA triage lead across a cross-functional team of 20+ during a high-pressure rebrand sprint.</li>
			<li>Migrated from TranslatePress to WPML for multilingual support and trained content staff and EMEA regional teams on the new workflow. The 2022 relaunch drove a 50% increase in site visitors.</li>
			<li>Improved page load times from roughly 3s to 2s across both migration cycles.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Republic Ranches <span class="career-timeline__dates"><a href="https://republicranches.com" target="_blank" rel="noopener">republicranches.com</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Integrated the Google Maps JavaScript API to build an interactive property map for filtering and searching.</li>
			<li>Added real-estate schema markup to property detail pages for greater search relevance.</li>
			<li>Reduced the image library from 20GB to 8GB by automating WebP conversion and compression on every upload, improving load times from roughly 3 to 5s down to 1 to 2s.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">San Antonio Legal Services Association <span class="career-timeline__dates"><a href="https://sa-lsa.org" target="_blank" rel="noopener">sa-lsa.org</a></span></p>
		<ul class="career-timeline__bullets">
			<li>Developed custom PHP Gutenberg blocks so admins could add UI components without code.</li>
			<li>Integrated the Volunteer Hub API for clinic opportunities serving families in need of pro bono services.</li>
			<li>Configured the Legal Server API with WP All Import to schedule data into a custom post type, surfacing pro bono cases for lawyers with a filtering UI.</li>
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
			<li>Built a WordPress plugin for exit-intent and timed popups with A/B testing, impression tracking, and a per-popup conversion dashboard with CSV export.</li>
			<li>Implemented exit-intent detection for desktop (cursor exit) and mobile (scroll-reversal heuristic) with six configurable position modes.</li>
			<li>Added GA4 event tracking for impressions, CTA clicks, and dismissals.</li>
			<li>Built the front end in vanilla JavaScript to WCAG 2.1 AA, with ARIA dialog attributes, a keyboard focus trap, ESC support, and a reduced-motion fallback.</li>
		</ul>
	</div>
</div>

## Professional experience

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">DigitalBlake.com (Self-Employed) <span class="career-timeline__dates">July 2025 to Present</span></p>
		<p class="career-timeline__role">Senior Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Applied AI-assisted development workflows across a Next.js and Sanity project, native macOS tooling, and digitalblake.com.</li>
			<li>Built native macOS applications, directing AI tooling through the Swift implementation and publishing write-ups on the results, including a <a href="{% post_url 2026-04-28-swiftui-vs-appkit-macos-ui-performance %}">SwiftUI and AppKit UI performance comparison</a>.</li>
			<li>Built and maintain digitalblake.com on Jekyll with a Docker-isolated toolchain, esbuild, inlined critical CSS, and subset WOFF2 fonts, deployed by GitHub Actions running HTMLProofer and Snyk, with a gitleaks pre-commit scan and a pnpm release-age gate guarding the supply chain.</li>
			<li>Researched and published on <a href="{% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}">WCAG 2.1 AA conformance testing</a> and on <a href="{% post_url 2026-07-24-web-accessibility-standards-and-law-wcag-eaa-us %}">which WCAG version the European Accessibility Act, ADA Title II and III, and Section 508 each require</a>.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic <span class="career-timeline__dates">February 2022 to July 2025</span></p>
		<p class="career-timeline__role">Web Developer, promoted to Senior Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Served as development lead for the WordPress-to-Sitecore migration, collaborating with design, brand, content, and SEO specialists and joining leadership meetings to resolve technical conflicts.</li>
			<li>Acted as the technical point of escalation to align stakeholders across teams during high-stress, timeline-constrained delivery sprints.</li>
			<li>Documented workflows and technical setup for long-term knowledge handoffs across security, leadership, and privacy teams.</li>
			<li>Led post-business-hour code deployments and quality assurance for seismic.com.</li>
			<li>Onboarded a team of 6 contractors on the operating procedures of seismic.com for developers and producers.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Gray Digital Group <span class="career-timeline__dates">January 2014 to February 2022</span></p>
		<p class="career-timeline__role">Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Worked with account executives, project managers, and designers to scope client requests and estimate the time to research, design, develop, test, and launch projects.</li>
			<li>Trained clients in groups of 1 to 6 on the admin UI for WordPress, Joomla, Drupal, and Sitefinity.</li>
			<li>Quality assured sites for browser support, HTML validation, script errors, usability, and build quality.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">DigitalBlake.com (Freelance) <span class="career-timeline__dates">January 2013 to February 2022</span></p>
		<p class="career-timeline__role">Web Developer</p>
		<ul class="career-timeline__bullets">
			<li>Built a WP Foundation 6 coding library to keep code consistent across teams.</li>
			<li>Developed a mobile mega-menu plugin that generates a horizontally scrollable navigation.</li>
			<li>Created a JavaScript NPM module using the YouTube API for custom embedded playlists.</li>
			<li>Programmed Joomla 3.x social-sharing modules without relying on JavaScript.</li>
		</ul>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">PPDG, Inc. <span class="career-timeline__dates">February 2012 to January 2013</span></p>
		<p class="career-timeline__role">Web Designer and Developer</p>
		<ul class="career-timeline__bullets">
			<li>Coordinated the migration of all sites to a new server running the latest PHP, MySQL, and Apache.</li>
			<li>Designed and built an employee portal on Joomla 2.5 for 600+ field employees.</li>
			<li>Trained a corporate office of 30+ employees on the operation and business rules of the portal.</li>
			<li>Designed and built Plaza Lecea Event Center website on Joomla 2.5.</li>
		</ul>
	</div>
</div>
