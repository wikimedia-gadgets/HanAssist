if (COMPAT) {
  // Compatibility: redirect wgULS, wgUVS and wgUXS calls to HanAssist implementation
  import('./shims');
}

export { Candidates, CandidateKey, conv, convByVar, batchConv } from './conversion';
