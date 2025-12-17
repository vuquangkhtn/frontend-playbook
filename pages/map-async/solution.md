Solution
This question is very similar to the Promise.all question and since this question can be reduced to Promise.all, the same approaches can be used.

Approach 1: Count unresolved promises
The only difference is that instead of just an array of iterables, you have to map the array yourself using a mapping function, then resolve the mapped results.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Array<any>} iterable
 * @param {Function} callbackFn
 *
 * @return {Promise}
 */
export default function mapAsync(iterable, callbackFn) {
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterable.forEach((item, index) => {
      callbackFn(item)
        .then((value) => {
          results[index] = value;
          unresolved -= 1;

          if (unresolved === 0) {
            resolve(results);
          }
        })
        .catch((err) => reject(err));
    });
  });
}
Approach 2: Promise.all
We can also use Promise.all as mapping each item with the mapping function will produce an array of Promises to be resolved.


Open files in workspace

export default function mapAsync<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
): Promise<Array<U>> {
  return Promise.all(iterable.map(callbackFn));
}
Edge cases
We did not specify what parameters the asynchronous mapping function will be passed, so it is up to you to clarify with the interviewer whether the mapping callback function will be passed additional arguments like in Array.prototype.map.