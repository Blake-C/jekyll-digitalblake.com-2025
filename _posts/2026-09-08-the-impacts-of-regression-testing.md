---
layout: post
title: 'The Impacts of Regression Testing'
description: 'Adding Playwright and Lighthouse to my own site found missing JSON-LD on 14 case studies, WCAG violations axe missed, a layout shift, and an SVG dropping performance score to 57.'
date: 2026-09-08 14:30:39 CDT -0500
categories: ['Articles']
tags: ['testing', 'regression-testing', 'playwright', 'lighthouse', 'accessibility', 'performance', 'jekyll']
image: '/assets/uploads/2026/09/the-impacts-of-regression-testing.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>14 case studies rendered without their <code>CreativeWork</code> JSON-LD</strong> because <code>_includes/head.html</code> still checked for <code>website-case-study</code> after the layout was renamed to <code>case-study</code>. Two tests were created, one to ensure that the JSON-LD blocks parse and another making sure they loading on every page. </li>
		<li><strong>A 300ms fade-in on the code block toolbar was measured as a contrast of 1.53:1, failing 4 runs out of 10.</strong> axe was reaching the toolbar before Prism finished, so the test now waits for the toolbar to reach its resting opacity before axe measures color.</li>
		<li><strong>Case study layouts centered themselves only after main CSS loaded causing a layout shift.</strong> Moving these styles to the grid system allowed them to load with the critical CSS. Repeated runs now measure cumulative layout shift from 0 to 0.034 against a ceiling of 0.1.</li>
    	<li><strong>10 Gaussian blurs in a Sketch SVG export dropped a page's mobile emulation performance score to 57.</strong> Replacing them with radial gradients brought the score back into the 90s, and the budget now fails anything under 85.</li>
    	<li><strong>Lighthouse reported two accessibility violations that axe didn't, because axe skips experimental rules by default.</strong> Those were a Label in Name violation on the coding project buttons and an HTML table missing a header. One tool does not stand in for the other, so review both sets of results for inconsistencies.</li>
    	<li><strong>A Marketo form on seismic.com broke when a change to one instance of the form caused a regression in another.</strong> Integration and functional tests would have been useful there, and they never got implemented because the team didn't have the time.</li>
    </ul>

</aside>

## What is Regression Testing?

Regression testing checks that behavior which already worked still works after a change, so bugs and other issues get identified before they reach the end user in the production environment. Usually tests can run as part of a CI/CD pipeline while deploying to production, but can run locally as part of your development loop.

## Where Regression Testing had an impact

There were several instances where issues did not get caught until I added regression testing. One of these examples on my own site is a content type name mismatch for the JSON-LD markup provided on the case studies. A CreativeWork schema implementation wasn't getting output because I had previously changed the name of this content type and that didn't get reflected in the header file. This is the exact type of regression where we can add a test to prevent the issue from reappearing in the future.

That's 14 case studies that weren't getting their CreativeWork schema JSON-LD markup because the `_includes/head.html` file checked for `page.layout == 'website-case-study'`. This should have been `page.layout == 'case-study'`. Once the issue was identified, two tests could be added:

- a test to verify the JSON-LD data was valid
- a test to check that the JSON-LD data was loading on the front-end page

The following is only a snippet of the test document:

```js
const isCaseStudy = url => /^\/case-studies\/[^/]+\/$/.test(url)

test('every JSON-LD block is valid JSON', () => {
	for (const { url, html } of all) {
		for (const block of jsonLdBlocks(html)) {
			assert.doesNotThrow(() => JSON.parse(block), `${url}: JSON-LD does not parse`)
		}
	}
})

test('each page type emits its structured data', () => {
	const missing = []
	const expect = (page, type) => {
		if (!jsonLdTypes(page.html).includes(type)) missing.push(`${page.url} is missing ${type}`)
	}

	for (const page of all) {
		if (page.url === '/') expect(page, 'Person')
		else if (isPost(page.url)) expect(page, 'Article')
		else if (isCaseStudy(page.url)) expect(page, 'CreativeWork')
		else if (isGuide(page.url)) expect(page, 'CollectionPage')
		if (profileUrls.has(page.url)) expect(page, 'ProfilePage')
	}

	assert.deepEqual(missing, [], `structured data missing:\n  ${missing.join('\n  ')}`)
})
```

