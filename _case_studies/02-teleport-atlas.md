---
layout: case-study
featured: false
permalink: /case-studies/teleport-atlas/
title: Teleport Atlas (Coding Challenge)
description: 'A Teleport front-end coding challenge: the Atlas product landing page rebuilt from a Figma spec in Next.js, with Canvas product animations, a perfect axe score, and a 100 Lighthouse mobile run.'
thumbnail: /assets/uploads/2026/07/teleport-atlas-thumbnail.webp
image: /assets/uploads/2026/07/teleport-atlas-demo-product-for-sale-full-page-screenshot.webp
hero_image: /assets/uploads/2026/07/teleport-atlas-hero.webp
og_image: /assets/uploads/2026/07/teleport-atlas-og.webp
tech:
    - Next.js
    - React
    - Vercel
    - Canvas
link: https://teleport-atlas.vercel.app/
link_text: View Live Demo
---

## The challenge

This project was a coding challenge from Teleport during an interview process and I wanted to add this to my portfolio as it is the most recent site build I've done in the past six months since I've retooled myself for AI coding versus my previous manual process. Most of what I have built recently has been Swift applications or one-off WordPress plugins, single pieces of functionality rather than a whole page. This is the first full page I have built with AI tools like Claude. Teleport gave me a Figma of their Atlas product landing page and told me to build it in whatever front-end technology I wanted, then present it to the hiring panel. Because it was a challenge, I was given permission to publish the code, so the full source is public on [GitHub](https://github.com/Blake-C/teleport-web-eng-coding-challenge) and the build is live at [teleport-atlas.vercel.app](https://teleport-atlas.vercel.app/).

## Starting with the raw Figma data

I generated a Figma personal access token and pulled the design down as JSON through the Figma API, then handed that JSON to Claude Code to see whether it could build the page from the raw design data alone. It could not do it well. The fonts, layouts, and spacing all came back inconsistent, and I dropped that approach the same day. What worked was a hybrid of my usual manual build and a row-by-row collaboration with Claude, going section by section down the page. That got me from nothing to a built page with working product animations in about twelve hours.

## Foundation and architecture

To get the base of the site set up, I used the Figma JSON to pull every design token I needed into variables for the colors, the spacing, and the type. The two typefaces, Lato and Inter, are open source, so I grabbed them from their sites and self-hosted them, loading the WOFF2 files locally instead of pulling them from a third-party CDN. For the framework I used the Next.js App Router. Server components are the default, so JavaScript only ships for the pieces that opt into it with 'use client', the canvas layers, the navigation, and the request-access dialog and form. I split the site into route groups, a marketing group that owns the sticky navigation and footer, and a chrome-free group that holds the standalone request-access page. Styling is CSS Modules with BEM, which scopes at build time and costs nothing at runtime. I stayed off Tailwind on purpose for a site this simple.

## Header and hero

The first row is the header, with an SVG logo, the menu, a Sign In link, and a Request Access button. I built it static at first and came back days later to make it shrink its height once it became sticky. Tall sticky bars that follow you down the page are a pet peeve of mine, and reducing that padding gives the user back some vertical space. The menu started out without a list. I went back and added list semantics so a screen reader announces how many items are in the menu before reading them.

Claude stubbed out the hero layout, but it has a habit of missing details, line height, letter spacing, the small things. My QA pass caught those and I fixed them against the Figma. One of those fixes was a contrast problem. The small line under the buttons, Trusted by security teams at Nasdaq, DoorDash, GitLab, and 500+ more, used a gray that did not pass WCAG AA, so I nudged its color from #707783 to #818794. The product visual in the hero started as a static SVG. In the last few hours of that first build I replaced it with a canvas layered over a responsive WebP that serves a 1x and a 2x image, so high-resolution screens get the sharper version and smaller screens get a lighter file. The canvas stays proportional to the image as the layout shrinks down to tablet, animating the nodes and dots that stand in for the product. Later I added one element that was not in the Figma, a subtle node background where the points near your cursor light up and reveal the connections between them. It is a design touch with no real function, and I capped its resolution so it would not hurt performance.

## Working down the page

Below the hero is a trusted-by strip. The Figma listed the brands as plain text names. I swapped those for the actual company logos, which carries more social trust, since a user recognizes the logos at a glance in a way a list of names does not.

![The trusted-by logo strip showing real company logos in place of the plain brand names from the Figma.](/assets/uploads/2026/07/trusted-teams-logo-section.webp)

The problem section describes what Atlas solves. It is an eyebrow, a heading, a paragraph, and three cards. This is where I started embedding the card SVGs and standardizing the card layout, type, and spacing so every card grid down the page would match.

![The problem section: an eyebrow, heading, paragraph, and three cards with embedded SVG icons.](/assets/uploads/2026/07/the-problem-section.webp)

How It Works follows the same pattern with four cards, and it has the largest deviation from the Figma. To pass WCAG AA there, I raised the opacity of the numbers and the tokens on the cards so they stood out more, which made their colors more vibrant. The card numbers started as Inter text; I turned them into SVGs, both to cut a font weight and because the cards are not in a strict order, so the numbers read as decoration more than content. I also unified the card fonts to Lato to reduce how many font files the page loads. Normally I would settle changes like these with the designer, but the challenge told me to use my best judgment and explain it to the panel, so that is what I did.

![The How It Works section with four numbered cards, its numbers rendered as SVGs and its type unified to Lato.](/assets/uploads/2026/07/how-it-works-section-in-cards.webp)

## The interactive product section

Before I built the graphic animation in the hero section, I had built out the one here in the product section with the filtering and then stripped it down to what the hero section needed. It is an eyebrow and a title with no paragraph, and below that a canvas over a WebP with a row of toggle filters for humans, machines, AI agents, resources, and all of them at once. The canvas draws each type as a labeled dot sized by kind, which is the tagline made literal. "Atlas maps every identity-to-resource access path across your infrastructure in real time, for humans, machines, and AI agents, with policy and audit context on every edge." The animation respects prefers-reduced-motion. With motion allowed, the graph loads its nodes and then cycles through each filter on its own. I had to turn off the live announcement layer on it, because with a screen reader on and the user scrolled somewhere else on the page, it announced every filter change as it happened. With reduced motion turned on, nothing auto-rotates. The graph loads and the user clicks into each filter themselves.

![The interactive product section: a canvas access graph over a WebP with toggle filters for humans, machines, AI agents, and resources.](/assets/uploads/2026/07/the-product-section-with-product-interactive-graphic.webp)

## Testimonials, CTAs, and footer

The testimonial section, What Our Users Say, is an eyebrow, a title, and three cards, each with a quote. The markup is a blockquote inside a figure, which is the semantically correct structure for a quotation. Every card grid on the page, including this one, is a list, so a screen reader tells the user how many cards are in the section before it reads through them.

![The testimonials section with three quote cards, each marked up as a blockquote inside a figure.](/assets/uploads/2026/07/what-are-users-say-testimonial-section.webp)

The Get Started section has an eyebrow, a title, a paragraph, and two CTAs, one to request access and one to contact sales. In the Figma file, there is a section for the CTAs, but the CTAs in that section did not match what was actually being used in the primary file section. So I used the hover state from the component section with the CTAs, and then the static state colors from the primary Figma file. Typically, I would want to discuss this with the designer, but in alignment with the challenge, I decided to use my best judgment and then just discuss it during the panel call.

The footer has the logo, a short blurb, and three social links on the left, with four columns of site links on the right. In the Figma those columns were different widths; I standardized them with a CSS grid gap, which makes the footer a little wider but far more consistent. Claude first built the whole set of footer links as one giant list. I broke it into separate, labeled columns so a screen reader user can jump to the column they want, say the docs instead of the products, hear that column's heading and item count, and skip the rest. Below that is a horizontal rule, the copyright, and the legal links.

![The site footer, its four link columns standardized to a shared width with a CSS grid gap.](/assets/uploads/2026/07/footer-section.webp)

## Cutting the page weight

Once the page was built I looked at what it was shipping, and it was close to two and a half megabytes, most of it fonts. I optimized in two passes. First I cut how many fonts the page used: Inter dropped to a single SemiBold weight, used only for the canvas node labels, and everything else became Lato. Then I asked Claude whether there was a better way to shrink the files themselves, and it pointed me at subsetting the fonts with fonttools and brotli, keeping only basic Latin plus the handful of characters a marketing page actually uses, like smart quotes, dashes, and the ellipsis. That cut the font files by roughly 89%. I ran those tools once locally and committed the results, since the fonts were not going to change often on a challenge like this. Between the two passes the page dropped to around 800 kilobytes, and the hero node background brought it back up to about 950, still a long way down from where it started. I wrote up the font work in [its own article]({% post_url 2026-06-11-optimizing-self-hosted-fonts-with-fonttools-and-brotli %}).

![Chrome DevTools network panel before optimization, with the fonts dominating a payload near two and a half megabytes.](/assets/uploads/2026/07/before-optimization.webp)

![Chrome DevTools network panel after optimization, with the subset fonts and the payload down to roughly 950 kilobytes.](/assets/uploads/2026/07/after-optimization.webp)

## The request-access page

The challenge had an optional second page as a stretch goal, and I built a request-access page as a demo of what Teleport's real request-access landing could be. Their live version has a lot going on, with outbound links, a logo bar that hides and shows and blends white on white against the background, and accordions that drive the scrolling. All of that pulls focus off the form. On my version the only job of the page is to get the user to fill out the form, so I embedded the logo into the content, dropped the top bars, and turned the FAQ topics on the left into modals that only cover the left half of the page. The form on the right stays visible the whole time. The only ways off the page are the logo and the privacy policy. There are G2 and Gartner stars, but they show the rating without linking anywhere. The modal is a full dialog with a focus trap, escape to close, and focus returned where it came from, and the form validates on the client and requires a work email. It has no backend on purpose. The chrome-free page is what the second route group exists for.

![The request-access page with the form fixed on the right and FAQ topic tokens down the left side.](/assets/uploads/2026/07/request-access-form-with-token-models.webp)

![A FAQ topic opened as a modal that covers only the left half of the page, leaving the request-access form visible.](/assets/uploads/2026/07/wordcast-access-form-plus-open-mode.webp)

## Infrastructure and hardening

On the infrastructure side I deployed through the Vercel CLI, since Next.js and Vercel are what Teleport uses internally, and I shipped it as a static export. There is no Node server answering requests, which shrinks the attack surface, and the only real tradeoff is that on-page personalization would need that server back. Because the static export turns off Next's runtime image optimizer, I pre-optimized the images to WebP with the 1x and 2x variants and committed them. On the supply-chain side I leaned on pnpm. It enforces a seven-day cooldown before a package version is allowed in, blocks exotic sub-dependencies, and uses an allowlist so only two packages are ever permitted to run install scripts, along with exact-version pinning, a frozen lockfile, and store-integrity verification. Two more things are worth mentioning. The CI pins every GitHub Action to a full commit SHA, which closes the door on a tag being repointed under me, and the JSON-LD is run through a small helper that escapes the characters that could otherwise break out of a script tag.

## The panel discussion

A few things came up in the panel discussion. One panelist asked how the JavaScript behind the hero node background worked and picked a function I could not fully explain. Claude built that piece, and I had focused on the visual result and its cost to the page rather than reading every function. It probably counted against me. My take is that for a small, decorative element on a short-lived marketing page, as long as it does what I want and does not hurt the page, that's enough for me. To me it's not about understanding every line and every function for something that's purely a design element. It's primarily a matter of one, is this only what I need? And two, is this optimized and working the way I want. Without Claude, my path for something like that would have been CodePen anyway, where I would find something close, take the part I need, and drop it in.

They also asked about testing. My answer was no unit testing for a page like this. Marketing sites are short-lived, five years on average in my experience, and a redesign throws the tests out with the old build. I would do visual regression testing, the snapshot-and-compare kind that flags what looks broken, but test-driven development on a marketing site is overkill. When it was suggested that AI could write the tests, the way that I would push back on that is that using AI to write the tests isn't covering the full picture of what you would need to be testing. You need to understand what the AI is writing and testing so that you can cover any blind spots that it did not think about. It might also not be catching all the interactions that are happening on the front end of the website when you don't know truly what other components might be interacting with this. You still have to have a full QA process. Time spent doing QA work on testing could be better spent building out features, functionality, and content on the site to better sell the product. The same thinking applies to the stack. Next.js and Vercel are arguably heavier than a marketing site needs. A flatter, simpler static build is easier to secure and faster to serve, and since marketing teams rarely edit the site themselves, a static site fed by change requests through a project tool and an AI branch-and-review flow can replace a heavy CMS. The exception is real personalization, which is where things get complex.

There was also a question about content modeling. My written answer favored composable, reusable components over rigid per-section schemas or one monolithic type, modeling a page as an ordered list of section blocks with a single card type that uses a variant field instead of three near-identical ones. I had watched a cards component at Seismic grow unmaintainable by trying to be everything, so this was the concrete version of the same argument, that you do not need a heavy CMS for most of this.

## Accessibility and results

One accessibility item that I wanted to point out here is how I did the titles, the eyebrows, and how that gets read out by screen readers. The small eyebrow label is the real heading for each section, and the large display text under it is a paragraph styled to look like a heading. Reading the page by headings with VoiceOver, the short eyebrows on their own did not give enough context, so I appended the rest of the phrase to each eyebrow as visually hidden text and marked the big visual headline aria-hidden. Sighted users get the design the Figma asked for, and screen reader users get one clean, complete heading per section to navigate by.

![axe DevTools reporting zero accessibility issues for the page against WCAG 2.1 AA.](/assets/uploads/2026/07/axe-free-browser-extension-test.webp)

![A Lighthouse mobile run scoring 100 for performance, accessibility, best practices, and SEO.](/assets/uploads/2026/07/mobile-lighthouse-score.webp)

**Impact:** Built the full Atlas landing page and its interactive product and hero canvases in about twelve hours, from nothing, that first Friday. I spent roughly four hours on Saturday on optimization and another four on Sunday on accessibility testing. On Monday I sent off some questions, they came back with answers, and the next day I built the hero background animation. Most of the work landed in that first handful of days; the rest was adjustments and the request-access page, and the panel discussion itself came about three weeks after I started, once most of the build was done. Page weight came down from about 2.5MB to roughly 950KB and the font payload dropped about 89%. The result is a perfect axe score, zero issues against WCAG 2.1 AA, and a Lighthouse mobile run of 100 across performance, accessibility, best practices, and SEO, both wired into an automated check on every pull request.
