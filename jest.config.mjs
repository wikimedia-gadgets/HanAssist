// @ts-check

/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Required for jQuery to run in Node
  setupFiles: ['./tests/setup-jest.ts'],
  setupFilesAfterEnv: ['./tests/setup-after-env-jest.ts'],
};
