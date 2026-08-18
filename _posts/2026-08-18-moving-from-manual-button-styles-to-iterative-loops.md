---
layout: post
title: 'Moving From Manual Button Styles to Iterative Loops and the Issues That Followed'
description: 'How 500 lines of hand-written CTA styles became four nested SCSS loops, what the generated test page caught, and the three problems that only showed up in the compiled CSS.'
date: 2026-08-18 04:37:00 CDT -0500
categories: ['Articles']
tags: ['scss', 'css', 'sass', 'design-systems', 'refactoring', 'javascript']
image: '/assets/uploads/2026/08/moving-from-manual-button-styles-to-iterative-loops.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>A 500 line stylesheet of hand-written button variations became four nested loops.</strong> The loops emit 54 class names and 1,458 rules, and every value builds a segment of the class name and is handed to the mixin that holds the styling logic.</li>
		<li><strong>A JavaScript version of the same four lists rendered every button onto one page.</strong> 54 classes across three themes and three states is 486 buttons, which the dev team checked whenever a button style changed.</li>
		<li><strong>The test page could not show what the loop failed to generate.</strong> The SCSS and the JavaScript were separate iterators with nothing keeping them in sync, so a skipped block of styles left no trace on the page.</li>
		<li><strong>Three problems were only visible in the compiled CSS.</strong> Six of the 54 classes were duplicates, every class on the dark theme had a disabled label the same color as its background, and the purple theme kept all six icons it was meant to exclude.</li>
		<li><strong>A color needed on one page belongs in a page-scoped override.</strong> Three rules at 189 bytes compressed did the job that a fourth theme through the loop would have cost 17.6 KB.</li>
	</ul>
</aside>

The Seismic marketing site had a stylesheet partial called `_ctas-and-buttons.scss` that ran ~500 lines, including the blank lines between blocks. It was organized by size then variation, so the small buttons sat together, followed by the large buttons, then the primary and secondary, and inside those were the different icon variations.

Every one of those variations was written out manually. Each block passed properties into a shared mixin that held the logic, the mixin decided what to generate from the values it was handed. It had numerous `@if` statements in it, so a small button resized its icon differently than a large one, and the light and dark themes branched there as well. The mixin lived in a different file and was also used by things that were not part of this grid, like the text links and the back buttons, but it never iterated over the variations, so that part was done by hand.

## Why the file was hard to work in

In order to reason about the standard static file that it took to build out all of our buttons, you would have to build yourself a large context window over all these variations. In order to correctly make one of those changes on a particular style meant understanding how the styles were ordered and structured so that you didn't create any future issues or impact any additional button styles.

## What the loop generates

I ended up spending an entire evening reading all the button styles and turning them into loops so we did not have to write each variation manually. The four lists that came out of it are style, size, variant, and theme:

- **style** is `primary` or `secondary`
- **size** is `large`, `medium`, or `small`
- **variant** is the bare button, one of six icons (`arrow`, `download`, `minus`, `plus`, `popup`, `video`), or one of two shape modifiers (`small`, `wide`)
- **theme** is `light`, `dark`, or `dark-rich`, which was the purple one

Class names come out as `.cta-{style}-{size}-{variant}`, so two styles by three sizes by nine variants is 54 class names. Each of those is emitted once per theme, and the compiled CSS carries 1,458 rules for them. A variation with no icon takes 21 rules and one with an icon takes 30.

## Each value goes into the class name and into the mixin

The loop passes every value twice, using it to build a segment of the class name it is about to generate and handing the same value to the mixin, which resolves what that value means. The following example is a re-creation of what we were initially doing with our iterative loops to build out our buttons in SCSS:

```scss
@each $theme, $theme-config in $cta-themes {
	@each $style in $cta-styles {
		@each $size in map.keys($cta-sizes) {
			@each $variant in map.keys($cta-variants) {
				$suffix: if($variant == '', '', '-#{$variant}');
				$class: 'cta-#{$style}-#{$size}#{$suffix}';
				$selectors: theme-selectors($class, $theme, map.get($theme-config, default));

				#{join-selectors($selectors)} {
					@include cta-variation($style, $size, $theme, $variant);
				}
			}
		}
	}
}
```

