# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Writing

Load the `plain-prose` skill before drafting or editing any post, case study, or page copy. It holds the rules and the correction examples.

No published post is a style model. Do not read an existing article to match its voice. The two 2026-07-27 Sanity articles were corrected by hand and come close, but tells survived in both, and everything published before them predates those corrections. Use `~/.claude/skills/plain-prose/references/examples.md` instead.

The `prose-lint` hook runs on every markdown write and blocks on the mechanical tells. It cannot see metaphor or clever closers, so it is a backstop and not the check.

### Corrections to published articles

A substantive factual error in a published article gets a dated correction note listing what was wrong. Bump `modified_date` so the update surfaces in the visible label, in `article:modified_time`, and in the JSON-LD `dateModified`.

A prose-only cleanup gets no note and no date bump.

The dividing line is whether a reader who saw the earlier version would act differently.

Tooling that has changed since publication is not an error. Keep the dated account, add a short dated note saying what changed, and do not rewrite the section to match current behavior. See rule 29 in the `plain-prose` skill.

## Runtime isolation

All Node and Ruby commands run inside Docker. The container image bundles Node 24.18.0, Ruby 3.4.10, pnpm, ImageMagick, fonttools (`pyftsubset`, for font subsetting), and git. The project directory is bind-mounted into the container so your editor and git remain on the host.

## Commands

```bash
# Build the Docker image (first time, or after Dockerfile changes)
docker compose build

# Install dependencies (first time / after Gemfile or package.json changes)
docker compose run --rm app pnpm install
docker compose run --rm app bundle install

# Start dev server with live reload at http://localhost:4005
docker compose up

# Production build (images → thumbnails → fonts → styles → scripts → hash assets → jekyll build)
docker compose run --rm app pnpm run build

# Individual build steps
docker compose run --rm app pnpm run build:images      # Optimize JPG/PNG and generate WebP variants
docker compose run --rm app pnpm run build:image-dimensions  # Measure image sizes → _data/image_dimensions.json (for width/height injection)
docker compose run --rm app pnpm run cache:thumbnails  # Cache YouTube thumbnails locally as WebP
docker compose run --rm app pnpm run build:fonts       # Subset Montserrat variable TTF → WOFF2 (--emit to write)
docker compose run --rm app pnpm run build:styles      # Compile SCSS to assets/css/ and _includes/ (critical CSS)
docker compose run --rm app pnpm run build:scripts     # Bundle JS via webpack to assets/js/

# Search Console (on-demand, local only — needs a service-account key, see below)
docker compose run --rm app pnpm run sync:search-console   # Pull GSC data → tmp/search-console/report.{json,md}

# Code quality
docker compose run --rm app pnpm run lint           # ESLint + stylelint
docker compose run --rm app pnpm run lint:fix       # Auto-fix JS and SCSS issues
docker compose run --rm app pnpm run format         # Prettier (all files)

# HTML validation (run after jekyll build)
docker compose run --rm app pnpm run check:html    # what CI runs: internal links only
docker compose run --rm app pnpm run check:links   # adds external links, minus known bot-blockers
```

`check:html` matches `.github/workflows/deploy.yml` exactly, so a pass here means CI passes. `check:links` also hits the network. Its `--ignore-urls` list covers hosts that refuse automated requests (LinkedIn answers 999, CodePen/npm/claude.ai/linoxide/Businesswire answer 403) plus `youtube-nocookie.com`, which appears only as a `preconnect` resource hint in `_includes/head.html` and is not a navigable URL. Those links are fine in a browser; without the list they bury real failures under several hundred false ones.

The list also skips `https://digitalblake.com` itself. Those URLs only ever appear in generated `canonical`/`og:url` tags, never in post bodies, so fetching them tests whether a page is deployed yet rather than whether the build is correct: every unmerged post 404s by definition. Internal links are already covered by `check:html`, which walks them as relative paths.

Both checks should report zero. Anything either one reports is worth reading.

## Architecture

This is a **Jekyll 4.4.1** blog/portfolio deployed to GitHub Pages. The asset pipeline runs outside Jekyll: SCSS → webpack → hash-assets → then Jekyll builds.

### Config files

Two Jekyll configs are used:

- `_config.yml` — production (baseurl: `""`, `url: https://digitalblake.com`; served from a custom domain via the `CNAME` file)
- `_config.dev.yml` — development override (`url: http://localhost:4005`, port 4005); merged automatically by `pnpm run dev`

