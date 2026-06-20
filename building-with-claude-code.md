---
layout: content-page
title: Building with Claude Code
permalink: /guides/building-with-claude-code/
description: 'How I build, debug, and customize real software with Claude Code, including native macOS apps in a language I do not know. A running index of the projects and write-ups.'
pillar: claude-code-ai
toc:
    - label: Brief
      anchor: '#top'
    - label: Apps I have built
      anchor: '#apps'
    - label: Customizing the tooling
      anchor: '#tooling'
    - label: Lessons learned the hard way
      anchor: '#lessons'
---

<p>I am a web developer. Fifteen years of CMS work, mostly WordPress, Drupal, and Sitecore, with the PHP and JavaScript that holds those together. Swift was never on that list. AppKit and SwiftUI were not either. And yet a good chunk of what I have built in the last year is native macOS software written in exactly those tools. The reason is Claude Code.</p>

<p>This page collects everything I have built and written about building with Claude Code in one place. If you want to know how I actually work with an AI coding tool, not the demo-day version but the real one with specs, dead ends, and the occasional self-inflicted disaster, this is the index for that.</p>

<h2>How I actually use it</h2>

<p>I do not treat Claude Code as a vending machine where you drop in a prompt and collect a finished app. I treat it as a collaborator that needs a clear brief and a tight feedback loop. Every project of any size starts with a <code>project.md</code> file: a written spec of what the thing needs to do, broken into features. I keep that file updated as the work moves, so Claude has the history and the current target in one place instead of relying on a conversation that scrolls away.</p>

<p>From there it is iteration. I describe a feature, review what comes back, run it, and report what actually happened. The clearer I am about the goal and the constraints, the better the output. That is not so different from briefing a junior developer, except the loop is measured in seconds and I am the one responsible for catching the mistakes before they ship. Knowing what good code looks like still matters. Claude writes faster than I can, but I am the one who decides whether what it wrote is right.</p>

<p>What this unlocked is reach. I had clear pictures in my head of small tools I wanted, things that did not exist in quite the shape I needed, and the only thing standing between me and them was a language I did not know. That barrier is mostly gone now. I can describe a native macOS app precisely enough, and between my judgment about how software should behave and Claude handling the Swift, the app gets built.</p>

<h2>What this says about how I work</h2>

<p>I think the way a developer adopts a tool like this says more than the tool does. I did not wait for permission or for the workflow to be perfect. I had a problem, I reached for the best available way to solve it, and I learned the workflow by doing it on real projects. When the official Claude Code VS Code extension had defaults that did not match how I work, I did not file a feature request and wait. I built a companion extension that patches it. When my shell startup was slow and Claude Code kept losing track of my Node version, I profiled it and fixed it. That instinct, find the route or build it, is the same one I have brought to every CMS migration and client problem in my career.</p>

<p>It also keeps me honest. Not everything here is a polished release. Some of it is proof of concept. And one of these write-ups is the night I let an LLM refactor my dotfiles without watching closely enough and booted straight into Recovery Mode. I left that one in on purpose. Working with these tools well means knowing exactly where they will hurt you, and the only way to learn that is to get hurt once and write it down.</p>

<h2 id="apps">Apps I have built</h2>

<p>Real, working software built with Claude Code as the collaborator. Two of these are native macOS apps written in Swift, a language I do not know, driven entirely by a clear spec and a tight review loop.</p>

{% include article-card-grid.html pillar='claude-code-ai' section='apps' %}

<h2 id="tooling">Customizing the tooling</h2>

<p>Using a tool heavily means sanding down the parts that do not fit. These are the times I changed Claude Code and its environment to match how I work instead of the other way around.</p>

{% include article-card-grid.html pillar='claude-code-ai' section='tooling' %}

<h2 id="lessons">Lessons learned the hard way</h2>

<p>The honest part. What happens when you hand an LLM too much trust and not enough supervision, and what I took away from it.</p>

{% include article-card-grid.html pillar='claude-code-ai' section='lessons' %}
