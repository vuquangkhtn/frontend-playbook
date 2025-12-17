import { DependencyList, useState, useEffect } from "react";

type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export default function useQuery<T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): AsyncState<T> {
  const [response, setResponse] = useState<AsyncState<T>>({
    status: "loading",
  });

  useEffect(() => {

    let ignore = false;
    fn()
      .then((data) => {
        if (!ignore) {
          setResponse({
            status: "success",
            data,
          });
        }
      })
      .catch((error) => {
        setResponse({
          status: "error",
          error,
        });
      });

    return () => {
      setResponse({ status: "loading" });
      ignore = true;
    };
  }, [...deps]);

  return response;
}
