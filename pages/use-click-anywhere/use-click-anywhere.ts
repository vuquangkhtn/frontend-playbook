import { useEffect } from "react";

export default function useClickAnywhere(handler: (event: MouseEvent) => void) {
  const handleCallback = (event: MouseEvent) => {
    handler(event);
  };

  useEffect(() => {
    window.addEventListener("click", handleCallback);

    return () => {
      window.removeEventListener("click", handleCallback);
    };
  }, []);
}
