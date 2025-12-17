Solution
The useMediatedState hook can be implemented with useState and a setter function that calls the mediator function before updating the state. To determine the number of arguments a mediator function receives, we can use mediator.length.

To memoize the mediator, we can either use useRef, useMemo, or useCallback since we know for a fact that mediator is a function. The simplest way is to use useRef since there's no need to run any memoization function on the first render.


Open files in workspace

import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

interface StateMediator<T = unknown> {
  (newState: T): T;
  (newState: T, dispatch: Dispatch<SetStateAction<T>>): void;
}

export default function useMediatedState<T = unknown>(
  mediator: StateMediator<T>,
  initialState?: T,
): [T, Dispatch<SetStateAction<T>>] {
  const mediatorFn = useRef(mediator);

  const [state, setMediatedState] = useState<T>(initialState!);

  const setState: Dispatch<SetStateAction<T>> = useCallback(
    (newStateOrUpdaterFunction) => {
      const newState =
        newStateOrUpdaterFunction instanceof Function
          ? newStateOrUpdaterFunction(state)
          : newStateOrUpdaterFunction;

      const mediator = mediatorFn.current;

      if (mediator.length === 2) {
        mediator(newState, setMediatedState);
      } else {
        setMediatedState(mediator(newState));
      }
    },
    [state],
  );

  return [state, setState];
}