Solution
Approach 1: Iterate through all predicates and return false once any predicate is not fulfilled
Iterates over the predicates in the source object and ensure if the key is not inherited by source.
Returns false if predicate is not fulfilled, and only returns true after all predicate are checked to be true.

JavaScript

TypeScript

Open files in workspace

/**
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property predicates to conform to.
 * @returns {boolean} Returns true if object conforms, else false.
 */
export default function conformsTo(object, source) {
  for (const key in source) {
    // Ensure the property is not inherited.
    if (Object.hasOwn(source, key)) {
      // Return `false` immediately if any predicate is not fulfilled.
      if (!(key in object) || !source[key](object[key])) {
        return false;
      }
    }
  }
  return true;
}
Approach 2: Uses .every() to ensure all predicate is fulfilled
By using Object.keys(source).every(...), it ensures that to return true, every predicate must evaluate to true when passed its corresponding value from object.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property predicates to conform to.
 * @returns {boolean} Returns true if object conforms, else false.
 */
export default function conformsTo(object, source) {
  // .every() ensures that all predicate must return `true` for `conformsTo` to return `true`.
  return Object.keys(source).every((key) => {
    return (
      Object.hasOwn(source, key) &&
      Object.hasOwn(object, key) &&
      source[key](object[key])
    );
  });
}
Resources
Lodash _.conformsTo