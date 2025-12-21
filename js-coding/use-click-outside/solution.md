Solution
The useClickOutside hook can be implemented with useEffect to attach and detach our outside click event listener to the document with addEventListener and removeEventListener, respectively.

To detect if a click is outside of the target element, we can use the contains method on the ref element to check if event.target is a descendant of the target element.


Open files in workspace

import { RefObject, useEffect, useRef } from 'react';

export default function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: 'mousedown' | 'touchstart' = 'mousedown',
  eventListenerOptions: boolean | AddEventListenerOptions = {},
) {
  const latestHandler = useRef(handler);
  latestHandler.current = handler;

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent | FocusEvent) => {
      const target = event.target as Node;
      if (!target || !target.isConnected) {
        return;
      }

      const outside = ref.current && !ref.current.contains(target);
      if (!outside) {
        return;
      }

      latestHandler.current(event);
    };

    window.addEventListener(eventType, listener, eventListenerOptions);

    return () => {
      window.removeEventListener(eventType, listener, eventListenerOptions);
    };
  }, [ref, eventType, eventListenerOptions]);
}