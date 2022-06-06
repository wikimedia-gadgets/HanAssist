'use strict';

const { resolve } = require( 'path' ),
	{ BannerPlugin } = require( 'webpack' ),
	TerserPlugin = require( 'terser-webpack-plugin' ),
	{ readFileSync } = require( 'fs' );

const minimizer = new TerserPlugin( {
	extractComments: false,
	terserOptions: {
		format: {
			comments: /((^!|nowiki))/i // Preserve banners & nowiki guards
		},
		mangle: {
			// For diagnosis purposes
			reserved: [ 'rawMsg', 'locale', 'executor', 'candidates', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'zh', 'mo', 'my' ]
		},
		ecma: 5
	},
} );

/**@type {import('webpack').Configuration}*/
const webpackConfig = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [ 'babel-loader' ]
			}
		]
	},
	output: {
		path: resolve( './dist' ),
		filename: 'index.js',
		environment: {
			arrowFunction: false // No IIFE arrow
		}
	},
	plugins: [
		new BannerPlugin( { banner: '// <nowiki>', raw: true } ),
		new BannerPlugin( { banner: readFileSync( './gadget-banner.txt' ).toString() } ),
		new BannerPlugin( { banner: '// </nowiki>', footer: true, raw: true } )
	],
	optimization: {
		minimizer: [ minimizer ]
	},
	devtool: 'source-map'
}

module.exports = webpackConfig;
