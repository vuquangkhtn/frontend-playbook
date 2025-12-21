Solution
Start by creating a copy of the original array (this) using the spread operator ([...this]). This ensures that the polyfill operates on a copy of the array, leaving the original array unchanged.

Iterate through the arguments passed to the Array.prototype.myConcat method. For each argument, check if it's an array using Array.isArray(). If it's an array, spread its elements into the newArray. If it's not an array, simply push the element into the newArray.

Finally, return the newArray, which contains all the elements from the original array and the arguments passed to Array.prototype.myConcat. This mimics the behavior of the native Array.prototype.concat method.


JavaScript

TypeScript

Open files in workspace

/**
 * @template T
 * @param {...(T | Array<T>)} items
 * @return {Array<T>}
 */
Array.prototype.myConcat = function (...items) {
  const newArray = [...this];

  for (let i = 0; i < items.length; i++) {
    if (Array.isArray(items[i])) {
      newArray.push(...items[i]);
    } else {
      newArray.push(items[i]);
    }
  }

  return newArray;
};
Edge cases
Sparse arrays, e.g. [1, 2, , 4]. The empty values should be ignored while traversing the array.
One-liner solution
You can cheat the autograder by doing this:


Array.prototype.myConcat = Array.prototype.concat;

Spec solution
Here's a solution that is based off the Array.prototype.concat ECMAScript specification but does not use the Symbol.isConcatSpreadable property.


Open files in workspace

interface Array<T> {
  myConcat(...items: Array<T | Array<T>>): Array<T>;
}

Array.prototype.myConcat = function (...items) {
  const A = Array.from(this);
  let n = A.length;

  items.forEach((e) => {
    // The actual spec checks for the `Symbol.isConcatSpreadable` property.
    if (Array.isArray(e)) {
      const len = e.length;
      let k = 0;
      while (k < len) {
        // Ignore index if value is not defined for index (e.g. in sparse arrays).
        const exists = Object.hasOwn(e, k);
        if (exists) {
          const subElement = e[k];
          A[n] = subElement;
        }
        n += 1;
        k += 1;
      }
    } else {
      A[n] = e;
      n += 1;
    }
  });

  return A;
};
Resources
Array.prototype.concat | MDN
Array.prototype.concat ECMAScript specification