Solution
Approach 1: Loop through the pairs array
A for-of loop can be used to iterate through pairs and set the key and value on a result object.


JavaScript

TypeScript

Open files in workspace

/**
 * Creates an object from an array of key-value pairs.
 *
 * @param {Array} pairs - An array of key-value pairs.
 * @returns {Object} - The object composed from the key-value pairs.
 */
export default function fromPairs(pairs) {
  const result = {};

  for (const [key, value] of pairs) {
    result[key] = value;
  }

  return result;
}
Approach 2: Use Object.fromEntries()
There's a built-in static method on Object to do exactly this -- it transforms a list of key-value pairs into an object.


Open files in workspace

/**
 * Creates an object from an array of key-value pairs.
 *
 * @param {Array} pairs - An array of key-value pairs.
 * @returns {Object} - The object composed from the key-value pairs.
 */
export default function fromPairs(pairs) {
  return Object.fromEntries(pairs);
}
Resources
Lodash _.fromPairs
Object.fromEntries() - JavaScript | MDN