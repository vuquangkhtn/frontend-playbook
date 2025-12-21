Solution
The useFocus hook can be implemented by using useRef to create the ref object and defining the function that calls the focus method on the element referenced by the ref.

We can additionally wrap the focus function in requestAnimationFrame to ensure that the focus is applied by the next DOM repaint.


Open files in workspace

import { RefObject, useCallback, useRef } from 'react';

export default function useFocus<T extends HTMLElement>(): [
  RefObject<T>,
  () => void,
] {
  const ref = useRef<T>(null);

  const focusElement = useCallback(() => {
    requestAnimationFrame(() => {
      ref.current?.focus();
    });
  }, []);

  return [ref, focusElement];
}