---
layout: website-case-study
permalink: /projects/republic-ranches/
title: Republic Ranches
description: "A WordPress site for one of Texas's largest land brokerages, built with an interactive Google Maps property search, location-based SEO architecture, and load times cut from 3–5s to 1–2s."
thumbnail: /assets/uploads/2021/12/republicranches.com_-600x400.webp
image: /assets/uploads/2021/12/republicranches.com_-scaled.webp
hero_image: /assets/uploads/2021/12/republicranches.com_-scaled-hero.webp
og_image: /assets/uploads/2021/12/republicranches.com_-og.webp
agency: Gray Digital Group
team:
    - name: Jim Aderhold
      role: Project Manager
    - name: Aurora Cantu
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
---

Republic Ranches sells Texas land and ranch properties with listings across the United States, and the team needed a search experience that matched how buyers actually discover land by location first, then by features. I designed and built the site around that intent.

The centerpiece is the interactive property map. I integrated the Google Maps API with the property dataset so users can pan, zoom, and filter unsold listings directly on the map, and as they zoom in, the sidebar auto-filters to only the properties currently in view. Which keeps every listing in rotation instead of stranding them off-screen. I persisted the map state between sessions so a buyer who leaves and returns lands right where they left off, and added a list-only toggle for buyers who prefer to scroll a grid with the filters still active.

For SEO, I restructured the WordPress URL hierarchy to mirror real geography. A Bexar County listing's breadcrumbs roll up to all Bexar County properties, then to Texas, then to the global search, which gives Google a clean signal about location intent at every level. I marked up every property with real estate schema so listing name, location, assets, and attributes can surface directly in search results.

On detail pages I used CSS Grid to keep the property description front and center alongside a sticky sidebar of galleries, brochures, maps, and associate contacts. On mobile the sidebar collapses directly beneath the description with jump links, so one tap scrolls to exactly the section the buyer came for, and the main gallery opens a full-screen modal for a quick at-a-glance review of every image.

**Impact:** Reduced the site's image library from 20GB to 8GB. Automated a WebP conversion and compression pipeline (200KB cap) for all uploaded images, so the client can add new listings without worrying about file size. Page load times improved from 3-5s down to 1-2s. Offloaded large media library to Amazon AWS S3 Bucket to prevent server Degradation due to large storage requirements.
