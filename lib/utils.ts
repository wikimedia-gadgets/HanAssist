/**
 * Safely convert an object to string.
 * @param val value to convert
 * @return string
 */
function safelyToString(val: unknown): string {
  try {
    if (typeof val === 'undefined' || val === null) {
      return '';
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(val);
  } catch {
    return Object.prototype.toString.call(val);
  }
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return $.isPlainObject(val);
}

export { safelyToString, isPlainObject };
