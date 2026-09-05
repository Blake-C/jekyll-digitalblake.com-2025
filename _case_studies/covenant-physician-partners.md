---
layout: case-study
featured: false
order: 90
year: '2020'
permalink: /case-studies/covenant-physician-partners/
title: Covenant Physician Partners
description: 'A WordPress site for a national physician network, featuring an interactive SVG state map with static-JSON-backed filtering, a custom heart-letter carousel, and a live position/location directory powered by MixItUp.'
thumbnail: /assets/uploads/2025/05/covenant-physician-partners-thumbnail.webp
image: /assets/uploads/2025/05/covenant-physician-partners-homepage.webp
hero_image: /assets/uploads/2025/05/covenant-physician-partners-hero.webp
og_image: /assets/uploads/2025/05/covenant-physician-partners-og.webp
agency: Gray Digital Group
team:
    - name: Jim Aderhold
      role: Account Executive
    - name: Richard Baugh
      role: Production Director
    - name: Blake Cerecero
      role: Developer
    - name: Tim Layton
      role: Programmer
link: https://web.archive.org/web/20200902015029/https://covenantphysicianpartners.com/
link_text: View Archived Site
tech:
    - WordPress
    - Foundation for Sites
    - WP Rocket
    - Cloudflare
    - SlickJS
    - Remodal
    - MixItUp
    - Gravity Forms
    - PHP
    - SCSS
    - SVG
---

Covenant Physician Partners was a national network of physician-led practices and healthcare groups, bringing together a combined management experience of 150-plus years, a 10-plus year track record as value-add physician partners, 148% company growth, and 1,735 associates and physicians nationwide. The site was built at Gray Digital Group on WP Foundation 6 as the WordPress base and Foundation for Sites as the frontend framework. It is fully responsive and mobile-first, uses an SVG logo for crisp rendering at any size, and relies on WP Rocket for caching and Cloudflare for CDN, firewall, and DNS.

The homepage opens with a full-bleed video that communicates what the organization stands for and what they are trying to accomplish. Below the video, the page is divided into several content sections that use a diamond or arrow-shaped overlap pattern rather than a flat stack of horizontal bars. Each section bleeds into the next, which gave the layout a sense of motion and visual continuity. Buttons throughout the site use a smooth fade transition. All icons are SVGs to keep them sharp at any resolution; since WordPress blocks SVG uploads by default, we brought in a plugin to allow them through safely.

![Covenant Physician Partners Who We Are page with content blocks and custom model section](/assets/uploads/2025/05/covenant-physician-partners-our-model-and-carousel.webp)

The Who We Are page was built with the block-based WYSIWYG editor — this predated Gutenberg, so the layout relied on the editor's native block tools. At the bottom of the page sat a carousel where the standard dot pagination was replaced with individual letters that spelled out HEART. We built this as a custom component that let the client configure the word, with each letter linking to a corresponding value: Humility, Empathy, Accountability, Respect, and Teamwork.

![Custom HEART carousel with letter-based pagination](/assets/uploads/2025/05/covenant-physician-partners-heart-carousel.webp)

The Our Team page uses Foundation for Sites tab navigation to separate the executive leadership team from the senior leadership team in an accessible tabbing interface. Each tab loads its corresponding group without a page reload.

![Our Team page with Foundation for Sites tab navigation separating leadership groups](/assets/uploads/2025/05/covenant-physician-partners-our-team-page.webp)

The Partner With Us page uses SVGs for each of its subsections to keep the visual elements crisp across all display densities.

![Covenant Physician Partners icons and services section using SVGs](/assets/uploads/2025/05/covenant-physician-partners-icons-and-services.webp)

The Connect With Us Today section uses Gravity Forms to handle position opportunity interest submissions, with field-level validation and a straightforward form layout.

![Connect With Us Today form built with Gravity Forms](/assets/uploads/2025/05/covenant-physician-partners-gravity-forms-contact-form.webp)

The two most technically involved pages were Positions and Locations. Richard Baugh built a custom SVG map of the United States where clicking a state filters the listing below the map to only that state's results. Select menus alongside the map allowed for more granular filtering by specialty or category. The filtering and animation were handled by MixItUp, which gave a smooth transition as items entered and left the list.

The backend used custom post types in WordPress for both locations and position opportunities. When a record was saved, a hook wrote a static JSON file to the server as part of the save process. At runtime, the page loaded directly from that JSON file rather than making database queries or going through PHP — this produced fast initial load times and allowed the MixItUp filtering to run without any additional API calls.

![Location and position opportunity page with SVG US map and MixItUp filtering](/assets/uploads/2025/05/covenant-physician-partners-location-map-and-filtering-with-mix-it-up.webp)

The site also included a News section with pagination and individual post pages. The posts had been imported from a prior version of the site, which left behind a mix of shortcode remnants and mangled HTML. We ran an automated cleanup pass and then manually reviewed each post to make sure the content came through clean and consistently formatted.

![News section with paginated post listing](/assets/uploads/2025/05/covenant-physician-partners-newspage.webp)

**Impact:** A sharp, well-designed site that held up across devices and screen sizes. The static JSON architecture on the Positions and Locations pages produced fast load times and fluid real-time filtering without additional server round-trips. The custom post type workflow let the internal team add and update locations and position opportunities entirely on their own.
