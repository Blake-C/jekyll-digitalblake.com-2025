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

<p>Here is the thing I have learned about WordPress development specifically. The platform makes it very easy to write code that works and is a mess to maintain. The difference between a WordPress developer you want on a team and one you do not is rarely about knowing the API. It is about discipline: consistent standards, code the next person can actually read, and a setup that catches mistakes before a human reviewer has to.</p>

<p>That is what these articles are about. None of them are flashy. They are the unglamorous foundation that makes everything built on top of it hold up.</p>

<h2 id="standards">Coding standards</h2>

<p>When you work on a team, "good code" cannot be a matter of opinion. It has to be a standard that a tool enforces, so reviews are about logic instead of brace placement. These cover setting up PHP_CodeSniffer and the WordPress Coding Standards so the linter flags problems while you type.</p>

{% include article-card-grid.html pillar='wordpress-php' section='standards' %}

<h2 id="language">Language and dependencies</h2>

<p>The PHP language features worth knowing and the Composer commands I reach for to manage dependencies across projects.</p>

{% include article-card-grid.html pillar='wordpress-php' section='language' %}

<h2 id="editor">Editor workflow</h2>

<p>Small editor investments that pay back every day. Custom snippets for the boilerplate you type over and over.</p>

{% include article-card-grid.html pillar='wordpress-php' section='editor' %}
