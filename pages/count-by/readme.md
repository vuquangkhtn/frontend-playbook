Implement a function countBy(array, iteratee) that creates an object composed of keys generated from the results of running each element of array through iteratee. The corresponding value of each key is the number of times the key was returned by iteratee.


countBy(array, iteratee);
Arguments
array (Array): The array to iterate over.
iteratee (Function): The iteratee function to transform elements. The function is invoked with one argument: (value).
Returns
(Object): Returns the composed aggregate object.

Examples

countBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': 1, '6': 2 }

countBy([{ n: 3 }, { n: 5 }, { n: 3 }], (o) => o.n);
// => { '3': 2, '5': 1 }
The function should return when array is empty and treat null / undefined keys after going through iteratee as it is.


countBy([], (o) => o); // => {}

countBy([{ n: 1 }, { n: 2 }], (o) => o.m); // => { undefined: 2 }
Resources
Lodash _.countBy