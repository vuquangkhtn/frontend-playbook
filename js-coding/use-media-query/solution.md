Solution
window.matchMedia(query) is a JavaScript method that checks if the document matches a given CSS media query. It returns a MediaQueryList object, which provides:

.matches (boolean): Indicates whether the document currently matches the media query
.addEventListener("change", callback): Listens for changes in the media query’s match state
.removeEventListener("change", callback): Removes the event listener when it’s no longer needed
Example:


const mediaQuery = window.matchMedia('(max-width: 768px)');

if (mediaQuery.matches) {
  console.log('Viewport is 768px or smaller');
}

mediaQuery.addEventListener('change', (e) => {
  console.log(e.matches ? 'Now small screen' : 'Now large screen');
});
useMediaQuery is a hook that allows a React app to leverage this browser API and respond to media changes (e.g. screen size, resolution, orientation, and more).

Approach 1: useEffect and useState
The useMediaQuery hook can be implemented using the useState hook to store the current media query match and the useEffect hook to update the match when the media query changes. We can attach a listener to the change event on the MediaQueryList object returned by window.matchMedia(...) to update the match state.


Open files in workspace

import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    function updateMatch() {
      setMatches(mediaQueryList.matches);
    }

    mediaQueryList.addEventListener('change', updateMatch);

    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}
Approach 2: useSyncExternalStore
React's useSyncExternalStore hook is a better fit as it is meant for syncing React state with external systems, such as subscribing to native browser APIs.


Open files in workspace

import { useCallback, useSyncExternalStore } from 'react';

export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);

      mediaQueryList.addEventListener('change', callback);

      return () => {
        mediaQueryList.removeEventListener('change', callback);
      };
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
  );
}