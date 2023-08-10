import { batchConv, conv, convByVar, elect } from './conversion';

function uxsShim(
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

function generateUxsShim(configName: 'wgUserLanguage' | 'wgUserVariant') {
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
  ) => uxsShim(mw.config.get(configName), hans, hant, cn, tw, hk, sg, zh, mo, my);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deprecate(root: any, name: string, func: (...args: any[]) => any, replacement: string) {
  mw.log.deprecate(root, name, func, `Use ${replacement} instead.`);
}

// Compatibility: redirect wgULS, wgUVS and wgUXS calls to HanAssist implementation
deprecate(self, 'wgULS', generateUxsShim('wgUserLanguage'), 'HanAssist.conv');
deprecate(self, 'wgUVS', generateUxsShim('wgUserVariant'), 'HanAssist.convByVar');
deprecate(self, 'wgUXS', uxsShim, 'HanAssist.conv');

// Compatibility: redirect HanAssist <= v3 calls to v4
const globalMountPoint = (mw.libs.HanAssist = mw.libs.HanAssist || {});

deprecate(globalMountPoint, 'localize', conv, 'conv');
deprecate(globalMountPoint, 'vary', convByVar, 'convByVar');
deprecate(globalMountPoint, 'parse', batchConv, 'batchConv');
