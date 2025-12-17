Note: If you haven't completed the Promise.all question, you should attempt that first.

Async programming is frequently tested during interviews. Understanding how Promise.allSettled works under the hood will help you in understanding the mechanisms behind similar Promise-related functions like Promise.race, Promise.any, Promise.all, etc.

Solution
There are a few aspects to this question we need to bear in mind and handle:

Promises are meant to be chained, so the function needs to return a Promise.
If the input array is empty, the returned Promise resolves with an empty array.
The returned Promise contains an array of outcome objects in the same order as the input.
The input array can contain non-Promises.
We'll return a Promise at the top level of the function. Firstly check if the input array is empty and resolve with an empty array if so.

We then attempt to resolve every item in the input array. This can be achieved using Array.prototype.forEach or Array.prototype.map. As the returned values will need to preserve the order of the input array, create a results array and slot the value in the right place using its index within the input array.

If a value is resolved, the outcome object has the { status: 'fulfilled', value } shape.
If a value is rejected, the outcome object has the { status: 'rejected', reason } shape.
To know when all the input array values have an outcome, keep track of how many pending promises there are by initializing a counter of pending values and decrementing it whenever a value is resolved or rejected. When the pending counter reaches 0, return the results array.

One thing to note here is that because the input array can contain non-Promise values, if we are not await-ing them, we need to wrap each value with Promise.resolve() which allows us to use .then() on each of them and we don't have to differentiate between Promise vs non-Promise values and whether they need to be resolved.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array} iterable
 * @return {Promise<Array<{status: 'fulfilled', value: *}|{status: 'rejected', reason: *}>>}
 */
export default function promiseAllSettled(iterable) {
  return new Promise((resolve) => {
    const results = new Array(iterable.length);
    let pending = iterable.length;

    if (pending === 0) {
      resolve(results);
      return;
    }

    iterable.forEach(async (item, index) => {
      try {
        const value = await item;
        results[index] = {
          status: 'fulfilled',
          value,
        };
      } catch (err) {
        results[index] = {
          status: 'rejected',
          reason: err,
        };
      }

      pending -= 1;
      if (pending === 0) {
        resolve(results);
      }
    });
  });
}
Here's an alternative version which uses Promise.then() if you prefer not to use async/await.


Open files in workspace

/**
 * @param {Array} iterable
 * @return {Promise<Array<{status: 'fulfilled', value: *}|{status: 'rejected', reason: *}>>}
 */
export default function promiseAllSettled(iterable) {
  return new Promise((resolve) => {
    const results = new Array(iterable.length);
    let pending = iterable.length;

    if (pending === 0) {
      resolve(results);
      return;
    }

    iterable.forEach((item, index) => {
      Promise.resolve(item)
        .then(
          (value) => {
            results[index] = {
              status: 'fulfilled',
              value,
            };
          },
          (reason) => {
            results[index] = {
              status: 'rejected',
              reason,
            };
          },
        )
        .finally(() => {
          pending -= 1;
          if (pending === 0) {
            resolve(results);
          }
        });
    });
  });
}
Edge cases
Empty input array. An empty array should be returned.
If the array contains non-Promise values, they will still be part of the returned array if all the input values are fulfilled.
Techniques
Knowledge of Promises, how to construct one, how to use them.
Async programming.
Notes
The evaluator does not verify that your input array is resolved concurrently rather than sequentially.
Resources
Promise.allSettled() - JavaScript | MDN