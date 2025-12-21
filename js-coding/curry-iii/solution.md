This solution assumes you have completed the Curry II question and fully understand its solution.

Solution
Implicit type conversion is the fundamental concept that we need to be aware of here. When variable are used in scenarios with mismatched types, implicit type conversion happens as an attempt to make the operation succeed. Here are some examples from MDN regarding type conversions:


const foo = 42; // foo is a number
const result = foo + '1'; // JavaScript coerces foo to a string, so it can be concatenated with the other operand.
console.log(result); // 421

const bar = '42'; // bar is a string
const result2 = 2 * bar; // JavaScript coerces bar to a number, so it can be multiplied with the other operand.
console.log(result2); // 84
The function returned by curry (we call it curried) is a function, which is a JavaScript object. Under usual circumstances, when a function is coerced into a string, the function's code is used as the string value:


function foo(a, b) {
  return a + b;
}
console.log('hey ' + foo); // hey function foo(a, b) { return a + b }
This is not what we want. We want to call arbitrary logic when a function is used as a primitive value. In order for objects to be used as a primitive value (when being used in console.log() or in expressions), we can override the Symbol.toPrimitive property on objects, which is a method that accepts a preferred type and returns a primitive representation of an object.

Hence the solution to this question can be obtained by modifying the solution of Curry II slightly and calling func.apply(this, args) within the method of Symbol.toPrimitive.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} func
 * @return {Function}
 */
export default function curry(func) {
  return function curried(...args) {
    const fn = curried.bind(this, ...args);

    // Define using an arrow function to preserve `this`.
    fn[Symbol.toPrimitive] = () => func.apply(this, args);
    return fn;
  };
}
Edge cases
Functions which access this.
Techniques
Closures.
Invoking functions via Function.prototype.apply()/Function.prototype.call().
Type coercion.
Notes
this should be preserved when calling the original function, which can be achieved by using an arrow function.
Overriding Object.prototype.valueOf and Object.prototype.toString works as well, but defining an implementation for Symbol.toPrimitive is more reliable.
Resources
Lodash curry
Symbol.toPrimitive