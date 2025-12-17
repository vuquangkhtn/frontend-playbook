import { Dispatch, SetStateAction, useState, useCallback } from "react";

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

export default function useCounter(initialValue?: number): UseCounterReturn {
  const [counter, setCounter] = useState(initialValue ?? 0);

  const increment = useCallback(
    () => setCounter(counter + 1),
    [counter, setCounter],
  );
  const decrement = useCallback(
    () => setCounter(counter - 1),
    [counter, setCounter],
  );
  const reset = useCallback(() => setCounter(initialValue ?? 0), []);
  
  return {
    count: counter,
    increment,
    decrement,
    reset,
    setCount: setCounter,
  };
}
