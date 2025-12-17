import { useState, useRef } from "react";

export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setValue] = useState<T>(value);
  const timeoutRef = useRef<number>();

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    setValue(value);
  }, delay);

  return debouncedValue;
}
