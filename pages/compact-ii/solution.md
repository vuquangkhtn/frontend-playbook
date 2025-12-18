Solution
Since the input value can be deeply nested, a recursive solution will be handy for traversing the nested values. The idea is to recursively visit all values in the input, iterating through array items and object entries, filtering out the falsey values and keeping only the non-falsey values.

Since there are only primitives, arrays, and objects for this question, there are three categories of values we need to handle:

Primitives: This is the base case for the recursion and we can directly return the value. Given the data types available in this question, to check if a value is a primitive, we can use typeof value !== 'object' and include a special case for value == null since typeof null is 'object'.
Arrays: Iterate through the array and if the item is non-falsey, recursively call compact on the item, adding the returned compacted item into a new array. Return the new compacted array at the end.
Objects: Iterate through the entries of the object and if the object value is non-falsey, recursively call compact on the object, putting the returned compacted value into a new object. Return the new compacted object at the end.

JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array|Object} value
 * @return {Array|Object}
 */
export default function compact(value) {
  // Handle primitives.
  if (typeof value !== 'object' || value == null) {
    return value;
  }

  // Handle arrays.
  if (Array.isArray(value)) {
    const compactArr = [];
    value.forEach((item) => {
      if (item) {
        compactArr.push(compact(item));
      }
    });

    return compactArr;
  }

  // Lastly handle objects.
  const compactObj = Object.create(null);
  Object.entries(value).forEach(([key, val]) => {
    if (val) {
      compactObj[key] = compact(val);
    }
  });
  return compactObj;
}
Here's a shorter solution that adopts a more functional approach:


Open files in workspace

/**
 * @param {Array|Object} value
 * @return {Array|Object}
 */
export default function compact(value) {
  if (typeof value !== 'object' || value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.filter((item) => item).map((item) => compact(item));
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([_, value]) => value)
      .map(([key, value]) => [key, compact(value)]),
  );
}
Edge cases
Empty arrays and objects are not considered falsey.