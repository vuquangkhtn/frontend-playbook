Note: This is an advanced version of Promisify, which you should complete first before attempting this question.

Solution
The only addition you need to make is to check if the func argument has the custom Symbol.for('util.promisify.custom') defined and return the corresponding value if so.


JavaScript

TypeScript

Open files in workspace

const promisifyCustomSymbol = Symbol.for('util.promisify.custom');

/**
 * @callback func
 * @returns Function
 */
export default function promisify(func) {
  if (func[promisifyCustomSymbol]) {
    return func[promisifyCustomSymbol];
  }

  return function (...args) {
    return new Promise((resolve, reject) => {
      func.call(this, ...args, (err, result) =>
        err ? reject(err) : resolve(result),
      );
    });
  };
}
Resources
Custom promisified functions | Node.js