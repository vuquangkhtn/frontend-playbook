import { ChangeEvent, FocusEvent, useState, useEffect } from "react";

interface UseInputValueReturn {
  value: string;
  dirty: boolean;
  touched: boolean;
  different: boolean;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export default function useInputControl(
  initialValue: string,
): UseInputValueReturn {
  const [value, setValue] = useState<string>(initialValue);
  const [isDirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);
  const [different, setDifferent] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (!isDirty) {
      setDirty(true);
    }

    setDifferent(e.target.value !== initialValue);
  };

  const handleBlur = (e: FocusEvent) => {
    if (!touched) {
      setTouched(true);
    }
  };

  const reset = () => {
    setValue(initialValue);
    setDirty(false);
    setTouched(false);
    setDifferent(false);
  }

  return {
    value,
    dirty: isDirty,
    touched,
    different,
    handleChange,
    handleBlur,
    reset
  };
}
