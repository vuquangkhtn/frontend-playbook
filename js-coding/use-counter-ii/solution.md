Solution
The useCounter hook uses useState to manage the number state. The setter functions can be implemented in terms of setValue from the useState hook.


import { useState } from 'react';

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  return {
    count,
    increment: () => setCount((x) => x + 1),
    decrement: () => setCount((x) => x - 1),
    reset: () => setCount(initialValue),
    setCount,
  };
}
However, writing the hook this way means that components that rely on the utility functions will always be re-rendered since these functions are always freshly created on each render. To avoid this, we can use useCallback to memoize them.


Open files in workspace

import { Dispatch, SetStateAction, useCallback, useState } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

export default function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((x) => x + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((x) => x - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
To ensure consistency, the increment and decrement functions use an updater function to calculate the new value based on the previous value. As an added bonus, if you're wrapping them in useCallback, you don't have to add initialValue to the dependency array and increment and decrement will always be memoized once.

If you're using TypeScript, the tricky part is figuring out the right type for setCount since it can also accept an updater function. Simply hover the setter function from useState in your favourite IDE and you'll see the type signature in the form of Dispatch<SetStateAction<...>> where the type of the state is .... Dispatch and SetStateAction can be imported from react.

If you prefer to be verbose, it essentially boils down to this.


type SetCount = (
  valueOrUpdater: number | ((previousValue: number) => number),
) => void;
