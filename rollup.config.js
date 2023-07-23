// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import replace from '@rollup/plugin-replace';

const shimUXS = process.env.SHIM_UXS !== undefined;

export default defineConfig({
  input: 'lib/index.ts',
  output: {
    file: 'dist/Gadget-HanAssist.js',
    format: 'cjs',
    generatedCode: 'es5', // Keep in sync with tsconfig.json
    inlineDynamicImports: true,
    banner: readFileSync('./gadget-intro.js').toString(),
    footer: readFileSync('./gadget-outro.js').toString(),
  },
  plugins: [
    typescript(),
    replace({
      preventAssignment: true,
      __SHIM_UXS__: JSON.stringify(shimUXS),
    }),
    mwGadget({
      gadgetDef: './gadget-definition.txt',
    }),
    terser({
      format: {
        comments: /(^\*!|nowiki)/i, // Preserve banners & nowiki guards
      },
      ecma: 5, // Keep in sync with tsconfig.json
    }),
  ],
});
