import { useState, useEffect, useRef } from "react";

export default function Stopwatch() {
  const { millisecond, appState, start, stop, reset } = useStopWatch();

  const textMillisec = String(millisecond % 100).padStart(2, "0");
  const sec = Math.floor(millisecond / 100);
  const textSec = String(sec % 60).padStart(2, "0");
  const mins = Math.floor(sec / 60);
  const textMin = String(mins).padStart(2, "0");

  return (
    <div>
      <p>
        {mins ? `${textMin}m` : ""} {textSec}s {textMillisec}ms
      </p>
      <div>
        {appState === "running" ? (
          <button onClick={stop}>Stop</button>
        ) : (
          <button onClick={start}>Start</button>
        )}{" "}
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

const useStopWatch = () => {
  const [millisecond, setMillisecond] = useState(0);
  const [appState, setAppState] = useState("init");
  const currentIntervalRef = useRef();

  useEffect(() => {
    switch (appState) {
      case "running": {
        currentIntervalRef.current = setInterval(() => {
          setMillisecond((prev) => prev + 1);
        }, 10);
        break;
      }
      case "paused": {
        clearInterval(currentIntervalRef.current);
      }
      default:
    }

    return () => clearInterval(currentIntervalRef.current);
  }, [appState]);

  return {
    millisecond,
    appState,
    stop: () => setAppState("paused"),
    start: () => setAppState("running"),
    reset: () => {
      setAppState("paused");
      setMillisecond(0);
    },
  };
};