That's 14 lines, and `cta-variation` is the mixin that contained internal styling logic. The loop replaced the enumeration and left the logic where it was, so the mixin kept serving the text links and back buttons from its own file.

## Why the loops are nested

Nesting the loops lets you write an early return. If a particular color did not need all of the icons, an `@if` at the color level skips the icons for that one pass while the other loops keep running.

Having settled on the structure of looping over each of the variations to generate our button styles, we decided to stick on that path versus looking for other options as we were starting to realize we were coming up on a massive redesign of the seismic.com website, forcing us to drop any further optimizations on that build system and focus on what was to come.

## One copy of each icon, recolored per theme and state

The icons are inline SVGs embedded in the CSS as data URIs, so the whole SVG is written into the `background-image` value as text and no separate file is requested for it. Because the SVG is text at that point, the loop can substitute the colors into it before it is written out. A data URI cannot carry a bare `#`, so every hex color is escaped to `%23` before it is substituted in.

Three of the six icons take one color and three take two. The arrow, download, and popup icons are drawn in the button's text color. The minus, plus, and video icons are a filled circle in the text color with the glyph cut out of it in the button's background color, so both values have to be injected. Hover swaps the background and text colors, so the icon is generated a second time for the hover state. Those six icons produce 31 distinct data URIs across the generated classes.

Keeping one copy of each icon meant that updating an icon was a change in one place. Optionally, we could have loaded a single sprite onto the site, but that would also mean loading in sprites on pages that might not have needed an icon in the first place.

## Buttons inside a section set to a different theme

Each theme is emitted three ways:

- the class on the button itself
- the class on an ancestor element
- a cross-theme override, so a button carrying one theme class still renders correctly inside a container carrying another

The override exists because a header could be forced to `theme-dark` while the rest of the page was `theme-light`. The buttons inside that header switch to their dark-theme colors on their own, so a dark button never renders on a dark background, and changing a hero section between light, dark, and purple takes no edit to the buttons in it.

`light` is both the default and an explicit class, so the unprefixed selector is emitted for it as well. That is why one rule can carry 16 selectors, four disabled forms multiplied by four theme forms.

## Creating a test page for the dev team to use for QA'ing buttons

After the SCSS was done I realized the same four lists converted to JavaScript would generate every button onto a single page. The dev team went to that page whenever they changed a button style, and it was a good check during a deployment. It caught the case where you add an `@if` and it breaks the other variations, which you can see on the page and go back and fix.

The generator that did this is gone along with the rest of the theme's source, so what I have now is a rewrite against the same four lists. It renders each class in three states, resting, hover, and disabled, across the three themes:

```js
const STYLES = ['primary', 'secondary']
const SIZES = ['large', 'medium', 'small']
const VARIANTS = ['', 'arrow', 'download', 'minus', 'plus', 'popup', 'video', 'small', 'wide']
const THEMES = ['light', 'dark', 'dark-rich']
const STATES = ['default', 'hover', 'disabled']
```

54 classes by three themes by three states is 486 buttons. Hover cannot be triggered from a script, so the hover column gets a `force-hover` class that the loop emits alongside `:hover`, `:focus`, and `:focus-within`.

## Limitations to our dev test page

The SCSS and the JavaScript are two separate loops with nothing keeping them in sync. Adding a variation to the stylesheet means adding it to the four arrays in the script too, and if you do not, the new variation never appears on the page.

An early return does not show up on the page at all. If you add an `@if` that skips a chunk of styles, the page has no way to show you that it did not fire, so styles you thought were excluded keep getting generated and there's no indication on the page showing that change.

## A new color added to the loop, and reverted to one page

Later on, a colleague needed a new button color for a specific landing page and added it to the loop. That generated a large number of variations that did not need to exist, and the way the change was made caused icons to go missing on some of the other color variations. It went in over a weekend under a tight deadline and I found it the next week when I came back to make more changes to the same form.

I reverted it and made the color specific to the one page it was for, so it never touched the loop and no additional variations were generated. That override is still in the compiled CSS:

```css
.midline-callout-bg-bright [class*='cta-secondary-'] {
	background-color: #fcd408;
}

.midline-callout-bg-bright [class*='cta-primary-']:hover {
	background-color: #fcd408;
	color: #22092b;
}
```

