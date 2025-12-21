export default function difference<T>(
  array: Array<T>,
  values: Array<T>,
): Array<T> {
  const result = [];

  // Create a set of all the values in the values arrays.
  const valuesSet = new Set(values);

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    // Check if the value is in the values set.
    if (!valuesSet.has(value) && !(value === undefined && !(i in array))) {
      result.push(value);
    }
  }

  return result;
}

Here's a simpler solution that leverages Array.prototype.filter and checking of the set.


Open files in workspace

export default function difference(array, values) {
  const valuesSet = new Set(values);
  return array.filter((value) => !valuesSet.has(value));
}
The set can also be omitted by using Array.prototype.includes instead.


Open files in workspace

export default function difference(array, values) {
  return array.filter((value) => !values.includes(value));
}
Edge cases
To handle sparse arrays such as [1, ,3], the in operator is used check if the index i is present in the array before checking if the value at index i is undefined. This ensures that sparse arrays are handled correctly.

Resources
Lodash _.difference