Solution
The useIdle hook can be implemented using useState to store the idle state, and useEffect to set up the event listeners and the idle timeout. To detect if the user is currently on our tab, we can use either document.hidden or document.visibilityState when the visibilitychange event is triggered on the document.


Open files in workspace

import { useEffect, useState } from 'react';

const DEFAULT_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'resize',
  'keydown',
  'touchstart',
  'wheel',
];

export default function useIdle(
  ms = 60_000,
  initialState = false,
  events: (keyof WindowEventMap)[] = DEFAULT_EVENTS,
): boolean {
  const [idle, setIdle] = useState<boolean>(initialState);

  useEffect(() => {
    let timeoutId: number;

    function handleTimeout() {
      setIdle(true);
    }

    function handleEvent() {
      setIdle(false);

      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleTimeout, ms);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        return;
      }

      handleEvent();
    }

    timeoutId = setTimeout(handleTimeout, ms);

    events.forEach((event) => window.addEventListener(event, handleEvent));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);

      events.forEach((event) => window.removeEventListener(event, handleEvent));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  return idle;
}
Challenge
In the solution above (and probably yours, too), we are watching the mousemove event. This means that every time the user moves the mouse, handleEvent will be called to reset the idle state! This behaviour also happens for frequently dispatched events like resize or wheel. Can you think of a way to optimize for this?