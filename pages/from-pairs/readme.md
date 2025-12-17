# From Pairs

Implement a function fromPairs(pairs) that transforms a list of key-value pairs into an object.


fromPairs(pairs);
Arguments
pairs (Array): An array of key-value pairs.
Returns
(Object): Returns the object composed from the key-value pairs.

Examples

const pairs = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
];

fromPairs(pairs); // => { a: 1, b: 2, c: 3 }
Resources
Lodash _.fromPairs