const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		main: './theme_components/js/global-scripts.js',
		prism: './theme_components/js/prism-scripts.js',
	},
	output: {
		path: path.resolve(__dirname, 'assets'),
		filename: 'js/[name].min.js',
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
			new CssMinimizerPlugin(),
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].min.css',
		}),
	],
	module: {
		rules: [
			{
				parser: { amd: false },
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: [
						[
							'@babel/preset-env',
							{
								modules: false,
								useBuiltIns: 'usage',
								corejs: 3,
							},
						],
					],
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
								theme: 'okaidia',
								css: true,
							},
						],
					],
				},
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
}
