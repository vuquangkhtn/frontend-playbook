Solution
Here's a solution that finds the minimum element in array based on a given iteratee. It iterates through the array, calls the iteratee function with the array element, and tracks the element that produces the minimum value.

Two variables are used:

result: Tracks the minimum element to return.
computed: Tracks the computed value of the current minimum element which will be used to compare with the computed values of subsequent elements.

JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per element.
 * @returns {*} Returns the minimum value.
 */
export default function minBy(array, iteratee) {
  let result, computed;

  // Iterate through array to find the minimum `result`.
  for (const value of array) {
    const current = iteratee(value);
    // Check whether `computed` is assigned any value yet then compare with `current`, else assign an initial value to `computed` where `current` is not `null`.
    if (current != null && (computed === undefined || current < computed)) {
      computed = current; // Store the calculated value of the current `result`.
      result = value;
    }
  }

  return result;
}
Edge cases
Because iteratee is user-provided and can return a value of any type, we have to pay special attention to ignore computed values that cannot be compared, like null and undefined. For such computed values, they should be ignored entirely.

The function should also return the first occurrence of the element that produces the minimum computed value, even though many elements in the array can produce the same minimum computed value.

Resources
Lodash _.minBy