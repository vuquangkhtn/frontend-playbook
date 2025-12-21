Solution
The promiseTimeout function takes two parameters: the original promise and the timeout duration in milliseconds.
Inside the function, create and return a new Promise which will reject() with a custom error after the specified duration.
If the promise argument is fulfilled before duration is up, we can resolve() the promise with the fulfilled value. If it is rejected, we can reject() with the rejected reason.
We use setTimeout to set up the timeout mechanism. When the timeout is reached, the returned promise will reject() with the custom error message.
If the promise is settled before the timeout, we should clear the timer. We can keep a reference the id returned from setTimeout, and in the .finally() method, clear the timeout using clearTimeout so that the reject() within the timeout is not unnecessarily called.

JavaScript

TypeScript

Open files in workspace

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} duration
 * @return {Promise<T>}
 */
export default function promiseTimeout(promise, duration) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject('Promise timeout');
    }, duration);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(timeoutId);
      });
  });
}
Using Promise.race()
The setTimeout is also an async operation and hence be wrapped in a Promise. We can simplify the execution logic by using Promise.race(); whichever promise that is settled first will determine the outcome of the returned Promise.


JavaScript

TypeScript

Open files in workspace

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} duration
 * @return {Promise<T>}
 */
export default function promiseTimeout(promise, duration) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject('Promise timeout');
    }, duration);
  });

  return Promise.race([promise, timeout]);
}
Edge cases
If the promise argument resolves immediately, the overall result should be resolved regardless of the timeout duration, even if it is 0.