/**
 * Mock mw.config.get & mw.user.options.get.
 */

const getter = jest.fn<unknown, [string]>(() => 'zh');

const mockMW = new Proxy({}, {
  get(_, prop, receiver) {
    // Mock mw.config.get
    if (prop === 'get') {
      return getter;
    }

    // Mock mw.log.warn
    if (prop === 'warn') {
      // eslint-disable-next-line no-console
      return console.warn;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return receiver;
  },
});

export { getter, mockMW };
