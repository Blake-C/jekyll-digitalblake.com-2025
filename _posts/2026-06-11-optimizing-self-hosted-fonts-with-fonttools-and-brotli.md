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

If you self-host web fonts, you can shrink them by subsetting the glyphs you actually use with `fonttools` and compressing the result to WOFF2 with Brotli. The commands work on any stack. The numbers below are from a Next.js site.

Self-hosting fonts removes the request to a third-party CDN and the render-blocking stylesheet that comes with it. The tradeoff is that you now ship the whole font file, including thousands of glyphs you will never render. On a recent Next.js build using `next/font/local` with Lato and Inter, the fonts were the largest files the page loaded.

I used [fonttools](https://pypi.org/project/fonttools/) to strip the glyphs and tables I did not need, and [brotli](https://pypi.org/project/brotli/) to compress the result.

## What each tool does

`fonttools` ships a command-line utility called `pyftsubset`. It reads a font, keeps only the glyphs and tables you ask for, and writes a new font.

`brotli` is the compression backend. The [WOFF2 specification](https://www.w3.org/TR/WOFF2/) says the compressed font data stream must be compressed with Brotli, so when you tell `pyftsubset` to write `--flavor=woff2`, it uses the `brotli` package to do the compression. The fontTools docs say [WOFF2 requires the Brotli Python extension](https://fonttools.readthedocs.io/en/latest/subset/index.html), so without it the WOFF2 output fails. The two are installed together:

```bash
pip install fonttools brotli
```

## Subsetting with pyftsubset

The fonts in this project were already WOFF2 exports from Figma, so the comparison below is WOFF2 in, subsetted WOFF2 out. The subset I needed was basic Latin, the Latin-1 Supplement, and a handful of typographic characters (smart quotes, dashes, ellipsis, bullet, trademark). That maps to a short list of Unicode ranges:

```bash
pyftsubset Lato-Regular.woff2 \
	--output-file=Lato-Regular.subset.woff2 \
	--flavor=woff2 \
	--layout-features='kern,liga,clig' \
	--unicodes=U+0000-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2122
```

What each flag does:

- `--flavor=woff2` writes a brotli-compressed WOFF2. Drop this and you get a raw TTF/OTF, which is far larger.
- `--unicodes` is the allow-list of code points. Everything outside it is discarded. `U+0000-00FF` covers basic Latin and the Latin-1 Supplement; the rest are the typographic extras.
- `--layout-features` controls which OpenType features survive. I kept `kern`, `liga`, and `clig` so kerning and standard ligatures still render. By default `pyftsubset` keeps a [longer list of features](https://fonttools.readthedocs.io/en/latest/subset/index.html), including `calt`, `ccmp`, `locl`, and `mark`, so naming three explicitly drops the rest.

For more aggressive trimming, `--desubroutinize` flattens CFF subroutines and `--drop-tables` removes named tables outright. Both shrink the file further at the cost of fidelity.

## Byte sizes before and after

Five files were subsetted: four Lato weights and Inter SemiBold. The numbers below are the exact byte sizes before and after.

| Font file            | Before                 | After                  | Saved     |
| -------------------- | ---------------------- | ---------------------- | --------- |
| Lato-Regular.woff2   | 182,708 B (178 KB)     | 19,908 B (19.4 KB)     | 89.1%     |
| Lato-Medium.woff2    | 182,144 B (178 KB)     | 19,688 B (19.2 KB)     | 89.2%     |
| Lato-Semibold.woff2  | 184,076 B (180 KB)     | 19,932 B (19.5 KB)     | 89.2%     |
| Lato-Bold.woff2      | 184,912 B (181 KB)     | 19,784 B (19.3 KB)     | 89.3%     |
| Inter-SemiBold.woff2 | 114,812 B (112 KB)     | 14,720 B (14.4 KB)     | 87.2%     |
| **Total**            | **848,652 B (829 KB)** | **94,032 B (91.8 KB)** | **88.9%** |

Inter shipped four weights and only SemiBold 600 was used, so the other three were removed before any subsetting.

## Localizing the subset

A Latin-only subset has no glyphs for text outside that range.

Ranges map to scripts and regions. `latin` (U+0000-00FF) covers English and the accented letters used in most Western European languages, which sit in the [Latin-1 Supplement block](https://www.unicode.org/charts/nameslist/n_0080.html). `latin-ext` adds the Central and Eastern European characters from [Latin Extended-A](https://www.unicode.org/charts/nameslist/n_0100.html) and [Latin Extended-B](https://www.unicode.org/charts/nameslist/n_0180.html), including:

- Polish ł
- Czech č
- Romanian ș

Greek, Cyrillic, and Vietnamese need their own ranges beyond that.

To serve more than one region without sending every visitor every glyph, build per-region subset files and declare them with `unicode-range` in `@font-face`. [If the page uses no character in a file's range, the browser does not download that file](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range). [Google Fonts splits its families into subsets](https://developers.google.com/fonts/docs/getting_started) such as `latin`, `latin-ext`, and `cyrillic` the same way, and a browser that supports `unicode-range` picks the ones it needs.

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

Chinese, Japanese, and Korean all use Han characters, and the [CJK Unified Ideographs block](https://www.unicode.org/charts/) alone spans U+4E00 to U+9FFF, with ten more extension blocks beyond it. A font covering that range stays large after subsetting. The usual approaches are per-page dynamic subsetting (generate a file containing only the characters that page uses) or splitting the font into many `unicode-range` chunks so the browser fetches them on demand.

Decide which languages you support before you subset.

## Variable fonts as an alternative

Everything above ships a separate file per weight. Four Lato weights are four requests and four subsets to maintain. A [variable font](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) puts the whole weight range in one file with a `wght` axis, so those four become one request that still covers Regular through Black.

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

A variable font carries the interpolation data for the whole axis, so one variable file is larger than one static weight. Where the crossover sits depends on how many weights you ship. When I compared the two, the variable file was larger with a few weights and smaller with more. The variable font is also a single request. Build both and ship whichever is smaller.

## Cache busting when the subset changes

A subset is a build artifact, and you will rebuild it. You add a language, catch a glyph you missed, or drop a weight, and out comes a new file. The file name usually does not change, so `lato-latin.woff2` stays `lato-latin.woff2` whether it holds the old bytes or the new ones.

Browsers and CDNs cache fonts for a long time, because fonts normally do not change. So a visitor who already has the old file keeps using it, even after you ship new bytes under the same name. When you self-host, the `@font-face` is often inlined into the critical CSS in the document head, so even a fresh HTML response points at the same URL.

The fix is to fingerprint the file name with a hash of its contents. `lato-latin.woff2` becomes `lato-latin.9f3c2a1b.woff2`. Change the bytes and the hash changes, so the URL changes and the browser downloads the new file. If the bytes stay the same, the URL stays the same and the browser uses the cached copy.

Plenty of build setups already do this for CSS and JavaScript. If yours does, point the font at the same manifest. If it does not, hash the font on its own. Rename the file to include a content hash at build time, then reference that name in both the `preload` and the `@font-face src`. Either way, once the URL changes on every content change, you can set a long `immutable` cache header on the font path.

Without a content hash in the file name, you rebuild a subset, deploy, and the old font keeps rendering for everyone who has it cached. Disabling the cache in devtools makes it look fixed.

## The risks

Subsetting is lossy by design. The things it can break:

- **Missing glyphs.** Any character outside the subset renders as a fallback glyph or a notdef box (tofu). User-generated content, names with diacritics, emoji, and currency or math symbols are easy to miss, because they rarely appear in the design comps you subset against.
- **Dropped layout features.** Stripping OpenType features changes rendering. Drop `kern` and spacing shifts; drop `liga` and ligatures stop forming. An empty `--layout-features=''` produces the smallest file and drops every OpenType feature.
- **Hinting removal.** [`--no-hinting` drops glyph-specific hinting and the font-wide hinting tables](https://fonttools.readthedocs.io/en/latest/subset/index.html), which shrinks the file. Microsoft's typography documentation says hinting is ["indispensable in every font intended to be legible at small sizes on low resolution output devices"](https://learn.microsoft.com/en-us/typography/truetype/hinting), so dropping it can hurt rendering there.
- **Licensing.** The [SIL Open Font License FAQ](https://openfontlicense.org/documents/OFL-FAQ.txt) counts subsetting as modification: "Removing any parts of the font when delivering a webfont to a browser, including unused glyphs and smart font code, is considered modification." The OFL permits that. Other licenses set their own terms, so read the license for your font before you redistribute a modified file.
- **Maintenance drift.** A subset is a manual build artifact. This project still carries an un-subsetted `Lato-Light.woff2` at 181,500 B that nothing loads, left behind when the weight was dropped from the layout. If subsetting is not part of the build, it falls out of sync with what the site actually uses.
- **No double-compression payoff.** WOFF2 is already brotli-compressed. [Cloudflare's list of content types it compresses](https://developers.cloudflare.com/speed/optimization/content/compression/) includes `font/ttf`, `font/otf`, and `font/x-woff`, and WOFF2 is not on it. Use `Content-Encoding` compression on your other assets.

When you self-host, you can subset the font files yourself. Do it after you know which characters you need to render.

---

**Updated June 19, 2026 (Update 1):** Added two sections that were missing from the original. "Variable fonts as an alternative" covers how a single variable file with a `wght` axis can stand in for several static weight files, and when the byte math favors it. "Cache busting when the subset changes" covers why a rebuilt subset keeps serving stale bytes under a stable file name, and how content-hashing the font URL fixes it.
