Solution
This question is pretty straightforward and just tests that you know how to access the array values within Array.prototype methods (using this).

Creation of a new array can be done using new Array(length) or creating an empty array and pushing to it.

Elements of the array can be accessed via this[index].


JavaScript

TypeScript

Open files in workspace

/**
 * @return {Array<number>}
 */
Array.prototype.square = function () {
  const length = this.length;
  const results = new Array(length);

  for (let i = 0; i < length; i++) {
    results[i] = this[i] * this[i];
  }

  return results;
};
Simpler version using Array.prototype.map().


Open files in workspace

Array.prototype.square = function () {
  return this.map((el) => el * el);
};
Edge cases
Empty array.
Single-value array.
Multi-value array.