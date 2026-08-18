---
layout: post
title: 'Moving From Manual Button Styles to Iterative Loops and the Issues That Followed'
description: 'How about 500 lines of hand-written CTA styles became four nested SCSS loops, what the generated test page caught, and the four problems found later in the compiled CSS.'
date: 2026-08-18 04:37:00 CDT -0500
categories: ['Articles']
tags: ['scss', 'css', 'sass', 'design-systems', 'refactoring', 'javascript']
image: '/assets/uploads/2026/08/moving-from-manual-button-styles-to-iterative-loops.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>About 500 lines of hand-written button variations became four nested loops</strong> over style, size, variant, and theme, emitting 54 class names and 1,548 rules.</li>
		<li><strong>The site ran on WordPress and the content team applied the button classes themselves,</strong> so every combination the design system spec'd had to ship whether a page used it or not.</li>
		<li><strong>A JavaScript version of the same four lists rendered all 486 buttons onto one page.</strong> It could not show an unused combination or an <code>@if</code> that failed to fire.</li>
		<li><strong>Four problems turned up in the compiled CSS.</strong> Six of the 54 classes are duplicates, the dark theme sets disabled text and background to the same value, the purple theme generated icons it was meant to exclude, and 42 of the 54 appear on none of the 3,547 pages I archived.</li>
		<li><strong>The button rules are 43.7 KB compressed, a third of the stylesheet every visitor downloaded.</strong> A yellow submit button took a 214-byte override on the form instead of a 17.5 KB theme.</li>
	</ul>
</aside>

The Seismic marketing site had a stylesheet partial called `_ctas-and-buttons.scss` that ran ~500 lines, including the blank lines between blocks. It was organized by size then variation, so the small buttons sat together, followed by the large buttons, then the primary and secondary, and inside those were the different icon variations. Everything in that partial compiled into `seismic-core.css`, one file that every page on the site loaded, so every button style in it was downloaded whether the page had a button on it or not.

Every one of those variations was written out manually. Each block passed properties into a shared mixin that held the logic, the mixin decided what to generate from the values it was handed. It had numerous `@if` statements in it, so a small button resized its icon differently than a large one, and the light and dark themes branched there as well. The mixin lived in a different file and was also used by things that were not part of this grid, like the text links and the back buttons, but it never iterated over the variations.

## What changing one button style required

Changing one button style meant holding every variation in the file in your head at once. The blocks were ordered by size and then by variation, so the rules for a single button were spread through the file instead of sitting together, and before editing one you had to work out which other blocks passed the same values into the mixin. Getting that wrong changed buttons on pages you were not working on.

## What the loop generates

I ended up spending an entire evening reading all the button styles and turning them into loops so we did not have to write each variation manually. The four lists that came out of it are style, size, variant, and theme:

- **style** is `primary` or `secondary`
- **size** is `large`, `medium`, or `small`
- **variant** is the bare button, one of six icons (`arrow`, `download`, `minus`, `plus`, `popup`, `video`), or one of two shape modifiers (`small`, `wide`)
- **theme** is `light`, `dark`, or `dark-rich`, which was the purple one

Class names come out as `.cta-{style}-{size}-{variant}`, so two styles by three sizes by nine variants is 54 class names. Each of those is emitted for all three themes, and the compiled stylesheet carries 1,548 rules that name at least one of them. A class with no icon takes 21 rules from the loop across the three themes and one with an icon takes 30. Those per-class counts do not add up to 1,548, because a single rule can list many classes at once.

## Why every combination was generated

The site ran on WordPress, and the content and production teams picked button variations themselves as they built pages. A variation that was not already in the deployed CSS meant a dev deployment, so every combination the design system spec'd had to ship whether or not a page used it yet. The loop therefore generates all 54 classes.

## Byte sizes and class usage in the archived build

Before that version of seismic.com was replaced, I pulled down a static copy of the site, and the numbers below come from that archive.

In that build, `seismic-core.css` is 1.78 MB raw and 138 KB compressed. The button rules are 850 KB raw and 43.7 KB compressed, which is 48% of the raw stylesheet and 32% of what a visitor downloaded.

The archive also holds 3,547 rendered pages. Twelve of the 54 classes appear in a `class` attribute on at least one of them, and 42 appear on none. Three classes account for 9,589 of the 9,935 total uses:

- `cta-primary-large-arrow`, 5,059 uses
- `cta-secondary-large`, 2,702 uses
- `cta-primary-large`, 1,828 uses

The archive is a crawl of the public pages only, because pages behind logins and access levels were internal to Seismic and were never pulled into it, so those counts are a floor and 42 is the most that could have gone unused.

## Each value goes into the class name and into the mixin

The loop passes every value twice, using it to build a segment of the class name it is about to generate and handing the same value to the mixin, which resolves what that value means. The following example is a re-creation of what we were initially doing with our iterative loops to build out our buttons in SCSS:

