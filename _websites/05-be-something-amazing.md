---
layout: website-case-study
featured: true
permalink: /projects/be-something-amazing/
title: Be Something Amazing
description: 'A Drupal 7 career exploration site with a full visual redesign and an interactive JavaScript filterable grid for discovering skilled-trade career paths — under 1 second on launch.'
thumbnail: /assets/uploads/2025/05/besomethingamazing-thumbnail.webp
image: /assets/uploads/2025/05/besomethingamazing-full-screenshot.webp
hero_image: /assets/uploads/2025/05/besomethingamazing-hero.webp
og_image: /assets/uploads/2025/05/besomethingamazing-og.webp
agency: Gray Digital Group
team:
    - name: Richard Baugh
      role: Production Director
    - name: Blake Cerecero
      role: Designer/Developer
link: https://web.archive.org/web/20201126100255/https://besomethingamazing.com/
link_text: View Archived Site
tech:
    - Drupal 7
    - PHP
    - MixItUp
    - SCSS
---

Be Something Amazing is a career-exploration site for the South Carolina Hospital Association, built on Drupal 7. The agency received the project on an older version of Drupal, and I was the only person on the team with Drupal experience, so I took on both the design and the development. The scope was a reskin rather than a full rebuild: the homepage, career quiz, career finder, and news articles got a new visual layer, while some sections of the site still reflect the original design underneath.

The homepage opens after the main navigation with a full-bleed video banner overlaid with the site's mission statement. The video is served directly from the server in three formats, MP4, OGG, and WebM, without using YouTube or Vimeo, which kept playback fast and gave us complete control over the loop. Getting the loop right took real work. We cut and trimmed the video until it cycled back to the beginning without any visible stutter or jump. On wide viewports the client had a specific callout: they did not want the banner to grow too tall or the video to clip at the sides. I capped the banner height and constrained the video to a max width, keeping it centered with decorative bars filling the margins.

Below the hero is the Find Your Path section, which previews the career quiz and routes visitors into it. The rest of the homepage continues with full-bleed design images, a professional testimonials block, a second full-bleed background section, a blog article feed, additional imagery, and a follow button. At the bottom, a "Tell us about yourself" form handles the closing call to action. The form labels sit inside each input field. When the user clicks into a field the label animates up above it smoothly.

![Find Your Path homepage section linking to the career quiz on Be Something Amazing](/assets/uploads/2025/05/be-something-amazing-find-your-path-homepage-widget-takes-you-to-the-quiz.webp)

The career quiz is a four-section questionnaire I built inside Drupal. Each section presents radio-button choices, not free-text fields, so the system can always match the user's input against the careers in the database. On completion, the user lands on a summary page listing matched careers and their average salaries. I pressed the client on one specific requirement: the quiz only holds up if there is always at least one result at the end. A career quiz that returns nothing is a broken experience, so we treated the size and variety of the career library as a hard requirement and made sure any combination of answers would produce at least one match.

![Be Something Amazing career quiz with four sections and a results summary at the end](/assets/uploads/2025/05/be-something-amazing-find-your-path-career-quiz.webp)

The career finder page uses the Drupal API to pull all career listings into a grid on a single page. Filter controls at the top let visitors narrow by category, and MixItUp handles the animation. Careers shuffle in and out instantly with no page reloads, and the transitions are smooth enough that the filtering feels more like a UI effect than a data fetch.

Beyond the quiz and finder, the site includes informational pages covering the reasons to pursue a healthcare career. These sit within the same visual system and use Drupal Views to manage their layouts.

![Be Something Amazing why healthcare interior page](/assets/uploads/2025/05/be-something-amazing-why-healthcare-page.webp)

The professional testimonials block on the homepage pulls from a dedicated testimonials section with quotes from people currently working in healthcare careers.

![Professional testimonials section on the Be Something Amazing homepage](/assets/uploads/2025/05/be-something-amazing-professional-testimonials-on-homepage.webp)

Drupal's built-in page and block caching kept load times down without any custom work on that front. We added Cloudflare on top for a CDN, additional caching, and network-level protection. The Drupal Views module handled all of the custom content layouts across the site. The site has since been redesigned and rebuilt by another team. The Wayback Machine link in the project footer points to an archived snapshot of the version I built.

**Impact:** Solo design and development. Self-hosted looping video hero served in MP4, OGG, and WebM. Career quiz built in Drupal with radio-button inputs and guaranteed result coverage across all answer combinations. Career finder powered by the Drupal API and MixItUp with instant, animated filtering. Cloudflare CDN layered on Drupal's native caching. The archived version linked above reflects this build.
