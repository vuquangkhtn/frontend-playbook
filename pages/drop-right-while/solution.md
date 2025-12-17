Solution
The goal is to create a function that takes an array and a predicate function. We must remove elements from the end of the original array as long as the predicate function returns true when called with (value, index, array). The removal stops as soon as the predicate returns false for an element encountered while iterating from right to left. We must return a new array containing the remaining elements, the original array must not be modified.

Algorithm
The most straightforward approach is to iterate through the array from right to left, finding the index of the first element (from the right) for which the predicate returns a falsey value. Once this index is found, we know that all elements after this index should be dropped. We can then use Array.prototype.slice() to create a new array containing elements from the beginning up to (and including) this element.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} array - The array to iterate over.
 * @param {Function} predicate - The function invoked per iteration.
 * @return {Array} Returns the slice of `array`.
 */
export default function dropRightWhile(array, predicate) {
  let index = array.length - 1;

  while (index >= 0 && predicate(array[index], index, array)) {
    index--;
  }

  return array.slice(0, index + 1);
}
Note: contrast with Array.prototype.filter
It's important to note that dropRightWhile is different from filter. filter checks every element and keeps only those for which its predicate returns true. dropRightWhile checks elements only from the right end and stops dropping entirely as soon as it finds one element that doesn't satisfy the predicate.