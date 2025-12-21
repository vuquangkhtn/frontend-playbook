Solution
The useObject hook can be implemented using the useState hook and implementing the updater function to merge the current state object with the new incoming object. To merge objects, you can use the spread (...) syntax.

Note: Object.assign can also merge objects, but it is not recommended because it mutates the target object.


Open files in workspace

import { useCallback, useState } from 'react';

function isPlainObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

type UseObjectUpdater<T extends Record<string | number | symbol, any>> = (
  partialOrUpdaterFunction: Partial<T> | ((prev: T) => Partial<T>),
) => void;

export default function useObject<
  T extends Record<string | number | symbol, any>,
>(initialValue: T): [T, UseObjectUpdater<T>] {
  const [state, setState] = useState(initialValue);

  const merge: UseObjectUpdater<T> = useCallback((partialOrUpdaterFunction) => {
    if (partialOrUpdaterFunction instanceof Function)
      return setState((previousState) => {
        const newState = partialOrUpdaterFunction(previousState);
        if (!isPlainObject(newState)) {
          throw new Error('Invalid new state');
        }

        return { ...previousState, ...newState };
      });

    if (!isPlainObject(partialOrUpdaterFunction)) {
      throw new Error('Invalid new state');
    }

    setState((previousState) => ({
      ...previousState,
      ...partialOrUpdaterFunction,
    }));
  }, []);

  return [state, merge];
}
Edge cases
Simply checking if an object is an Object by using typeof is not enough to ensure that the variable is a POJO. For example, the typeof operator returns 'object' for arrays, null, and other objects like Date, RegExp, and Error.

There are many ways to check if an object is a POJO. One example is defined in this solution.


function isPlainObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
Another one is to reinstantiate the object in question with the Object() constructor. This method's definition is left as an exercise for the reader. Can you think of other reliable ways to check if an object is a POJO?