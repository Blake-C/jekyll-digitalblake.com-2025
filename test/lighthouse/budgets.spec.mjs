import { test, expect, chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import lighthouse from 'lighthouse'

/**
 * Lighthouse budgets, run against the local build.
 *
 * Running these against the deployed site would be wrong. Cloudflare injects
 * /cdn-cgi/challenge-platform/ at the edge, that script calls the deprecated
 * `StorageType.persistent`, and Lighthouse charges the deprecation to the page.
 * The live Best Practices score is 81 for that reason alone. It is nothing this
 * repo builds and nothing a commit here can fix, so gating on it would mean a
 * permanently red check that says nothing about the code. Against _site the
 * same pages score 100.
 *
 * Two audits are affected the other way, and neither is asserted here:
 * test/e2e/serve.mjs sends no cache headers and no compression, so
 * `cache-insight` and `document-latency-insight` always fail and byte weights
 * are uncompressed. That makes the performance score pessimistic against
 * production rather than optimistic, which is the safe direction.
 *
 * One page gets one Lighthouse run and every budget is checked against it. The
 * run is deliberately not cached across tests: a retry has to measure again,
 * otherwise it just re-reads the number that already failed.
 *
 * Thresholds live in budgets.json. Set them from measured runs of this spec,
 * not from a standalone script: the test runner and its web server add load,
 * and FCP here reads several hundred milliseconds higher than it does outside.
 */
const BUDGETS = JSON.parse(readFileSync(fileURLToPath(new URL('./budgets.json', import.meta.url)), 'utf8'))
const DEBUG_PORT = Number(process.env.LH_DEBUG_PORT ?? 24213)

// Lighthouse drives the browser itself over CDP, so it needs one with remote
// debugging open rather than the page fixture the other specs use.
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

		// Reported on every run, pass or fail, so a run doubles as a measurement.
		// Thresholds should be set from these numbers rather than guessed.
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
