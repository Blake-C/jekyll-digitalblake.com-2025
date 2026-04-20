---
layout: post
title: 'Building a WordPress Exit Intent Popup Plugin with Claude'
description: 'A proof of concept born from a request at Seismic, and my first real attempt at building a plugin with Claude as a collaborator.'
date: 2026-04-19 09:00:00 -0500
modified_date: 2026-04-19 09:00:00 -0500
categories: ['Articles']
tags: ['javascript', 'php', 'Wordpress', 'learning']
image: '/assets/uploads/2025/04/exit intent - front-end dark mode.webp'
---

While working at Seismic, our Analytics specialist came to me asking for exit intent popup functionality on one of our WordPress properties. The requirements were specific: A/B testing, conversion tracking, GA4 integration, and enough customizability that the team could manage it without touching code. I built a version of that for Seismic, but the code lived there. What I wanted was to revisit the concept on my own terms and see how far Claude Code could take me as a development collaborator.

This is a proof of concept, not a production-ready release. It does not recreate the Seismic version one for one. But it covers the core of what made that project interesting.

## The Spec

Before writing any code I put together a `project.md` outlining what the plugin needed:

- A custom post type with the Gutenberg editor so popup content could be written as blocks
- Per-popup settings: delay, auto-appear timer, frequency, position, size, theme, and date scheduling
- A multi-select on pages and posts for assigning popups
- Multiple popups per page for A/B testing
- A results dashboard with impressions, conversions, and close rates
- GA4 integration with configurable event names
- A global settings page for colors, sizes, and border radius using CSS custom properties

The `project.md` file helped me keep Claude on track in terms of what features we needed to build out as the project moved forward. I updated the spec in the file so that Claude could maintain the history and knowledge of what we were building.

## Working with Claude

Claude handled boilerplate well. Class scaffolding, hook registration, meta box markup, REST endpoint structure, all of that came fast and clean. Where it was most useful was in iteration. When something was not working correctly I could describe the problem in plain terms, point to the relevant code, and Claude would find it. Across multiple sessions it stayed coherent on the architecture of the plugin and made suggestions that fit the existing patterns rather than reinventing them.

Where I had to stay involved was in deciding where to go. Claude is good at executing well on a clear direction. It will not tell you what the plugin should do next or push back on a design decision. That judgment stayed with me. Think of it less as a co-developer and more as a very capable pair programmer who writes the boilerplate you describe and catches problems you miss on the way through.

## Architecture

Seven classes, one per concern: post type, popup settings, page assignment, global settings, frontend rendering, A/B tracking, and the results dashboard. No build pipeline. Vanilla JavaScript in an IIFE. All theming through CSS custom properties.

![Exit intent popup admin listing UI](/assets/uploads/2025/04/exit intent - popup backend listing ui.webp)

Each popup is a custom post type edited through a Gutenberg-enabled editor. All per-popup configuration lives in the sidebar.

![Exit intent popup editing UI in WordPress admin](/assets/uploads/2025/04/exit intent - popup editing ui.webp)

The popup itself supports light and dark themes, both of which can be further customized through the global settings page.

![Exit intent popup light mode on the front-end](/assets/uploads/2025/04/exit intent - popup front-end light mode.webp)

![Exit intent popup dark mode on the front-end](/assets/uploads/2025/04/exit intent - front-end dark mode.webp)

## Challenges

A few things came up during the build that were worth working through.

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

**Threshold tuning.** The initial desktop threshold was `clientY <= 5`. That turned out to be too aggressive. Scrolling to the top of a page or moving the cursor quickly to a navigation link was triggering the popup. Dropping it to `clientY <= 0` fixed it.

**A/B result color-coding on low data.** The results dashboard highlights conversion rates green or orange. The problem was that a popup with one impression and one conversion would show 100% in green, which is misleading. Color-coding is now only applied at 30 or more impressions.

**CSV injection.** The data export was one of the later additions. Spreadsheet applications treat cells starting with `=`, `+`, `-`, or `@` as formulas. Any popup title with those characters could execute arbitrary formulas when the CSV was opened in Excel. The fix is to prefix those cells with a tab character. Easy to miss, easy to fix.

## Final Thoughts

The plugin is sitting in a git repo, somewhere between a proof of concept and a feature-complete draft. I do not plan to release it as a polished plugin. What I wanted out of this was to build the thing again on my own, see how the architecture held up when I had full control over the decisions, and get a real read on how useful Claude is as a collaborator on something like this.

I'll likely continue to use Claude going into the future, however I'll be very cautious in terms of how often I use it and for what purposes. I don't want this thing to take full control over development itself, but it is a very very very good tool in terms of what it is able to do and accomplish in a quick buildout.

The final project can be found in this git repo: [https://github.com/Blake-C/wp-exit-intent-popups](https://github.com/Blake-C/wp-exit-intent-popups)
