# Promisify

Before promises/async/await became the standard, it was a convention for async APIs in JavaScript to accept callbacks as the last argument. Many async versions of Node.js APIs (e.g. fs.readFile and fs.rm) have such signatures. Node.js' util.promisify function was created to wrap around callback-based functions by returning Promises so that they can be used with async/await.

Implement a function promisify that takes a function following the common callback-last error-first style, i.e. taking a (err, value) => ... callback as the last argument, and returns a version that returns promises.

## Examples
```ts
// Example function with callback as last argument
// The callback has the signature `(err, value) => any`
function foo(url, options, callback) {
  apiCall(url, options)
    .then((data) => callback(null, data))
    .catch((err) => callback(err));
}

const promisifiedFoo = promisify(foo);
const data = await promisifiedFoo('example.com', { foo: 1 });
```