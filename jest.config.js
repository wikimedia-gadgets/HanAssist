/* eslint-env node */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: [
    './tests/setup-jest.ts',
  ],
};
