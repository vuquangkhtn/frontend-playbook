Solution
The useCycle hook can be implemented using the useState hook that stores the current index in the sequence that represents the current value. The cycle function can be implemented by incrementing the index by 1 modulo the length of the sequence so that it cycles back to 0 when it reaches the length of the sequence.

The indefinite number of arguments can be implemented using the rest parameter syntax.


Open files in workspace

import { useCallback, useState } from 'react';

export default function useCycle<T>(...args: T[]) {
  const [index, setIndex] = useState(0);

  const cycle = useCallback(() => {
    setIndex((index) => (index + 1) % args.length);
  }, []);

  return [args[index], cycle] as const;
}
