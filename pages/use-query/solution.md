Solution
The useQuery hook can be implemented with useEffect to begin the promise resolution and update the states accordingly.

The challenge here is to realize that promise resolutions are asynchronous from React updates, so there is a possibility of race conditions when the dependencies change before a pending promise is resolved.

To prevent this, we can use an ignore flag to ignore the promise resolution if it is no longer relevant (e.g. deps have changed, the component has been unmounted). The ignore is initialized within the function's closure; each time useEffect runs, the function has its own ignore instance variable and can refer to it when the promise is resolved and it has to decide whether to use the results.

This approach is well-documented in the React documentation.


Open files in workspace

import { DependencyList, useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export default function useQuery<T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'loading',
  });

  useEffect(() => {
    let ignore = false;

    setState({ status: 'loading' });

    fn()
      .then((data) => {
        if (ignore) {
          return;
        }

        setState({ status: 'success', data });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setState({ status: 'error', error });
      });

    return () => {
      ignore = true;
    };
  }, deps);

  return state;
}