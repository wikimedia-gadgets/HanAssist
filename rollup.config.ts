import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { readFileSync } from 'fs';

const shimUXS = process.env.SHIM_UXS !== 'false';

export default defineConfig({
  input: 'lib/index.ts',
  output: {
    file: shimUXS ? 'dist/index.min.js' : 'dist/index.no-shim.min.js',
    format: 'iife',
    name: 'mw.libs.HanAssist',
    extend: false,
    generatedCode: 'es5',
    inlineDynamicImports: true,
    banner: readFileSync('./gadget-prepend.js').toString(),
    footer: readFileSync('./gadget-append.js').toString(),
  },
  plugins: [
    replace({
      values: {
        __SHIM_UXS__: shimUXS ? 'true' : 'false',
      },
      preventAssignment: true,
    }),
    typescript(),
    terser({
      format: {
        comments: /((^\*!|nowiki))/i, // Preserve banners & nowiki guards
      },
      ecma: 5,
    }),
  ],
});
