---
title: Covenant Physician Partners
thumbnail: /assets/uploads/2021/07/covenantphysicianpartners.com_-600x400.webp
image: /assets/uploads/2021/07/covenantphysicianpartners.com_.webp
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
    - ES6
    - Babel
    - Webpack
    - Gutenberg
    - ACF
---

Covenant Physician Partners is a national network of physician-led practices, and the primary task for visitors is finding a nearby location. The existing directory was a flat text list which my team rebuilt as an interactive SVG map of the United States.

I wrote the front-end in modern ES6 and ran it through Babel and Webpack so I could use current syntax while still supporting the browser matrix Covenant's audience actually uses. Clicking a state on the SVG filters the practice list to that region in real time, and both practices and physicians are modeled as custom post types so the marketing team can add, edit, and relate them without touching code. On top of that, I built custom Gutenberg blocks with Advanced Custom Fields that let editors drop filtered practice or physician lists into any landing page from the block inserter.

The result is a location search that works on a phone or a desktop and a content workflow where the internal team can publish new practices and physicians end-to-end on their own.
