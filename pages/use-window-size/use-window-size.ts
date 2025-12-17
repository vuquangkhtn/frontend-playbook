import { useState, useEffect } from "react";

interface WindowSize {
  height: number;
  width: number;
}

export default function useWindowSize(): WindowSize {
  const [screen, setScreen] = useState<WindowSize>();

  useEffect(() => {
    const resizeHandler = () => {
      setScreen({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    if (!screen) {
      resizeHandler();
    }
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return screen;
}
