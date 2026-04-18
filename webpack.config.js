const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		main: './theme_components/js/global-scripts.js',
		prism: './theme_components/js/prism-scripts.js',
	},
	output: {
		path: path.resolve(__dirname, 'assets/js'),
		filename: '[name].min.js',
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true,
						passes: 2,
					},
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
}
