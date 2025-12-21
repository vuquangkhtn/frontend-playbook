Solution
Approach 1: Standard method of basic functions
Create an empty result object to store the count of occurrences of each key.
Iterate through the array and determine the key for each element by calling iteratee(element). If the key does not exist within the result object, set the value for that key to 0. Next we can increment the value for that key.

JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns the composed aggregate object.
 */
export default function countBy(array, iteratee) {
  const result = {};

  for (const element of array) {
    const key = String(iteratee(element));
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = 0;
    }

    result[key]++;
  }

  return result;
}
Approach 2: Using nullish coalescing assignment operator
An alternative way to increment the result counter is to use the nullish coalescing assignment operator to set the value to 0 if key doesn't exist within result. Note that using nullish coalescing assignment operator means you might be accessing inherited properties, which is not desired, but since the object is created via Object.create(null), there will not be inherited properties and is safe to use.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns the composed aggregate object.
 */
export default function countBy(array, iteratee) {
  const result = Object.create(null);

  for (const element of array) {
    const key = String(iteratee(element));
    result[key] ??= 0;
    result[key]++;
  }

  return result;
}
Resources
Lodash _.countBy