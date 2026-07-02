---
layout: content-page
title: WordPress and PHP Development
permalink: /guides/wordpress-and-php/
description: 'The standards, language features, and tooling behind fifteen years of WordPress and PHP work: PHPCS and WPCS, PHP language features, Composer, and editor setup.'
pillar: wordpress-php
toc:
    - label: Brief
      anchor: '#top'
    - label: Coding standards
      anchor: '#standards'
    - label: Language and dependencies
      anchor: '#language'
    - label: Editor workflow
      anchor: '#editor'
---

<p>WordPress and PHP have been the center of my work for most of my career. Fifteen years of it, across agencies and in-house teams, building and migrating sites that other people had to maintain long after I moved on. The deep client work, the custom Gutenberg blocks and the thousand-page migrations, lives in my case studies. This guide is the groundwork underneath it: the standards, the language, and the tooling that keep WordPress and PHP work maintainable.</p>

<p>The platform makes it very easy to write code that works and is a mess to maintain. Knowing the API is the easy part. The developers worth having on a team hold themselves to consistent standards and set up tooling that catches mistakes before a human reviewer has to.</p>

<h2 id="standards">Coding standards</h2>

<p>When you work on a team, "good code" has to be a standard a tool enforces, so reviews are about logic instead of brace placement. These cover setting up PHP_CodeSniffer and the WordPress Coding Standards so the linter flags problems while you type.</p>

{% include article-card-grid.html pillar='wordpress-php' section='standards' %}

<h2 id="language">Language and dependencies</h2>

<p>The PHP language features worth knowing and the Composer commands I reach for to manage dependencies across projects.</p>

{% include article-card-grid.html pillar='wordpress-php' section='language' %}

<h2 id="editor">Editor workflow</h2>

<p>Small editor investments that pay back every day. Custom snippets for the boilerplate you type over and over.</p>

{% include article-card-grid.html pillar='wordpress-php' section='editor' %}
