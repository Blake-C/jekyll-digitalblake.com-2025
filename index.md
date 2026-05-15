---
layout: base
title: Home
permalink: /
description: 'Senior web developer with 15 years building fast, accessible sites on WordPress, JavaScript, PHP, and beyond.'
preload_image: /assets/images/header-background.webp
preload_image_mobile: /assets/images/header-background-sm.webp
---

<main id="content">
    <section class="intro">
        <div class="row align-middle">
            <div class="large-7 medium-12 small-12 columns">
                <div>
                    <p class="intro__availability">
                        <span class="intro__availability-dot" aria-hidden="true"></span>
                        Open to new opportunities
                    </p>
                    <h1 class="title">Blake Cerecero</h1>
                    <p class="line-1">Senior Web Developer</p>
                    <p class="line-2">WordPress · JavaScript · PHP</p>
                    <p class="line-3">30+ CMS projects across agency and in-house roles, with consistent improvements in site speeds going down from 5-3 seconds to 2-1 seconds. I've been involved in multiple 1,000 page migrations across my 15 year career seeing 50% increase in organic traffic after massive site overhauls.</p>
                    <div class="intro__cta">
                        <a
                            href="https://www.linkedin.com/in/blakecerecero/"
                            class="button button--primary-light"
                            target="_blank"
                            rel="noreferrer noopener"
                        >Get in touch</a>
                        <a href="#code-samples" class="button button--secondary-light">Coding Projects</a>
                    </div>
                </div>
            </div>
            <div class="large-5 columns intro__headshot-column">
                <div class="intro__headshot">
                    <picture>
                        <source srcset="{{ '/assets/images/profile-2022-v3.webp' | relative_url }}" type="image/webp">
                        <img
                            src="{{ '/assets/images/profile-2022-v3.jpg' | relative_url }}"
                            alt="Blake Cerecero, Senior Web Developer"
                            width="400"
                            height="400"
                            class="intro__headshot-img"
                            loading="eager"
                            fetchpriority="low"
                        >
                    </picture>
                </div>
            </div>
        </div>
    </section>

    {%- include coding-projects.html featured_only=true -%}

    {%- include case-studies.html featured_only=true -%}

    {%- include recent-articles.html -%}

    {%- include testimonials.html -%}

</main>
