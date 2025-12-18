Implement a function rangeRight([start=0], end, [step=1]) that creates an array of numbers progressing from start up to (but not including) end with a specified step, similar to range, but in a descending order.

Arguments
start (Number): The start of the range.
end (Number): The end of the range.
step (Number): The value to increment or decrement by.
Returns
(Array): Returns the range of numbers.

Examples

rangeRight(4); // => [3, 2, 1, 0]

rangeRight(-4); // => [-3, -2, -1, 0]

rangeRight(1, 5); // => [4, 3, 2, 1]

rangeRight(0, 20, 5); // => [15, 10, 5, 0]

rangeRight(0, -4, -1); // => [-3, -2, -1, 0]

rangeRight(1, 4, 0); // => [1, 1, 1]
The function should return an empty array if start is equal to end.


rangeRight(0); // => []
Resources
Lodash _.rangeRight