Note: This is an advanced version of the Deep Clone question, which you should complete first before attempting this question.

This is a follow-up question based on Deep Clone, with much more depth and obscure corners of the JavaScript language covered.

It is not realistic to expect anyone to come up with a complete deep clone solution in typical interview settings. However, this question serves a good tool to test your knowledge on checking various data types, object properties, leverage various built-in APIs and Object methods to traverse a given object and various edge cases you might only encounter when writing library code.

Solution
Before we go about writing out the deep clone function, we need a way to identify the data type of a given JavaScript value. It is ok to go with typeof and instanceof but you have to be aware of their limitations. In this solution, we leverage Object.prototype.toString. Check out Zhenghao's post "A Complete Guide To Check Data Types In JavaScript" if you like to understand how this works exactly.

Since we want to implement it as thoroughly as possible, here are a few things to consider:

This advanced deepClone should work with objects that have symbol-keyed properties. That is, symbol-keyed properties are also copied. On top of that, non-enumerable properties should also be copied. Neither the for ... in statement or the Object.entries()/Object.keys() reveals them, so we need to leverage a lesser-known API called Reflect.ownKeys(). Check out this MDN page to learn more about it.
The input object's property descriptors should also be copied. For that, we can use the method Object.getOwnPropertyDescriptors().
The input object's prototype should not be lost after the copying. We can use Object.getPrototypeOf() to get a reference to the prototype of a given object.
We should account for circular references in the input object and avoid erroring. We can achieve this by having a cache (a Map underneath) that acts as a cache to store visited properties. After cloning an object, we can put the cloned object in cache with the original object as the key. If we encounter the same value again in the original object while cloning, we can retrieve the cloned value from the cache.

```ts
function isPrimitiveTypeOrFunction(value: unknown): boolean {
  return (
    typeof value !== 'object' || typeof value === 'function' || value === null
  );
}

function getType(value: unknown) {
  const type = typeof value;
  if (type !== 'object') {
    return type;
  }

  return Object.prototype.toString
    .call(value)
    .replace(/^\[object (\S+)\]$/, '$1')
    .toLowerCase();
}

function deepCloneWithCache<T>(value: T, cache: Map<any, any>): T {
  if (isPrimitiveTypeOrFunction(value)) {
    return value;
  }

  const type = getType(value);

  if (type === 'set') {
    const cloned = new Set();
    (value as Set<any>).forEach((item) => {
      cloned.add(deepCloneWithCache(item, cache));
    });
    return cloned as T;
  }

  if (type === 'map') {
    const cloned = new Map();
    (value as Map<any, any>).forEach((value_, key) => {
      cloned.set(key, deepCloneWithCache(value_, cache));
    });
    return cloned as T;
  }

  if (type === 'function') {
    return value;
  }

  if (type === 'array') {
    return (value as Array<any>).map((item) =>
      deepCloneWithCache(item, cache),
    ) as T;
  }

  if (type === 'date') {
    return new Date(value as Date) as T;
  }

  if (type === 'regexp') {
    return new RegExp(value as RegExp) as T;
  }

  if (cache.has(value)) {
    return cache.get(value);
  }

  const cloned = Object.create(Object.getPrototypeOf(value));

  cache.set(value, cloned);
  for (const key of Reflect.ownKeys(value as Object)) {
    const item = (value as any)[key];
    cloned[key] = isPrimitiveTypeOrFunction(item)
      ? item
      : deepCloneWithCache(item, cache);
  }

  return cloned;
}

export default function deepClone<T>(value: T): T {
  return deepCloneWithCache(value, new Map());
}

```

One-liner solution
As of writing, all major browsers have native support for performing deep clone via the structuredClone API. Check out "Deep-copying in JavaScript using structuredClone" on web.dev if you want to learn more about structuredClone's features and limitations.


const clonedObj = structuredClone(obj);
Edge cases
Property descriptors are not copied.