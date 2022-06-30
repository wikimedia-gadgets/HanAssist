'use strict';

const { resolve } = require( 'path' ),
	{ BannerPlugin, DefinePlugin } = require( 'webpack' ),
	TerserPlugin = require( 'terser-webpack-plugin' ),
	{ readFileSync } = require( 'fs' );

const isES5 = require( './tsconfig.json' )
	.compilerOptions.target.toLowerCase() === 'es5';

module.exports = ( env ) => {
	/**@type {import('webpack').Configuration}*/
	const webpackConfig = {
		entry: './lib/index.ts',
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
				name: [ 'mw', 'libs', 'HanAssist' ],
				type: 'window',
				export: 'HanAssist'
			},
			path: resolve( './dist' ),
			filename: 'index.js',
			environment: {
				arrowFunction: !isES5
			},
		},
		plugins: [
			new BannerPlugin( {
				banner: readFileSync( './gadget-prepend.js' ).toString(), raw: true
			} ),
			new BannerPlugin( {
				banner: readFileSync( './gadget-append.js' ).toString(), footer: true, raw: true
			} ),
			new DefinePlugin( {
				__SHIM_UXS__: JSON.stringify( env.shimuxs !== 'false' )
			} )
		],
		optimization: {
			minimizer: [
				new TerserPlugin( {
					extractComments: false,
					terserOptions: {
						format: {
							comments: /((^\*!|nowiki))/i // Preserve banners & nowiki guards
						},
						ecma: isES5 ? 5 : undefined
					},
				} )
			]
		}
	}

	return webpackConfig;
};
