import { useState } from 'react';

type UseBooleanReturn = {
  value: boolean;
  setTrue: () => void;
  setFalse: () => void;
};

export default function useBoolean(initialValue?: boolean): UseBooleanReturn {
  const [value, setValue] = useState(initialValue || false);


  return {
    value,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
  }
}