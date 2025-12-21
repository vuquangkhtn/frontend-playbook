Solution
The useArray hook can be implemented by storing the array in a useState state and defining the utility methods to manipulate the array in terms of the state's setter function with JavaScript's built-in array methods.

Remember to wrap the utility methods in useCallback to prevent unnecessary re-renders of the calling component.


Open files in workspace

import { Dispatch, SetStateAction, useCallback, useState } from 'react';

interface UseArrayReturn<T> {
  array: T[];
  set: Dispatch<SetStateAction<T[]>>;
  push: (element: T) => void;
  filter: (callback: (value: T, index: number, array: T[]) => boolean) => void;
  update: (index: number, newElement: T) => void;
  remove: (index: number) => void;
  clear: () => void;
}

export default function useArray<T>(defaultValue: T[]): UseArrayReturn<T> {
  const [array, setArray] = useState(defaultValue);

  const push: UseArrayReturn<T>['push'] = useCallback(
    (element) => setArray((a) => [...a, element]),
    [],
  );

  const filter: UseArrayReturn<T>['filter'] = useCallback(
    (callback) => setArray((a) => a.filter(callback)),
    [],
  );

  const update: UseArrayReturn<T>['update'] = useCallback(
    (index, newElement) =>
      setArray((a) => [
        ...a.slice(0, index),
        newElement,
        ...a.slice(index + 1, a.length),
      ]),
    [],
  );

  const remove: UseArrayReturn<T>['remove'] = useCallback(
    (index) =>
      setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]),
    [],
  );

  const clear: UseArrayReturn<T>['clear'] = useCallback(() => setArray([]), []);

  return { array, set: setArray, push, filter, update, remove, clear };
}
Edge cases
Ensure that the utility methods you implement modify the array in an immutable way since states in React should not be mutated.