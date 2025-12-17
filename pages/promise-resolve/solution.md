Solution
The purpose of Promise.resolve is to add a safe wrapper around any value such that can be used with then() or await-ed.

There are three cases to handle within the static Promise.resolve function:

If the value is a native Promise, return it directly without creating a new instance. We can check for this case using value instance of Promise.
If the value is not a thenable, return a promise that's fulfilled with the value. We can use a Promise constructor that calls resolve with the value.
If the value is a thenable, the then() method will be called. The then() method has the same signature as a Promise constructor.
The first two cases are straightforward. Let's talk a bit about the last case. Since the Promise constructor and then() has the same parameters, one might be tempted to pass value.then to a new Promise e.g. new Promise(value.then) and call it a day. However, the then() will lose the value of this. Hence we need to pass in value.then.bind(value) instead.

Nested thenables and promises should also be flattened. This is already handled by the resolve callbacks of a Promise constructor, so we don't have to manually attempt to flatten.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {*} value
 * @returns Promise
 */
export default function promiseResolve(value) {
  if (value instanceof Promise) {
    return value;
  }

  if (typeof value.then === 'function') {
    return new Promise(value.then.bind(value));
  }

  return new Promise((resolve) => resolve(value));
}
In fact, the resolve function can also handle thenables. So we can simplify the code even further.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {*} value
 * @returns Promise
 */
export default function promiseResolve(value) {
  if (value instanceof Promise) {
    return value;
  }

  return new Promise((resolve) => resolve(value));
}