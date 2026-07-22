---
layout: post
title: 'Fixing Prism Line-Number Misalignment'
description: "Prism's line-numbers plugin froze the wrong line heights onto the gutter, leaving the numbers drifting below the code. The cause was a white-space race with a deferred stylesheet, and the fix was one rule in the critical CSS."
date: 2026-06-19 20:52:32
categories: ['Notes']
tags: ['prismjs', 'css', 'critical-css', 'jekyll', 'web-performance', 'debugging']
pillar: front-end-performance
pillar_section: rendering
image: '/assets/uploads/2026/06/fixing-prism-line-number-misalignment.webp'
---

On a Jekyll site that loads Prism's stylesheet asynchronously, the line-numbers gutter would sometimes render misaligned: the numbers drifting below their lines, and the whole block growing a vertical scroll. Refreshing while scrolled down to a code block reproduced it. Loading the page at the top and scrolling down did not. Same page, same CSS. That inconsistency is the tell for a race.

## What I saw

In the broken state the gutter spans carried inline `height` styles, and there was an extra `.line-numbers-sizer` element that does not normally stick around:

```html
<span class="line-numbers-rows" aria-hidden="true">
	<span style="height: 28.7969px;"></span>
	<span style="height: 28.7969px;"></span>
</span>
<span class="line-numbers-sizer" style="display: none;"></span>
```

In the correct state the spans were clean, just `<span></span>` with a CSS counter, no inline heights and no sizer.

`28.7969px` is `1.8 × 16`, my body line-height. The code blocks use `line-height: 1.5`, which is 24px. So the gutter had been measured against the wrong line-height and the result was frozen onto each span.

## The cause

Prism's line-numbers plugin only runs its JavaScript height measurement when the code element's computed `white-space` is `pre-wrap` or `pre-line`:

```js
var whiteSpace = codeStyles['white-space']
return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line'
```

When that check passes, it builds the `.line-numbers-sizer`, measures each line, and writes the height back as an inline style on every gutter span.

My generic `pre` rule sets `white-space: pre-wrap`, and it lives in the critical CSS inlined in the document head. Prism's theme overrides language blocks back to `white-space: pre`, but that rule sits in the stylesheet I load asynchronously. So there is a window where the code block is still `pre-wrap`:

- The script wins the race. The code is `pre-wrap`, so the plugin measures against the body's 1.8 line-height and freezes 28.8px heights. The deferred CSS then sets the code to 1.5, the gutter keeps 28.8, and the numbers drift.
- The stylesheet wins the race. The code is already `pre`, so the plugin skips the measurement and the gutter stays pure CSS.

Whether the script or the stylesheet lands first depends on cache and scroll restoration, which is why a plain refresh on the section broke it and a cold load at the top did not.

## The fix

Resolve the language block's `white-space` in the critical CSS, so it is `pre` before the script ever runs. An attribute selector outranks the generic `pre` rule, so source order does not matter:

```scss
pre[class*='language-'],
code[class*='language-'] {
	line-height: 1.5;
	white-space: pre;
}
```

Now the plugin always sees `white-space: pre`, always skips the measurement, and never writes the inline heights or the sizer. The gutter aligns from CSS alone, whichever resource lands first.

The lesson: if you defer a stylesheet, anything a script measures on load has to be settled by the CSS that ships before it. `white-space` was the property the plugin gated on, so that was the one that had to be in the critical path.
