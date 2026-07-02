---
layout: content-page
title: Shell Scripting and macOS
permalink: /guides/shell-and-macos/
description: 'Shell scripts and macOS automation: reusable functions, command-line tricks, yabai tiling window management, and a one-command Mac setup.'
pillar: shell-macos
toc:
    - label: Brief
      anchor: '#top'
    - label: Shell scripting
      anchor: '#scripting'
    - label: macOS automation
      anchor: '#macos'
---

<p>If I do something on the command line more than a couple of times, I start thinking about how to stop doing it by hand. That instinct is the thread running through all of these articles. Most of them came straight out of my own workflow: a small annoyance, a few lines of shell, and a task that never needs my full attention again.</p>

<p>None of these scripts is impressive on its own. Stacked up over a few years, they make the machine work the way I think. The most complete version of this is my bootstrap script, which sets up an entire Mac from nothing in one command, but it started with exactly the kind of small one-off functions you'll find in the first section.</p>

<h2 id="scripting">Shell scripting</h2>

<p>Reusable shell techniques: writing functions that accept named or abbreviated arguments, switching Node versions automatically per project, and batch-converting files from the command line.</p>

{% include article-card-grid.html pillar='shell-macos' section='scripting' %}

<h2 id="macos">macOS automation</h2>

<p>Bending macOS to fit how I work: spacing out the Dock, hiding the desktop for screen shares, tiling windows with yabai, and automating a full machine setup with a single script.</p>

{% include article-card-grid.html pillar='shell-macos' section='macos' %}
