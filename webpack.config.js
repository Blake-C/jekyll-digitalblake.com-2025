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
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: [['@babel/preset-env', { modules: false }]],
					plugins: [
						[
							'prismjs',
							{
								languages: [
									'javascript',
									'css',
									'css-extras',
									'scss',
									'markup',
									'php',
									'php-extras',
									'bash',
									'yaml',
									'json',
								],
								plugins: [
									'line-numbers',
									'autolinker',
									'show-language',
									'normalize-whitespace',
									'copy-to-clipboard',
								],
							},
						],
					],
				},
			},
		],
	},
}
