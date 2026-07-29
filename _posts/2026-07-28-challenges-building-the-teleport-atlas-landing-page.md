---
layout: post
title: 'Challenges Building the Teleport Atlas Landing Page'
description: 'Six checks that passed on broken code in a Next.js landing page build, including axe reporting zero violations with three accessibility defects.'
date: 2026-07-28 15:24:31 CDT -0500
categories: ['Articles']
tags: ['accessibility', 'wcag', 'testing', 'axe-core', 'nextjs', 'vercel', 'claude-code']
image: '/assets/uploads/2026/07/challenges-building-the-teleport-atlas-landing-page.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>axe reported zero violations on a carousel with three accessibility defects.</strong> Focus loss, non-text contrast, and a button label describing the wrong state are all outside what it checks.</li>
		<li><strong>A DOM diff reported no differences because it compared a build against itself.</strong> A <code>next dev</code> server from an earlier run still held port 3000, and the new server fell back to 3001.</li>
		<li><strong>The type checker passed a pause button that did nothing on the first press.</strong> Lint and the DOM diff passed it too. Clicking it in a browser is what found it.</li>
		<li><strong>A scripted browser test approved a Content Security Policy that broke visual editing.</strong> The test framed the site from one origin and passed. Sanity's Presentation tool builds a different ancestor chain.</li>
		<li><strong>Two commands print success and change nothing.</strong> <code>vercel env add</code> from an unlinked directory, and Sanity's TypeGen when its query paths stop matching.</li>
		<li><strong>The security scanner needed its own ignore file in each project directory.</strong> Without it the scan indexed 1.7 GB of dependencies and returned hundreds of third-party findings alongside this project's own.</li>
	</ul>
</aside>

Teleport Atlas is a Next.js 16 landing page, built from a Figma file as a coding challenge. The build is covered in the [Teleport Atlas case study](/case-studies/teleport-atlas/), and moving its copy into a CMS is covered in [Taking a Next.js App from Static Export to Sanity CMS]({% post_url 2026-07-27-taking-a-nextjs-app-from-static-export-to-sanity-cms %}).

## Three issues were found, even though the axe report had no violations

The carousel rotates through cards and has arrow buttons, dots, and a play and pause button, and axe reported no violations on it.

![axe DevTools reporting zero automatic issues on the page](/assets/uploads/2026/07/axe-devtools-result.webp)

The arrow buttons used the `disabled` property. A disabled button is removed from the tab order. Pressing Next until it reached the last card removed the focus from the button that had just been pressed, which put focus on `<body>`, and the next Tab started over at the top of the page. Switching to `aria-disabled` keeps the button focusable and still announces it as unavailable. The click handler ignores the press when the carousel is at the last card.

The idle dots used a background-overlay color measuring 1.36:1 against the row. [SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) requires 3:1 for user interface components, and its exemption covers components that are inactive. These dots are unselected, and a visitor still has to see them to click them, so the exemption does not apply. Repointing them at an existing tertiary text color measured 5.39:1.

The third defect was the play and pause button. The carousel pauses on hover so you can read a card, and it has a button because [WCAG 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html) requires one. Pressing play set a playing state that stayed set, so hover stopped pausing for the rest of the visit. The hover handler was also bound to the component root instead of the card track, so moving the pointer toward the button counted as a hover. The button label changed to "Resume automatic rotation" before the pointer reached it, so the label no longer described what the click would do.

Now only the paused state stays set. Pressing play lets hover pause the carousel again, and the hover handlers are on the card track, which the button is not inside.

axe reported zero violations before and after all three changes. Three things are outside what it checks.

- focus loss on a control that disables itself
- non-text contrast
- a button whose label describes the wrong state

The logo row can be switched to a scrolling marquee, and WCAG 2.2.2 requires a mechanism to pause it. That criterion is Level A and has no exemption for decorative motion. `prefers-reduced-motion` does not satisfy it, because an OS preference is not a mechanism. Hover-to-pause does not satisfy it either, because it only works for pointers. axe reports zero violations whether or not the pause button exists, so nothing in CI would catch someone removing it.