There were also accessibility issues, such as with code blocks, that didn't get caught until Playwright was implemented to do additional testing alongside axe and Lighthouse, which brought those issues to the surface. On my machine, Claude Code is locked down to the specific project being worked on and doesn't have direct access to my browser, whereas with Playwright Claude Code has a way to actually see the web page, the profiler, and the console.

On the code blocks, there was an issue with a 300 millisecond fade-in being reported as a contrast of 1.53:1, failing 4 runs out of 10. This was due to axe getting to the toolbar before Prism, the script that powers the code blocks. In the below example, `settleCodeToolbar` gets us past that fade-in to do a true test of the final page.

```js
async function settleCodeToolbar(page) {
	const block = page.locator('div.code-toolbar').first()
	if ((await block.count()) === 0) return

	const toolbar = page.locator('div.code-toolbar > .toolbar').first()
	await toolbar.waitFor({ state: 'attached' })
	await expect
		.poll(() => toolbar.evaluate(element => getComputedStyle(element).opacity), {
			message: 'the Prism toolbar never settled to its resting opacity',
		})
		.toBe('0')
}

const summarise = violations => violations.map(v => `${v.id} (${v.impact}) on ${v.nodes.length}: ${v.help}`)

for (const [name, url] of Object.entries(PAGES)) {
	test(`the ${name} page has no WCAG 2.1 AA violations`, async ({ page }) => {
		await page.goto(url)
		await settleCodeToolbar(page)

		const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
		expect(summarise(violations), `axe violations on ${url}`).toEqual([])
	})
}

test('the code block toolbar meets contrast in the state that shows it', async ({ page }) => {
	await page.goto('/case-studies/teleport-atlas/')
	await settleCodeToolbar(page)

	await page.locator('div.code-toolbar').first().hover()
	const toolbar = page.locator('div.code-toolbar > .toolbar').first()
	await expect.poll(() => toolbar.evaluate(element => getComputedStyle(element).opacity)).toBe('1')

	const { violations } = await new AxeBuilder({ page }).withTags(TAGS).include('div.code-toolbar').analyze()
	expect(summarise(violations), 'axe violations on the visible code toolbar').toEqual([])
})
```

Playwright also found layout shifting on the case study detail pages where the page content would jump towards the center after main CSS resolved. This happened because the critical CSS didn't contain the styles for the case studies that did the centering. This would have been caught by either purposefully slowing down the page load, loading on a clean cache, or via Playwright. The solution was to extract the styles in the case study CSS and move them over to the grid system where I could center that column and have that be a part of the critical CSS. With the fix in place, repeated runs using a ceiling of 0.1 measured cumulative layout shift (CLS) from 0 to 0.034. It ultimately didn't save anything in terms of the size of the critical CSS, but it did fix the jumping issue that occurred on page load.

A trickier example where Playwright caught a regression that I didn't think to test in the first place was when I switched out a WebP graphic for an SVG as part of the case studies background image. It turned out that that image, the SVG, had 10 Gaussian blurs inside of it that came out of a Sketch export. Those 10 Gaussian blurs slowed down the page so much that the Lighthouse performance score under mobile emulation dropped to 57. Switching those Gaussian blurs to radial gradients improved the score into the 90s. Now Playwright is using Lighthouse to score the pages, and we have a baseline of 85 for how low the performance score can drop. All other scores are kept at 100. Anything that drops a mobile emulation performance score to below 85 in the future will now get captured and can be corrected.

