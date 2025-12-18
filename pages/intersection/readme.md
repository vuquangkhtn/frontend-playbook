Implement a JavaScript function intersection(arrays) that takes multiple arrays as input and returns a new array containing the unique values that are present in all given arrays SameValueZero for equality comparisons. The order of values in the returned array are determined by the first array.


intersection(...arrays);
Arguments
[arrays] (...Array): The arrays to perform the intersection on.
Returns
(Array): Returns a new array containing the unique values present in all given arrays.

Examples

const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4];
const arr3 = [3, 4, 5];

intersection(arr1, arr2, arr3); // => [3]

const arr4 = [1, 5, 7, 9, 7];
intersection(arr4); // [1, 5, 7, 9]
Constraints
The input arrays may contain any type of values.
The input arrays may have varying lengths.
The input arrays may be empty.
The function should not modify the original arrays.
0 <= number of arrays <= 20
Resources
Lodash _.intersection