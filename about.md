---
layout: content-page
title: Blake Cerecero
permalink: /about/
description: 'Senior web developer with 15 years building fast, accessible sites on WordPress, Drupal, Sitecore, and beyond.'
show_recommendations: true
profile_schema: true
---

In university, my plan was to major in astronomy, but after the 2008 financial crisis happened, I decided I was done taking out student loans, so I went back to Northwest Vista College and focused on Digital Media and web development. While I was there, I worked as a lab tech in the Digital Media department, where students came to me when they were stuck. In every subsequent job I've had since Vista, it's been my role to figure things out and make things work.

I've been experimenting with and using AI tooling to further my own knowledge and expertise in how to build modern [web-accessible](/2026/07/24/web-accessibility-standards-and-law-wcag-eaa-us/) sites. I'm currently building sites in Next.js and Sanity CMS; check out the [Teleport Atlas](/case-studies/teleport-atlas/) case study. Since leaving Seismic I've kept building [coding projects](/coding-projects/) and writing [articles](/articles/), and my former colleagues have shared many [kind words](/recommendations/) about working with me.

## Career

<div class="career-timeline">
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Northwest Vista College, 1.25 years</p>
		<p class="career-timeline__role">Lab Tech, Digital Media &amp; Cinematography</p>
		<p class="career-timeline__description">Assisted students with software and equipment questions, managed lab operations, installed and maintained workstations, and organized the equipment library. First exposure to what it means to be the person who figures things out. My manager Alan Garner told me I was never allowed to say no. I was always supposed to find the solution to any issues that appeared, even if it meant finding someone else who knew the answer to them.</p>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">PPDG (Professional Performance Development Group), 1 year</p>
		<p class="career-timeline__role">Web Developer and Designer (Webmaster)</p>
		<p class="career-timeline__description">Built and maintained the company's public-facing site in Joomla, which accepted resumes from medical personnel seeking placement at military facilities. Designed and developed an employee portal that let 600+ field employees log in, view required documents, and submit completed forms directly into the HR system. Rebuilt the Plaza Lecea event center website for easy content management. Trained 30+ HR professionals on the portal after launch, running multiple sessions until the team was fully self-sufficient.</p>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Gray Digital Group, 8 years</p>
		<p class="career-timeline__role">Web Developer</p>
		<p class="career-timeline__description">Worked across 30+ client sites spanning WordPress, Drupal, Joomla, Sitefinity, and dotCMS. Led the full project lifecycle on many engagements, from initial client meetings through wireframes, design iterations, development, and post-launch training. Clients ranged from small businesses to hospitals, law firms, podcast networks, medical research centers, and land companies. Regularly consulted with account executives, senior developers, and partners to solve problems no one else wanted to touch. Trained clients on their CMS after every launch.</p>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">Seismic, 3.5 years</p>
		<p class="career-timeline__role">Web Developer, promoted to Senior Web Developer</p>
		<p class="career-timeline__description">Joined during a high-stakes rebrand: a six-month project compressed into three, with a cross-functional team of 20+ across development, design, content, SEO, and brand. In the middle of this project, I transitioned from creating new code to leading the QA triage for new pages. Phase one launched about 40 pages, and later phases rebuilt the blog, enablement explainers, and resources, bringing the rebuild to about 1,000 pages. The 2022 launch drove a 50% increase in site visitors. Built custom Gutenberg blocks, led the migration from TranslatePress to WPML, and trained three content producers from our agency partner and the French and German page content editors, each as their own team, on the new localization workflow. A second 1,000-page rebuild followed in 2025, this time in Sitecore. I was the internal lead developer on it, working with an external agency that had its own lead developer, developers, and designers. When the agency couldn't do all the coding work we needed, I stepped in to build several blog components in Sitecore myself, ramping up on TypeScript, GraphQL, and Tailwind under a live deadline. It required a reverse proxy, which I set up with the IT team, to keep the site live through cutover. The 2022 rebuild brought page loads down to 1 to 2 seconds. New features and tracking tools pushed them back up to 2 to 3 seconds over time, and the move to Sitecore brought them back to 1 to 2 seconds. When our WordPress agency partner transitioned off the project, they and I documented every development standard, analytics configuration, and production workflow we had, then trained the internal team of 6 from the Seismic India office. Over my time there, I documented and handed off work to 2 agency partners.</p>
	</div>
	<div class="career-timeline__item">
		<p class="career-timeline__employer">How can I assist your organization?</p>
		<p class="career-timeline__role">Senior Web Developer</p>
		<p class="career-timeline__description">Currently available for full-time or contract roles. Remote-first, flexible schedule.</p>
	</div>
</div>

## What I do best

Architect CMS projects that allow non-technical users to work independently. Custom Gutenberg blocks, complex migrations that don't drop search rankings, API integrations eliminating double data entry tasks, and front-ends built to allow the next developer to move the work forward. Having conducted interviews, trainings, and team meetings, I've become comfortable speaking truthfully in front of my teams in order to get the best results for our stakeholders.

## How I work

Every project I've run started with client or stakeholder meetings to work out what the site has to accomplish, followed by wireframes and design iterations before any code was written. On the build, I read the design spec first and flag anything that will cause a development problem, then implement the component, build a full page with it, and send it back for stakeholder review before it launches. QA and testing is a step of its own covering browser support, HTML validation, script errors, and usability.

When I'm reviewing AI code, I'm more concerned about items that have security risks or high-impact implications to the project as a whole. Just like with individual tasks you work on throughout your day, you need to be cognizant of the ordering you choose and pick your battles. For low-risk components, such as a purely decorative item, I'm not nearly as concerned. For instance, the supply-chain implications of using pnpm over npm and [supply-chain hardening](/2026/05/15/supply-chain-attacks-got-smarter/) are things I'm more diligent on, as opposed to a hero background, which is purely decorative. Follow the design system, follow the specifications, build for performance and optimize for the user, but triple check the things that have high impact. That is my driving goal.

After launch I document the development standards, the analytics configuration, and the production workflows, then train the people who will be running the site. That has meant 30+ HR professionals at PPDG, client groups of 1 to 30 at Gray Digital Group, three agency content producers and the French and German content editor teams at Seismic, and the internal team of 6 from the Seismic India office that took over seismic.com.

### Testing

If you're building an application that has business logic and it's going to be long-lived and you need to make sure that it's doing exactly what it needs to do and nothing more, unit testing is needed there. Before I added Playwright and `node:test` to [my own site](/2026/09/08/the-impacts-of-regression-testing/), I didn't think testing a marketing site was worth the cost to implement. The tests turned up issues I didn't realize existed, including a broken JSON-LD block on the case studies, a layout shift on the case study pages, and WCAG 2.1 AA violations, and I've come around to a more favorable view of regression testing. I'd test the high-priority items, such as a request-a-demo form that feeds the sales pipeline, and leave the rest to manual testing.

I've had discussions with other developers who say you can just have AI write the testing for you. However, the AI tool might not be testing the right thing, and you still need to understand what's being tested in the first place. Testing isn't always about whether it's doing what I need it to do; it's about the edge cases, and the AI tool might not pick up on those. It is a developer's job to make sure things are getting done correctly, not just that they are done.

## What I'm looking for

Remote-first work with a flexible schedule. In-house, agency, or contract. Open to the right problem.

**Outside of work:** I spend a lot of time on YouTube and experimenting with AI tools, plus whatever apartment project I've decided I should probably finally finish.

<p class="resume-actions">
	<a class="button button--primary" href="{{ '/resume/' | relative_url }}">View my resume</a>
</p>
