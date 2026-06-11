---
layout: post
title: 'Optimizing Self-Hosted Fonts with fonttools and brotli'
description: 'Self-hosted Lato and Inter were dragging down a Next.js build. Subsetting the glyphs with pyftsubset and re-compressing with brotli cut the font payload by roughly 89%. Here are the commands, the real before and after numbers, the localization tradeoffs, and the risks.'
date: 2026-06-11 18:32:33 CDT -0500
categories: ['Articles']
tags: ['fonts', 'performance', 'web-performance', 'fonttools', 'brotli', 'python', 'nextjs', 'self-hosting']
image: '/assets/uploads/2026/06/optimizing-self-hosted-fonts-with-fonttools-and-brotli.webp'
---

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

## The risks

Subsetting is lossy by design. The things it can break:

- **Missing glyphs.** Any character outside the subset renders as a fallback glyph or a notdef box (tofu). User-generated content, names with diacritics, emoji, and currency or math symbols are the common surprises, because they rarely show up in the design comps you subset against.
- **Dropped layout features.** Stripping OpenType features changes rendering. Drop `kern` and spacing shifts; drop `liga` and ligatures stop forming. An empty `--layout-features=''` is the smallest file and the most likely to look wrong.
- **Hinting removal.** Removing hinting tables shrinks the file but can hurt rendering at small sizes, particularly on low-DPI displays and Windows, where hinting does more work.
- **Licensing.** Modifying a font, which subsetting is, has to be permitted by its license. Not every webfont license allows it. Check before you redistribute a modified file.
- **Maintenance drift.** A subset is a manual build artifact, and artifacts rot. This project still carries an un-subsetted `Lato-Light.woff2` at 181,500 B that nothing loads, left behind when the weight was dropped from the layout. If subsetting is not part of the build, it falls out of sync with what the site actually uses.
- **No double-compression payoff.** WOFF2 is already brotli-compressed. Adding brotli `Content-Encoding` at the HTTP layer on top of a WOFF2 buys almost nothing and wastes server CPU. Compress your other assets that way, not your fonts.

When you self-host, the file is yours to trim, and subsetting is the highest-leverage move available. Just do it after you know exactly which characters you need to render, not before.
