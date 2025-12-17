Solution
Solutions will involve checking the passed in value whether it is smaller than the lower and bigger than the upper and returns the right number accordingly.

Approach 1: Sequential bound checks
We can first check if value is lower than lower. If so, the value is out of range and we can return the lower bound. Next check if value is higher than upper. If so, the value is out of range and we can return the upper bound. If none of the previous checks were true, then we can return the original value, which is within the specified range.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {number} value The number to clamp.
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
export default function clamp(value, lower, upper) {
  if (value < lower) {
    return lower;
  }

  if (value > upper) {
    return upper;
  }

  return value;
}
Approach 2: Using Math.max / Math.min
The previous solution can be succinctly expressed in a line using Math.max() and Math.min().


JavaScript

TypeScript

Open files in workspace

/**
 * @param {number} value The number to clamp.
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
export default function clamp(value, lower, upper) {
  return Math.min(upper, Math.max(lower, value));
}
Edge cases
upper is smaller than lower. We can assume we aren't given this case.
Resources
Lodash _.clamp