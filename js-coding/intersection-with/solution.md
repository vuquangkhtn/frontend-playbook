```ts
export default function intersectionWith<T>(
  comparator: (a: T, b: T) => boolean,
  ...arrays: Array<Array<T>>
): Array<T> {
  if (!arrays.length) {
    return [];
  }

  const firstArray = arrays[0];

  // Perform intersection
  return firstArray.filter((value) =>
    arrays
      .slice(1)
      .every((arr) => arr.some((otherValue) => comparator(value, otherValue))),
  );
}

```

The solution iterates over the values of the first array using .filter. For each value, it checks whether in every other array there is some value such that the comparator function returns true. If so, then the value passes the filter and is included in the returned array.

Resources
Lodash _.intersectionWith