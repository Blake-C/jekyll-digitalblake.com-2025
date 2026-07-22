---
layout: content-page
title: Front-End Performance
permalink: /guides/front-end-performance/
modified_date: 2026-07-21 20:04:04 -0500
description: 'Making the browser side fast: subsetting and compressing web fonts, and keeping critical CSS small and correct, with the real fixes behind a quick-loading site.'
pillar: front-end-performance
toc:
    - label: Brief
      anchor: '#top'
    - label: Fonts
      anchor: '#fonts'
    - label: CSS and rendering
      anchor: '#rendering'
---

<p>In my career, I've worked on a lot of sites, and the ones that have always gotten the most recognition from our clients are the ones that performed very well. To get a site to perform that well, you have to dig down into the details of what CSS you're delivering, what JavaScript you're not delivering, and how you can perform well in search engines and give the most information to web crawlers to surface website data.</p>

<p>On this page, I'm going to start accumulating articles associated with this process. The first two are a story about optimizing your fonts for the language your site is being delivered in, and a fix for the Prism plugin that I use on this website, including how to modify your CSS to ensure content renders properly with this plugin. In the future, this pillar page will grow with new articles specific to front-end performance, optimization, and front-end technologies.</p>

<h2 id="fonts">Fonts</h2>

<p>Self-hosted fonts are easy to ship whole, glyphs and all. Subsetting them to the characters a page actually renders, then compressing to WOFF2 with Brotli, is the highest-leverage payload cut available.</p>

{% include article-card-grid.html pillar='front-end-performance' section='fonts' %}

<h2 id="rendering">CSS and rendering</h2>

<p>Inlining critical CSS speeds up the first paint, but it also changes when and how later styles load, which can break things in ways that only show up at runtime. This is one of those cases, traced and fixed.</p>

{% include article-card-grid.html pillar='front-end-performance' section='rendering' %}
