'use strict';
const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );

/**@type {import('webpack').Configuration}*/
module.exports = {
	entry: path.resolve( __dirname, 'src/index.ts' ),
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				}
			}
		]
	},
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'index.js',
		environment: {
			arrowFunction: false // No IIFE arrow
		}
	},
	plugins: [
		new webpack.BannerPlugin( { banner: '// <nowiki>', raw: true } ),
		new webpack.BannerPlugin( {
			banner: ` _____________________________________________________________________________
|                                                                             |
|                    === WARNING: GLOBAL GADGET FILE ===                      |
|                  Changes to this page affect many users.                    |
|   Please discuss changes on the talk page or on [[WP:VPT]] before editing.  |
|_____________________________________________________________________________|

HanAssist - Utilities to ease Chinese variant handling in user scripts and gadgets.
Built from source code at GitHub repository []
All changes should be made in the repository, otherwise they will be lost.

To update this script from GitHub, you must have a local repository set up. Then
follow the instructions at [].

For license information, see [].`
		} ),
		new webpack.BannerPlugin( { banner: '// </nowiki>', footer: true, raw: true } )
	],
	optimization: {
		minimizer: [
			new TerserPlugin( {
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
			} )
		]
	},
	mode: 'production',
	devtool: 'source-map'
};
