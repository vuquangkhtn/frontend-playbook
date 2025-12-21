Solution
The useCountdown hook can be implemented using useState to store the current value of the countdown and useEffect to manage the countdown timer with setInterval.

We just need to make sure we clear the interval with clearInterval when the component is unmounted, i.e., on the effect's clean-up.


Open files in workspace

import { useCallback, useEffect, useState } from 'react';

interface UseCountdownOptions {
  countStart: number;
  countStop?: number;
  intervalMs?: number;
  isIncrement?: boolean;
}

interface UseCountdownReturn {
  count: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export default function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: UseCountdownOptions): UseCountdownReturn {
  const [count, setCount] = useState(countStart);
  const [running, setRunning] = useState(false);

  const reset: UseCountdownReturn['reset'] = useCallback(() => {
    setRunning(false);
    setCount(countStart);
  }, [countStart]);

  const start: UseCountdownReturn['start'] = useCallback(() => {
    setRunning(true);
  }, []);

  const stop: UseCountdownReturn['stop'] = useCallback(() => {
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      if (count === countStop) return stop();

      if (isIncrement) {
        setCount((prev) => prev + 1);
      } else {
        setCount((prev) => prev - 1);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [count, countStop, intervalMs, isIncrement, running]);

  return { count, start, stop, reset };
}