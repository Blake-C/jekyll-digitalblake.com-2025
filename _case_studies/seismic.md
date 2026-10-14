---
layout: case-study
featured: true
order: 140
year: '2022 to 2025'
permalink: /case-studies/seismic/
title: Seismic
description: 'A ground-up WordPress rebuild of seismic.com through a major rebrand, from about 40 pages at the phase one launch to about 1,000 pages over later phases, followed by a rebuild in Sitecore in 2025. The 2022 launch drove a 50% traffic increase within the first year.'
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
    - Internationalization
    - Systems Security
link: https://seismic.com
link_text: View Live Site
---

Seismic builds enterprise sales enablement software used by global sales teams. I was recruited specifically for production-level WordPress development (PHP, JavaScript, and custom Gutenberg work) and was onboarded and shipping code within two days of starting. Over three and a half years I worked across every phase of the site: a ground-up redesign, an internationalization platform migration, a phase two blog and tooling build, two agency transitions, and a full platform migration from WordPress to Sitecore.

## The 2022 redesign

For the first project, the 2022 redesign of seismic.com, we duplicated the site, stripped out the old theme, and rebuilt it on a new WordPress theme with a library of custom Gutenberg blocks. Phase one launched about 40 pages, including the home page and product pages, and kept parts of the old theme on pages we couldn't finish in time. Phases two and three rebuilt the blog, enablement explainers, and resources, which completed the rebuild at about 1,000 pages. The design-to-development workflow ran in tight cycles: review a design spec, flag any development constraints, implement the component, build a full page, send it back for stakeholder review, address the annotated feedback, close out the markers, and ship. Partway through the project I transitioned from component development to QA lead, reading and resolving comments left by designers and stakeholders across pages already in build, coordinating with the lead developer and the external agency, and pushing updates while the rest of the team focused on core development. We were regularly working 12 to 16 hour days in the final stretch against a hard marketing deadline. The launch went out on time, and the 2022 rebuild drove a 50% increase in site visitors within the first year.

![Cards and carousel blocks built for the 2022 seismic.com redesign](/assets/uploads/2025/05/seismic-2022-home-page-cards-and-carousel-blocks.webp)

## Moving from TranslatePress to WPML

After launch I led the migration from TranslatePress to WPML to support dedicated localized pages for German and French audiences. TranslatePress translated content on the fly on top of the English pages, and translated content kept appearing in the wrong places while pages that should have been translated weren't. Its interface was also difficult for our production team to use. I planned the migration, executed the content freeze and transfer with three content producers from our agency partner, and trained the French and German page content editors, each as their own team, on the new system: how pages needed to be structured and how to deliver translated content so we could get it onto the site quickly.

WPML gave each language its own dedicated page with a correct canonical URL. Our production team could open a page on their own, replace the English text with the translated content, and publish it, and we had zero issues moving pages into other languages from that point forward. We could also create a dedicated page for any new language we needed. Site performance didn't change, but the site was more stable because pages were no longer being translated on the fly.

## The blog and the ROI calculator

Phase two focused on the blog and a major new interactive tool. On the blog side, we rebuilt the post template in Gutenberg: new components for the author byline, a time-to-read estimate calculated from word count, a collapsible author bio with links to their other posts, and lazy-loading of the next post as the reader scrolls. The blog index page was rebuilt with a new grid: a featured most-recent post at the top, editors' picks, a subscribe component, per-category row layouts with varying column arrangements, and mid-page CTAs with images that broke out of the container.

![Midline CTA block from the 2022 blog page redesign](/assets/uploads/2025/05/seismic-2022-midline-cta-block.webp)

![Complex grid layout of the redesigned seismic.com blog index](/assets/uploads/2025/05/seismic-2022-blog-home-page-complex-layout.webp)

The ROI calculator was about two months of work. It was a four-step conditional form where each field could show or hide other fields based on user inputs. On submission, the data was sent to an API that generated a PDF, emailed it to the user, and triggered a sales notification so the team could follow up with context on what the prospect had submitted.

![ROI calculator interface built for seismic.com](/assets/uploads/2025/05/seismic-2022-roi-calculator-screen.webp)

## Handing off from Resources Online to Grazitti

In 2024 our external agency partner, Resources Online (RO), transitioned off the project. RO and I were responsible for documenting the full development stack, which included over 200 Advanced Custom Fields components assigned to Gutenberg blocks, development standards, analytics configurations, production workflows, and media requirements. With that documentation in hand, RO and I trained the incoming team of about 6 people from the India agency, Grazitti, on the operations of seismic.com.

## Security

