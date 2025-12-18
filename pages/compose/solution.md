Solution
Approach 1: Using reduceRight
The compose function takes multiple functions as arguments using the rest parameter syntax ...fns. This allows us to pass any number of functions.
It returns a new function that takes a single argument x.
Inside the returned function, the reduceRight method is used to apply the functions in reverse order.
The reduceRight method starts from the last function in the fns array and iterates over the array from right to left.
In each iteration, it applies the current function (func) to the intermediate result obtained from the previous iteration or the original input in the first iteration.
The result of each function becomes the input for the next function in the chain, effectively composing the functions in reverse order.
The final result of the composed function is returned.

JavaScript

TypeScript

Open files in workspace

/**
 * @param {...Function} args
 * @returns Function
 */
export default function compose(...fns) {
  return function (x) {
    return fns.reduceRight((result, func) => func(result), x);
  };
}
Approach 2: Using for loops
If you're not familiar with reduceRight, it can also be written as a for loop that traverses the array from the back.


Open files in workspace

/**
 * @param {...Function} args
 * @returns Function
 */
export default function compose(...fns) {
  return function (x) {
    let result = x;

    for (let i = fns.length - 1; i >= 0; i--) {
      result = fns[i](result);
    }

    return result;
  };
}
Approach 3: Recursion
If iteration is not your thing, here's a recursive solution. Note that it's less memory efficient due to the recursion stack using up memory space (potentially even causing a stack overflow).


Open files in workspace

/**
 * @param {...Function} args
 * @returns Function
 */
export default function compose(...fns) {
  return function (x) {
    function apply(fn, ...rest) {
      if (rest.length === 0) {
        return fn(x);
      }

      return fn(apply(...rest));
    }

    return apply(...fns);
  };
}