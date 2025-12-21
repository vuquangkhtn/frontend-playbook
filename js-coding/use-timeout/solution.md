Solution
The useTimeout hook can be implemented with useEffect to create a timeout with setTimeout for delay milliseconds. The timeout is cleared when the component is unmounted or when the delay is null.

The callback is stored using useRef so that the pending timer can reference the latest callback.


Open files in workspace

import { useRef, useEffect } from 'react';

export default function useTimeout(callback: () => void, delay: number | null) {
  const latestCallback = useRef(callback);
  latestCallback.current = callback;

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const timeoutId = setTimeout(() => {
      latestCallback.current();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay]);
}