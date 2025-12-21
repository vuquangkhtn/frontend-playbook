export default function compact<T>(
  array: Array<T | null | undefined | false | 0 | ''>,
): Array<T> {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    const value = array[i];

    // Skip falsey values
    if (value) {
      result.push(value);
    }
  }

  return result;
}

Here's a simpler solution that leverages Array.prototype.filter.


Open files in workspace

/**
 * @param {Array} array: The array to compact.
 * @return {Array} Returns the new array of filtered values.
 */
export default function compact(array) {
  return array.filter(Boolean);
}
Edge cases
Empty arrays and objects are not considered falsey.
Resources
Lodash _.compact
