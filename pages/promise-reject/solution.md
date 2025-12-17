Solution
Promise.reject returns a Promise that is rejected. It is essentially a shorthand for new Promise((resolve, reject) => reject(reason)).

The only thing we need to note is to wrap the reason value in a new Promise object even when reason is already a Promise.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {*} reason
 * @returns Promise
 */
export default function promiseReject(reason) {
  return new Promise((_, reject) => reject(reason));
}