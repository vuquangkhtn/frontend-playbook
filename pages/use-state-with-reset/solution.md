Solution
The useStateWithReset hook can be implemented using the useState hook. We then additionally define a reset function that resets the state to its initial value.

The challenge is when we realize that useState can also accept an initializer function to compute its initial value. If the user provides an initializer function, the reset function should reset the state to the value returned by this initializer only when it was called during state initialization.


JavaScript

TypeScript

Open files in workspace

import { useCallback, useMemo, useState } from 'react';

export default function useStateWithReset(initialStateOrInitializer) {
  const initialState = useMemo(() => {
    if (
      typeof initialStateOrInitializer === 'function' &&
      initialStateOrInitializer.length === 0
    )
      return initialStateOrInitializer();

    return initialStateOrInitializer;
  }, []);

  const [state, setState] = useState(initialState);

  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, setState, reset];
}