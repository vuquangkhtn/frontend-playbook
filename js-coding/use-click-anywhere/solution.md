Solution
The useClickAnywhere hook can be implemented by making the provided handler function a click event listener on the window object whenever the component mounts.

useEffect is the React hook to use here, and the event listener is added when calling the hook. When adding event listeners, it's imperative to remember to remove the event listener when the component is unmounted. This can be achieved by returning a function within the useEffect callback that unsubscribes from the event. This returned function is called when the component unmounts.


Open files in workspace

import { useEffect } from 'react';

export default function useClickAnywhere(handler: (event: MouseEvent) => void) {
  useEffect(() => {
    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);
}