Two of the three rules are above. A secondary button inside that container is yellow, a primary button turns yellow on hover, and the third rule sets the hover color for secondary. The `[class*='cta-secondary-']` attribute selector matches any class name containing that string, so it applies to whatever the loop already generated and adds no combinations of its own. Compressed, the three rules are 189 bytes. A fourth theme through the loop is 487 rules and 17.6 KB compressed.

## Communicating with the design team on consequences of over customizing buttons

We asked the design team to send the limits alongside the variation. When a new variation arrives with no constraints on it, the loop multiplies it out across every style, size, and theme, and that output is on every page load because the CSS was one monolithic file. One new icon is six more classes. One new theme is 17.6 KB compressed, against 189 bytes for the same color applied to a single page.

On the test page, design could also see the number of icon variations the design system was generating.

Fewer variations came to us after that, and the ones that did came with clearer instructions about whether they were for one page or for the whole site, which meant we could decide earlier not to touch the button styles.

Narrowing a request got easier, and a request that was global got harder, because we then had to put safeguards in the loop to say that this color gets the sizes and the light and dark themes without the icons.

## Failures found after the fact in the generated loop styles

The `small` variant produces no declarations. `.cta-primary-large-small` compiles to output byte-for-byte identical to `.cta-primary-large`, and `small` sits in both the size list and the variant list. Large and small should never be placed within each other, and six of the 54 classes are duplicates of their initial output.

On the dark theme, a disabled button sets its text color and its background color to the same value, `#7a6b80`, so the label cannot be read. That is true for every one of the 54 classes on that theme. Our test page generated the disable states that we cared about, so it's likely that there are additional disabled states that we didn't take into account.

There was a purple theme that we added where our intention was to disable the icons. We had believed this to be true, but upon further inspection the icon variations found their way into our compiled styles. This finding occurred after the fact and since I no longer have the original assets, I can't determine why that had happened.

Reading the compiled output would have caught all three.

## The maintenance costs for the iterative approach

Other developers could work in the loop, and when a new form variation came to the dev team I was usually the one assigned to it, because I understood the bigger picture of what was happening with the buttons. That is not a good position for a team to be in, because if I had been out or had left, nobody else would have had what they needed unless I spent time documenting it first, and documentation is the thing we did least well at Seismic during that period.

The loop is self-documenting in a way that 500 lines of hand-written variations were not. All the variations are in arrays at the top, the loops are nested underneath them with their early guards, and you can see what is happening without scrolling through the whole file. There is nothing SCSS can do now that would have made any of this easier.

## What the work required and what came out of it

Reading the existing 500 lines and getting them into my head took longer than writing the loop. Testing it took the next longest, which is what the JavaScript version was for.

- 54 class names and 1,458 rules generated from four lists and 14 lines of loops
- one copy of each icon, recolored per theme and per state
- a test page rendering 486 buttons, used on any button change and at deployment
- a page-scoped override as the answer to a one-page color, at 189 bytes against 17.6 KB

## What to take away from this article

When using an iterator to generate multiple styled components, you'll want to take the following into account.

- Read the compiled output. All three of the problems in this build were sitting in the CSS, and a generated preview page only renders what it has been told to render.
- Check whether a value appears in two of the lists. `small` was in the size list and in the variant list, so `.cta-primary-large-small` came out byte-for-byte identical to `.cta-primary-large`, and six of the 54 classes were duplicates of their initial output.
- Always confirm that any exclusion you add to your iterator is truly removed from the output. A purple theme we included, which was supposed to exclude icon variations, generated the icon variations because of a likely mistake on our end.
- There's a maintenance cost to having a test page that generates your output via JavaScript. There are two iterators that need to be kept in sync: one in SCSS, one in JavaScript. This should be well documented so the team knows to keep them in sync.
- Fully understand the true outputted bytes of an iterated inclusion when accepting new values. One new icon is six more classes, and one new theme is 17.6 KB compressed against 189 bytes for the same color scoped to a single page.
- Double check your combinations to ensure you don't include items that were never designed. Every combination of the lists gets generated, which is how all 54 classes ended up with a disabled state that sets the text and the background to `#7a6b80`.

The core problem of me being the only dev on the team who fully understood the scope of the button variations was never truly solved. The true fix for this is well documenting your process so that the next dev team can take the pattern and run with it.