```scss
@use 'sass:map';

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

That's 14 lines of loop. Four of the names in it are the lists it iterates over, and in each of the maps the key is the name that goes into the class while the value holds what the mixin reads back out.

- `$cta-themes` maps a theme name to its config.
- `$cta-styles` is a plain list of `primary` and `secondary`.
- `$cta-sizes` maps each size name to the measurements for that size.
- `$cta-variants` maps each variant name to its icon data.

One of the keys in `$cta-variants` is an empty string, which is the bare button with no icon, and `$suffix` tests for that empty key so the class name does not come out with a trailing dash.

The other two names are helpers. `theme-selectors()` takes a class name, a theme, and whether that theme is the default, and returns the list of selectors that class needs for that theme. `join-selectors()` joins that list into the comma-separated string that opens the rule. `cta-variation` is the mixin that contained the styling logic, and the loop replaced the enumeration while leaving that logic where it was, so the mixin still styled the text links and back buttons from its own file.

## Why the loops are nested

Sass has no `break` or `continue`, so skipping a combination means wrapping it in an `@if`. Nesting is what lets one `@if` cover a whole group of combinations instead of being re-tested on all 54. In the snippet above the theme loop is outermost and the variant loop is innermost, so excluding the icons from a single theme means putting the check inside the theme loop and around the variant loop, where it skips every variant for that one pass while the other themes keep generating.

## Options we did not explore

Having settled on the structure of looping over each of the variations to generate our button styles, we decided to stick on that path versus looking for other options. We were coming up on a massive redesign of the seismic.com website, which meant dropping any further work on that build system to focus on what was to come.

The WordPress constraint required every variation to be in the deployed CSS, though not 487 rules per theme, and two changes would have cut the number of rules.

- Setting the theme colors as CSS custom properties emits the structural rules once and lets each theme override a few values, so a theme costs a block of declarations instead of 487 rules, and the content team still gets every class it could apply.
- Iterating over an explicit map of the combinations that were designed, rather than every pair the four lists produce, keeps a combination like `.cta-primary-large-small` out of the output entirely.

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

`light` is both the default and an explicit class, so the selector with no theme prefix is emitted for it as well, which gives light four theme forms where dark and dark-rich have three. A disabled rule on the light theme multiplies those four by the four forms a disabled button can take, `.disabled`, `.disabled:hover`, `.disabled:focus-within`, and `[disabled]`, and comes out carrying 16 selectors. 108 rules in the archived stylesheet carry exactly 16, which is two rules for each of the 54 classes, one setting the disabled colors and one setting the opacity. The longest rule in the file carries 72 selectors.

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

The page was a manual check, so a developer had to open it, look at 486 buttons, and notice that one of them was wrong.

The SCSS and the JavaScript are two separate loops with nothing keeping them in sync. Adding a variation to the stylesheet means adding it to the four arrays in the script too, and if you do not, the new variation never appears on the page.

A guard does not show up on the page at all. If you add an `@if` that skips a chunk of styles and it does not fire, the page renders every button it was told to render and gives no sign that the styles you meant to exclude are still being generated.

The page also renders exactly what the four arrays contain, so it cannot show you that a combination is unused. The 42 classes that do not appear on an archived page rendered on it the same as the 12 that carried the site.

## A new color added to the loop, and reverted to the form that needed it

Later on, a colleague needed a yellow submit button on a Marketo form for a specific landing page and added the color to the loop. That generated a large number of variations that did not need to exist, and the way the change was made caused icons to go missing on some of the other color variations. It went in over a weekend under a tight deadline and I found it the next week when I came back to make more changes to the same form.

I reverted it and scoped the color to the form instead, so it never touched the loop and no additional variations were generated. That override is still in the compiled CSS:

```css
#standalone-form.pill-fields.bright-buttons .mktoForm .mktoButtonRow [type='submit'] {
	background-color: #fcd408;
	border-color: #fcd408;
}

