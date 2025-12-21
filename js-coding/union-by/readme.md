Implement a function unionBy(array) that creates an array of unique values, in order, from all given arrays and accepts iteratee which is invoked for each element of each arrays to generate the criterion by which uniqueness is computed.


unionBy(iteratee, arrays);
Arguments
iteratee (Function): The iteratee invoked per element. The function is invoked with one argument: (value).
[arrays] (...Array): The arrays to inspect
Returns
(Array): Returns the new array of combined values.

Examples

unionBy((value: any) => value, [2], [1, 2]); // => [2, 1]

unionBy(Math.floor, [2.1], [1.2, 2.3]); // => [2.1, 1.2]

unionBy((o) => o.x, [{ x: 1 }], [{ x: 2 }, { x: 1 }]); // => [{ 'x': 1 }, { 'x': 2 }]
The function should return an empty array if array is empty and leave the treat false values as-is.


unionBy((o) => o.m, []); // => []

unionBy((o) => o.m, [{ n: 1 }], [{ m: 2 }]); // => [{ n: 1 }, { m: 2 }]
Resources
Lodash _.unionBy