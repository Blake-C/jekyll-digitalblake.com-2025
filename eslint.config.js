const js = require('@eslint/js')
const globals = require('globals')
const prettier = require('eslint-config-prettier')

module.exports = [
	{
		ignores: [
			'assets/js/*.min.js',
			'_site/**',
			'_site_dev/**',
			// Gitignored article working files. Scratch scripts written while drafting
			// are not shipped code, and linting them fails the whole run.
			'_drafts/**',
			'node_modules/**',
			'vendor/**',
			'_includes/critical.min.css',
		],
	},
	js.configs.recommended,
	{
		files: ['theme_components/js/**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	},
	{
		files: ['script/**/*.mjs', 'test/**/*.mjs'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ['postcss.config.js', 'eslint.config.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'commonjs',
			globals: {
				...globals.node,
			},
		},
	},
	prettier,
]
