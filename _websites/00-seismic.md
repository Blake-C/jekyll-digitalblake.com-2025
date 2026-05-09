---
layout: website-case-study
permalink: /projects/seismic/
title: Seismic
description: 'A ground-up WordPress rebuild of seismic.com through a major rebrand — forty pages launched, two 1,000-page migrations completed, and a 50% traffic increase within the first year.'
thumbnail: /assets/uploads/2025/05/seismic-thumbnail.webp
image: /assets/uploads/2025/05/seismic-full-screenshot.webp
hero_image: /assets/uploads/2025/05/seismic-hero.webp
og_image: /assets/uploads/2025/05/seismic-og.webp
agency: Seismic
team:
    - name: Josh Patrice
      role: Senior Director, Digital Marketing & Web Strategy
    - name: Vinolia Huxley
      role: Director, Web Development
    - name: Lauren Walters
      role: Website Project Manager
    - name: Neicole Crepeau
      role: Senior Director, Web Strategy
    - name: Rachel Saltsgaver
      role: Senior SEO Manager
    - name: Alex Biyevetskiy
      role: Senior Manager, Growth
    - name: Cameron Alcorn
      role: Lead Frontend Developer
    - name: Simeon Awosan
      role: Design Team Lead
    - name: Byron Elliott
      role: Senior Visual Designer
    - name: Blake Cerecero
      role: Senior Web Developer
    - name: Resources Online
      role: Agency Partner
tech:
    - WordPress
    - Gutenberg
    - Sitecore
    - WPML
    - PHP
link: https://seismic.com
link_text: View Live Site
---

Seismic builds enterprise sales enablement software used by global sales teams. I was recruited specifically for production-level WordPress development (PHP, JavaScript, and custom Gutenberg work) and was onboarded and shipping code within two days of starting. Over three and a half years I worked across every phase of the site: a ground-up redesign, an internationalization platform migration, a phase two blog and tooling build, two agency transitions, and a full platform migration from WordPress to Sitecore.

The first project was the 2022 redesign of seismic.com, a reskin and rebuild of the full site on a new WordPress theme with a library of custom Gutenberg blocks. The design-to-development workflow ran in tight cycles: review a design spec, flag any development constraints, implement the component, build a full page, send it back for stakeholder review, address the annotated feedback, close out the markers, and ship. Partway through the project I transitioned from component development to QA lead, reading and resolving comments left by designers and stakeholders across pages already in build, coordinating with the lead developer and the external agency, and pushing updates while the rest of the team focused on core development. We were regularly working 12–16 hour days in the final stretch against a hard marketing deadline. The launch went out on time, and the 2022 rebuild drove a 50% increase in site visitors within the first year.

![Cards and carousel blocks built for the 2022 seismic.com redesign](/assets/uploads/2025/05/seismic-2022-home-page-cards-and-carousel-blocks.webp)

After launch I led the migration from TranslatePress to WPML to support dedicated localized pages for German and French audiences. TranslatePress had been overlaying translations on top of English pages; WPML gave us separate posts per locale, correct canonical URLs, and a much cleaner authoring workflow. I planned the migration, executed the content freeze and transfer with three content producers from our agency partner, and trained the EMEA content teams on the new system: how pages needed to be structured and how to deliver translated content so we could get it onto the site quickly.

Phase two focused on the blog and a major new interactive tool. On the blog side, we rebuilt the post template in Gutenberg: new components for the author byline, a time-to-read estimate calculated from word count, a collapsible author bio with links to their other posts, and lazy-loading of the next post as the reader scrolls. The blog index page was rebuilt with a new grid: a featured most-recent post at the top, editors' picks, a subscribe component, per-category row layouts with varying column arrangements, and mid-page CTAs with images that broke out of the container.

![Midline CTA block from the 2022 blog page redesign](/assets/uploads/2025/05/seismic-2022-midline-cta-block.webp)

![Complex grid layout of the redesigned seismic.com blog index](/assets/uploads/2025/05/seismic-2022-blog-home-page-complex-layout.webp)

The ROI calculator was about two months of work. It was a four-step conditional form where each field could show or hide other fields based on user inputs. On submission, the data was sent to an API that generated a PDF, emailed it to the user, and triggered a sales notification so the team could follow up with context on what the prospect had submitted.

![ROI calculator interface built for seismic.com](/assets/uploads/2025/05/seismic-2022-roi-calculator-screen.webp)

In 2024 our external agency partner, Resources Online, transitioned off the project. I was responsible for documenting the full development stack: over 200 Advanced Custom Fields components assigned to Gutenberg blocks, plus development standards, analytics configurations, production workflows, and media requirements. With that documentation in hand, I trained the incoming agency team from Seismic's India office on all of it under a timeline that left very little margin for error.

In 2025 the decision was made to migrate seismic.com from WordPress to Sitecore to support personalization, A/B testing, and complex content workflows. I audited all 200+ components from the WordPress build to determine what needed to be rebuilt in Sitecore, what could be migrated as static content, and what could stay in WordPress. Explainers and resources remained on WordPress; I worked with IT to set up a reverse proxy so both systems could serve content under the same domain through and after the cutover. On the Sitecore side, I built new components using TypeScript, Tailwind, and GraphQL, a stack I ramped up on quickly under a live deadline. Sitecore's server-side rendering brought load times into the 1–2 second range. We completed the migration, updated all documentation, and handed the project off to the incoming team. I was part of a company-wide reduction in force in July 2025.

![seismic.com after the 2025 migration to Sitecore](/assets/uploads/2025/05/seismic-2025-home-page-redesign.webp)

**Impact:** Cross-functional team of 20+ across development, design, content, SEO, and brand. Two 1,000-page migrations: WordPress to WordPress in 2022, WordPress to Sitecore in 2025. Three agency partnerships documented and handed off. Load times reduced from ~3s to ~2s on WordPress, then to 1–2s on Sitecore SSR. The 2022 launch drove a 50% increase in site visitors within the first year.
