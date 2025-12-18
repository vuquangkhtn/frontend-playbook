The Function.prototype.call() function is a built-in method in JavaScript that allows you to call a function with a specified this value and a set of arguments, passed individually (not as an array like Function.prototype.apply). It allows you to explicitly define the context (this value) in which the function will be executed.

Solution
Approach 1: Using bind
bind, apply, and call can be viewed as sibling functions. They're highly similar in terms of function signature and usage. Within Function.prototype methods, this refers to the Function object itself. If the this context is not used at all, the following will work:


Function.prototype.myCall = function (thisArg, ...argArray) {
  return this(...argArray);
};
However, thisArg is still used widely in modern code, so we need another way to do this. Function.prototype.bind creates a new function with a specified this value and initial arguments, without executing the original function immediately. It allows you to permanently bind a specific context (this value) to the function and partially apply arguments if needed. This is exactly what we need to bridge the gap in the solution above.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {any} thisArg
 * @param {...*} argArray
 * @return {any}
 */
Function.prototype.myCall = function (thisArg, ...argArray) {
  return this.bind(thisArg)(...argArray);
};
Or you can also pass the argArray into bind() before executing it.


Open files in workspace

/**
 * @param {any} thisArg
 * @param {...*} argArray
 * @return {any}
 */
Function.prototype.myCall = function (thisArg, ...argArray) {
  return this.bind(thisArg, ...argArray)();
};
Approach 2: Using apply
Function.prototype.call and Function.prototype.apply are very similar. Here's an easy way to remember each function's signature:

Function.prototype.call starts with "C" and takes in a Comma-separated list of arguments
Function.prototype.apply starts with "A" and takes in an Array of arguments

Open files in workspace

/**
 * @param {any} thisArg
 * @param {...*} argArray
 * @return {any}
 */
Function.prototype.myCall = function (thisArg, ...argArray) {
  return this.apply(thisArg, argArray);
};
Approach 3: Using Symbol
Another approach is to create a Symbol and add it as a property to a newly-created Object with thisArg bound to it. This is very similar to one of the solutions to the Function.prototype.bind question.


Open files in workspace

/**
 * @param {any} thisArg
 * @param {...*} argArray
 * @return {any}
 */
Function.prototype.myCall = function (thisArg, ...argArray) {
  const sym = Symbol();
  const wrapperObj = Object(thisArg);
  Object.defineProperty(wrapperObj, sym, {
    enumerable: false,
    value: this,
  });

  return wrapperObj[sym](...argArray);
};
