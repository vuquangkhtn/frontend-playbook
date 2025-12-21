Solution
Approach 1: Use unshift() to push elements from the front of the result array
Here is a solution that generates the range of sequence from start to (but not including) end with step as increment using unshift() instead of push(). Overloaded functions are required in TypeScript as start and step are optional.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {number} start - The start of the range.
 * @param {number} end - The end of the range.
 * @param {number} step - The value to increment or decrement by.
 * @returns {Array<number>} An array of numbers in the specified range.
 */
export default function rangeRight(start, end = undefined, step = 1) {
  const result = [];

  // Adjust parameters if only `end` is provided
  if (end === undefined) {
    end = start;
    start = 0;
  }

  // Adjust `step` for descending sequences
  if (end < start && step === 1) {
    step = -1;
  }

  // Determine the number of elements in `result`
  const length = (end - start) / (step || 1);

  // Generate the range
  for (let i = 0; i < length; i++) {
    result.unshift(start + i * step);
  }

  return result;
}
Approach 2: Insert elements from the back normally, but reverse the final result array
However, since unshift() has a time complexity of O(N), here is a more efficient solution that reverses the result array after pushing the values into the array normally.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {number} start - The start of the range.
 * @param {number} end - The end of the range.
 * @param {number} step - The value to increment or decrement by.
 * @returns {Array<number>} An array of numbers in the specified range.
 */
export default function rangeRight(start, end = undefined, step = 1) {
  const result = [];

  // Adjust parameters if only `end` is provided
  if (end === undefined) {
    end = start;
    start = 0;
  }

  // Adjust `step` for descending sequences
  if (end < start && step === 1) {
    step = -1;
  }

  // Determine the number of elements in `result`
  const length = (end - start) / (step || 1);

  // Generate the range
  for (let i = 0; i < length; i++) {
    result.push(start + i * step);
  }

  return result.reverse();
}
Edge cases
To handle cases where start and step are not specified but end is negative, we can add an if statement to change the value of step to -1.

Resources
Lodash _.range
Lodash _.rangeRight