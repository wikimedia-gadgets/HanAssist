'use strict';

const { resolve } = require( 'path' ),
	{ BannerPlugin } = require( 'webpack' ),
	TerserPlugin = require( 'terser-webpack-plugin' ),
	{ readFileSync } = require( 'fs' );

const minimizer = new TerserPlugin( {
	extractComments: false,
	terserOptions: {
		format: {
			comments: /((^\*!|nowiki))/i // Preserve banners & nowiki guards
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
	entry: './src/browser-entry.ts',
	resolve: {
		extensions: [ '.ts', '.js' ]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: 'ts-loader'
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
		new BannerPlugin( { banner: readFileSync( './gadget-prepend.js' ).toString(), raw: true } ),
		new BannerPlugin( { banner: readFileSync( './gadget-append.js' ).toString(), footer: true, raw: true } )
	],
	optimization: {
		minimizer: [ minimizer ]
	},
	devtool: 'source-map'
}

module.exports = webpackConfig;
