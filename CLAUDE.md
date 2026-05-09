# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Accessing Node / npm

Node is managed via **nvm** and is not on `PATH` by default. Source nvm before running any `npm` or `node` command:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npm <command>
```

## Commands

```bash
# Install dependencies (first time / after Gemfile or package.json changes)
bundle install
npm install

# Start dev server with live reload at http://localhost:4005
npm run dev

# Production build (images → styles → scripts → hash assets → jekyll build)
npm run build

# Individual build steps
npm run build:images   # Optimize JPG/PNG and generate WebP variants via ImageMagick
npm run build:styles   # Compile SCSS to assets/css/ and _includes/ (critical CSS)
npm run build:scripts  # Bundle JS via webpack to assets/js/

# Code quality
npm run lint           # ESLint + stylelint
npm run lint:fix       # Auto-fix JS and SCSS issues
npm run format         # Prettier (all files)

# HTML validation (run after jekyll build)
bundle exec htmlproofer ./_site
```

## Architecture

This is a **Jekyll 4.4.1** blog/portfolio deployed to GitHub Pages. The asset pipeline runs outside Jekyll: SCSS → webpack → hash-assets → then Jekyll builds.

### Config files

Two Jekyll configs are used:

- `_config.yml` — production (baseurl: `/jekyll-digitalblake.com-2025`)
- `_config.dev.yml` — development override (baseurl: `""`, port 4005); merged automatically by `npm run dev`

### Asset pipeline

1. **SCSS** (`theme_components/sass/`) compiles three entry points:
    - `global-styles.scss` → `assets/css/global-styles.min.css`
    - `critical-styles.scss` → `_includes/critical.min.css` (inlined in `<head>`)
    - `prism-styles.scss` → `assets/css/prism.min.css`
2. **Webpack** (`theme_components/js/`) bundles two entry points → `assets/js/`
3. **`script/hash-assets.mjs`** fingerprints compiled CSS/JS with SHA256 hashes and writes `_data/asset_manifest.json` (gitignored); templates reference hashed filenames via this manifest

### Content collections

| Directory            | Purpose                                              | Jekyll output |
| -------------------- | ---------------------------------------------------- | ------------- |
| `_posts/`            | Blog posts (articles, snippets)                      | Yes           |
| `_websites/`         | Portfolio entries rendered in homepage gallery modal | No            |
| `_websites_archive/` | Archived portfolio entries                           | No            |
| `_github_projects/`  | GitHub project cards on homepage                     | No            |

**`_websites/` body content is rendered as raw HTML** in the homepage modal — treat as trusted first-party content only.

### Post front matter

```yaml
---
layout: post
title: 'Title'
description: 'SEO description'
date: YYYY-MM-DD HH:MM:SS -0500
modified_date: YYYY-MM-DD HH:MM:SS -0500 # optional
categories: ['Category']
tags: ['tag1', 'tag2']
image: '/assets/uploads/YYYY/MM/filename.webp'
author: 'author_slug' # optional, defaults to site.author.id
---
```

New post filenames follow the pattern `YYYY-MM-DD-slug.md`. Use the current date/time in America/Chicago (CT) for both the filename and `date` field.

### Authors

Defined in `_data/authors.yml`. The custom plugin `_plugins/author_pages.rb` generates paginated author archive pages at build time.

### Syntax highlighting

Rouge is disabled. **Prism.js** handles all syntax highlighting via webpack with plugins: `line-numbers`, `autolinker`, `show-language`, `normalize-whitespace`, `copy-to-clipboard`.

### Pre-commit hooks

Husky runs lint-staged on commit:

- Prettier formats all staged files
- ESLint auto-fixes staged JS/MJS
- stylelint auto-fixes staged SCSS
- ImageMagick optimizes staged images and auto-generates WebP variants

### CI/CD

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`: installs deps → builds styles/scripts → hashes assets → `jekyll build` → `htmlproofer` → deploys to GitHub Pages.
