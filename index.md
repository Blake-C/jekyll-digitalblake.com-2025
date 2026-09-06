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
                    <p class="line-2">JavaScript · PHP & WordPress · React & Next.js</p>
                    <p class="line-3">Over 15 years I've worked on 30+ CMS projects across agency and in-house roles, including two 1,000-page migrations, cutting 5 second page loads to the 1 second range. The 2022 rebuild of seismic.com increased visitor traffic by 50% in the first year.</p>
                    <div class="intro__cta">
                        {%- include email-link.html label="Email me" class="button button--primary-light" -%}
                        <a
                            href="https://www.linkedin.com/in/blakecerecero/"
                            class="button button--secondary-light"
                            target="_blank"
                            rel="noreferrer noopener"
                        >LinkedIn<span class="show-for-sr"> (opens in a new tab)</span></a>
                        <a href="#code-samples" class="button button--secondary-light">Coding Projects</a>
                    </div>
                </div>
            </div>
            <div class="large-5 columns intro__headshot-column">
                <div class="intro__headshot">
                    <picture>
                        <source srcset="{{ '/assets/images/profile-2022-v3.webp' | relative_url }}" type="image/webp">
                        <img
                            src="{{ '/assets/images/profile-2022-v3.webp' | relative_url }}"
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

    {%- include recommendations.html -%}

</main>