The dev server builds to `_site_dev`, not `_site`. It rebuilds on every file change, and `jekyll serve --host 0.0.0.0` overrides `url`, so when the two shared a directory a running dev server would overwrite a production build seconds after it finished and leave `http://0.0.0.0:4005` in the canonical, `og:url`, and feed tags. Keeping the destinations separate means `htmlproofer ./_site` always reads production output. `_site_dev/` is listed in both `.gitignore` and the `exclude:` list in `_config.yml`; the exclude is required, since Jekyll only auto-excludes its own destination and would otherwise copy the whole dev site into `_site`.

### Asset pipeline

1. **SCSS** (`theme_components/sass/`) compiles three entry points:
    - `global-styles.scss` → `assets/css/global-styles.min.css`
    - `critical-styles.scss` → `_includes/critical.min.css` (inlined in `<head>`)
    - `prism-styles.scss` → `assets/css/prism.min.css`
2. **Webpack** (`theme_components/js/`) bundles two entry points → `assets/js/`
3. **`script/hash-assets.mjs`** fingerprints compiled CSS/JS and the shipped WOFF2 fonts with SHA256 hashes and writes `_data/asset_manifest.json` (gitignored); templates reference hashed filenames via this manifest. The inlined `@font-face` src is rewritten to a manifest lookup by `script/rewrite-critical-urls.mjs`, so a rebuilt font subset always gets a new (cache-busting) URL

### Content collections

| Directory           | Purpose                                                                                             | Jekyll output |
| ------------------- | --------------------------------------------------------------------------------------------------- | ------------- |
| `_posts/`           | Blog posts (articles, snippets)                                                                     | Yes           |
| `_case_studies/`    | Portfolio case studies: homepage gallery modal, individual pages, and the `/case-studies/` archive  | Yes           |
| `_coding_projects/` | Coding project cards on homepage and `/coding-projects/` archive; entries support a `featured` flag | No            |

**`_case_studies/` body content is rendered as raw HTML** in the homepage gallery modal — treat as trusted first-party content only.

**Case study ordering** is controlled by an `order:` integer in each case study's front matter, not the filename prefix. `_includes/case-studies.html` (and the "More Case Studies" block in `_layouts/case-study.html`) sort by `order` descending, so a higher number sits higher on the page. Featured and archived (`featured: false`) render as separate grids but share this one sort. Existing values step by 10 (`130` down to `10`). To add a new case study at the top of its grid, give it an `order` higher than the current maximum (the next top slot is max + 10); nothing else needs editing. To reorder two entries, swap their `order` values. Case study filenames are just the slug (e.g. `teleport-atlas.md`), with no numeric prefix — ordering is entirely `order`-driven.

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

### Pillar pages (topic clusters)

Pillar pages are hand-written, **indexable** topic hubs under `/guides/` that link out to every article in a cluster, with each article linking back (bidirectional hub-and-spoke for topical authority). They are distinct from the `noindex` `/category/` and `/tag/` archives and sit alongside them. The system is registry-driven, so adding articles is front-matter only.

**Registry — `_data/pillars.yml`:** each pillar is keyed by id with `title`, `url` (always `/guides/<slug>/`), and `description`. This is the single source of truth, read by the hub page, the per-post backlink, the `/guides/` index, and the `CollectionPage` JSON-LD.

**To add an existing post to a pillar** (the common case): add two keys to its front matter — nothing else needs editing.

```yaml
pillar: claude-code-ai # must match a key in _data/pillars.yml
pillar_section: apps # optional grouping: which section's card grid it appears in
```

Membership is explicit via `pillar` (not the broad tag), so tangential posts are not swept in. On the next build the post automatically: gets a "Part of the guide" backlink (`_layouts/post.html`, via the registry); appears as a card in the hub's matching section; and is added to the hub's `CollectionPage`/`ItemList` JSON-LD.

**To create a new pillar:**

1. Add an entry to `_data/pillars.yml` (its `url` must be `/guides/<slug>/`).
2. Create `<slug>.md` at the repo root with `layout: content-page`, `permalink: /guides/<slug>/`, `pillar: <id>`, and a `toc:` list (each item has `label` + `anchor`; include a `Brief` item linking to `#top`). Write intro prose, then per section an `<h2 id="...">`, short prose, and `{% include article-card-grid.html pillar='<id>' section='<section>' %}`.
3. Tag the cluster posts as above.

The `/guides/` index (`guides.md`) lists every registry entry automatically — no edit needed. The sticky TOC sidebar renders whenever a `content-page` defines `toc:` (`_layouts/content-page.html`); `wide: true` instead yields a full-width page with no sidebar. The `CollectionPage` JSON-LD and the `Guides` breadcrumb level for `/guides/*` pages are wired in `_includes/head.html` and `_includes/jsonld-breadcrumb.html`.

