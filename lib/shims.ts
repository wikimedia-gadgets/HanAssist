import { batchConv, conv, convByVar, elect } from './conversion';

function legacyUxsShim(
  locale: string,
  hans: unknown,
  hant: unknown,
  cn: unknown,
  tw: unknown,
  hk: unknown,
  sg: unknown,
  zh: unknown,
  mo: unknown,
  my: unknown,
): unknown {
  try {
    return elect({
      hans, hant, cn, tw, hk, sg, zh, mo, my,
    }, locale);
  } catch {
    return undefined;
  }
}

function generateLegacyUxsShim(configName: 'wgUserLanguage' | 'wgUserVariant') {
  return (
    hans: unknown,
    hant: unknown,
    cn: unknown,
    tw: unknown,
    hk: unknown,
    sg: unknown,
    zh: unknown,
    mo: unknown,
    my: unknown,
  ) => legacyUxsShim(mw.config.get(configName), hans, hant, cn, tw, hk, sg, zh, mo, my);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shim(name: string, replacement: string, func: (...args: any[]) => unknown) {
  mw.log.deprecate(window, name, func, `Use ${replacement} instead.`);
}

// Compatibility: redirect wgULS, wgUVS and wgUXS calls to HanAssist implementation
shim('wgULS', 'HanAssist.conv', generateLegacyUxsShim('wgUserLanguage'));
shim('wgUVS', 'HanAssist.convByVar', generateLegacyUxsShim('wgUserVariant'));
shim('wgUXS', 'HanAssist', legacyUxsShim);

// Compatibility: redirect HanAssist <= v3 calls to v4
mw.log.deprecate(
  mw.libs,
  'HanAssist',
  { localize: conv, vary: convByVar, parse: batchConv },
  'Use require() to import HanAssist functions instead.',
);
