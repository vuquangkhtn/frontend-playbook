Debounce, along with throttle, are among the most common front end interview questions; it's the front end equivalent of inverting a binary tree. Hence you should make sure that you are very familiar with the question.

Solution
Given that there's a wait duration before the function can be invoked, we know that we will need a timer, and setTimeout is the first thing that comes to mind.

We will also need to return a function which wraps around the callback function parameter. This function needs to do a few things:

1. Debounce invocation
It invokes the callback function only after a delay of wait. This is performed using setTimeout. Since we might need to clear the timer if the debounced function is called again while there's a pending invocation, we need to retain a reference to a timeoutID, which is the returned value of setTimeout.
If the function is called again while there's a pending invocation, we should cancel existing timers and schedule a new timer for the delayed invocation with the full wait duration. We can cancel the timer via clearTimeout(timeoutID).
2. Calls the callback function with the right parameters
Debounced functions are used like the original functions, so we should forward the value of this and function arguments when invoking the original callback functions.

You may be tempted to use func(...args) but this will be lost if callback functions are invoked that way. Hence we have use Function.prototype.apply()/Function.prototype.call() which allows us to specify this as the first argument.

func.apply(thisArg, args)
func.call(thisArg, ...args)

JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
export default function debounce(func, wait = 0) {
  let timeoutID = null;
  return function (...args) {
    // Keep a reference to `this` so that
    // func.apply() can access it.
    const context = this;
    clearTimeout(timeoutID);

    timeoutID = setTimeout(function () {
      timeoutID = null; // Not strictly necessary but good to do this.
      func.apply(context, args);
    }, wait);
  };
}
Edge cases
The main pitfall in this question is invoking the callback function with the correct this, the value of this when the debounced function was called. Since the callback function will be invoked in a timeout, we need to ensure that the first argument to func.apply()/func.call() is the right value. There are two ways to achieve this:

Use another variable to keep a reference to this and access this via that variable from within the setTimeout callback. This is the traditional way of preserving this before arrow functions existed.
Use an arrow function to declare the setTimeout callback where the this value within it has lexical scope. The value of this within arrow functions is bound to the context in which the function is created, not to the environment in which the function is called.

Open files in workspace

/**
 * @callback func
 * @param {number