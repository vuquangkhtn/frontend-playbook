Solution
The useInterval hook can be implemented with useEffect to create an interval with setInterval every given delay milliseconds. The interval is cleared when the component is unmounted or when the delay is null.


Open files in workspace

import { useEffect, useRef } from 'react';

export default function useInterval(
  callback: () => void,
  delay: number | null,
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}