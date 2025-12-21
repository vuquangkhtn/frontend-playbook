Solution
The useCounter hook uses useState to manage the number state. The setter functions can be implemented in terms of setValue from the useState hook.


JavaScript

TypeScript

Open files in workspace

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
To ensure consistency, the increment and decrement functions use an updater function to calculate the new value based on the previous value.

If you're using TypeScript, the tricky part is figuring out the right type for setCount since it can also accept an updater function. Simply hover the setter function from useState in your favourite IDE and you'll see the type signature in the form of Dispatch<SetStateAction<...>> where the type of the state is .... Dispatch and SetStateAction can be imported from react.

If you prefer to be verbose, it essentially boils down to this.


type SetCount = (
  valueOrUpdater: number | ((previousValue: number) => number),
) => void;