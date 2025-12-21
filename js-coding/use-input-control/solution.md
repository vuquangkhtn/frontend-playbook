Solution
To recap what fields are returned:

value: The current input value
touched: Whether the input has been focused then blurred
dirty: Whether the value has been changed before
different: Whether the value is different from the original
Let's go through each field and how to implement them:

value
value is a boolean value tracked using React state. An handleChange handler us used to to update the value state from the input's change event.

touched
touched is a boolean value tracked using React state. It will be set to true when the input is blurred. As the hook does not know when the <input> element is blurred, we return a handleBlur function that sets the value to true and the user will call the handleBlur function in an onBlur event handler.

dirty
touched is a boolean value tracked using React state. Since it is set to true when it has been changed before, handleChange is a good place to do that.

different
This field does not require a state as it is derived state that can be computed by comparing the initial value and the current value. However, the comparison should not be done against the initialValue argument as the value might be different during re-renders!

Instead, we track the first render's initialValue using useRef. Why not state? Because initialValueRef does not ever change after the hook is mounted.


const different = initialValueRef.current !== value;
reset function
This function resets all the states within the hook. Simply call the various state setters with their initial values. The initial value to set to can be obtained from initialValueRef.


Open files in workspace

import { ChangeEvent, useCallback, useRef, useState } from 'react';

interface UseInputValueReturn {
  value: string;
  dirty: boolean;
  touched: boolean;
  different: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  reset: () => void;
}

const defaultDirty = false;
const defaultTouched = false;

export default function useInputControl(
  initialValue: string,
): UseInputValueReturn {
  const initialValueRef = useRef<string>(initialValue);
  const [value, setValue] = useState(initialValue);
  const [dirty, setDirty] = useState(defaultDirty);
  const [touched, setTouched] = useState(defaultTouched);

  const handleChange: UseInputValueReturn['handleChange'] = useCallback(
    (event) => {
      setValue(event.currentTarget.value);
      setDirty(true);
    },
    [],
  );
  const handleBlur: UseInputValueReturn['handleBlur'] = useCallback(() => {
    setTouched(true);
  }, []);
  const reset = useCallback(() => {
    setValue(initialValueRef.current);
    setDirty(defaultDirty);
    setTouched(defaultTouched);
  }, []);

  // Derived from whether the value is different from the initial value
  const different = initialValueRef.current !== value;

  return {
    value,
    dirty,
    touched,
    different,
    handleChange,
    handleBlur,
    reset,
  };
}