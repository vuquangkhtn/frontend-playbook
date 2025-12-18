Solution
Value comparison in JavaScript can be deceptively simple. Normally a triple equal ===, i.e. strict equality, can do the job: for primitive values, it compares the actual values; for objects, it compares their identities/references, instead of their "contents". For example, const a = {id: 1}; const b = {id: 1} are considered different objects by === even if they contain the exactly same id property. Most of the time this is what we want. For this question though, we are going to implement a function that can deeply compare objects. Therefore we can't solely rely on === for comparison.

Outside its reference-checking nature, strict equality === does have a few edge cases that it doesn't cover:

Two NaN values are considered different NaN === NaN // false.
Numerical values -0 and +0 are considered as equal.
A better choice here is to use Object.is. This is also what React uses during its reconciliation phase to detect props change for a given component. Check out Object.is on MDN if you want to learn more about it and see how it differs from ===.

We don't test for the above cases but you might want to point this out when explaining why you used Object.is.

There are two main ways to go about solving this question:

Handling arrays/objects first, primitives last.
Handling primitives first, arrays/objects last.
Approach 1: Handling arrays/objects first
The tricky part of the question about deep-comparing objects and arrays. Firstly, we need to know how to detect their data types. The typeof operator is probably the first solution that comes to mind but it is not enough for our use case here.

typeof null gives you object, so we cannot use typeof to distinguish between objects, arrays, and nulls. More importantly, it doesn't distinguish other built-in objects such as Date and Regex from plain objects and array. That is, it return object for all of the built-in objects (except for functions). This is not useful because we can only sensibly traverse and deep-compare objects and arrays, and everything else should be compared by references via Object.is.

To get around this, you can combine the instanceof operator to check for the constructor of a given object. But an easier and cleaner way to detect data types is to use Object.prototype.toString. Check out this article by Zhenghao if you want to dive deep into this topic.

A utility function shouldDeepCompare will be useful for determining whether we should traverse down the current property of the input object based on the data type retrieved by getType. When the current property is not an object or an array, we can proceed to compare their types and values via Object.is.

```ts
// Warning: Incomplete solution. Refer to below.
function shouldDeepCompare(type) {
  return type === '[object Object]' || type === '[object Array]';
}

function getType(value) {
  return Object.prototype.toString.call(value);
}

export default function deepEqual(valueA, valueB) {
  const typeA = getType(valueA);
  const typeB = getType(valueB);

  if (typeA === typeB && shouldDeepCompare(typeA) && shouldDeepCompare(typeB)) {
    // When both props are objects or arrays, we traverse into them by calling `isEqual` again.
  }

  return Object.is(valueA, valueB);
}

```

Now let's work on the case where both input values are objects or arrays. Because we need to recurse into any objects/arrays we found in the input. If it is an array, we can just loop through the items. However if it is an object, we either use for ... in statement to loop through all the keys (own keys and inherited keys), or we can convert its own enumerable, non-symbol-keyed properties into an array of key-value pairs with Object.entries and then we can loop through that array instead. The benefits with the second approach are:

We only get its own properties, as opposed to inherited ones.
We can bail out of comparison if the lengths of two arrays are different. That is, two objects/arrays have different numbers of properties/items.
Here is the complete solution:

```ts
function shouldDeepCompare(type: string) {
  return type === '[object Object]' || type === '[object Array]';
}

function getType(value: unknown): string {
  return Object.prototype.toString.call(value);
}

export default function deepEqual(valueA: unknown, valueB: unknown): boolean {
  // Check for arrays/objects equality.
  const type1 = getType(valueA);
  const type2 = getType(valueB);

  // Only compare the contents if they're both arrays or both objects.
  if (type1 === type2 && shouldDeepCompare(type1) && shouldDeepCompare(type2)) {
    const entriesA = Object.entries(valueA as Array<unknown> | Object);
    const entriesB = Object.entries(valueB as Array<unknown> | Object);

    if (entriesA.length !== entriesB.length) {
      return false;
    }

    return entriesA.every(
      // Make sure the other object has the same properties defined.
      ([key, value]) =>
        Object.hasOwn(valueB as Array<unknown> | Object, key) &&
        deepEqual(value, (valueB as any)[key]),
    );
  }

  // Check for primitives + type equality.
  return Object.is(valueA, valueB);
}

```

Approach 2: Handling primitives first
We can also get primitives out of the way by handling them with Object.is() first. If they fail the primitive equality check, then we can check if they're both arrays or objects. If it also fails that check, it means there's a mismatch between the type of values and we can return false.

The next part is to check if both arrays/objects have the same entries (keys/values). The approach provided here is an alternative to the earlier solution but the idea is the same:

Check that both objects have the same keys:
Both objects have the same number of keys.
All of the first object's keys exist in the other object.
Recursively check that the each key's value are the same.

```ts
/**
 * @param {*} valueA
 * @param {*} valueB
 * @return {boolean}
 */
export default function deepEqual(valueA, valueB) {
  // Check primitives for equality.
  if (Object.is(valueA, valueB)) {
    return true;
  }

  const bothObjects =
    Object.prototype.toString.call(valueA) === '[object Object]' &&
    Object.prototype.toString.call(valueB) === '[object Object]';
  const bothArrays = Array.isArray(valueA) && Array.isArray(valueB);

  // At this point, they can still be primitives but of different types.
  // If they had the same value, they would have been handled earlier in Object.is().
  // So if they're not both objects or both arrays, they're definitely not equal.
  if (!bothObjects && !bothArrays) {
    return false;
  }

  // Compare the keys of arrays and objects.
  if (Object.keys(valueA).length !== Object.keys(valueB).length) {
    return false;
  }

  for (const key in valueA) {
    if (!deepEqual(valueA[key], valueB[key])) {
      return false;
    }
  }

  // All checks passed, the arrays/objects are equal.
  return true;
}

```

Edge cases
- Comparing nulls, Objects, Arrays.
- Equality of +0 and -0.
- Cyclic objects, i.e. objects with circular references are not handled.
- Property descriptors are not taken into account when comparing properties.
- Non-enumerable properties and symbol-keyed properties are not compared.