import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, useEffect } from "react";
import setCancellableTimeout from "./cancellable-timeout.solution";

const Demo = () => {
  const [delay, setDelay] = useState(2000);
  const [status, setStatus] = useState<
    "idle" | "waiting" | "executed" | "cancelled"
  >("idle");
  const [cancelRef, setCancelRef] = useState<(() => void) | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Update elapsed time while waiting
  useEffect(() => {
    if (status !== "waiting") return;

    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.min(Date.now() - startTime, delay));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [status, startTime, delay]);

  const startTimeout = () => {
    setStatus("waiting");
    setElapsedTime(0);
    setStartTime(Date.now());

    const cancel = setCancellableTimeout(() => {
      setStatus("executed");
      setElapsedTime(delay);
    }, delay);

    setCancelRef(() => cancel);
  };

  const cancelTimeout = () => {
    if (cancelRef) {
      cancelRef();
      setStatus("cancelled");
      setCancelRef(null);
    }
  };

  const reset = () => {
    if (cancelRef) {
      cancelRef();
    }
    setStatus("idle");
    setElapsedTime(0);
    setStartTime(null);
    setCancelRef(null);
  };

  const progressPercent = (elapsedTime / delay) * 100;

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>setCancellableTimeout Demo</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>What is setCancellableTimeout?</h3>
        <p>
          <code>setCancellableTimeout()</code> is a wrapper around the native
          <code>setTimeout()</code> that returns a cancel function instead of a
          timer ID. This provides a cleaner API for managing one-off delayed
          operations.
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
              <strong>Delay (ms):</strong>
              <input
                type="number"
                value={delay}
                onChange={(e) =>
                  setDelay(Math.max(100, Number(e.target.value)))
                }
                disabled={status === "waiting"}
                style={{ marginLeft: "10px", padding: "4px", width: "100px" }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <button
              onClick={startTimeout}
              disabled={status !== "idle"}
              style={{
                padding: "8px 16px",
                backgroundColor: status !== "idle" ? "#ccc" : "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: status !== "idle" ? "not-allowed" : "pointer",
              }}
            >
              Start Timeout
            </button>
            <button
              onClick={cancelTimeout}
              disabled={status !== "waiting"}
              style={{
                padding: "8px 16px",
                backgroundColor: status !== "waiting" ? "#ccc" : "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: status !== "waiting" ? "not-allowed" : "pointer",
              }}
            >
              Cancel Timeout
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

          {/* Progress Bar */}
          {status === "waiting" && (
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Progress:</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "20px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    backgroundColor: "#2196F3",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>
            </div>
          )}

          {/* Status Display */}
          <div
            style={{
              padding: "12px",
              backgroundColor: getStatusColor(status),
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
              {getStatusMessage(status)}
            </p>
            {status === "waiting" && (
              <p style={{ margin: "0", fontSize: "14px" }}>
                Elapsed: {Math.round(elapsedTime)}ms / {delay}ms
              </p>
            )}
          </div>
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
            {`// Simple usage
const cancel = setCancellableTimeout(() => {
  console.log('Executed!');
}, 2000);

// Cancel before it executes
cancel();

// With parameters
const cancel2 = setCancellableTimeout(
  (name, message) => {
    console.log(\`\${name}: \${message}\`);
  },
  1000,
  'User',
  'Hello!'
);`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Comparison: setTimeout vs setCancellableTimeout</h3>
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
              setTimeout (Native)
            </p>
            <pre style={{ margin: "0", fontSize: "11px" }}>
              {`const id = setTimeout(() => {
  doSomething();
}, 2000);

// Must clear by ID
clearTimeout(id);`}
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
              setCancellableTimeout
            </p>
            <pre style={{ margin: "0", fontSize: "11px" }}>
              {`const cancel = setCancellableTimeout(() => {
  doSomething();
}, 2000);

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
            <strong>Debouncing:</strong> Execute a function after user stops
            typing
          </li>
          <li>
            <strong>Toast Notifications:</strong> Auto-dismiss notifications
            after a delay
          </li>
          <li>
            <strong>Confirmation Dialogs:</strong> Auto-close after a timeout
            with cancel option
          </li>
          <li>
            <strong>Async Operations:</strong> Set a timeout for an operation
            and cancel if it's no longer needed
          </li>
          <li>
            <strong>Undo Actions:</strong> Show an undo option for a limited
            time then execute action
          </li>
          <li>
            <strong>Animated Transitions:</strong> Schedule cleanup after
            animation completes
          </li>
        </ul>
      </section>

      <section>
        <h3>Key Advantages</h3>
        <ul>
          <li>✅ Cleaner API: Returns a function instead of a numeric ID</li>
          <li>✅ Encapsulation: Timer management is abstracted away</li>
          <li>
            ✅ More Intuitive: Function-based cancellation is easier to
            understand
          </li>
          <li>
            ✅ Supports all setTimeout parameters including additional arguments
          </li>
          <li>✅ Perfect for React hooks (useEffect cleanup)</li>
        </ul>
      </section>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "waiting":
      return "#fff3e0";
    case "executed":
      return "#e8f5e9";
    case "cancelled":
      return "#ffebee";
    default:
      return "#f5f5f5";
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case "waiting":
      return "⏱️ Waiting for timeout to complete...";
    case "executed":
      return "✅ Timeout executed!";
    case "cancelled":
      return "❌ Timeout was cancelled";
    default:
      return "⏸️ Ready to start";
  }
};

const meta = {
  title: "JS/easy/setCancellableTimeout",
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
