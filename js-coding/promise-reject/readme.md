# Promise Reject

Source: [Promise.reject() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

Unlike Promise.resolve(), Promise.reject() always wraps reason in a new Promise object, even when reason is already a Promise.

Implement the Promise.reject() function as promiseReject. You can ignore the case where this is referenced within the implemented function.

## Examples
```ts
try {
  promiseReject('Mayday!');
} catch (err) {
  console.log(err); // Mayday!
}

```