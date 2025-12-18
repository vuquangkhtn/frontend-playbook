Currying is not commonly used in real-world development but is a moderately common question for interviews as it tests the candidate's understanding of certain JavaScript fundamentals like arity and closures.

Clarification questions
What value types will curry expect?
Should the function expect values of different types?
Solution
We first need to understand a few terms:

Arity: The number of arguments or operands taken by a function.
Closure: A closure is the combination of a function bundled together with references to its lexical environment (surrounding state).
The curried function will stop accepting arguments after the number of arguments have been passed into the curried function equals the arity of the original function.

We can keep a record of the curried function arguments so far via closures. Each time the curried function is called, we compare the number of arguments so far with the arity of the original function.

If they're the same, we call the original function with the arguments.
If more arguments are needed, we will return a function that accepts more arguments and invokes the curried function with the new arguments.
The solutions for this question can also work for Curry, because this solution is a general version that doesn't make any assumptions on the number of arguments needed.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} func
 * @return {Function}
 */
export default function curry(func) {
  return function curried(...args) {
    if (args.length === func.length) {
      return func.apply(this, args);
    }

    return (...args2) => curried.apply(this, [...args, ...args2]);
  };
}
An alternative solution using Function.prototype.call:


Open files in workspace

/**
 * @param {Function} func
 * @return {Function}
 */
export default function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.call(this, ...args);
    }

    return (...args2) => curried.call(this, ...args, ...args2);
  };
}
Since the innermost function is essentially meant for preserving the this scope and passing arguments along, it can be achieved with Function.prototype.bind:


Open files in workspace

/**
 * @param {Function} func
 * @return {Function}
 */
export default function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }

    return curried.bind(this, ...args);
  };
}
Edge cases
Calling the function without any arguments should not have any effect, unless the function does not take in any arguments.
Functions which access this. Do test this case for curried functions that are meant to receive multiple arguments as well.
Techniques
Closures.
Invoking functions via Function.prototype.apply()/Function.prototype.call().
Notes
Intermediate functions should be reusable as seen from the examples in the question description.
Resources
[Understanding JavaScript currying](https://blog.logrocket.com/understanding-javascript-currying)
[Lodash curry](https://lodash.com/docs/4.17.15#curry)