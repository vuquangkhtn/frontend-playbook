Solution
The important part of this question is to be aware of how to check for each type of data and how to determine whether it's empty.

The order of checking isn't too important, but Object is a base type for many JavaScript values (null, Arrays are all objects), so it is best to check for plain objects at the last.

Note that Lodash's implementation of isEmpty also checks for less common data types like arguments objects and DOM collections but we've excluded that from the solution.

```ts
export default function isEmpty(value: unknown): boolean {
  if (value == null) {
    return true;
  }

  // Arrays/Strings.
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }

  // Maps/Sets.
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Plain objects.
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null || prototype === Object.prototype) {
    return Object.keys(value).length === 0;
  }

  return true;
}

```

Resources
Lodash _.isEmpty