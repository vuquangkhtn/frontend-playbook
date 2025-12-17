Solution
For the most part, Promise.withResolvers() is syntactic sugar. The only way to get access to the resolve and reject function is the arguments to the Promise constructor. Hence we can create the resolve and reject functions before creating the Promise, then exposing it from within the constructor function.

The Promise constructor function argument runs synchronously, so we can be sure that the resolve and reject variables are assigned the right values before the return statement.


JavaScript

TypeScript

Open files in workspace

/**
 * @returns { promise: Promise, resolve: Function, reject: Function }
 */
export default function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
In fact, MDN even mentions that Promise.withResolvers() is exactly equivalent to the following code:


let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
Resources
Promise.withResolvers() - JavaScript | MDN