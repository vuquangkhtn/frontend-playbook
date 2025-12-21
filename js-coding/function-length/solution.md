Function Length (Official solution)
Premium
Languages
Recommended duration to spend during interviews
5 mins
Solution
All function instances have a length property which indicates the number of parameters expected by the function.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} fn
 * @return {number}
 */
export default function functionLength(fn) {
  return fn.length;
}
Notes
The length property excludes the rest parameter and only includes parameters before the first one with a default value.


function foo(a, b = 2) {}
foo.length; // 1

function bar(a = 1, b = 2) {}
bar.length; // 0

function baz(...args) {}
baz.length; // 0
Resources
Function: length | MDN