After Resources Online left, the WordPress site was my responsibility as the internal lead developer, and I locked down access to it. Wordfence provided the firewall and two-factor authentication, which we required for every user, including those without admin access. Our hosting provider, WP Engine, let us restrict the admin section, including the login page, to approved IP addresses, and we added the corporate VPN's IP addresses there so anyone on the VPN could log in. We also put the WP Engine account behind the corporate SSO login system. We replaced our activity log plugin with Melapress WP Activity Log, which recorded every login, page view, and content change in more detail and let us roll back anything that had been modified.

Melapress Login Security set the password rules for every user:

- A minimum password length
- No reusing old passwords
- Password reset links disabled
- A required password reset on first login
- A limit on failed login attempts
- Passwords that expire after a set number of months

I worked with everyone who had login access to the marketing site to get their IP address approved or get them onto the corporate VPN, and to make sure they had two-factor authentication set up and active. After that, I was the person they came to with login problems, such as someone deleting their two-factor authentication app and needing their access restored. From then until the move to Sitecore, the site had no security issues.

## Migrating to Sitecore

In 2025 the decision was made to migrate seismic.com from WordPress to Sitecore to support personalization, A/B testing, and complex content workflows. Most pages had to be rewritten in the Sitecore CMS, because there was no way to migrate the data out of MySQL into the database structure Sitecore uses. I audited all 200+ components from the WordPress build to determine what needed to be rebuilt in Sitecore, what could be migrated as static content, and what could stay in WordPress. The ROI calculator, the maturity calculator, the podcast pages, and the enablement explainer detail pages stayed on WordPress, and I worked with IT to set up a reverse proxy so both systems could serve content under the same domain through and after the cutover. Access to the Sitecore authoring environment was locked down to corporate SSO.

My initial role on the Sitecore project was managing the content migration, and our new Sitecore agency partner was supposed to handle the coding. When it became clear the agency couldn't do all the work we needed, I moved over to building components to fill those gaps, ramping up on Sitecore, TypeScript, GraphQL, and Tailwind under a live deadline. I built several components for the blog section, which included spending a weekend reworking what the agency had built. After deciding my weekend rework wouldn't hold up long term, I threw it out and reworked it again the next day.

The agency had built the blog on the same template as the resource pages, which would have made future updates to either one much more difficult. My rebuild gave the blog its own template, which made it easier to manage long term and let me write styles targeted to the blog, so it matched what our design team put together instead of reusing everything from the resource pages. It also let me add a listing of three related posts at the bottom of each article, pulled from posts in the same category, which the original template didn't have. Each card shows the first tag on that post instead of its category, because the category would have repeated the one on the article being read.

![Header of a seismic.com blog post on the 2025 Sitecore template, with the category, title, byline, and featured image](/assets/uploads/2026/10/the-new-2025-seismic-blog-header.webp)

![Three post cards at the bottom of a seismic.com blog post on the 2025 Sitecore template](/assets/uploads/2026/10/the-new-2025-seismic-blog-footer-three-latest-blogs-and-related-categories.webp)

Our internal design team expected to review Sitecore components in context on the page, while the agency delivered them one by one, so the design team asked for changes after components were already built. I stepped in several times to explain to the agency how the design team expected components to be handed to them, which smoothed out communication between the two teams.

Sitecore's server-side rendering brought load times into the 1 to 2 second range.

In about the last two months of the migration, we onboarded two teams at the same time while we were still building the site. A new Grazitti team knowledgeable in Sitecore joined first so they would know what was being built, and toward the end Seismic hired a new internal team of 6 in its India office to manage the site going forward. We had to get both teams working on parts of the project quickly to help us finish it. Throughout, I answered their questions about how things worked, who was responsible for what, and which internal teams at Seismic were stakeholders for each part of the site, such as the HR team for the career pages and careers portal and the podcast team for the podcast pages. I also introduced them to other groups within Seismic, such as the security team and Cloud Engineering, so they would have a working relationship with them.

We completed the migration and updated all documentation, and after launch there were about two weeks left for my offboarding and the new team's onboarding. In those two weeks I also handed off the WordPress site, which stayed up behind the reverse proxy to serve the pages that hadn't been migrated, and the new team became responsible for moving those pages into Sitecore. Before I left, the plan was for them to build the enablement explainers hub page in Sitecore and link it to the detail pages on WordPress until they had time to move those over. I was part of a company-wide reduction in force in July 2025.

![seismic.com after the 2025 migration to Sitecore](/assets/uploads/2025/05/seismic-2025-home-page-redesign.webp)

**Impact:** Cross-functional team of 20+ across development, design, content, SEO, and brand. A rebuild of the entire site, about 1,000 pages, on WordPress in 2022, and a migration of most of the site to Sitecore in 2025. Two agency partnerships documented and handed off. Page loads dropped by 40%, from 2 to 3 seconds on WordPress to 1 to 2 seconds on Sitecore. The 2022 launch drove a 50% increase in site visitors within the first year.