### Authors

Defined in `_data/authors.yml`. The custom plugin `_plugins/author_pages.rb` generates paginated author archive pages at build time.

### Syntax highlighting

Rouge is disabled. **Prism.js** handles all syntax highlighting via webpack with plugins: `line-numbers`, `normalize-whitespace`, `toolbar`, `show-language`, `copy-to-clipboard`.

### Search Console feedback loop

`script/sync-search-console.mjs` (`pnpm run sync:search-console`) pulls Google Search Console data — Search Analytics (top queries/pages), Sitemaps, and URL Inspection (per-URL index/coverage state) — and writes a private diagnostic report to `tmp/search-console/report.json` and `report.md`. It also derives a flat `issues[]` list (not indexed, robots-blocked, canonical mismatch, sitemap errors, high-impression/low-CTR queries).

This output is **diagnostic data, not site content**: it lives under `tmp/` (gitignored), never `_data/`, so it is not published.

Auth: a Google Cloud service account whose `client_email` is added as a user on the property in Search Console. Provide the JSON key at `secrets/gsc-service-account.json` (gitignored) or set `GSC_SERVICE_ACCOUNT_KEY`. Set `GSC_SITE_URL` to match the registered property exactly — a URL-prefix property (`https://digitalblake.com/`) or a Domain property (`sc-domain:digitalblake.com`); for a Domain property the https origin is derived automatically (override with `GSC_BASE_URL`). Copy `.env.example` → `.env` (loaded into the container) to configure. This is **local and on-demand** — it is not wired into the build or CI.

**Workflow for Claude:** run the sync, read `tmp/search-console/report.md` (issues first), then propose edits for the flagged issues and apply them only on the user's approval. Typical fix targets: post front matter (`description`, `image`, canonical), the robots/canonical/meta logic in `_includes/head.html`, titles and internal linking for low-CTR queries, and sitemap/`robots.txt` problems.

### Pre-commit hooks

Husky runs lint-staged on commit:

- gitleaks v8.30.1 scans staged files for leaked secrets/API keys (runs before lint-staged; blocks the commit if a secret is found)
- Prettier formats all staged files
- ESLint auto-fixes staged JS/MJS
- stylelint auto-fixes staged SCSS
- ImageMagick optimizes staged images and auto-generates WebP variants

### Dependency updates

`pnpm-workspace.yaml` sets `minimumReleaseAge: 10080` (7 days) as a supply-chain gate, so **any version published in the last week will not install**: `pnpm install` fails with `ERR_PNPM_NO_MATURE_MATCHING_VERSION` rather than falling back to the newest mature version. `pnpm outdated` reports gate-eligible versions, so treat its "Latest" column as the real upgrade target. A fresh security patch that must land inside the window needs a temporary entry in `minimumReleaseAgeExclude` with a dated comment, removed once it ages out.

`.github/dependabot.yml` sets `cooldown.default-days: 7` on the npm ecosystem to match. Without it, Dependabot proposes the absolute latest version and its update job fails against the gate. Cooldown covers version updates only; security updates still arrive immediately and can hit the gate.

Lockfile-changing installs need `pnpm install --no-frozen-lockfile`, since `frozenLockfile: true` is set repo-wide.

### CI/CD

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`: installs deps → security scans (`pnpm audit`, Snyk for npm/Gemfile/code) → builds styles/scripts → hashes assets → `jekyll build` → `htmlproofer` → deploys to GitHub Pages (custom domain `digitalblake.com`).

CI does **not** run `build:images`, `build:image-dimensions`, `cache:thumbnails`, or `build:fonts` — those outputs (optimized images, the `_data/image_dimensions.json` size manifest, cached thumbnails, the subset WOFF2) are committed to the repo and used as-is. Regenerate and commit them locally when their inputs change. After adding or replacing images, run `build:images` then `build:image-dimensions` and commit the updated manifest so content-image `width`/`height` stay correct.

`build:images` and `build:fonts` are both idempotent: re-running them on unchanged inputs leaves the working tree clean. If either one reports a change you did not expect, that is a real signal, not noise. `build:images` skips any image it cannot make at least 1% smaller (JPEG re-encoding is lossy, so an in-place re-encode never converges), but always strips embedded EXIF/IPTC/XMP/ICC profiles regardless of size. `build:fonts` pins `SOURCE_DATE_EPOCH`, because fonttools otherwise stamps the current time into `head.modified` and every build emits different bytes. Do not change that epoch constant; it would rewrite the shipped WOFF2 for no reason.
