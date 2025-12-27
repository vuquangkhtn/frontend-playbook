import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, useEffect } from "react";

// Import the solution to register the function
const setCancellableInterval = (
  callback: Function,
  delay?: number,
  ...args: Array<any>
): (() => void) => {
  const timer = setInterval(callback, delay ?? 0, ...args);
  return () => {
    clearInterval(timer);
  };
};

const Demo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [cancelAt, setCancelAt] = useState<number | null>(null);
  const [cancelRef, setCancelRef] = useState<(() => void) | null>(null);

  const startInterval = () => {
    let localCount = 0;
    setCount(0);
    setIsRunning(true);

    const cancel = setCancellableInterval(() => {
      localCount++;
      setCount(localCount);

      if (cancelAt !== null && localCount >= cancelAt) {
        cancel();
        setIsRunning(false);
      }
    }, delay);

    setCancelRef(() => cancel);
  };

  const stopInterval = () => {
    if (cancelRef) {
      cancelRef();
      setIsRunning(false);
      setCancelRef(null);
    }
  };

  const reset = () => {
    if (cancelRef) {
      cancelRef();
    }
    setCount(0);
    setIsRunning(false);
    setCancelRef(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>setCancellableInterval Demo</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>What is setCancellableInterval?</h3>
        <p>
          <code>setCancellableInterval()</code> is a wrapper around the native
          <code>setInterval()</code> that returns a cancel function instead of a
          timer ID. This provides a cleaner, more object-oriented API for
          managing intervals.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Interactive Example</h3>
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              <strong>Interval Delay (ms):</strong>
              <input
                type="number"
                value={delay}
                onChange={(e) =>
                  setDelay(Math.max(100, Number(e.target.value)))
                }
                disabled={isRunning}
                style={{ marginLeft: "10px", padding: "4px", width: "100px" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              <strong>Auto-cancel after (iterations):</strong>
              <input
                type="number"
                value={cancelAt ?? ""}
                onChange={(e) =>
                  setCancelAt(e.target.value ? Number(e.target.value) : null)
                }
                disabled={isRunning}
                placeholder="Leave empty for manual cancel"
                style={{ marginLeft: "10px", padding: "4px", width: "150px" }}
              />
            </label>
            <p style={{ color: "#666", fontSize: "12px", margin: "5px 0 0 0" }}>
              Leave empty to cancel manually using the button
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={startInterval}
              disabled={isRunning}
              style={{
                padding: "8px 16px",
                backgroundColor: isRunning ? "#ccc" : "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              Start Interval
            </button>
            <button
              onClick={stopInterval}
              disabled={!isRunning}
              style={{
                padding: "8px 16px",
                backgroundColor: !isRunning ? "#ccc" : "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: !isRunning ? "not-allowed" : "pointer",
              }}
            >
              Cancel Interval
            </button>
            <button
              onClick={reset}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#e8f5e9",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: "0 0 10px 0" }}>
            <strong>Counter:</strong>{" "}
            <span style={{ fontSize: "28px", color: "#2e7d32" }}>{count}</span>
          </p>
          <p style={{ margin: "0", color: "#666", fontSize: "12px" }}>
            Status: <strong>{isRunning ? "⏱️ Running" : "⏸️ Stopped"}</strong>
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Code Example</h3>
        <div
          style={{
            padding: "12px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          <pre style={{ margin: "0", fontSize: "12px" }}>
            {`let counter = 0;

const cancel = setCancellableInterval(() => {
  counter++;
  console.log('Counter:', counter);
}, 1000);

// Later, to stop the interval:
cancel();`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Comparison: setInterval vs setCancellableInterval</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fff3e0",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
              setInterval (Native)
            </p>
            <pre style={{ margin: "0", fontSize: "11px" }}>
              {`const id = setInterval(() => {
  doSomething();
}, 1000);

// Must clear by ID
clearInterval(id);`}
            </pre>
          </div>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e3f2fd",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
              setCancellableInterval
            </p>
            <pre style={{ margin: "0", fontSize: "11px" }}>
              {`const cancel = setCancellableInterval(() => {
  doSomething();
}, 1000);

// Just call the function
cancel();`}
            </pre>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Real-World Use Cases</h3>
        <ul>
          <li>
            <strong>Polling API Data:</strong> Fetch data at regular intervals
            and cancel when component unmounts
          </li>
          <li>
            <strong>Game Loops:</strong> Run game updates at fixed intervals,
            stopping when game ends
          </li>
          <li>
            <strong>Auto-save:</strong> Periodically save user data and stop
            when the session ends
          </li>
          <li>
            <strong>Animation Loops:</strong> Animate UI elements and stop when
            animation completes
          </li>
          <li>
            <strong>Countdown Timers:</strong> Run countdown and auto-cancel
            when reaching zero
          </li>
        </ul>
      </section>

      <section>
        <h3>Key Advantages</h3>
        <ul>
          <li>✅ Cleaner API: Returns a function instead of a numeric ID</li>
          <li>✅ Encapsulation: Timer management is abstracted away</li>
          <li>
            ✅ Easier to understand: More intuitive function-based cancellation
          </li>
          <li>
            ✅ Supports all setInterval parameters including additional
            arguments
          </li>
          <li>✅ Compatible with React hooks (useEffect cleanup)</li>
        </ul>
      </section>
    </div>
  );
};

const meta = {
  title: "JS/easy/setCancellableInterval",
  tags: ["!autodocs"],
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {};

export const DemoStory: Story = {
  name: "Demo",
  render: () => <Demo />,
};
