Solution
The goal is to create a function that takes an array and a predicate function. We must remove elements from the start of the original array as long as the predicate function returns true when called with (value, index, array). The removal stops as soon as the predicate returns false for an element encountered while iterating from left to right. We must return a new array containing the remaining elements (from the stopping point onwards), and the original array must not be modified.

Algorithm
The most straightforward approach is to iterate through the array from left to right (starting at index 0), finding the index of the first element for which the predicate returns a falsey value. Once this index is found, we know that all elements before this index should be dropped. We can then use Array.prototype.slice() to create a new array containing elements from this index to the end of the array.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} array - The array to iterate over.
 * @param {Function} predicate - The function invoked per iteration.
 * @return {Array} Returns the slice of `array`.
 */
export default function dropWhile(array, predicate) {
  let index = 0;

  while (index < array.length && predicate(array[index], index, array)) {
    index++;
  }

  return array.slice(index);
}
Resources
Lodash _.dropWhile