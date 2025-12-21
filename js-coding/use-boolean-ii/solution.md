Solution
The typical useBoolean hook uses useState to manage the boolean state. The setter functions can be implemented in terms of setValue from the useState hook, bound by true and false.


import { useState } from 'react';

export default function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
  };
}
However, writing the hook this way means that components that rely on setTrue or setFalse will always be re-rendered since these functions are always freshly created on each render. To avoid this, we can use useCallback to memoize them.


Open files in workspace

import { useCallback, useState } from 'react';

type UseBooleanReturn = {
  /** The current boolean state value. */
  value: boolean;
  /** Function to set the boolean state to `true`. */
  setTrue: () => void;
  /** Function to set the boolean state to `false`. */
  setFalse: () => void;
};

export default function useBoolean(initialValue = false): UseBooleanReturn {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, setTrue, setFalse };
}