And then finally there was an instance where Lighthouse's accessibility audit caught issues that axe didn't due to a configuration difference. Both run axe-core under the hood, but axe lists the offending rules under experimental; those rules get skipped by default. One example is the labels on the coding project buttons not passing [WCAG 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html), a `label-content-name-mismatch` violation. I was able to get rid of an ARIA label that was not needed and just use a screen reader text-only section that extended the button text to read properly for when the button click opens in a new window. Another is an accessibility issue with one of the HTML tables, which was missing one of the [headings](https://www.browserstack.com/docs/accessibility/rules/a11y-engine/td-has-header); the heading was not necessary, but it adds additional context for screen reader users to understand the table better. The lesson here is to remember that one test does not stand in for the other. You must also review the results for inconsistencies to make sure you have adequate coverage.

## A past example where Regression Testing could have been useful

An example of high-priority testing would be when I worked on the seismic.com website. We had our request-a-demo form, which is powered by Marketo. This is high priority because it's the primary intake pipeline for getting potential clients through the door to turn them into paying customers. We'd want to test both the integration and the functionality.

In that testing, we'd want to make sure that all the fields were properly validated based on their input. So a name into a text field would pass, and any numbers would fail. An email in an email field would pass, but if it's a personal email it would fail. Same thing for the phone field. You then want to test both cases on your pass scenario and your fail scenario on submission. If it fails, do error messages appear and are they the error messages which you would expect to see based on whatever the failed test is?

When testing an integration, you want to make sure that when the user lands on the home page:

- they can click the request-a-demo button
- the request-a-demo page loads
- the Marketo form initializes
- they can see all the fields on the form

Both the integration test and the functional testing would have been useful on seismic.com very specifically because I do remember an instance where one of our Marketo forms broke because a piece of functionality was changed on one instance of a form, but caused a regression on another. On that particular project we never got around to implementing testing because we didn't have the time based on the desires and requests being made by our management team. But I think this is an instance where both management needs to understand the benefits of testing and where the development team needs to push back, making a case for testing and requesting the time to implement them.

## Automated testing and AI tooling do not replace the human

AI has brought the implementation of testing down to such a low level that implementing tests across your project has become trivial. One of the downsides to that is that you might be overeager to add tests. Although I was able to use AI to more quickly build out tests, there were instances where some of the tests were flaky, such as a 300ms fade-in causing a false contrast fail on my code blocks, or an aborted sub-resource causing WebKit to hang. You need to be cognizant of the long-term maintenance of the tests and where the test itself could be the issue. A human still needs to be in the pipeline to catch what automated testing cannot, because the human can reason about what's **actually** happening on the screen versus what a test or prompt says **ought** to be happening.

## Testing can be expensive

When running tests on only those items you changed, these tests should take a matter of seconds, compared to a couple of minutes for merging against several commits, and hours for nightly scheduled and pre-release testing to ensure your deployment is stable.

- **Commits and Pull Requests:** quick short bespoke units
- **Pre-merging into main:** medium length grouped segments of change
- **Nightly scheduled:** longer length segments which can be followed up on the next day
- **Pre-release deployment:** full project end-to-end testing run early enough for priority and modifications to be made

The moderate path to follow is to be running tests on changes that you perform while developing, but then prior to your deployment window and merging into main, you run the full test suite to catch any blockers. Not all of us are running Facebook.com or Instagram-level applications. So we need to keep our expectations in check and build our tests accordingly. Don't over-leverage yourself on testing if the cost and time don't justify the effort. You can choose to be very specific in whatever your key high-priority items are and test those and leave the rest to manual testing.

If your tests take a long time to run without an adequate amount of benefit or your tests are testing the wrong things, giving false positives, they will start to be ignored, completely negating the benefits that you would get from regression testing. You must do proper upfront analysis of what you want to test, the benefits you expect to get from them, and the cost it will take to implement those tests, to determine what you need to test in the first place.

## Coming around on Regression Testing

Before introducing testing via Playwright and `node:test` on several aspects of my own website, I didn't think testing would contribute a large enough value to the project, given the overall cost it would take to implement. However, implementing it on my own site has caused me to come around to a more favorable view of regression testing and testing in general. There are several issues that I didn't even realize existed until I started to implement tests and dig deeper, whether that was the broken JSON-LD block on case studies, the WCAG 2.1 AA violations on code blocks, the layout shifts on the case study pages, or the cost of 10 Gaussian blurs on a Sketch SVG export.
