Solution
Approach 1: Using array to store unique key values
Create an empty compare array to store the unique keys.
Iterate through array and determine the key for each element by calling iteratee(element). If the key does not exist within compare, insert the key into compare. Next, append the element into result.
Two variables are used:

result: Tracks the unique elements from array.
compare: Tracks the unique computed value of the elements through iteratee to be used for comparison.

JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} iteratee The iteratee invoked per element.
 * @param {...Array} arrays Array from which the elements are all numbers.
 * @return {Array} Returns the new array of combined values.
 */
export default function unionBy(iteratee, ...arrays) {
  const result = [];
  const compare = [];

  // Push the unique `item` based on `iteratee` into `result` while keeping the comparison value in `compare`.
  arrays.forEach((array) => {
    array.forEach((item) => {
      if (!compare.includes(iteratee(item))) {
        result.push(item);
        compare.push(iteratee(item));
      }
    });
  });

  return result;
}

Approach 2: Use Set for compare
Another solution will be using a set instead of array for compare as sets can check for existence of items efficiently.



```ts
export default function unionBy<T>(
  iteratee: (value: T) => any,
  ...arrays: Array<any>
): Array<T> {
  const result: Array<T> = [];
  const compare = new Set<number>();

  // Push the unique `item` based on `iteratee` into `result` while keeping the comparison value in `compare`.
  arrays.forEach((array) => {
    array.forEach((item: T) => {
      if (!compare.has(iteratee(item))) {
        result.push(item);
        compare.add(iteratee(item));
      }
    });
  });

  return result;
}

```

Edge cases
If the input arrays are sparse, the function might include undefined in the output for the missing indices. To solve this, we can pre-process arrays to remove or fill sparse elements as appropriate.

Resources
Lodash _.unionBy