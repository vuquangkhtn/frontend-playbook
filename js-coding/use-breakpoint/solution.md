Solution
The useBreakpoint hook can be implemented in createBreakpoint using the useState hook to store the current window width and the useEffect hook to update the width when the window is resized.

After which, sort the breakpoints by increasing values, then search for the last breakpoint whose minimum width is less than the current window width.

If you're using TypeScript, you can make the createBreakpoint function generic so that the returned useBreakpoint's return type is only the strings of the keys of the given breakpoints object, ensuring maximum typesafety.


Open files in workspace

import { useEffect, useMemo, useState } from 'react';

export default function createBreakpoint<T extends Record<string, number>>(
  breakpoints: T,
): () => keyof T {
  return function (): keyof T {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      function resize() {
        setWidth(window.innerWidth);
      }

      resize();
      window.addEventListener('resize', resize);

      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    const sortedBreakpoints = useMemo(
      () => Object.entries(breakpoints).sort((a, b) => a[1] - b[1]),
      [breakpoints],
    );

    return useMemo(
      () =>
        sortedBreakpoints.reduce(
          (acc, [name, size]) => (width >= size ? name : acc),
          sortedBreakpoints[0][0],
        ),
      [sortedBreakpoints, width],
    );
  };
}