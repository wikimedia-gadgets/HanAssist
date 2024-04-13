import '../node_modules/types-mediawiki';

export declare global {
  const COMPAT: boolean;

  namespace mw {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const libs: Record<string, any>;
  }
}
