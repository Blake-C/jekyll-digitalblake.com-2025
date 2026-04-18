const js = require('@eslint/js')
const globals = require('globals')
const prettier = require('eslint-config-prettier')

module.exports = [
	{
		ignores: ['assets/js/*.min.js', '_site/**', 'node_modules/**', 'vendor/**', '_includes/critical.min.css'],
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
		files: ['script/**/*.mjs'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ['webpack.config.js', 'postcss.config.js', 'eslint.config.js'],
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
