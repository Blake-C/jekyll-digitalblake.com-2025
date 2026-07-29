---
layout: post
title: 'How to Compress WOFF2 Fonts with fonttools and Brotli'
description: 'Subset and re-compress self-hosted WOFF2 fonts with pyftsubset and Brotli to cut the font payload by 89%, with the exact commands and byte numbers.'
date: 2026-06-11 18:32:33 CDT -0500
modified_date: 2026-07-21 20:04:04 CDT -0500
categories: ['Articles']
tags: ['fonts', 'performance', 'web-performance', 'fonttools', 'brotli', 'python', 'nextjs', 'self-hosting']
image: '/assets/uploads/2026/06/optimizing-self-hosted-fonts-with-fonttools-and-brotli.webp'
pillar: front-end-performance
pillar_section: fonts
---

If you self-host web fonts, the fastest way to shrink them is to subset the glyphs you actually use with `fonttools` and compress the result to WOFF2 with Brotli. This works on any stack; the numbers below are from a Next.js site, but nothing here is Next-specific.

Self-hosting fonts removes the request to a third-party CDN and the render-blocking stylesheet that comes with it. The tradeoff is that you now ship the whole font file, including thousands of glyphs you will never render. On a recent Next.js build using `next/font/local` with Lato and Inter, those files were the single largest drag on the page. Subsetting them fixed it.

