---
layout: post
title: 'Testing for WCAG Conformance: Automated Tools, Manual Review, and AI'
description: 'How developers test a website against WCAG: the standard automated tools (axe-core, Lighthouse, WAVE, Pa11y), what they catch and what they miss, pass and fail code examples for common criteria, and where AI now fits.'
date: 2026-07-24 17:25:33 CDT -0500
categories: ['Articles']
tags: ['accessibility', 'wcag', 'testing', 'axe-core', 'automation', 'ai', 'web-development']
image: '/assets/uploads/2026/07/testing-web-accessibility-tools-automation-and-ai.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>Start with automated tools in CI.</strong> axe-core, Lighthouse, WAVE, and Pa11y are the common ones, and wiring one into the build stops regressions from shipping.</li>
		<li><strong>Automation only goes so far.</strong> It catches roughly 30 to 40 percent of the WCAG success criteria (about 57 percent of issues by volume). It confirms that something exists, like an <code>alt</code> attribute or a contrast ratio, but it cannot judge whether the content is correct or meaningful.</li>
		<li><strong>Manual review is required for conformance.</strong> A keyboard-only pass, a screen reader pass, and human judgment cover the criteria automation cannot.</li>
		<li><strong>AI raises the floor, not the ceiling.</strong> Vision models can draft the contextual work automation never could, starting with alt text, but a model can be confidently wrong, so a person still verifies everything before it ships.</li>
		<li><strong>Skip the overlay widgets.</strong> A single script promising full automated compliance cannot make the source-code changes real remediation requires.</li>
		<li><strong>The target:</strong> build and test to WCAG 2.1 Level AA today, with 2.2 AA as the near-future target.</li>
	</ul>
</aside>

Web accessibility has a technical standard, the Web Content Accessibility Guidelines (WCAG), and a set of laws that require it. This article is about the developer side: how you actually test a site against WCAG. For which laws apply to you and which WCAG version each one requires, see the companion reference on [web accessibility standards and law]({% post_url 2026-07-24-web-accessibility-standards-and-law-wcag-eaa-us %}). Throughout, the working target is WCAG 2.1 Level AA, the version nearly every current law points to, with 2.2 AA as the near-future target.

## Automated testing tools

Testing WCAG conformance usually starts with automated tools, because they are fast, repeatable, and easy to run on every build. The common ones are:

