if (__SHIM_UXS__) {
  // Compatibility: redirect wgULS, wgUVS and wgUXS calls to HanAssist implementation
  import('./shims');
}

export { Candidates, CandidateKey, conv, convByVar, batchConv } from './conversion';
