Solution
This question is a simple one that involve two parts, summing up the numbers in the array then dividing by the number of items in the array.

Approach 1: Sum using for loop
This solution uses a for loop to sum up all the numbers.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} array - Array from which the elements are all numbers.
 * @return {Number} Returns the mean.
 */
export default function mean(array) {
  let total = 0;

  // Calculate the sum of all numbers in the array.
  for (let i = 0; i < array.length; i++) {
    total += array[i];
  }

  // Calculate the mean from the sum.
  return total / array.length;
}
Approach 2: Sum using Array.prototype.reduce()
A shorter version is to use Array.prototype.reduce() to perform the summation.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} array - Array from which the elements are all numbers.
 * @return {Number} Returns the mean.
 */
export default function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}
Edge cases
Surprisingly enough, an empty array does not require special handling. Division by zero in JavaScript gives Infinity if the numerator is non-zero, and `NaN when the numerator is zero, which is exactly what is required.

It is possible that the sum of the numbers in the array becomes too big that it "overflows". Strictly speaking, overflowing doesn't occur in JavaScript, values larger than Number.MAX_VALUE are represented as Infinity and will lose their actual value.

To handle large value cases, we can split the array into smaller equal chunks and calculate the average for each chunk. The final average can be determined by taking the average of each chunk's averages. Not all array lengths can be divided into equal chunks, so the key idea here is to divide as small as possible, then take a weighted average of the chunks that depends on the size of each chunk.

Resources
Lodash _.mean