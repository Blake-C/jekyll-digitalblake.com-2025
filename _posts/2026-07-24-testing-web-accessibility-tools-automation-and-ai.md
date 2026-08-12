---
layout: post
title: 'Testing for WCAG Conformance: Tools, Manual Review, and AI'
description: 'How to test a website against WCAG with axe-core, Lighthouse, WAVE, and Pa11y, what those tools miss, and where AI fits in manual review.'
date: 2026-07-24 17:25:33 CDT -0500
modified_date: 2026-07-28 02:11:06 CDT -0500
categories: ['Articles']
tags: ['accessibility', 'wcag', 'testing', 'axe-core', 'automation', 'ai', 'web-development']
image: '/assets/uploads/2026/07/testing-web-accessibility-tools-automation-and-ai-og.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>Run automated tools in CI.</strong> axe-core, Lighthouse, WAVE, and Pa11y are the common ones. Wiring one into the build stops regressions from shipping.</li>
		<li><strong>Automation covers part of WCAG.</strong> Deque measured 57.38 percent of issues by volume across its audit sample. The share of WCAG success criteria a machine can test at all is smaller. Automation confirms that something exists, like an <code>alt</code> attribute or a contrast ratio, and it cannot read that thing and judge whether it is correct.</li>
		<li><strong>Manual review is required for conformance.</strong> A keyboard-only pass, a screen reader pass, and a person judging the content cover the criteria automation cannot.</li>
		<li><strong>AI can draft the contextual work.</strong> Vision models can write alt text and read a page for meaning. A model can also be confidently wrong, so a person verifies everything before it ships.</li>
		<li><strong>Skip the overlay widgets.</strong> The Overlay Fact Sheet states that full compliance cannot be achieved with an overlay.</li>
		<li><strong>The target:</strong> build and test to WCAG 2.1 Level AA today, with 2.2 AA next.</li>
	</ul>
</aside>

Web accessibility has a technical standard, the Web Content Accessibility Guidelines (WCAG), and a set of laws that require it. Which laws apply to a given site, and which WCAG version each one names, is covered in the companion reference on [web accessibility standards and law]({% post_url 2026-07-24-web-accessibility-standards-and-law-wcag-eaa-us %}). The working target below is WCAG 2.1 Level AA, the version nearly every current law names. WCAG 2.2 AA is next.

## Automated testing tools

Testing WCAG conformance usually starts with automated tools, because they are fast, repeatable, and easy to run on every build. The common ones are:

