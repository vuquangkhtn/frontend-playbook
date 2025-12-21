Solution
We can use closures to capture state required by the returned function. The returned function's closure has access to the following variables:

func: The first argument to limit(), the callback function to be invoked.
n: The second argument to limit(), the maximum number of times the callback function can be invoked.
count: A boolean variable indicating the number of times the function has been invoked before. func will only be invoked if count < n.
value: Since we need to return the value of the last invocation for subsequent invocations exceeding n, we have to save the result of the last invocation and return it directly for those situation.

JavaScript

TypeScript

Open files in workspace

/**
 * @callback func
 * @param {number} n
 * @return {Function}
 */
export default function limit(func, n) {
  let count = 0;
  let value;

  return function (...args) {
    if (count < n) {
      value = func.apply(this, args);
      count++;
    }

    return value;
  };
}
Note that the callback function is invoked with the this binding and arguments of the created function, hence we cannot return an arrow function if we want the value of this to refer to the object calling the created function.

Edge cases
Functions which access this
Techniques
Closures
How this works
Invoking functions via Function.prototype.apply()/Function.prototype.call()
Resources
Lodash _.before