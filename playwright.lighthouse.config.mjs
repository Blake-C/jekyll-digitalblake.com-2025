import { defineConfig } from '@playwright/test'

/**
 * Separate from playwright.config.mjs so `playwright test` stays fast, since a
 * Lighthouse run takes about fifteen seconds per page.
 *
 * Run with: docker compose run --rm playwright npm run test:lighthouse
 */
const PORT = Number(process.env.PORT ?? 24210)

export default defineConfig({
	testDir: './test/lighthouse',
	// Lighthouse measures timings, so nothing else may compete for the CPU.
	workers: 1,
	fullyParallel: false,
	// Absorbs a slow cold run. A real regression fails both times.
	retries: 1,
	timeout: 120_000,
	use: {
		baseURL: `http://localhost:${PORT}`,
	},
	webServer: {
		command: 'node test/e2e/serve.mjs',
		url: `http://localhost:${PORT}/`,
		reuseExistingServer: !process.env.CI,
		env: { PORT: String(PORT) },
	},
	reporter: 'list',
})
