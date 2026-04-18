# DigitalBlake — Jekyll Site

Personal site built with Jekyll 4, deployed to GitHub Pages via GitHub Actions.

## Requirements

- Ruby 3.4+ (via [rbenv](https://github.com/rbenv/rbenv) or [ruby-install](https://github.com/postmodern/ruby-install))
- Node.js 24+ (via [nvm](https://github.com/nvm-sh/nvm))
- Bundler (`gem install bundler`)

## Setup

```bash
# Install Ruby and Node dependencies
bundle install
npm install
```

`npm install` will automatically run `husky` via the `prepare` script to set up the pre-commit hook.

### nvm users

Husky runs in a limited shell environment and cannot load nvm automatically. Create the following file so husky can find `node` and `npm`:

```bash
mkdir -p ~/.config/husky
echo 'export PATH="$HOME/.nvm/versions/node/$(ls -1 $HOME/.nvm/versions/node | sort -V | tail -1)/bin:$PATH"' > ~/.config/husky/init.sh
```

## Development

```bash
npm run dev
```

This builds styles and scripts, then starts Jekyll with live reload on [http://localhost:4005](http://localhost:4005). Styles and scripts are watched for changes.

## Build

```bash
npm run build
```

Compiles SCSS, bundles JS via webpack, then runs `bundle exec jekyll build`.

Individual steps:

```bash
npm run build:styles   # Compile SCSS → assets/css/global-styles.min.css
npm run build:scripts  # Bundle JS via webpack → assets/js/
```

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys the site to GitHub Pages at:

[https://blake-c.github.io/jekyll-digitalblake.com-2025/](https://blake-c.github.io/jekyll-digitalblake.com-2025/)

## Configs

| File              | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `_config.yml`     | Production config (`baseurl: /jekyll-digitalblake.com-2025`)     |
| `_config.dev.yml` | Local dev override (`baseurl: ""`, `url: http://localhost:4005`) |

The dev server merges both configs automatically via `npm run dev`.

## Code Formatting

[Prettier](https://prettier.io/) is used for formatting with the `@shopify/prettier-plugin-liquid` plugin for Liquid templates.

```bash
npm run format   # Format all files
```

A pre-commit hook (via [Husky](https://typicode.com/husky)) runs Prettier automatically before every commit.

## Project Structure

```
_data/          # YAML data files (authors, navigation, etc.)
_github_projects/  # GitHub project data for homepage
_includes/      # Reusable HTML/Liquid partials
_layouts/       # Page layout templates
_plugins/       # Custom Jekyll plugins (author pages)
_posts/         # Blog posts (Markdown)
_websites/      # Website portfolio data for homepage
assets/         # Compiled/static assets (CSS, JS, images, uploads)
theme_components/
  js/           # JS source files
  sass/         # SCSS source files
```

## Security notes

`_websites/*.md` body content is rendered as raw HTML inside the homepage gallery modal (see [`_includes/sites-gallery.html`](_includes/sites-gallery.html)). The collection is treated as trusted, first-party content. Do **not** accept outside contributions to `_websites/` without first sanitizing or escaping the body — a malicious entry would execute as inline HTML/JS on every page that embeds the gallery.

## Syntax Highlighting

Rouge (Jekyll's default) is disabled. [Prism.js](https://prismjs.com/) handles syntax highlighting and line numbers, loaded via webpack with the following plugins: `line-numbers`, `autolinker`, `show-language`, `normalize-whitespace`, `copy-to-clipboard`.
