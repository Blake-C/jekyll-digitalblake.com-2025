---
layout: case-study
featured: false
order: 90
permalink: /case-studies/san-antonio-legal-services/
title: San Antonio Legal Services Association
description: "A WordPress platform built for one of San Antonio's largest pro bono legal organizations, with dual API integration, an authenticated resource library, and a public events calendar."
thumbnail: /assets/uploads/2025/05/salsa-thumbnail.webp
image: /assets/uploads/2025/05/salsa-full-screenshot.webp
hero_image: /assets/uploads/2025/05/salsa-hero.webp
og_image: /assets/uploads/2025/05/salsa-og.webp
agency: Gray Digital Group
team:
    - name: Jim Aderhold
      role: Project Manager
    - name: Aurora Ramirez
      role: Account Executive
    - name: Blake Cerecero
      role: Designer/Developer
link: https://www.sa-lsa.org/
link_text: View Live Site
tech:
    - WordPress
    - PHP
    - Gutenberg
    - Legal Server API
    - Events Calendar Pro
    - Gravity Forms
    - WP Rocket
    - Cloudflare
---

San Antonio Legal Services Association (SALSA) connects pro bono legal volunteers with individuals across San Antonio who cannot afford representation. I handled the full engagement at Gray Digital Group: wire-framing, design, and development, with direct client communication throughout. The core challenge was building a single platform that could surface both internal clinic events and third-party case listings without asking SALSA staff to maintain the same data in two places.

The homepage opens with an announcement bar that SALSA can pin below the navigation for time-sensitive community notices, a way to push something important to the top of the screen without touching the carousel. Below that, a staff-managed announcements carousel handles routine updates. The Volunteer Opportunities section below it was a specific client requirement: Upcoming Clinical Opportunities and Available Cases had to sit side by side as parallel columns at equal visual weight on the page. The client was clear that neither section should read as subordinate to the other. Upcoming Clinical Opportunities pulls from an internal API call against events added to the site; Available Cases pulls from Legal Server, the external third-party service SALSA uses for managing pro bono cases. Legal Server stays the single source of truth for case data, staff never re-enter it, and volunteers find both their training and their next assignment in one place.

Below the volunteer section is the organization's mission statement: _We envision a community where everyone has equal access to justice regardless of the ability to pay._ Three image cards follow: Preventing Homelessness, Advocating for Vulnerable Populations, and Protecting Individual Rights. A news feed at the bottom of the homepage pulls in the three most recent articles with featured image, category tag, title, excerpt, and a read-more link, plus a button directing users to the full article listing.

![SALSA homepage news and announcements section](/assets/uploads/2025/05/salsa-homepage-news-and-announcements-section.webp)

![SALSA homepage mission statement section with three image cards](/assets/uploads/2025/05/salsa-home-page-mission-statement-section.webp)

The events section uses the Events Calendar Pro plugin to display a public calendar of upcoming clinics and legal aid events such as the Veterans Legal Advice Clinic. Hovering over a calendar entry surfaces a quick-detail popup; a list view gives the full chronological rundown of everything on the schedule. Clicking into an event loads a detail page with all the specifics: date, time, event category, location map, menu, info number, and a button to add the event directly to your calendar.

![SALSA public events calendar interface](/assets/uploads/2025/05/salsa-public-events-calendar-interface.webp)

![SALSA event detail with add-to-calendar button and location information](/assets/uploads/2025/05/salsa-events-footer-with-events-detail-and-add-to-calendar-button.webp)

The resource library required an access-gating layer. A custom Gravity Forms form lets users request access by submitting their bar number; that submission is what SALSA uses to verify the person is a licensed legal representative before granting access to the protected document library. WordPress's default media library has no folder organization, so I added a media library plugin that creates a proper folder structure in the admin. SALSA staff can organize documents by category and manage the library themselves; authenticated front-end users get a clean, browsable interface to the materials they need. Gravity Forms also handles other dynamic forms across the site where a polished, configurable UI was needed.

![SALSA status reports form section built with Gravity Forms](/assets/uploads/2025/05/salsa-status-reports-form-section-with-gravity-forms-example.webp)

The layout system is built on custom Gutenberg blocks that give SALSA staff full-bleed background sections and columned layouts without writing any code for each variation. WP Rocket combined with Cloudflare handles page caching and CDN delivery. A donation page routes visitors to the appropriate support lines depending on how they want to contribute.

This was a rewarding project from wireframes through launch. Designing and building a platform for a cause this direct, getting legal help to people who cannot afford it, made every decision feel worth getting right.

**Impact:** Page load times reduced from 5s to under 2s. Unified case matching, clinic scheduling, authenticated resource access, and fundraising into a single WordPress platform. Legal Server remains the authoritative source for case data with no duplicate staff entry required.
