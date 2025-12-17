import { useRef, useEffect } from "react";

export default function useTimeout(callback: () => void, delay: number | null) {
  const currentTimeoutRef = useRef<number>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay) {
      if (currentTimeoutRef.current) {
        clearTimeout(currentTimeoutRef.current);
      }
      currentTimeoutRef.current = setTimeout(() => {
        callbackRef.current();
      }, delay);
    }
    return () => clearTimeout(currentTimeoutRef.current);
  }, [delay]);
}