#standalone-form.pill-fields.bright-buttons .mktoForm .mktoButtonRow [type='submit']:hover {
	background-color: #22092b;
	border-color: #fe5000;
}
```

Marketo renders its own submit button rather than one of our CTA classes, so these two rules style `[type=submit]` and the `.next-button` on a multi-step form, and they add nothing to the loop. The color is switched on by a `bright-buttons` class on the form container, which means a page opts in by adding one class to the form rather than by getting a new theme compiled into every button on the site. Compressed, the two rules are 214 bytes. A fourth theme through the loop is 487 rules and 17.5 KB compressed.

Eleven of the archived pages carry `bright-buttons`, so the color that started on one landing page ended up on the contact pages for enablement consulting in four locales. Adding it to those pages cost nothing, because the rules were already there.

## Communicating with the design team on consequences of over customizing buttons

We asked the design team to send the limits alongside the variation. When a new variation arrives with no constraints on it, the loop multiplies it out across every style, size, and theme, and that output is on every page load because the CSS was one monolithic file. One new icon is six more classes. One new theme is 17.5 KB compressed, against 214 bytes for the same color scoped to the component that needed it.

On the test page, design could also see the number of icon variations the design system was generating.

Fewer variations came to us after that, and the ones that did came with clearer instructions about whether they were for one page or for the whole site, which meant we could decide earlier not to touch the button styles.

Narrowing a request got easier, and a request that was global got harder, because we then had to put safeguards in the loop to say that this color gets the sizes and the light and dark themes without the icons.

## Failures found after the fact in the generated loop styles

The `small` variant produces no declarations. `.cta-primary-large-small` compiles to output byte-for-byte identical to `.cta-primary-large`, and `small` sits in both the size list and the variant list. Large and small should never be placed within each other, and six of the 54 classes are duplicates of their initial output.

On the dark theme, a disabled button sets `color`, `background-color`, and `border-color` to the same value, `#7a6b80`, so the button renders as a solid block and the label cannot be read. That is true for every one of the 54 classes on that theme. [WCAG success criterion 1.4.3](https://www.w3.org/TR/WCAG21/#contrast-minimum) says that text which is part of an inactive user interface component has no contrast requirement, and a disabled control is inactive, so an unreadable label there is not a conformance failure. The output was still not what we intended. Our test page generated the disabled states that we cared about, so it's likely that there are additional disabled states we didn't take into account, and since a dark disabled button was never used on a page, none of our usual QA passes would have put one in front of anyone.

There was a purple theme that we added where our intention was to disable the icons. We had believed this to be true, but upon further inspection the icon variations were in our compiled styles. In the archived build, 360 rules carrying `theme-dark-rich` target an icon variant and 72 of those set an icon data URI, so the icons were generated in full. I no longer have the original assets and cannot confirm why the exclusion did not apply, though my guess is the loop order, since the theme loop is outermost and the variant loop innermost, and a check written at the theme level does not skip the variants underneath it unless it wraps the inner loop.

That theme is 487 rules and 17.5 KB compressed on every page load, and `theme-dark-rich` appears 316 times across the 3,547 archived pages, against 6,447 for `theme-dark` and 3,642 for `theme-light`.

The fourth problem is the usage count. 42 of the 54 classes do not appear on any archived page, so most of what the loop generated was never applied to public content.

Finding three of these four does not require a person to read 1,548 rules. Hashing each generated block finds the duplicates, comparing `color` against `background-color` in a rule finds the dark disabled state, and diffing the generated class names against the `class` attributes in the built HTML finds the ones nothing uses. Each check is a few lines against the compiled CSS.

## The maintenance costs for the iterative approach

Other developers could work in the loop, and when a new form variation came to the dev team I was usually the one assigned to it, because I understood the bigger picture of what was happening with the buttons. That is not a good position for a team to be in, because if I had been out or had left, nobody else would have had what they needed unless I spent time documenting it first, and documentation is the thing we did least well at Seismic during that period.

The loop is self-documenting in a way that 500 lines of hand-written variations were not. All the variations are in arrays at the top, the loops are nested underneath them with their guards, and you can see what is happening without scrolling through the whole file. It does not show the compiled output, which is where all four of the problems were.

## What the work required and what came out of it

Reading the existing 500 lines and getting them into my head took longer than writing the loop. Testing it took the next longest, which is what the JavaScript version was for.

- 54 class names and 1,548 rules generated from four lists and 14 lines of loops
- one copy of each icon, recolored per theme and per state
- a test page rendering 486 buttons, used on any button change and at deployment
- a form-scoped override for a one-page color, at 214 bytes against 17.5 KB for a fourth theme
- 43.7 KB compressed on every page load, with 12 of the 54 classes appearing on the archived pages

## What to check when generating styles with an iterator

When using an iterator to generate multiple styled components, you'll want to take the following into account.

- Check the compiled output with a script rather than by reading it. All four of the problems in this build were in the compiled CSS, and a generated preview page only renders the combinations its own lists contain.
- Count how many of the generated classes your pages use. Twelve of these 54 appeared on the archived pages, and the other 42 downloaded on every page load without being applied to anything.
- Check whether a value appears in two of the lists. `small` was in the size list and in the variant list, so `.cta-primary-large-small` came out byte-for-byte identical to `.cta-primary-large`, and six of the 54 classes were duplicates of their initial output.
- Confirm that any exclusion you add to your iterator is missing from the compiled output. The purple theme was supposed to exclude the icon variations, and it generated all of them.
- There's a maintenance cost to having a test page that generates your output via JavaScript. There are two iterators that need to be kept in sync, one in SCSS and one in JavaScript, and that should be documented so the team knows to keep them in sync.
- Fully understand the true outputted bytes of an iterated inclusion when accepting new values. One new icon is six more classes, and one new theme is 17.5 KB compressed against 214 bytes for the same color scoped to the one component that needed it.
- Double check your combinations to ensure you don't include items that were never designed. Every combination of the lists gets generated, which is how all 54 classes ended up with a disabled state that sets the text and the background to `#7a6b80`.

The core problem of me being the only dev on the team who fully understood the scope of the button variations was never truly solved. The true fix for this is well documenting your process so that the next dev team can use the pattern.