- [axe-core](https://github.com/dequelabs/axe-core), the Deque engine that most other tools are built on. It ships as the axe DevTools browser extension and as libraries that plug into test runners like Playwright, Cypress, and Jest.
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring), built into Chrome DevTools, which runs an axe-based accessibility audit alongside its performance checks. Good for a quick pass during development.
- [WAVE](https://wave.webaim.org/) from WebAIM, a browser extension and online tool that renders issues visually on the page.
- [Pa11y](https://pa11y.org/), a command-line tool designed to run in CI so a build can fail when new violations appear.

These tools catch the issues that have clear programmatic rules: missing `alt` attributes, insufficient color contrast, missing form labels, empty buttons, and invalid ARIA usage. Wiring one into CI keeps regressions from shipping.

## What passing and failing look like in code

The clearest way to see what an automated rule catches is to look at the markup on both sides of it. Each pair below is a common criterion, the version that fails, and the version that passes.

**Text alternatives (SC 1.1.1).** An image needs a text alternative that conveys its meaning, or an empty `alt` if it is purely decorative.

```html
<!-- Fail: no alt, or a useless one -->
<img src="q3-revenue.png" />
<img src="q3-revenue.png" alt="image" />

<!-- Pass: describes the content; decorative images get an empty alt -->
<img src="q3-revenue.png" alt="Bar chart: Q3 revenue up 12 percent over Q2" />
<img src="divider.png" alt="" />
```

**Form labels (SC 1.3.1, 4.1.2).** A placeholder is not a label. It disappears on input and is not reliably announced.

```html
<!-- Fail: placeholder only, no programmatic label -->
<input type="email" placeholder="Email" />

<!-- Pass: a real label tied to the input -->
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" />
```

**Name for icon-only controls (SC 4.1.2).** An icon button with no text has no accessible name.

```html
<!-- Fail: screen reader announces "button", nothing more -->
<button>
	<svg aria-hidden="true"><!-- x icon --></svg>
</button>

<!-- Pass: an accessible name, icon hidden from the tree -->
<button aria-label="Close dialog">
	<svg aria-hidden="true"><!-- x icon --></svg>
</button>
```

**Link purpose (SC 2.4.4).** Link text should make sense on its own, since screen reader users often pull links out of context.

```html
<!-- Fail: "click here" tells you nothing in a link list -->
<a href="/reports/q3.pdf">click here</a>

<!-- Pass: the text names the destination -->
<a href="/reports/q3.pdf">Download the Q3 report (PDF)</a>
```

**Use of color (SC 1.4.1).** Meaning cannot be carried by color alone.

```html
<!-- Fail: the only signal of an error is a red border -->
<input class="error" aria-invalid="true" />

<!-- Pass: a text cue in addition to the color -->
<input class="error" aria-invalid="true" aria-describedby="email-err" />
<p id="email-err"><strong>Error:</strong> Enter a valid email address.</p>
```

**Target Size, Minimum (SC 2.5.8, new in 2.2).** Interactive targets should be at least 24 by 24 CSS pixels, unless there is enough spacing around them or an equivalent alternative. This breaks on a tight row of icon buttons rendered at 16 pixels with no padding.

```css
/* Fail: 16px icons, easy to mis-tap */
.toolbar button {
	width: 16px;
	height: 16px;
}

/* Pass: 24px minimum target, icon can stay 16px */
.toolbar button {
	min-width: 24px;
	min-height: 24px;
	padding: 4px;
}
```

**Accessible Authentication, Minimum (SC 3.3.8, new in 2.2).** A login step must not depend on a cognitive function test with no accessible alternative. Blocking paste defeats password managers, which forces the user to transcribe or memorize.

```html
<!-- Fail: paste disabled defeats password managers -->
<input type="password" onpaste="return false" />

<!-- Pass: let the field be pasted into and autofilled -->
<input type="password" autocomplete="current-password" />
```

The broader fix for authentication is to support passkeys, email or OAuth sign-in, and password-manager autofill, and to pair any CAPTCHA with a non-cognitive alternative such as object recognition or a device check.

## What automation misses

The limitation to automated tools is coverage. By [Deque's own measurement](https://www.deque.com/automated-accessibility-coverage-report/), axe-core detects around 57 percent of issues by volume, and broader industry estimates put automated coverage closer to 30 to 40 percent of the WCAG success criteria. There must be a person involved in the process. Automation can confirm that something exists, but it cannot judge whether the correct path was taken, which requires human thoughtfulness.

Alt text is a good example of where you would get an automation pass, but human thoughtfulness would be required to make sure that the text actually describes the image. A product photo with `alt="DSC_0042"` or `alt="image"` passes every automated scan because the attribute is present, yet it tells a screen reader user nothing. A human reviewer would look at the image, read the alt text, and immediately notice the problem.

The same issue will appear on multiple criteria, not just alt text. In the examples below, the automated test passes, but the structural requirements go unmet:

| What the automated tool checks (and passes) | What a human still has to judge                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| An image has an `alt` attribute             | Whether the alt text describes the image, or is just a filename                |
| A page has one `h1` and heading tags exist  | Whether the heading order is logical and reflects the content structure        |
| Every link has text                         | Whether "click here" or "read more" makes sense out of context                 |
| A form input has an associated `<label>`    | Whether the label wording actually explains what to enter                      |
| A video has a `<track>` captions file       | Whether the captions are accurate and synced to the audio                      |
| Text meets the contrast ratio               | Whether meaning is carried by color alone (a red "error" with no icon or text) |
| Elements carry ARIA roles and attributes    | Whether those roles match how the widget actually behaves for a screen reader  |
| The DOM order is valid                      | Whether keyboard focus order matches the visual order and nothing traps focus  |

None of the answers in the right column can be produced by a scanner. A human would be necessary to review the page thoughtfully and find the correct answer to those issues. These issues surface the moment you tab through an interface or turn on a screen reader.

Automated tooling is your baseline. It is not the full picture. We can add these things to our build system as a great first line of defense, but WCAG conformance requires human review: keyboard-only navigation, a screen reader pass, and a human judging whether the content is genuinely usable. Both layers are complementary, the automated and the human testing. One does not replace the other.

For a related look at how the same accessibility semantics that help screen readers also get read by bots, see [the note on vetting sales leads]({% post_url 2026-06-26-identity-is-not-legitimacy-vetting-a-sales-lead-is-an-arms-race %}).

## The future of accessibility testing with AI

AI is starting to change how developers test for these things. The rule-based scanners in the last section can only check mechanics, whether an `alt` attribute exists or whether the contrast ratio passes. They cannot evaluate meaning. Vision models can read an image and describe what is in it, which brings a set of judgment checks within reach of tooling for the first time.

Take alt text. A vision model like Claude, GPT, or Gemini can look at an image, work out what it shows, and write a draft description that fits the context. A check that used to be fully manual becomes a fast first pass, which is well beyond what earlier automation could manage. The same reasoning extends to other judgment-heavy checks: whether link text describes its destination, whether a heading structure matches the content, whether an ARIA role is plausible for the widget it sits on. A newer class of AI accessibility agents runs the deterministic rules first and then layers this kind of reasoning on top, returning suggested code fixes instead of raw rule IDs, which speeds up remediation.

The catch is that a model can be confidently wrong. It can misread an image, miss the reason a particular image was chosen, or invent detail that is not there. AI-generated alt text that ships without review can be grammatically clean and factually wrong, which is worse than an obvious error because it looks finished. So the human stays in the loop, now as a reviewer rather than the sole author: the AI drafts, a person checks the draft against the actual image and its purpose on the page, and only then does it ship.

Two things are worth keeping in mind. AI extends what automation can help with, by [one industry estimate](https://testeragents.com/accessibility-testing-ai/) roughly 5 to 10 percentage points of the success criteria beyond the machine-testable baseline, but it does nothing for the parts that still need a real assistive-technology pass: screen reader experience, cognitive accessibility, and complex interactive components. Also be aware of accessibility overlay widgets that promise full automated compliance from a single script; they cannot make the source-code changes real remediation requires, which is why they remain a red flag. What works is a mix, with deterministic scanners on the mechanics, AI drafting the contextual work and speeding up fixes, and a person verifying all of it before it counts as conformant.

## Bringing it together

A realistic testing setup is layered. Automated scanners run in CI on every change and catch the mechanical regressions. AI drafts the contextual work and suggests fixes. A person runs the keyboard and screen reader passes and signs off on the parts only a human can judge. That mix is what gets a site to a defensible WCAG 2.1 AA today, and toward 2.2 AA next.

Which standard you actually owe, and to which law, is the other half of the picture. For the standards and the legal requirements behind all of this, from the European Accessibility Act to US rules for government and private sites, see the companion reference on [web accessibility standards and law]({% post_url 2026-07-24-web-accessibility-standards-and-law-wcag-eaa-us %}).

## References

- axe-core testing engine, Deque: [github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core)
- Automated Accessibility Coverage Report (the 57 percent figure), Deque: [deque.com/automated-accessibility-coverage-report](https://www.deque.com/automated-accessibility-coverage-report/)
- Lighthouse accessibility scoring, Chrome DevTools: [developer.chrome.com/docs/lighthouse/accessibility/scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
- WAVE evaluation tool, WebAIM: [wave.webaim.org](https://wave.webaim.org/)
- Pa11y accessibility testing: [pa11y.org](https://pa11y.org/)
- How to Meet WCAG (quick reference), W3C WAI: [w3.org/WAI/WCAG22/quickref](https://www.w3.org/WAI/WCAG22/quickref/)
- What's New in WCAG 2.2, W3C WAI: [w3.org/WAI/standards-guidelines/wcag/new-in-22](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- AI accessibility testing and the WCAG coverage ceiling (5 to 10 point estimate), analyst overview: [testeragents.com/accessibility-testing-ai](https://testeragents.com/accessibility-testing-ai/)
