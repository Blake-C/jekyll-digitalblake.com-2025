---
layout: website-case-study
permalink: /projects/san-antonio-legal-services/
title: San Antonio Legal Services Association
description: "A WordPress platform integrating Volunteer Hub and Legal Server APIs to eliminate double data entry for one of San Antonio's largest pro bono legal organizations."
thumbnail: /assets/uploads/2025/05/salsa-thumbnail.webp
image: /assets/uploads/2025/05/salsa-full-screenshot.webp
hero_image: /assets/uploads/2025/05/salsa-hero.webp
og_image: /assets/uploads/2025/05/salsa-og.webp
agency: Gray Digital Group
team:
    - name: Jim Aderhold
      role: Project Manager
    - name: Aurora Cantu
      role: Account Executive
    - name: Blake Cerecero
      role: Designer/Developer
link: https://www.sa-lsa.org/
link_text: View Live Site
tech:
    - WordPress
    - PHP
    - REST API
    - WP All Import
---

San Antonio Legal Services Association (SALSA) organizes pro bono legal volunteers across the city, and they needed a platform that could both push training resources to volunteers and route them to available cases; without staff maintaining the same data in two admin systems.

I chose WordPress for the content layer so SALSA staff could build training landing pages themselves using familiar blocks, and put the engineering effort into the integration layer underneath. I wrote PHP to authenticate against the Volunteer Hub API and pull the three upcoming pro bono clinics and events onto the site automatically, so the homepage is always current without anyone touching it. On the case side, I used WP All Import to sync the Legal Server API into a custom post type, which turned available cases into filterable listings volunteers can browse and sign up for directly.

The net effect: Legal Server stays the single source of truth for case data, staff never re-enter it, and volunteers find both their training and their next case in one place.

**Impact:** Page load times reduced from 5s to under 2s. Integrated a donation pipeline alongside the volunteer tools, giving SALSA a single platform for case matching, clinic scheduling, and fundraising.
