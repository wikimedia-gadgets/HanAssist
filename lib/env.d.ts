import '../node_modules/types-mediawiki';

export declare global {
  const COMPAT: boolean;

  namespace mw {
    const libs: Record<string, any>;
  }
}
