const path = require('path')

module.exports = {
	mode: 'production',
	entry: './theme_components/js/global-scripts.js',
	output: {
		path: path.resolve(__dirname, 'assets/js'),
		filename: 'main.min.js',
	},
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
				use: ['style-loader', 'css-loader'],
			},
		],
	},
}
