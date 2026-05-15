# DigitalBlake — Jekyll Site

Personal site built with Jekyll 4, deployed to GitHub Pages via GitHub Actions.

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — all other runtimes (Node, Ruby, pnpm, ImageMagick) run inside the container

## Setup

```bash
# Build the Docker image (first time, or after Dockerfile changes)
docker compose build

# Install Node and Ruby dependencies
docker compose run --rm app pnpm install
docker compose run --rm app bundle install
```

`pnpm install` automatically runs `husky` via the `prepare` script to set up the pre-commit hook.

## Development

```bash
docker compose up
```

This builds styles and scripts, then starts Jekyll with live reload on [http://localhost:4005](http://localhost:4005). Styles and scripts are watched for changes.

> **Note:** `docker compose up` is used here instead of `docker compose run` because only `up` publishes the declared ports to the host. `docker compose run` ignores port mappings by default, so the dev server would be unreachable at `http://127.0.0.1:4005`.

## Build

```bash
docker compose run --rm app pnpm run build
```

Optimizes images, compiles SCSS, bundles JS via webpack, hashes compiled assets for cache busting, then runs `bundle exec jekyll build`.

Individual steps:

```bash
docker compose run --rm app pnpm run build:images   # Optimize JPG/PNG in assets/images/ and assets/uploads/
docker compose run --rm app pnpm run build:styles   # Compile SCSS → assets/css/global-styles.min.css
docker compose run --rm app pnpm run build:scripts  # Bundle JS via webpack → assets/js/
```

### Asset manifest

After `build:styles` and `build:scripts`, the production build runs `node script/hash-assets.mjs` which creates content-hashed copies of all compiled CSS and JS files and writes `_data/asset_manifest.json`. Jekyll templates read this manifest for cache-busted asset URLs. The manifest file is excluded via `.gitignore` and always generated at build time.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys the site to GitHub Pages at:

[https://blake-c.github.io/jekyll-digitalblake.com-2025/](https://blake-c.github.io/jekyll-digitalblake.com-2025/)

## Configs

| File              | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `_config.yml`     | Production config (`baseurl: /jekyll-digitalblake.com-2025`)     |
| `_config.dev.yml` | Local dev override (`baseurl: ""`, `url: http://localhost:4005`) |

The dev server merges both configs automatically via `pnpm run dev`.

## Code Formatting

[Prettier](https://prettier.io/) is used for formatting with the `@shopify/prettier-plugin-liquid` plugin for Liquid templates.

```bash
docker compose run --rm app pnpm run format   # Format all files
```

A pre-commit hook (via [Husky](https://typicode.com/husky)) runs automatically before every commit via lint-staged:

- **gitleaks** — scans staged files for leaked secrets/API keys before lint-staged runs; blocks the commit if a secret is found
- **Prettier** — formats all files
- **ESLint** — lints and auto-fixes JS/MJS files
- **`stylelint`** — lints and auto-fixes SCSS files
- **ImageMagick** — optimizes any staged JPG/PNG in `assets/images/` or `assets/uploads/` and creates WebP counterparts where missing

## Project Structure

```
_data/          # YAML data files (authors, navigation, etc.)
_github_projects/  # GitHub project data for homepage and /coding-projects/ archive
_includes/      # Reusable HTML/Liquid partials
_layouts/       # Page layout templates
_plugins/       # Custom Jekyll plugins (author pages)
_posts/         # Blog posts (Markdown)
_case_studies/  # Case study portfolio data for homepage
assets/         # Compiled/static assets (CSS, JS, images, uploads)
coding-projects/   # Dedicated archive page for GitHub/coding projects
script/         # Build scripts (image optimization, asset hashing)
theme_components/
  js/           # JS source files
  sass/         # SCSS source files
```

## Security notes

`_case_studies/*.md` body content is rendered as raw HTML inside the homepage gallery modal (see [`_includes/case-studies.html`](_includes/case-studies.html)). The collection is treated as trusted, first-party content. Do **not** accept outside contributions to `_case_studies/` without first sanitizing or escaping the body — a malicious entry would execute as inline HTML/JS on every page that embeds the gallery.

## Syntax Highlighting

Rouge (Jekyll's default) is disabled. [Prism.js](https://prismjs.com/) handles syntax highlighting and line numbers, loaded via webpack with the following plugins: `line-numbers`, `autolinker`, `show-language`, `normalize-whitespace`, `copy-to-clipboard`.