<aside class="callout callout--related" aria-label="Related reading">
	<p>Automated accessibility testing has failures it cannot catch. Those tools cover about 30 to 40 percent of the WCAG success criteria, and the rest needs a human to make a judgment call. I wrote about where each tool stops and what a manual pass has to cover in <a href="{% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}">testing for WCAG conformance</a>.</p>
</aside>

## The DOM diff ran against the wrong server

Moving the copy into a CMS meant pulling the text out of every component and passing it back in as props. The markup and the CSS were supposed to come through unchanged.

- capture the DOM of the deployed build
- capture the DOM of the local build
- normalize the CSS-module hashes, which differ between builds
- diff the two

The first run reported 611 nodes and 0 differences. A `next dev` server from an earlier run was still bound to port 3000, so `pnpm start` fell back to 3001. Every `curl localhost:3000` reached the old server, and the diff compared the deployed build against pre-change code.

The check now kills port 3000 first and confirms what the new server bound to.

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
pnpm start > /tmp/server.log 2>&1 &
for i in $(seq 1 30); do curl -sf -o /dev/null http://localhost:3000/ && break; sleep 1; done
grep -i "port\|Local:" /tmp/server.log
```

Once that was corrected, the diff found two differences that had passed the type checker and the linter. Section headers were rendering as `div`. The original markup used `<header>`, and the extracted `SectionHeader` component wrapped everything in a `div`, so no section had a `header` landmark. It now takes a `wrapper` prop with three values, `div`, `header`, or `none`, and each section sets it to the element it used before.

The second difference was a `position: relative` on every row that nothing depended on, left behind when the section components were rewritten to take props. Removing it did not change how the page rendered.

## The type checker passed a broken pause button

The rule behind the carousel and the marquee is three functions in their own module. Moving it out of the component made it testable without a renderer.

```ts
export function isPaused({ enabled, manuallyPaused, hovered, focused }: PauseInputs): boolean {
	return enabled && (manuallyPaused || hovered || focused)
}

export function nextManual(inputs: PauseInputs): boolean {
	return !isPaused(inputs)
}
```

`nextManual` is what the playback button sets the sticky flag to. It reads off the current paused state and not off `manuallyPaused`, because the button shows "Pause" whenever anything is moving, and pressing it then has to stop things even though `manuallyPaused` is already false.

The first version had `nextManual` inverted, so pressing pause on a running carousel did nothing. The type checker, the linter, and the DOM diff all passed on that version. I found it by clicking through the page in a browser.

There are seven tests on that module now. One of them is "the button pauses on the first press from idle", which would have failed on the inverted version.

One Sanity package fails the same way. `@sanity/icons` declares `RocketIcon` and every other icon name in its root type declarations, and the package root only exports `Icon` and `icons` at runtime. A root import type-checks, builds, and then fails in the browser. The working import is the per-icon subpath.

```ts
import { RocketIcon } from '@sanity/icons/Rocket'
```

## A scripted browser test passed a CSP that broke visual editing

Sanity's Presentation tool loads the site in an iframe. Both `X-Frame-Options` and a Content Security Policy `frame-ancestors` directive stop that.

A policy of `frame-ancestors 'self' https://*.sanity.studio` shipped to production and broke visual editing.

```
Unable to connect, check the browser console for more information.
Framing 'https://teleport-atlas.vercel.app/' violates the following Content
Security Policy directive: "frame-ancestors 'self' https://*.sanity.studio".
```

That policy had passed a scripted browser test which framed the deployed site from `https://teleport-atlas.sanity.studio` and confirmed it loaded. Presentation builds a longer ancestor chain than that single hop, so the test never reproduced how the tool loads the site.

`next.config.ts` now sends no framing header at all. Confirming that takes one request.

```bash
curl -sI https://teleport-atlas.vercel.app/ | grep -iE "content-security-policy|x-frame-options"
# expect no output
```

