Solution
The useToggle hook can be implemented using the useState hook, but additionally returns a toggle function that sets the state with an updater function that negates the current state.


Open files in workspace

import { Dispatch, SetStateAction, useState, useCallback } from 'react';

export default function useToggle(
  defaultValue?: boolean,
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(Boolean(defaultValue));

  const toggle = useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, toggle, setValue];
}
We return a triplet, similar to the useState hook, so that the consumer can easily rename the variables when they destructure it.