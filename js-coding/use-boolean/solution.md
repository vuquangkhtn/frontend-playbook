Solution
The useBoolean hook uses useState to manage the boolean state. The setter functions can be implemented in terms of setValue from the useState hook, bound by true and false.


JavaScript

TypeScript

Open files in workspace

import { useState } from 'react';

export default function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
  };
}
