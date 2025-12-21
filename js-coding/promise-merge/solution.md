Clarification questions
What happens if there are overlapping properties on objects to be merged?
They can be overridden simply, a deep merge doesn't need to be performed.
Solution
Approach 1: Manual coordination
We can keep track of the state of the promises by tracking the number of unresolved promises and storing the values of the resolved promises. If there are no unresolved promises left, we can proceed to merge the results and resolve() the returned promise with that result.

Merging the results is straightforward if you know how to check for the common data types, which we have covered in Type Utilities and Type Utilities II. Since only merging of plain objects is supported, we need to differentiate between plain objects and other objects like Sets and Maps.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Promise} p1
 * @param {Promise} p2
 * @return {Promise<any>}
 */
export default function promiseMerge(p1, p2) {
  let unresolved = 2;
  let p1Result, p2Result;

  return new Promise((resolve, reject) => {
    function then() {
      unresolved--;
      if (unresolved === 0) {
        resolve(mergeResult(p1Result, p2Result));
      }
    }

    p1.then((result) => {
      p1Result = result;
      then();
    }).catch(reject);
    p2.then((result) => {
      p2Result = result;
      then();
    }).catch(reject);
  });
}

function mergeResult(result1, result2) {
  try {
    if (typeof result1 === 'number' && typeof result2 === 'number') {
      return result1 + result2;
    }

    if (typeof result1 === 'string' && typeof result2 === 'string') {
      return result1 + result2;
    }

    if (Array.isArray(result1) && Array.isArray(result2)) {
      return [...result1, ...result2];
    }

    if (isPlainObject(result1) && isPlainObject(result2)) {
      return { ...result1, ...result2 };
    }

    throw 'Unsupported data types';
  } catch {
    throw 'Unsupported data types';
  }
}

function isPlainObject(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
Notice that the logic to keep track of the resolved promise results can get repetitive, and it gets worse if the function supports more than 2 promises. Thankfully, there's actually a built-in construct to help with managing state of multiple promises: Promise.all, which we can use to simplify the code.

Approach 2: Using Promise.all()
Using Promise.all() will simplify the code a lot. However, you might not be allowed to use that during interviews, so it's still useful to know how track the states of the promises manually.


Open files in workspace

/**
 * @param {Promise} p1
 * @param {Promise} p2
 * @return {Promise<any>}
 */
export default function promiseMerge(p1, p2) {
  return Promise.all([p1, p2]).then(([result1, result2]) => {
    try {
      if (typeof result1 === 'number' && typeof result2 === 'number') {
        return result1 + result2;
      }

      if (typeof result1 === 'string' && typeof result2 === 'string') {
        return result1 + result2;
      }

      if (Array.isArray(result1) && Array.isArray(result2)) {
        return [...result1, ...result2];
      }

      if (isPlainObject(result1) && isPlainObject(result2)) {
        return { ...result1, ...result2 };
      }

      throw 'Unsupported data types';
    } catch {
      throw 'Unsupported data types';
    }
  });
}

function isPlainObject(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
Approach 3: Using serial await (non-optimal)
This solution is very simple but is non-optimal because the promises are resolved serially instead of in parallel.


Open files in workspace

/**
 * @param {Promise} p1
 * @param {Promise} p2
 * @return {Promise<any>}
 */
export default async function promiseMerge(p1, p2) {
  const result1 = await p1;
  const result2 = await p2;

  try {
    if (typeof result1 === 'number' && typeof result2 === 'number') {
      return result1 + result2;
    }

    if (typeof result1 === 'string' && typeof result2 === 'string') {
      return result1 + result2;
    }

    if (Array.isArray(result1) && Array.isArray(result2)) {
      return [...result1, ...result2];
    }

    if (isPlainObject(result1) && isPlainObject(result2)) {
      return { ...result1, ...result2 };
    }

    throw 'Unsupported data types';
  } catch {
    throw 'Unsupported data types';
  }
}

function isPlainObject(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}