'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: __dirname + '/build',
	entry: {
		app: './app/app.js',
		vendor: ['angular']
	},
	output: {
		path: __dirname + '/build',
		filename: 'app.bundle.js'
	},
	devtool: 'source-map',
	plugins: [new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		filename: 'vendor.bundle.js'
	}), new HtmlWebpackPlugin({
		template: './index.html',
		minify: {
        	collapseWhitespace: true,
        	collapseInlineTagWhitespace: true,
        	removeRedundantAttributes: true,
        	removeEmptyAttributes: true,
        	removeScriptTypeAttributes: true,
        	removeStyleLinkTypeAttributes: true
        }
    })]
}