The rest of a CSP is left off on purpose. Next.js inlines scripts and styles during hydration, so a useful `script-src` needs nonces threaded through the app, and a policy that ends in `unsafe-inline` does not restrict which scripts run. Adding one back means deploying it to a preview URL, pointing the Studio at that URL, and opening Presentation to see the preview pane render.

## Two commands that exit successfully after doing nothing

`vercel env add` has to run from the directory Vercel is linked to, which on this project is the git root and not the app directory. Run from anywhere else it prints what looks like success and adds no variable.

```bash
printf '%s' "$VALUE" | vercel env add NAME production --sensitive
vercel env ls
```

The second line is the only way to see whether the first one did anything.

Sanity's TypeGen also exits successfully after doing nothing. `sanity.cli.ts` points at `../teleport-application/src/**/*.{ts,tsx}` and writes the generated types back into the app. Renaming either directory stops the paths from matching. TypeGen then reports "no queries found" and exits successfully, so the build carries on with stale types.

## The security scanner needed a .dcignore in each project directory

Snyk treats the path it is handed as the scan root, and it reads ignore files only at or below that path. The `node_modules/` rule for this project lives in the `.gitignore` at the git root, which is above both project directories. Scanning `teleport-application/` without a `.dcignore` inside it indexed around 1.7 GB of dependencies. The scan took minutes and returned hundreds of third-party findings alongside the findings for this project's code. With a `.dcignore` in each project directory the same scan returns in seconds, and a clean run is `issueCount: 0`.

Generated Lighthouse reports cause the same problem on a smaller scale, so `.lighthouseci/` gets deleted before a scan. The HTML in those reports is generated, and it accounts for dozens of findings.

The dependency scan reports a standing set of findings, several of them high, in the `next-sanity` to `sanity` to `@sanity/cli` subtree. That subtree is command-line tooling and never reaches the Next.js build output, and the fixes have to come from Sanity. The current set of findings is the baseline, and the check on each change is whether it added a finding.

## The minimum release age blocked a security patch

Next 16.2.7 turned up eight Snyk findings, two of them high-severity SSRF advisories. Next 16.2.11 fixed all eight, and it had been published five days earlier. The project refuses anything published in the last seven days.

Lowering the minimum release age would have dropped that protection on every other dependency at the same time. The exact version went into `minimumReleaseAgeExclude`, which only exempts that one package at that one version. Everything else kept the full seven days, pnpm still refused the newer 16.2.12, and the entry gets removed at the next upgrade.

<aside class="callout callout--related" aria-label="Related reading">
	<p>The minimum release age setting exists because of the Shai Hulud worm, which poisoned a pnpm store cache in GitHub Actions to reach TanStack and 170+ npm packages. I covered how that attack worked and the full <code>pnpm-workspace.yaml</code> hardening config in <a href="{% post_url 2026-05-15-supply-chain-attacks-got-smarter %}">Shai Hulud npm attack</a>.</p>
</aside>

While confirming the fix, postcss and sharp also showed high findings, and both reach production through Next.js. Their fixes were published well over seven days earlier, so they went in as plain version overrides.

## What the checks did not cover

Five checks on this project reported a pass on code that was wrong.

- axe on three accessibility defects
- the DOM diff, against a server holding pre-change code
- the type checker and the linter, on an inverted pause button and on a package import that fails at runtime
- a scripted browser test, on a policy that broke visual editing
- `vercel env add` and Sanity's TypeGen, both of which exit successfully after doing nothing

Snyk reported no pass. Without a `.dcignore` in each project directory it returned hundreds of third-party findings alongside this project's own.

Finding these took five things.

- tabbing through the controls by hand
- clicking the controls in a browser
- confirming which server answered before trusting a diff
- opening Presentation against a preview deployment instead of scripting an iframe
- running `vercel env ls` after every `vercel env add`

The pause rule is the only one of these that ended up covered by a test, because moving it out of the component made it testable without a renderer. The rest are written down as steps in a verification document, because no tool in this project's CI reports them.
