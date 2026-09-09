import { test, expect, chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import lighthouse from 'lighthouse'

/**
 * Lighthouse budgets, run against _site and never the deployed site. Cloudflare
 * injects /cdn-cgi/challenge-platform/ at the edge, that script calls the
 * deprecated `StorageType.persistent`, and Lighthouse charges the deprecation to
 * the page, costing the live site its Best Practices score. No commit here can
 * change that.
 *
 * test/e2e/serve.mjs sends no cache headers and no compression, so
 * `cache-insight` and `document-latency-insight` always fail and byte weights
 * are uncompressed. Neither is asserted, and both make the performance score
 * pessimistic against production.
 *
 * Thresholds live in budgets.json. Set them from runs of this spec, since the
 * test runner and its web server add load that reads several hundred
 * milliseconds onto FCP.
 */
const BUDGETS = JSON.parse(readFileSync(fileURLToPath(new URL('./budgets.json', import.meta.url)), 'utf8'))
const DEBUG_PORT = Number(process.env.LH_DEBUG_PORT ?? 24213)

// Lighthouse drives the browser itself over CDP, so it needs one launched with
// remote debugging open instead of the page fixture the other specs use.
let browser

test.beforeAll(async () => {
	browser = await chromium.launch({ args: [`--remote-debugging-port=${DEBUG_PORT}`] })
})

test.afterAll(async () => {
	await browser?.close()
})

for (const [name, path] of Object.entries(BUDGETS.pages)) {
	test(`${name} ${path} is within budget`, async ({ baseURL }, testInfo) => {
		const { lhr } = await lighthouse(new URL(path, baseURL).href, {
			port: DEBUG_PORT,
			output: 'json',
			logLevel: 'error',
		})

		if (lhr.runtimeError) throw new Error(`Lighthouse failed on ${path}: ${lhr.runtimeError.message}`)

		const scores = Object.fromEntries(
			Object.entries(lhr.categories).map(([id, category]) => [id, Math.round(category.score * 100)]),
		)
		const measured = Object.fromEntries(
			Object.keys(BUDGETS.metrics).map(id => [
				id,
				Math.round((lhr.audits[id]?.numericValue ?? NaN) * 1000) / 1000,
			]),
		)

		// Reported on every run, pass or fail, so thresholds can be set from these
		// numbers.
		await testInfo.attach('lighthouse', {
			body: JSON.stringify({ path, scores, measured }, null, '\t'),
			contentType: 'application/json',
		})
		console.log(
			`  LH ${path} perf=${scores.performance} ` +
				Object.entries(measured)
					.map(([id, value]) => `${id}=${value}`)
					.join(' '),
		)

		const violations = [
			...Object.entries(BUDGETS.categories)
				.filter(([id, floor]) => (scores[id] ?? 0) < floor)
				.map(([id, floor]) => `category ${id} scored ${scores[id]}, budget is ${floor}`),

			...Object.entries(BUDGETS.metrics)
				.filter(([id, ceiling]) => !(measured[id] <= ceiling))
				.map(([id, ceiling]) => `metric ${id} was ${measured[id]}, budget is ${ceiling}`),

			// A null score means the audit found nothing to apply to, which counts
			// as a pass. Only an actual 0 or partial score is a failure.
			...BUDGETS.audits
				.map(id => {
					const audit = lhr.audits[id]
					if (!audit) return `audit ${id} does not exist in this Lighthouse version`
					return audit.score === null || audit.score === 1 ? null : `audit ${id} scored ${audit.score}`
				})
				.filter(Boolean),
		]

		expect(violations, `budgets missed on ${path}\nmeasured ${JSON.stringify({ scores, measured })}`).toEqual([])
	})
}
