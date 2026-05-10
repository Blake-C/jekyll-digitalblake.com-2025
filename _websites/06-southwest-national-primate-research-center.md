---
layout: website-case-study
permalink: /projects/southwest-national-primate-research-center/
title: Southwest National Primate Research Center
description: 'A WordPress rebuild for the sister site to Texas Biomedical Research Institute, featuring a CSS-only slanted navigation, section-based inner page architecture, and a platform migration that brought page loads to 1-2 seconds.'
thumbnail: /assets/uploads/2025/05/snprc-thumbnail.webp
image: /assets/uploads/2025/05/snprc-full-screenshot.webp
hero_image: /assets/uploads/2025/05/snprc-hero.webp
og_image: /assets/uploads/2025/05/snprc-og.webp
agency: Gray Digital Group
team:
    - name: Richard Baugh
      role: Production Director
    - name: Nicole Sellers
      role: Project Manager
    - name: Jessica Donovan
      role: Account Executive
    - name: Blake Cerecero
      role: Developer
link: https://web.archive.org/web/20180602125735/http://snprc.org/
link_text: View Archived Site
tech:
    - WordPress
    - PHP
    - SVG
    - Gravity Forms
---

The Southwest National Primate Research Center (SNPRC) is the sister organization to the Texas Biomedical Research Institute, and the two organizations share many of the same scientists. The site shares design DNA with Texas BioMed but has its own identity, theming, and framing. The previous SNPRC site was slow and running on an outdated platform; the rebuild on WordPress brought page loads into the 1-2 second range, which was a meaningful improvement for the time.

The most distinctive element on the site is the navigation at the top of every page. Each nav link is transformed at an angle using CSS, and the link text is counter-rotated back roughly 20 degrees so it reads vertically within the slanted container. The entire effect is CSS-only, with no JavaScript involved. It puts a clean diagonal cut across the top of the page with vertically oriented labels, and it holds up across browsers without any scripting overhead.

The homepage is structured in clear horizontal bands. At the top, a banner section lets researchers post announcements and current messaging. Below that, an Extraordinary Resources section surfaces the four primary units: Scientific Units, Laboratory Core Services, Primate Services, and Animals and Research, each linking to its own section. A Make a Request section follows with three form entry points and a donation support link. Contact information anchors the bottom of the page.

![Primates and Primate Services section entry page on SNPRC](/assets/uploads/2025/05/snprc-primates-and-primate-services-enterpage.webp)

Each inner section has its own banner image and section title. Page content lives in a main column with a right-hand sidebar. The top of the sidebar is a sub-navigation block scoped to the current section; under About, for example, you see Leadership, Scientist, and ORIP Program. The sidebar content can be customized per page or per section. This was built before Gutenberg, so all content editing ran through the standard WordPress WYSIWYG editor.

![About page with right-hand sidebar sub-navigation and custom sidebar elements](/assets/uploads/2025/05/snprc-interpage-about-with-side-navigation-and-custom-sidebar-elements.webp)

The scientist directory doesn't live on SNPRC. Clicking into that section routes users over to the Texas Biomedical Research Institute site with the organization pre-filtered to SNPRC, so they see only the relevant scientists. That page uses the Mixed It Up JavaScript plugin to filter by department, research area, and last name, with smooth grid animations as results rearrange on screen.

The Scientific Units page covers Infectious Disease, Regenerative Medicine and Aging, Experimental Psychology, and Genomics. Laboratory Core Services and the other primary sections follow the same structural template: banner, section title, main content column, and sidebar. Keeping the layout consistent made adding and updating sections straightforward without any one-off template work.

![Texas Biomedical Research Institute scientist page, pre-filtered to SNPRC scientists](/assets/uploads/2025/05/the-texas-biomedical-research-institute-scientist-page-with-custom-filtering.webp)

When a page or section included contact information in the sidebar, a small icon would break out of the sidebar container visually. It was a minor detail but it kept the sidebar from reading as a stack of flat gray blocks and gave the layout a bit of dimensional interest without anything elaborate.

![Pilot Research Grants page with contact information in the sidebar](/assets/uploads/2025/05/snprc-pilot-research-grants-page-with-contact-sidebar.webp)

Site forms were handled by Gravity Forms. The Make a Request section links out to dedicated form pages, and the Contact page uses the same setup. On the infrastructure side, the site ran on WordPress with WP Rocket for caching and Cloudflare for CDN and firewall. Sucuri provided an additional layer of protection against bots and spam. There's also a Publications page that archives the center's published research going back through the years.

![Contact Us page with Gravity Form](/assets/uploads/2025/05/snprc-contact-us-page-with-gravity-form.webp)

Another team has since come in and reworked parts of the site. The footer is still the one we built, but a number of other sections have been updated. I still think the original version held up well. The slanted navigation was something I hadn't seen many places at the time, and getting it to work purely in CSS without a JavaScript dependency was satisfying.

**Impact:** Rebuilt from a slow, outdated platform onto WordPress, bringing page loads into the 1-2 second range. CSS-only slanted navigation with no JavaScript dependency. Publications archive, Gravity Forms for request and contact flows, and Cloudflare plus Sucuri for layered security.
