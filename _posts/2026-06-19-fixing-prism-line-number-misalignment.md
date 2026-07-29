---
layout: post
title: 'Fixing Prism Line-Number Misalignment'
description: "Prism's line-numbers plugin measured the gutter against the wrong line-height when the stylesheet loaded late. One rule in the critical CSS fixed it."
date: 2026-06-19 20:52:32
categories: ['Notes']
tags: ['prismjs', 'css', 'critical-css', 'jekyll', 'web-performance', 'debugging']
pillar: front-end-performance
pillar_section: rendering
image: '/assets/uploads/2026/06/fixing-prism-line-number-misalignment.webp'
---

On a Jekyll site that loads Prism's stylesheet asynchronously, the line-numbers gutter would sometimes render misaligned. The numbers sat below their lines and the block scrolled vertically. Refreshing while scrolled down to a code block reproduced it. Loading the page at the top and scrolling down did not. The page and the CSS were the same in both cases.

## What I saw

In the broken state the gutter spans carried inline `height` styles, and there was an extra `.line-numbers-sizer` element that is not normally there:

```html
<span class="line-numbers-rows" aria-hidden="true">
	<span style="height: 28.7969px;"></span>
	<span style="height: 28.7969px;"></span>
</span>
<span class="line-numbers-sizer" style="display: none;"></span>
```

In the correct state the spans were just `<span></span>` with a CSS counter, no inline heights and no sizer.

`28.7969px` is `1.8 × 16`, my body line-height. The code blocks use `line-height: 1.5`, which is 24px. So the gutter had been measured against the wrong line-height, and the measured height was written onto each span as an inline style.

## The cause

Prism's line-numbers plugin only runs its JavaScript height measurement when the code element's computed `white-space` is `pre-wrap` or `pre-line`:

```js
var whiteSpace = codeStyles['white-space']
return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line'
```

When that check passes, it builds the `.line-numbers-sizer`, measures each line, and writes the height back as an inline style on every gutter span.

My generic `pre` rule sets `white-space: pre-wrap`, and it lives in the critical CSS inlined in the document head. Prism's theme overrides language blocks back to `white-space: pre`, but that rule sits in the stylesheet I load asynchronously. So there is a window where the code block is still `pre-wrap`:

- If the script runs first, the code is `pre-wrap`, so the plugin measures against the body's 1.8 line-height and writes 28.8px heights onto the gutter spans. The deferred CSS then sets the code to 1.5, the gutter keeps 28.8, and the numbers sit below their lines.
- If the stylesheet is applied first, the code is already `pre`, so the plugin skips the measurement and the gutter stays pure CSS.

A plain refresh while scrolled to the section broke it, and a cold load at the top did not. I did not pin down what decides the order, though cache and scroll restoration are the likely causes.

## The fix

Resolve the language block's `white-space` in the critical CSS, so it is `pre` before the script runs. An attribute selector has higher specificity than the generic `pre` rule, so source order does not matter:

```scss
pre[class*='language-'],
code[class*='language-'] {
	line-height: 1.5;
	white-space: pre;
}
```

The computed `white-space` is now always `pre`, so the plugin skips the measurement and does not write the inline heights or create the sizer. The gutter aligns from CSS alone, whether or not the deferred stylesheet has loaded yet.

If you defer a stylesheet, anything a script measures on load has to be set by the CSS that is sent before it. `white-space` was the property the plugin gated on, so that was the one that had to be in the critical path.
