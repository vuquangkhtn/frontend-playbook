The intersectionBy function takes an iteratee function and multiple arrays as arguments. It first applies the iteratee function to transform the values in all arrays. Then, it identifies the set of transformed values that are common across all arrays. Finally, it returns an array containing the original values from the first array which correspond to these common transformed values.

Note: The comparison to find common elements uses the values after the iteratee is applied, but the final returned array contains the original values from the first array (before the iteratee was applied).


intersectionBy(iteratee, ...arrays);
The iteratee function is invoked with one argument: value, where value is the current value being iterated.

Arguments
iteratee (Function): The iteratee invoked per element.
arrays (Array): The arrays to inspect.
Returns
(Array): Returns the new array of intersecting values.

Examples

// Get the intersection based on the floor value of each number
const result = intersectionBy(Math.floor, [1.2, 2.4], [2.5, 3.6]);
// Compares floored values ([1, 2] vs [2, 3]). Common floor value is 2.
// Original value from the first array that floors to 2 is 2.4.
// => [2.4]

// Get the intersection based on the lowercase value of each string
const result2 = intersectionBy(
  (str) => str.toLowerCase(),
  ['apple', 'banana', 'ORANGE', 'orange'],
  ['Apple', 'Banana', 'Orange'],
);
// Common lowercase results are 'apple', 'banana', 'orange'.
// Returns corresponding first-occurrence originals from the first array: 'apple', 'banana', 'ORANGE'.
// => ['apple', 'banana', 'ORANGE']

// Single array case
intersectionBy(Math.floor, [1, 2.5, 3]); // => [1, 2.5, 3]
Constraints
The input arrays may contain any type of values.
The input arrays may have varying lengths.
The input arrays may be empty.
The function should not modify the original arrays.
0 <= number of arrays <= 20
Resources
Lodash _.intersectionBy
In Lodash, iteratee is optional and is the last parameter, but in this question it is a required parameter for simplicity.