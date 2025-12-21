The tricky part of the question is to see that some form of iteration/recursion has to be done on the object to access nested fields.

Solution
The first step is to split up the path by the delimiter, which is a period. Then we have to recursively traverse the object given each token in the path, which can be done either with while/for loops or recursions. The looping should stop when a null-ish value is encountered.

Array index accessing doesn't require special handling and can be treated like accessing string-based fields on objects.


const arr = [10, 20, 30];
arr[1] === 20; // true
arr['1'] === 20; // true

JavaScript

TypeScript

Open files in workspace

/**
 * @param {Object} objectParam
 * @param {string|Array<string>} pathParam
 * @param {*} [defaultValue]
 * @return {*}
 */
export default function get(objectParam, pathParam, defaultValue) {
  // If the path is a `.` seperated string, use split to convert it to an array.
  const path = Array.isArray(pathParam) ? pathParam : pathParam.split('.');

  let index = 0;
  let length = path.length;
  let object = objectParam;

  // Traverse path in the object, stopping early if a value is null/undefined.
  while (object != null && index < length) {
    // We use != null instead of !== null to handle undefined objects too
    // Access next level in the object using string key (handles numeric indices too).
    object = object[String(path[index])];
    index++;
  }

  // Check if the entire path was successfully traversed. If not, the path is invalid.
  const value = index && index === length ? object : undefined;

  // Return the found value, or the default if the value resolved to undefined.
  return value !== undefined ? value : defaultValue;
}
Edge cases
Bad path inputs like get(obj, 'a.b..c') and get(obj, '') are unresolved and the defaultValue should be returned.
The solution only works for simple objects. It doesn't work with objects with
Symbols as keys.
Map and Set as values.
For these cases you can (and should) clarify the expected behavior with the interviewer.

Notes
null should be differentiated from undefined. Hence we should not use value != undefined (which is false when value = null) to check whether to return the defaultValue.
Resources
Lodash _.get