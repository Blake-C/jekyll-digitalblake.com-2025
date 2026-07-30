---
layout: post
title: 'Building a WordPress Exit Intent Popup Plugin with Claude'
description: 'A WordPress exit intent popup plugin built with Claude Code. A custom post type, per-popup settings, A/B testing, and GA4 event tracking.'
date: 2026-04-19 09:00:00 -0500
modified_date: 2026-04-19 09:00:00 -0500
categories: ['Articles']
tags: ['javascript', 'php', 'wordpress', 'claude-code', 'ai']
pillar: claude-code-ai
pillar_section: apps
image: '/assets/uploads/2025/04/exit intent - front-end dark mode.webp'
---

While working at Seismic, our Analytics specialist came to me asking for exit intent popup functionality on one of our WordPress properties. The requirements were:

- A/B testing
- conversion tracking
- GA4 integration
- enough customizability that the team could manage it without touching code

I built a version of that for Seismic, and the code stayed there. What I wanted was to revisit the concept on my own terms and see how far Claude Code could take me as a development collaborator.

This is a proof of concept. It does not recreate the Seismic version one for one, and it covers the core of what made that project interesting.

## The Spec

Before writing any code I put together a `project.md` outlining what the plugin needed:

- A custom post type with the Gutenberg editor so popup content could be written as blocks
- Per-popup settings for delay, auto-appear timer, frequency, position, size, theme, and date scheduling
- A multi-select on pages and posts for assigning popups
- Multiple popups per page for A/B testing
- A results dashboard with impressions, conversions, and close rates
- GA4 integration with configurable event names
- A global settings page for colors, sizes, and border radius using CSS custom properties

The `project.md` file helped me keep Claude on track in terms of what features we needed to build out as the project moved forward. I updated the spec in the file so that Claude could maintain the history and knowledge of what we were building.

## Working with Claude

Claude wrote the class scaffolding, the hook registration, the meta box markup, and the REST endpoint structure quickly. It was more useful during iteration. When something was not working I could describe the problem in plain terms, point to the relevant code, and Claude would find it. Across multiple sessions it stayed coherent on the plugin's architecture and made suggestions that fit the patterns already in the code.

Deciding what to build next stayed with me. Claude executes on a clear direction, and it did not tell me what the plugin should do next or argue with a design decision I had made. It writes the boilerplate you describe and catches problems you miss along the way.

## Architecture

There are seven classes, one per concern:

- the custom post type
- per-popup settings
- page assignment
- global settings
- frontend rendering
- A/B tracking
- the results dashboard

There is no build pipeline. The JavaScript is vanilla, wrapped in an IIFE, and all theming goes through CSS custom properties.

![Exit intent popup admin listing UI](/assets/uploads/2025/04/exit intent - popup backend listing ui.webp)

Each popup is a custom post type edited through a Gutenberg-enabled editor. All per-popup configuration lives in the sidebar.

![Exit intent popup editing UI in WordPress admin](/assets/uploads/2025/04/exit intent - popup editing ui.webp)

The popup itself supports light and dark themes, both of which can be further customized through the global settings page.

![Exit intent popup light mode on the front-end](/assets/uploads/2025/04/exit intent - popup front-end light mode.webp)

![Exit intent popup dark mode on the front-end](/assets/uploads/2025/04/exit intent - front-end dark mode.webp)

## Challenges

Four things came up during the build.

**Exit intent on mobile.** The `mouseleave` event does not fire on touch devices. The solution was a scroll-reversal heuristic: once a visitor has scrolled down at least 100 pixels, watch for a fast upward scroll and treat that as exit intent. It is not precise, but it fires in the right situations often enough to be useful.

```javascript
// Mobile / touch: scroll-reversal exit-intent heuristic.
// mouseleave never fires on touch devices, so watch for a rapid upward
// scroll after the user has scrolled at least 100px down the page.
if ('ontouchstart' in window) {
	let lastScrollY = window.scrollY
	let maxScrollY = window.scrollY

	document.addEventListener(
		'scroll',
		function () {
			const current = window.scrollY
			if (current > maxScrollY) {
				maxScrollY = current
			}
			if (!popupTriggered && delayPassed && !activeModal && maxScrollY >= 100 && lastScrollY - current >= 50) {
				popupTriggered = true
				openModal(selected)
			}
			lastScrollY = current
		},
		{ passive: true },
	)
}
```

**Threshold tuning.** The initial desktop threshold was `clientY <= 5`, which fired when someone scrolled to the top of a page or moved the cursor quickly to a navigation link. Dropping it to `clientY <= 0` fixed that, and that is the value the plugin ships with.

**A/B result color-coding on low data.** The results dashboard highlights conversion rates green or orange. A popup with one impression and one conversion would show 100% in green, which tells you nothing about how it performs. Color-coding is now applied only at 30 or more impressions, and rows below that get a warning marker instead.

**CSV injection.** The data export was one of the later additions. Spreadsheet applications treat a cell starting with `=`, `+`, `-`, or `@` as a formula, so a popup title beginning with one of those characters could run a formula when someone opened the export in Excel. Every text cell now goes through a function that prefixes the value with a tab character when it starts with one of those, which stops the spreadsheet from parsing it as a formula.

## Where the Plugin Stands

The plugin is sitting in a git repo, somewhere between a proof of concept and a feature-complete draft, and I do not plan to release it as a polished plugin. I wanted to build the thing again on my own, see how the architecture held up when I had full control over the decisions, and get a read on how useful Claude is as a collaborator on something like this.

I'll likely continue to use Claude going into the future, however I'll be very cautious in terms of how often I use it and for what purposes. I don't want this thing to take full control over development itself, but it is a very very very good tool in terms of what it is able to do and accomplish in a quick buildout.

The final project can be found in this git repo: [https://github.com/Blake-C/wp-exit-intent-popups](https://github.com/Blake-C/wp-exit-intent-popups)
