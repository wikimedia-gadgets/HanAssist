/**
 * Safely convert an object to string.
 * @private
 * @param val value to convert
 * @return string
 */
function safelyToString(val: unknown): string {
  try {
    if (typeof val === 'undefined' || val === null) {
      return '';
    }
    return String(val);
  } catch {
    return Object.prototype.toString.call(val);
  }
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return $.isPlainObject(val);
}

export { safelyToString, isPlainObject };
