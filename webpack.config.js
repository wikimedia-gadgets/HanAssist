'use strict';

const { resolve } = require( 'path' ),
	{ BannerPlugin } = require( 'webpack' ),
	TerserPlugin = require( 'terser-webpack-plugin' ),
	{ readFileSync } = require( 'fs' );

const IS_ES5 = true;

const terser = new TerserPlugin( {
	extractComments: false,
	terserOptions: {
		format: {
			comments: /((^\*!|nowiki))/i // Preserve banners & nowiki guards
		},
		ecma: IS_ES5 ? 5 : undefined
	},
} );

/**@type {import('webpack').Configuration}*/
const webpackConfig = {
	entry: './src/index.ts',
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
		clean: true,
		library: {
			name: 'HanAssist',
			type: 'window',
			export: 'HanAssist'
		},
		path: resolve( './dist' ),
		filename: 'index.js',
		environment: {
			arrowFunction: !IS_ES5
		},
	},
	plugins: [
		new BannerPlugin( { banner: readFileSync( './gadget-prepend.js' ).toString(), raw: true } ),
		new BannerPlugin( { banner: readFileSync( './gadget-append.js' ).toString(), footer: true, raw: true } )
	],
	optimization: {
		minimizer: [ terser ]
	},
	devtool: 'source-map'
}

module.exports = webpackConfig;