- [axe-core](https://github.com/dequelabs/axe-core), the Deque engine that most other tools are built on. Its README states that you can find on average 57 percent of WCAG issues automatically with it, and that it returns zero false positives. Deque publishes [seven integration packages](https://github.com/dequelabs/axe-core-npm) around it, including `@axe-core/playwright`, `@axe-core/puppeteer`, `@axe-core/webdriverio`, and `@axe-core/cli`. It also ships as the axe DevTools browser extension.
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring), built into Chrome DevTools. Its accessibility score weights results using axe's user impact assessments, and it runs alongside the performance checks.
- [WAVE](https://wave.webaim.org/) from WebAIM, a browser extension and online tool that renders issues visually on the page.
- [Pa11y](https://pa11y.org/), which publishes a command-line tool that loads web pages and highlights the accessibility issues it finds, plus Pa11y CI, a version geared toward use in CI.

These tools catch the issues that have clear programmatic rules. Missing `alt` attributes, insufficient color contrast, missing form labels, empty buttons, and invalid ARIA usage all have a rule behind them. Wiring one of these tools into CI keeps regressions from shipping.

## What passing and failing look like in code

Each pair below is a common criterion, the markup that fails it, and the markup that passes.

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

**Target Size, Minimum (SC 2.5.8, new in 2.2).** [The criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) requires the target for pointer inputs to be at least 24 by 24 CSS pixels. It lists five exceptions, covering spacing around undersized targets, an equivalent control elsewhere on the page, targets inline in a sentence, sizing determined by the user agent, and cases where the size is essential. A tight row of icon buttons rendered at 16 pixels with no padding fails it.

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

**Accessible Authentication, Minimum (SC 3.3.8, new in 2.2).** [The criterion](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) says a cognitive function test, such as remembering a password or solving a puzzle, must not be required for any step in an authentication process unless an exception applies. Its Understanding page names support for password entry by password managers, and copy and paste, as mechanisms that satisfy it. Blocking paste forces the user to transcribe or memorize the password.

```html
<!-- Fail: paste disabled defeats password managers -->
<input type="password" onpaste="return false" />

<!-- Pass: let the field be pasted into and autofilled -->
<input type="password" autocomplete="current-password" />
```

The broader fix for authentication is to support passkeys, email or OAuth sign-in, and password-manager autofill, and to pair any CAPTCHA with a non-cognitive alternative such as object recognition.

## What automation misses

[Deque measured](https://www.deque.com/automated-accessibility-coverage-report/) that 57.38 percent of total issues across its audit sample were identified by its automated tests, counted by volume of issues. That page also describes the older and commonly cited figure of 20 to 30 percent. That figure counts how many individual WCAG success criteria a machine can test. Deque's figure counts issues found in real audits, so the two numbers measure different things. [One vendor estimate](https://testeragents.com/accessibility-testing-ai/) puts the machine-testable share of success criteria at 30 to 40 percent, and that page cites no published study for the number, so treat it as an estimate.

Either way, a person has to be involved. Automation confirms that something exists. It cannot read that thing and judge whether it is correct.

Alt text shows the difference. A product photo with `alt="DSC_0042"` or `alt="image"` passes every automated scan because the attribute is present, and it tells a screen reader user nothing. A person looks at the image, reads the alt text, and sees the problem.

The same thing happens on other criteria. In each row below, the automated test passes and the structural requirement goes unmet.

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

A scanner cannot produce any of the answers in the right column. A person has to open the page, tab through it, turn on a screen reader, and decide.

Automated tooling is the baseline. Add it to the build system and it catches mechanical regressions on every change. WCAG conformance still requires keyboard-only navigation, a screen reader pass, and a person judging whether the content is usable.

<aside class="callout callout--related" aria-label="Related reading">
	<p>For a related look at how the same accessibility semantics that help screen readers also get read by bots, see <a href="{% post_url 2026-06-26-identity-is-not-legitimacy-vetting-a-sales-lead-is-an-arms-race %}">the note on vetting sales leads.</a></p>
</aside>

## Where AI fits

Rule-based scanners check mechanics. They can tell whether an `alt` attribute exists and whether a contrast ratio passes, and they cannot evaluate meaning. Vision models can read an image and describe what is in it, which puts some judgment checks inside tooling for the first time.

Take alt text. A vision model like Claude, GPT, or Gemini can look at an image, work out what it shows, and write a draft description that fits the context. A check that used to be fully manual becomes a fast first pass. The same reasoning applies to other judgment-heavy checks:

- whether link text describes its destination
- whether a heading structure matches the content
- whether an ARIA role is plausible for the widget it sits on

A model can also be confidently wrong. It can misread an image, miss the reason a particular image was chosen, or invent detail that is not there. AI-generated alt text that ships without review can be grammatically clean and factually wrong. So the person becomes a reviewer. The AI drafts, a person checks the draft against the actual image and its purpose on the page, and then it ships.

The [same vendor estimate](https://testeragents.com/accessibility-testing-ai/) puts the lift from AI at roughly 5 to 10 percentage points of the success criteria beyond the machine-testable baseline. That page cites no published study for the number either. AI does nothing for the parts that need a real assistive-technology pass, which includes screen reader experience, cognitive accessibility, and complex interactive components.

Accessibility overlay widgets promise compliance from a single script. The [Overlay Fact Sheet](https://overlayfactsheet.com/en/), signed by more than a thousand accessibility practitioners, states that full compliance cannot be achieved with an overlay, and that overlays do not repair content in Flash, Java, Silverlight, PDF, HTML5 Canvas, SVG, or media files. Its recommendation is to remediate accessibility issues at the source of the original error.

## A layered testing setup

A realistic setup has three layers.

- Automated scanners run in CI on every change and catch the mechanical regressions.
- AI drafts the contextual work and suggests fixes.
- A person runs the keyboard and screen reader passes and signs off on the parts only a human can judge.

Which standard a given site owes, and under which law, is in the companion reference on [web accessibility standards and law]({% post_url 2026-07-24-web-accessibility-standards-and-law-wcag-eaa-us %}).

## References

- axe-core testing engine, Deque: [github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core)
- axe-core integration packages, Deque: [github.com/dequelabs/axe-core-npm](https://github.com/dequelabs/axe-core-npm)
- Automated Accessibility Coverage Report (the 57.38 percent figure), Deque: [deque.com/automated-accessibility-coverage-report](https://www.deque.com/automated-accessibility-coverage-report/)
- Lighthouse accessibility scoring, Chrome DevTools: [developer.chrome.com/docs/lighthouse/accessibility/scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
- WAVE evaluation tool, WebAIM: [wave.webaim.org](https://wave.webaim.org/)
- Pa11y accessibility testing: [pa11y.org](https://pa11y.org/)
- Understanding SC 2.5.8 Target Size (Minimum), W3C WAI: [w3.org/WAI/WCAG22/Understanding/target-size-minimum.html](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Understanding SC 3.3.8 Accessible Authentication (Minimum), W3C WAI: [w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)
- How to Meet WCAG (quick reference), W3C WAI: [w3.org/WAI/WCAG22/quickref](https://www.w3.org/WAI/WCAG22/quickref/)
- What's New in WCAG 2.2, W3C WAI: [w3.org/WAI/standards-guidelines/wcag/new-in-22](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- Overlay Fact Sheet: [overlayfactsheet.com](https://overlayfactsheet.com/en/)
- AI accessibility testing estimates (30 to 40 percent machine-testable, 5 to 10 point AI lift), vendor overview with no cited study: [testeragents.com/accessibility-testing-ai](https://testeragents.com/accessibility-testing-ai/)
