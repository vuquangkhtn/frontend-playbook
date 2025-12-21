Clarification questions
Is the function being applied to values within nested objects?
The function only operates on the top level keys/values of the object.
What should the value of this be within the callback function?
The input object.
Solution
The only tricky part of the question is to provide the value of this for the fn via Function.prototype.call()/Function.prototype.apply(). In Array.prototype.map(), the thisArg value can be provided as a second argument to the .map() function and the callback function will the invoked with thisArg as the this value. In our case, the this value within callbacks is not explicitly specified but a reasonable assumption is to use the obj input as this.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Object} obj
 * @param {Function} fn
 * @returns Object
 */
export default function objectMap(obj, fn) {
  const result = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn.call(obj, obj[key]);
    }
  }

  return result;
}
A shorter solution that uses a more functional approach:


Open files in workspace

/**
 * @param {Object} obj
 * @param {Function} fn
 * @returns Object
 */
export default function objectMap(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn.call(obj, value)]),
  );
}
Edge cases
Accessing this within the callback function.