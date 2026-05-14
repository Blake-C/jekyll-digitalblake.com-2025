---
layout: website-case-study
featured: true
permalink: /projects/texas-biomedical-research-institute/
title: Texas Biomedical Research Institute
description: "A WordPress rebuild for one of the nation's leading biomedical research institutions, migrating off Sitefinity onto a responsive Foundation for Sites base with a CSS-only slanted nav and a static-JSON scientist filtering system."
thumbnail: /assets/uploads/2025/05/texas-biomedical-research-institute-thumbnail.webp
image: /assets/uploads/2025/05/texas-biomedical-research-institute-full-screenshot.webp
hero_image: /assets/uploads/2025/05/texas-biomedical-research-institute-hero.webp
og_image: /assets/uploads/2025/05/texas-biomedical-research-institute-og.webp
agency: Gray Digital Group
team:
    - name: Tim Smith
      role: Designer
    - name: Kai Armstrong
      role: Project Manager
    - name: Jessica Donovan
      role: Account Executive
    - name: Blake Cerecero
      role: Developer
link: https://web.archive.org/web/20161215000000/http://txbiomed.org/
link_text: View Archived Site
tech:
    - WordPress
    - PHP
    - Foundation for Sites
    - SVG
    - Mix It Up
    - Gravity Forms
    - WP Rocket
    - Cloudflare
    - jQuery
---

Texas Biomedical Research Institute is one of the country's leading independent biomedical research organizations, and the parent organization of the Southwest National Primate Research Center. The previous site ran on Sitefinity and had architectural issues that created ongoing maintenance problems. When the green light came to migrate to WordPress in late 2015, the goal was a fully responsive rebuild on our WP Foundation 6 base framework, which used Foundation for Sites as its primary library. The project ran from February to June 2016.

Moving off Sitefinity onto WordPress gave the team considerably more flexibility in design and content management. We paired the WordPress installation with WP Rocket for server-side caching and Cloudflare for CDN delivery and DNS. SVGs were used throughout the site, not just for the logo, but for icons, social share buttons, and the search button, so every graphic element stayed sharp at any display density.

The header opens with a black background, the Texas BioMed SVG logo, social follow buttons, and a prominent Give Now button in the upper right. Below that sits a row with search, contact, and employment entry points. The main navigation immediately below is the most visually distinctive element on the site: each anchor element is tilted 20 degrees to the right using CSS transforms, and the link text is counter-rotated 20 degrees back so it reads vertically within the slanted container. The entire effect is CSS-only, with no JavaScript involved, and it holds up through hover and active states without any scripting overhead. Below the nav is a carousel that editors could configure with different layout options. The initial layout used a full-width background image with a centered overlay block for a title, supporting text, and a learn more button, all manageable from the WordPress backend.

The homepage continues with an External Resources section surfacing three key areas: Biosafety Level 4 Laboratory, Genomics Research Center, and Primate Research Facility. A reports section follows with links to winter, annual, and scientific reports. The three most recent news articles display below that, and the page closes with a contact bar showing phone and address information before the footer.

![Texas Biomedical Research Institute about page with left-hand sidebar sub-navigation](/assets/uploads/2025/05/texas-biomedical-research-institute-about-page.webp)

Inner pages open with a full-width banner image and a centered section title. A breadcrumb bar below the header traces the page location within the site hierarchy. Page content sits in a main column with a left-hand sidebar that shows the subpages for the current section, along with optional custom sidebar components like media inquiry cards, each with a configurable icon. This was built before Gutenberg, so all content editing ran through TinyMCE. We injected the site's compiled styles into the WYSIWYG editor so that as editors added headings, columns, and buttons, they saw the correct visual output inside the editor. The style dropdown let editors apply proper markup classes directly without touching code. We also built custom tabs and accordions for this site: the tab interface would convert to a stacked accordion pattern once there was no longer enough horizontal space for the tabs to display side by side.

The scientist directory was one of the more technically interesting parts of the build. Three filters along the top of the page let visitors narrow by department, research area, and last name. The Mix It Up JavaScript plugin drove the filtering, animating the grid smoothly as results rearranged on screen. Each scientist card showed a headshot, the scientist's name, an email button that opened the visitor's default mail client, and a learn more link to the scientist detail page.

![Scientist directory with department, research area, and last name filters](/assets/uploads/2025/05/texas-biomedical-research-institute-scientist-filters.webp)

The scientist detail page included a headshot, a link to the scientist's publications, a description of their research focus, an Inside the Lab section, and a main technologies and methodologies section. On the backend, scientists are a custom post type. When a scientist post is saved, WordPress generates a static JSON file on the server rather than routing data through the REST API or the database at page load. The front end loads that file directly for filtering, which made the experience fast and kept the server from fielding database queries on every filter interaction.

![Reports section on the Texas Biomedical Research Institute homepage](/assets/uploads/2025/05/texas-biomedical-research-institute-homepage-reports.webp)

All site forms used Gravity Forms with responsive styling. The Give Now flow and the contact pages were both powered by Gravity Forms, and we used custom query strings to pre-populate specific form fields based on where a visitor arrived from, so the form could be contextually scoped without additional pages.

![Contact page with Gravity Forms on Texas Biomedical Research Institute](/assets/uploads/2025/05/texas-biomedical-research-institute-contact-form-gravity-forms.webp)

After launch, the Gray Digital Group team traveled to the Texas Biomedical Research Institute offices to train their staff on managing the new site. We sat with approximately 15 people and walked through how the site was structured, how content was managed in WordPress, and how the scientist custom post type and JSON generation worked. It was one of the more memorable parts of the project.

**Impact:** Rebuilt from a non-responsive Sitefinity site onto a fully responsive WordPress foundation. CSS-only slanted navigation with no JavaScript dependency. Static-JSON scientist filtering for performant front-end search without runtime database queries. SVGs throughout for crisp rendering at any resolution. WP Rocket and Cloudflare for caching and CDN. Gravity Forms with custom query-string pre-filtering for the Give Now and contact flows.
