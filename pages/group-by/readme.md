Implement a function groupBy(array, iteratee) that takes an array and an iteratee function, and groups the values in the array based on the iteratee.


groupBy(array, iteratee);
Arguments
array (Array): The array to iterate over.
iteratee (Function): The iteratee to transform elements. The function is invoked with one argument: (value).
Returns
(Object): Returns the composed aggregate object.

Examples

groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }

groupBy([{ n: 3 }, { n: 5 }, { n: 3 }], (o) => o.n);
// => { '3': [{ n: 3 }, { n: 3 }], '5': [{ n: 5 }] }
The function should return {} when array is empty and treat null / undefined keys after going through iteratee as it is.


groupBy([], (o) => o); // => {}

groupBy([{ n: 1 }, { n: 2 }], (o) => o.m); // => { undefined: [{ n: 1 }, { n: 2 }] }
Resources
Lodash _.groupBy