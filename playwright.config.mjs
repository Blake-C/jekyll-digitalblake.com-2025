import { defineConfig, devices } from '@playwright/test'

// Block 24210-24219 in digitalblake-system-setup/notes/dev-ports.md. Not 4005:
// that is the Jekyll dev server, and the two need to be able to run at once.
const PORT = Number(process.env.PORT ?? 24210)

export default defineConfig({
	testDir: './test/e2e',
	// Chromium only for now. Firefox and WebKit cost image size and runtime for
	// a site whose JavaScript is a handful of small modules.
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
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