This is the toolchain I used: [fonttools](https://pypi.org/project/fonttools/) to strip the glyphs and tables I did not need, and [brotli](https://pypi.org/project/brotli/) to compress the result.

## How the two tools fit together

`fonttools` ships a command-line utility called `pyftsubset`. It reads a font, keeps only the glyphs and tables you ask for, and writes a new font. That is the part that does the actual cutting.

`brotli` is the compression backend. WOFF2 is a brotli-compressed container, so when you tell `pyftsubset` to write `--flavor=woff2`, it leans on the `brotli` package to do the compression. If `brotli` is not installed, the WOFF2 output fails. The two are installed together:

```bash
pip install fonttools brotli
```

So the division of labor is simple: fonttools decides what stays, brotli decides how small the bytes get.

## Subsetting with pyftsubset

The fonts in this project were already WOFF2 exports from Figma, so the comparison below is WOFF2 in, subsetted WOFF2 out. The subset I needed was basic Latin, the Latin-1 Supplement, and a handful of typographic characters (smart quotes, dashes, ellipsis, bullet, trademark). That maps to a short list of Unicode ranges:

```bash
pyftsubset Lato-Regular.woff2 \
	--output-file=Lato-Regular.subset.woff2 \
	--flavor=woff2 \
	--layout-features='kern,liga,clig' \
	--unicodes=U+0000-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2122
```

The flags that matter:

- `--flavor=woff2` writes a brotli-compressed WOFF2. Drop this and you get a raw TTF/OTF, which is far larger.
- `--unicodes` is the allow-list of code points. Everything outside it is discarded. `U+0000-00FF` covers basic Latin and the Latin-1 Supplement; the rest are the typographic extras.
- `--layout-features` controls which OpenType features survive. I kept `kern`, `liga`, and `clig` so kerning and standard ligatures still render. By default `pyftsubset` keeps a conservative set; naming them explicitly documents the intent.

For more aggressive trimming, `--desubroutinize` flattens CFF subroutines and `--drop-tables` removes named tables outright. Both shrink the file further at the cost of fidelity, which is the theme of the risks section below.

## What it saved

Five files were subsetted: four Lato weights and Inter SemiBold. The numbers below are the exact byte sizes before and after.

| Font file            | Before                 | After                  | Saved     |
| -------------------- | ---------------------- | ---------------------- | --------- |
| Lato-Regular.woff2   | 182,708 B (178 KB)     | 19,908 B (19.4 KB)     | 89.1%     |
| Lato-Medium.woff2    | 182,144 B (178 KB)     | 19,688 B (19.2 KB)     | 89.2%     |
| Lato-Semibold.woff2  | 184,076 B (180 KB)     | 19,932 B (19.5 KB)     | 89.2%     |
| Lato-Bold.woff2      | 184,912 B (181 KB)     | 19,784 B (19.3 KB)     | 89.3%     |
| Inter-SemiBold.woff2 | 114,812 B (112 KB)     | 14,720 B (14.4 KB)     | 87.2%     |
| **Total**            | **848,652 B (829 KB)** | **94,032 B (91.8 KB)** | **88.9%** |

A separate, complementary win came first: Inter shipped four weights and only SemiBold 600 was actually used, so the other three were pruned before any subsetting. Dropping unused weights is the cheapest reduction available, and worth doing before you reach for `pyftsubset`.

## Localizing the subset

A Latin-only subset breaks the moment you render text outside that range. The Unicode allow-list is, in effect, a list of the languages you support.

Ranges map to scripts and regions. `latin` (U+0000-00FF) covers English and most Western European languages. `latin-ext` adds the Central and Eastern European characters: Polish ł, Czech č, Romanian ș, and so on. Beyond that you have separate blocks for Greek, Cyrillic, and Vietnamese, each its own range.

The way to serve more than one region without forcing every visitor to download every glyph is to build per-region subset files and declare them with `unicode-range` in `@font-face`. The browser parses the text on the page, sees which ranges it needs, and downloads only the matching files. This is exactly how Google Fonts slices its families into `latin`, `latin-ext`, `cyrillic`, and the rest:

```css
@font-face {
	font-family: 'Lato';
	src: url('/fonts/lato-latin.woff2') format('woff2');
	unicode-range: U+0000-00FF, U+2013-2014, U+2018-2019, U+201C-201D, U+2022, U+2026, U+2122;
}

@font-face {
	font-family: 'Lato';
	src: url('/fonts/lato-latin-ext.woff2') format('woff2');
	unicode-range: U+0100-017F, U+0180-024F;
}
```

CJK is the outlier. Chinese, Japanese, and Korean fonts carry tens of thousands of glyphs, so even a subset is large and a single file is not viable. The usual approaches are per-page dynamic subsetting (generate a file containing only the characters that page uses) or splitting the font into many `unicode-range` chunks so the browser fetches them on demand.

The practical rule: decide which languages you support before you subset. Subsetting without that list is how you ship broken text to a region you forgot about.

## Variable fonts as an alternative

Everything above ships a separate file per weight. Four Lato weights are four requests and four subsets to maintain. A variable font collapses the weight range into one file with a `wght` axis, so those four become one request that still gives you Regular through Black and everything in between.

You subset a variable font the same way, with one extra step in front. Pin the axis to the range you actually use before subsetting, so you are not carrying interpolation data for weights you never render:

```bash
fonttools varLib.instancer Lato-Variable.ttf wght=400:900 \
	-o Lato-axis.ttf

pyftsubset Lato-axis.ttf \
	--output-file=lato-variable.subset.woff2 \
	--flavor=woff2 \
	--layout-features='kern,liga,clig' \
	--unicodes=U+0000-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2122
```

The `@font-face` then declares the range instead of a single weight, and the browser interpolates:

```css
@font-face {
	font-family: 'Lato';
	src: url('/fonts/lato-variable.subset.woff2') format('woff2');
	font-weight: 400 900;
}
```

The tradeoff is in the math. A variable font carries the interpolation data for the whole axis, so one variable file is larger than one static weight. The win shows up once you ship three or more weights: the single variable file usually beats the sum of the static subsets, and it is one request instead of several. If you only ship Regular and Bold, two static subsets can still come out smaller. Count the weights you actually use before you decide.

## Cache busting when the subset changes

A subset is a build artifact, and you will rebuild it. You add a language, catch a glyph you missed, or drop a weight, and out comes a new file. The problem is that the file name usually does not change. `lato-latin.woff2` is `lato-latin.woff2` whether it holds the old bytes or the new ones.

Fonts are exactly the kind of asset browsers and CDNs cache hard, because they normally never change. So a visitor who already has the old file keeps it. You ship new bytes under an old name and nobody downloads them. It gets worse when you self-host, because the `@font-face` is often inlined into the critical CSS in the document head, so even a fresh HTML response still points at the same stale URL.

The fix is to fingerprint the file name with a hash of its contents. `lato-latin.woff2` becomes `lato-latin.9f3c2a1b.woff2`. Change the bytes and the hash changes, so the URL changes, so the cache misses and the browser pulls the new file. Leave the bytes alone and the URL is stable, so the cache hit stands.

Plenty of build setups already do this for CSS and JavaScript. If yours does, point the font at the same manifest and you get it for free. If it does not, you can hash the font on its own: rename the file to include a content hash at build time, then reference that name in both the `preload` and the `@font-face src`. Either way, once the URL changes on every content change, you can set a long `immutable` cache header on the font path and let the hash do the invalidation.

Skip this and the failure is quiet. You rebuild a subset, deploy, and the old font keeps rendering for everyone who has it cached. Disabling the cache in devtools makes it look fixed, which is exactly how you end up debugging the wrong thing for an hour.

## The risks

Subsetting is lossy by design. The things it can break:

- **Missing glyphs.** Any character outside the subset renders as a fallback glyph or a notdef box (tofu). User-generated content, names with diacritics, emoji, and currency or math symbols are the common surprises, because they rarely show up in the design comps you subset against.
- **Dropped layout features.** Stripping OpenType features changes rendering. Drop `kern` and spacing shifts; drop `liga` and ligatures stop forming. An empty `--layout-features=''` is the smallest file and the most likely to look wrong.
- **Hinting removal.** Removing hinting tables shrinks the file but can hurt rendering at small sizes, particularly on low-DPI displays and Windows, where hinting does more work.
- **Licensing.** Modifying a font, which subsetting is, has to be permitted by its license. Not every webfont license allows it. Check before you redistribute a modified file.
- **Maintenance drift.** A subset is a manual build artifact, and artifacts rot. This project still carries an un-subsetted `Lato-Light.woff2` at 181,500 B that nothing loads, left behind when the weight was dropped from the layout. If subsetting is not part of the build, it falls out of sync with what the site actually uses.
- **No double-compression payoff.** WOFF2 is already brotli-compressed. Adding brotli `Content-Encoding` at the HTTP layer on top of a WOFF2 buys almost nothing and wastes server CPU. Compress your other assets that way, not your fonts.

When you self-host, the file is yours to trim, and subsetting is the highest-leverage move available. Just do it after you know exactly which characters you need to render, not before.

---

**Updated June 19, 2026 (Update 1):** Added two sections that were missing from the original. "Variable fonts as an alternative" covers how a single variable file with a `wght` axis can stand in for several static weight files, and when the byte math favors it. "Cache busting when the subset changes" covers why a rebuilt subset keeps serving stale bytes under a stable file name, and how content-hashing the font URL fixes it.
