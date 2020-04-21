const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: './src/app.js',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					// style-loader
					{
						loader: 'style-loader'
					},
					// css-loader
					{
						loader: 'css-loader',
						options: {
							modules: true
						}
					},
					// sass-loader
					{
						loader: 'sass-loader'
					}]
			},
			{
				// https://webpack.js.org/loaders/html-loader/
				test: /\.html$/i,
				use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader']
//				use: [{
//					loader: ['html-loader'],
//					options: {
//						minimize: true
//					}
//				}]
			}
    ]
	},
	optimization: {
		minimize: true,
		minimizer: [
		  new TerserPlugin({
			  // https://github.com/webpack-contrib/terser-webpack-plugin#terseroption
			  test: /\.html(\?.*)?$/i,
			  // TODO doesn't work: remove HTML comments
			  // https://webpack.js.org/plugins/terser-webpack-plugin/#remove-comments
			terserOptions: {
			  output: {
				comments: false,
			  },
			},
			  extractComments: false,
		  }),
		],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
