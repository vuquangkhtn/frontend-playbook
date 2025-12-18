Solution
Approach 1: Verbose
In this solution, check if the end parameter is being passed into the function by using end === undefined. With the start and end values defined correctly, we can proceed to check if the value falls within range.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {number} value The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export default function inRange(value, startParam, endParam) {
  let start = startParam;
  let end = endParam;
  if (end === undefined) {
    end = start;
    start = 0;
  }

  if (start < end) {
    return value >= start && value < end;
  }

  return value >= end && value < start;
}
Approach 2: Shorter
Here's a shorter solution which is more concise but a little less readable. We can use a ternary expression to determine of start and end.

To check if the value falls within range, we can use Math.min(start, end) to determine the lower bound and Math.max(start, end) to determine the upper bound.


Open files in workspace

/**
 * @param {number} value The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export default function inRange(value, startParam, endParam) {
  const [start, end] =
    endParam !== undefined ? [startParam, endParam] : [0, startParam];

  return Math.min(start, end) <= value && value < Math.max(start, end);
}
Approach 3: One-liner
This even shorter solution relies on setting a default value for end to be 0. This works because if the user omits the end parameter, the range becomes [start, 0] but will be flipped around by the Math.min() and Math.max().


Open files in workspace

export default function inRange(value, start, end = 0) {
  return Math.min(start, end) <= value && value < Math.max(start, end);
}
Resources
Lodash _.inRange