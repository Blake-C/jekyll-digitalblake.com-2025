---
layout: content-page
title: Docker and Linux
permalink: /guides/docker-and-linux/
description: 'Reproducible dev environments with Docker, plus standing up Ubuntu and Arch Linux from the command line.'
pillar: docker-linux
toc:
    - label: Brief
      anchor: '#top'
    - label: Docker
      anchor: '#docker'
    - label: Linux environments
      anchor: '#linux'
---

<p>Almost every project I work on now runs inside Docker, including this site. The reason is simple: the environment that runs on my machine should be the same one that runs in production, and the same one a teammate gets when they clone the repo. No more "works on my machine." The container is the machine, and it is identical for everyone.</p>

<p>It did not start that clean. These articles trace the path from learning Docker as a set of notes and aliases to running full Linux environments for real project setups, including helping a coworker stand up a Windows machine and configuring Arch from scratch. The recent version of this discipline shows up in my Core WP starter and in this Jekyll site, both of which boot a complete containerized stack on the first command.</p>

<h2 id="docker">Docker</h2>

<p>The foundation: what Docker is, the commands worth committing to muscle memory, and the shell aliases I use to make the daily container work less tedious.</p>

{% include article-card-grid.html pillar='docker-linux' section='docker' %}

<h2 id="linux">Linux environments</h2>

<p>Standing up a Linux box from the command line: a full Ubuntu-on-Windows setup through WSL, creating and configuring users, and installing a working toolchain on Arch.</p>

{% include article-card-grid.html pillar='docker-linux' section='linux' %}
