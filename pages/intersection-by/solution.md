```ts
export default function intersectionBy<T, R>(
  iteratee: (value: T) => R,
  ...arrays: Array<Array<T>>
): Array<T> {
  if (arrays.length == 0) {
    return [];
  }

  if (arrays.length === 1) {
    const uniqueSet = new Set<R>();
    const result = [];
    for (const value of arrays[0]) {
      const transformedValue = iteratee(value);

      if (!uniqueSet.has(transformedValue)) {
        uniqueSet.add(transformedValue);
        result.push(value);
      }
    }
    return result;
  }

  // If any array is empty, the intersection is empty
  if (arrays.some((arr) => arr.length === 0)) {
    return [];
  }

  // Create Sets of transformed values for arrays 2 onwards for O(1) lookup
  const subsequentSets = arrays
    .slice(1)
    .map((array) => new Set(array.map(iteratee)));

  const result = [];
  const includedTransformedValues = new Set<R>();

  // Check elements from the first array against the sets.
  for (const value of arrays[0]) {
    const transformedValue = iteratee(value);

    if (
      !includedTransformedValues.has(transformedValue) &&
      subsequentSets.every((set) => set.has(transformedValue))
    ) {
      result.push(value); // Add the original value.
      includedTransformedValues.add(transformedValue); // Mark transformed value as included.
    }
  }

  return result;
}

```

The solution first creates Sets of transformed values from arrays 2 onwards using the iteratee for efficient lookups. It then filters the first array by checking if each element's transformed value is present in all these Sets via has(). Finally, it collects the corresponding original values from the first array that satisfy the condition.

Resources
Lodash _.intersectionBy