Solution
The benefit of returning a cancel function as opposed to a timerId is that the interval mechanism is abstracted away, and can be swapped for something else. Realistically though, there aren't many other good ways to achieved interval execution in JavaScript and that's why you probably don't see this outside of interviews.

Approach 1: Return a function that calls clearInterval
setInterval returns a timer ID. To cancel the timer, we can call clearInterval(timerId). One simple way to solve this question is to return a function that does exactly that. We can forward all the parameters to setInterval.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {Function}
 */
export default function setCancellableInterval(callback, delay, ...args) {
  const timerId = setInterval(callback, delay, ...args);

  return () => {
    clearInterval(timerId);
  };
}
We can simplify the code a little and forward all the parameters to setInterval.


Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {Function}
 */
export default function setCancellableInterval(...args) {
  const timerId = setInterval(...args);

  return () => {
    clearInterval(timerId);
  };
}
We don't have to worry about this within the callback function because there's no option to pass a thisArg to setInterval unlike Array.prototype.forEach()/Array.prototype.reduce(). Read more about this on MDN.

Approach 2: Maintain a cancelled flag (non-optimal)
Another way is to maintain a cancelled flag that the returned function will set to true when called. Before the setInterval callback is called, check the value of cancelled before executing the callback. This is non-optimal because the setInterval callback will run forever without doing nothing!


Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {Function}
 */
export default function setCancellableInterval(callback, delay, ...args) {
  let cancelled = false;
  setInterval(() => {
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
setInterval() | MDN