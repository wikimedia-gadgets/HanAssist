export const v3Compat: boolean = COMPAT;

if (COMPAT) {
  import('./shims');
}

export { Candidates, CandidateKey, conv, convByVar, batchConv } from './conversion';
