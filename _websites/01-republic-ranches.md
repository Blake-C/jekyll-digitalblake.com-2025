---
layout: website-case-study
featured: true
permalink: /projects/republic-ranches/
title: Republic Ranches
description: "A WordPress site for one of Texas's largest land brokerages, built with an interactive Google Maps property search, location-based SEO architecture, and load times cut from 3–5s to 1–2s."
thumbnail: /assets/uploads/2025/05/republic-ranches-thumbnail.webp
image: /assets/uploads/2025/05/republic-ranches-full-screenshot.webp
hero_image: /assets/uploads/2025/05/republic-ranches-hero.webp
og_image: /assets/uploads/2025/05/republic-ranches-og.webp
agency: Gray Digital Group
team:
    - name: Jim Aderhold
      role: Project Manager
    - name: Aurora Ramirez
      role: Account Executive
    - name: Blake Cerecero
      role: Designer/Developer
link: https://republicranches.com/
link_text: View Live Site
tech:
    - WordPress
    - Google Maps API
    - PHP
    - ES6
    - SCSS
    - ACF
    - AWS S3
---

Republic Ranches is one of Texas's largest land and ranch brokerages, with listings across the US and international partner properties. I built the site at Gray Digital Group through a full redesign engagement that began with several rounds of wireframes before locking in a direction. The first challenge was infrastructure: the client handed us a hard drive with twenty gigabytes of listing images. I wrote a batch optimization script to process the backlog, set a 200KB cap with automatic WebP conversion for all new uploads, and offloaded the entire media library to AWS S3 using a WordPress plugin that routes uploads there automatically. That kept the server lean with just WordPress and its database, so new listings could go live without touching file size or server capacity.

The homepage opens with a full-width background video and the company mission statement overlaid. The main navigation uses dropdown menus structured around the property hierarchy: property area, interactive map, and state and sub-region levels within Texas. The featured property carousel uses Slick.js. Slick has a known animation glitch where looping back to the first item causes a visible bump in the transition; I modified the JavaScript so that glitch does not occur when scrolling forward. The active center property scales up slightly as you move through. Below the carousel is a property pre-filter: choose a state, a region, and a county, click Find Properties, and it hands that selection to the interactive map pre-filtered to that exact view. My favorite part of the homepage is the "What We Do" section: a ribbon fills one half of the layout with two cards laying over a background image on the other.

!["What We Do" section on the Republic Ranches homepage](/assets/uploads/2025/05/republic-ranches-what-we-do-homepage-segment.webp)

The interactive map was the most technically interesting part of the build. Properties are a custom post type in WordPress. When a property is saved, a script automatically writes a static JSON file to the server rather than routing data through the WordPress REST API at runtime, which was too slow for the number of simultaneous map interactions we expected. The JSON feeds a Google Maps integration where Texas is divided into named regions (High Plains, Rolling Plains, North Texas, South Texas, and others), each labeled directly on the map. Outside Texas, only state lines appear. As you zoom in, the sidebar list auto-filters to the properties within the current viewport. List mode swaps the map for a scrollable grid with all filters still active. Filtering stacks: state, then region, then county, plus text search by property name, sort options (high price, low price, high acreage, low acreage), and a clear button. Featured properties pin to the top of the sidebar list. Sold properties and Faye Ranches partner listings each have their own icon.

![Republic Ranches interactive property map on initial load](/assets/uploads/2025/05/republic-ranches-interactive-map-on-page-load.webp)

![Interactive map zoomed in with property pin marker visible](/assets/uploads/2025/05/republic-ranches-interactive-map-zoomed-in-with-pin-marker-visible.webp)

Property pages open with a full gallery. Images wider than the carousel can be panned left, right, up, or down depending on the aspect ratio. A grid button opens all images in a modal; a maximize button expands the gallery to fill the full top section of the page. Breadcrumbs trace the full location hierarchy from the current property up through county, region, state, and back to the global property search. That hierarchy is reflected in the URL structure, so a listing's URL reads domain/properties/texas/east-texas/henderson, communicating location context even when shared on social media before the page loads. On the right, a sticky detail card has anchor buttons that jump to the assigned associate, social sharing, a video embed, an interactive map embed, and ACF repeater fields for topography, wildlife, agriculture, improvements, water, electricity, area history, and a catch-all for anything else. Property attributes are clickable tags: clicking "Quail" or "Cattle" takes you to a filtered listing of every property sharing that attribute.

![Republic Ranches property detail page with gallery, breadcrumbs, sidebar, and associate card](/assets/uploads/2025/05/republic-ranches-property-detail-page-gallery-breadcrumbs-sidebar-associates.webp)

The team listing page is filterable by state, city, or license location. Selecting a filter animates the grid down to only the matching associates. Each associate has a detail page with a photo, bio, contact information, a contact form, any featured articles they have written, and any properties assigned to them. That same page is linked from the associate card on every property page.

![Republic Ranches associates listing page with state, city, and license filters](/assets/uploads/2025/05/republic-ranches-associates-listing-page-with-filters-to-view-by-state-city-or-state-license.webp)

![Republic Ranches associate detail page with photo, contact information, and contact form](/assets/uploads/2025/05/republic-ranches-associate-detail-page-has-contact-information-photo-and-form.webp)

**Impact:** Page loads reduced from 3-5 seconds to 1-2 seconds. Image library reduced from 20GB to 8GB with automated WebP conversion and a 200KB upload cap routed to AWS S3. Location-based URL structure and real estate schema markup built into the property hierarchy. The client reported a significant increase in site traffic after the relaunch.
