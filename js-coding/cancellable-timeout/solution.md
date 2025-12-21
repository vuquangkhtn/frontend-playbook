Solution
The benefit of returning a cancel function as opposed to a timerId is that the delay mechanism is abstracted away, and can be swapped for something else. Realistically though, there aren't many other ways to achieved delay execution in JavaScript and that's why you probably don't see this outside of interviews.

Approach 1: Return a function that calls clearTimeout
setTimeout returns a timer ID. To cancel the timer, we can call clearTimeout(timerId). One simple way to solve this question is to return a function that does exactly that. We can forward all the parameters to setTimeout.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {Function}
 */
export default function setCancellableTimeout(callback, delay, ...args) {
  const timerId = setTimeout(callback, delay, ...args);

  return () => {
    clearTimeout(timerId);
  };
}
We can simplify the code a little and forward all the parameters to setTimeout.


Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {Function}
 */
export default function setCancellableTimeout(...args) {
  const timerId = setTimeout(...args);

  return () => {
    clearTimeout(timerId);
  };
}
We don't have to worry about this within the callback function because there's no option to pass a thisArg to setTimeout unlike Array.prototype.forEach()/Array.prototype.reduce(). Read more about this on MDN.

Approach 2: Maintain a cancelled flag (non-optimal)
Another way is to maintain a cancelled flag that the returned function will set to true when called. Before the setTimeout callback is called, check the value of cancelled before executing the callback. This is non-optimal because the setTimeout callback is still invoked unnecessarily and ends up doing nothing.


Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {Function}
 */
export default function setCancellableTimeout(callback, delay, ...args) {
  let cancelled = false;
  setTimeout(() => {
    if (cancelled) {
      return;
    }

    callback(...args);
  }, delay);

  return () => {
    cancelled = true;
  };
}
Resources
setTimeout() | MDN