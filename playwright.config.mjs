import { defineConfig, devices } from '@playwright/test'

// Block 24210-24219 in digitalblake-system-setup/notes/dev-ports.md. Not 4005:
// that is the Jekyll dev server, and the two need to be able to run at once.
const PORT = Number(process.env.PORT ?? 24210)

export default defineConfig({
	testDir: './test/e2e',
	// All three engines are already in the Playwright image, so the only cost is
	// runtime: 8s for chromium alone against 36s for all three. Chromium stays
	// the default run to keep the local loop short, and CI runs every project.
	// Pick one with --project=<name>.
	//
	// WebKit matters more than its share of traffic suggests. Both modals are
	// built on <dialog>, which is the one modern API here with real cross-engine
	// history.
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
	],
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
	},
	// Serves the production build in _site, so these tests read the same output
	// the node:test contract tests do.
	webServer: {
		command: `node test/e2e/serve.mjs`,
		url: `http://localhost:${PORT}/`,
		reuseExistingServer: !process.env.CI,
		env: { PORT: String(PORT) },
	},
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
})
