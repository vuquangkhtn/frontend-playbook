Implement a function range([start=0], end, [step=1]) that creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end. A step of -1 is used if a negative start is specified without an end or step. If end is not specified, it's set to start with start then set to 0.

Arguments
start (Number): The start of the range.
end (Number): The end of the range.
step (Number): The value to increment or decrement by.
Returns
(Array): Returns the range of numbers.

Examples

range(4); // => [0, 1, 2, 3]

range(-4); // => [0, -1, -2, -3]

range(1, 5); // => [1, 2, 3, 4]

range(0, 20, 5); // => [0, 5, 10, 15]

range(0, -4, -1); // => [0, -1, -2, -3]

range(1, 4, 0); // => [1, 1, 1]
The function should return an empty array if start is equal to end.


range(0); // => []
Resources
Lodash _.range