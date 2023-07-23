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
      return console.log;
    }

    return receiver;
  },
});

export { getter, mockMW };
