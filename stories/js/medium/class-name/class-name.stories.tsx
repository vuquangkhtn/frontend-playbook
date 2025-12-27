import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

// ClassNames implementation
type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = Array<ClassValue>;

const classNames = (...args: Array<ClassValue>): string => {
  const classes: Array<string> = [];

  const process = (arg: ClassValue) => {
    if (!arg) {
      return;
    }

    const argType = typeof arg;

    if (argType === "string" || argType === "number") {
      classes.push(String(arg));
      return;
    }

    if (Array.isArray(arg)) {
      arg.forEach(process);
      return;
    }

    if (argType === "object") {
      const objArg = arg as ClassDictionary;
      for (const key in objArg) {
        if (Object.hasOwn(objArg, key) && objArg[key]) {
          classes.push(key);
        }
      }
      return;
    }
  };

  args.forEach(process);
  return classes.join(" ");
};

const Demo = () => {
  const [demoMode, setDemoMode] = useState<
    "strings" | "objects" | "mixed" | "arrays"
  >("mixed");

  const demos = {
    strings: {
      inputs: [
        {
          label: "Single string",
          code: "classNames('btn')",
          result: classNames("btn"),
        },
        {
          label: "Two strings",
          code: "classNames('btn', 'primary')",
          result: classNames("btn", "primary"),
        },
        {
          label: "Three strings",
          code: "classNames('text', 'large', 'bold')",
          result: classNames("text", "large", "bold"),
        },
      ],
    },
    objects: {
      inputs: [
        {
          label: "Single true",
          code: "classNames({btn: true})",
          result: classNames({ btn: true }),
        },
        {
          label: "True and false",
          code: "classNames({active: true, disabled: false})",
          result: classNames({ active: true, disabled: false }),
        },
        {
          label: "Multiple keys",
          code: "classNames({btn: true, primary: true, large: false})",
          result: classNames({ btn: true, primary: true, large: false }),
        },
      ],
    },
    mixed: {
      inputs: [
        {
          label: "String + Object",
          code: "classNames('btn', {primary: true})",
          result: classNames("btn", { primary: true }),
        },
        {
          label: "Multiple mixed",
          code: "classNames('btn', {primary: true, disabled: false}, 'lg')",
          result: classNames("btn", { primary: true, disabled: false }, "lg"),
        },
        {
          label: "With falsey values",
          code: "classNames('btn', false && 'disabled', {primary: true})",
          result: classNames("btn", false && "disabled", { primary: true }),
        },
      ],
    },
    arrays: {
      inputs: [
        {
          label: "Array of strings",
          code: "classNames(['btn', 'primary'])",
          result: classNames(["btn", "primary"]),
        },
        {
          label: "Mixed array",
          code: "classNames(['btn', {primary: true}])",
          result: classNames(["btn", { primary: true }]),
        },
        {
          label: "Nested arrays",
          code: "classNames('btn', ['primary', ['large']])",
          result: classNames("btn", ["primary", ["large"]]),
        },
      ],
    },
  };

  const currentDemo = demos[demoMode];

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>classNames() Demo</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>What is classNames()?</h3>
        <p>
          <code>classNames()</code> is a utility function that conditionally
          joins CSS class names together. It accepts strings, objects, arrays,
          and numbers, filters out falsey values, and returns a space-separated
          string of class names.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Interactive Examples</h3>
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          <h4>Demo Mode:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {(Object.keys(demos) as Array<keyof typeof demos>).map((mode) => (
              <button
                key={mode}
                onClick={() => setDemoMode(mode)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: demoMode === mode ? "#2196F3" : "#ddd",
                  color: demoMode === mode ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}
        >
          {currentDemo.inputs.map((demo, idx) => (
            <div
              key={idx}
              style={{
                padding: "12px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                {demo.label}
              </p>
              <p
                style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}
              >
                <code>{demo.code}</code>
              </p>
              <p
                style={{
                  margin: "0",
                  backgroundColor: "#e8f5e9",
                  padding: "8px",
                  borderRadius: "3px",
                  color: "#2e7d32",
                }}
              >
                <code>"{demo.result}"</code>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Real-World Example: Button Component</h3>
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <p style={{ marginBottom: "15px" }}>
            <strong>Button Component with Variants:</strong>
          </p>
          <pre
            style={{
              margin: "0",
              fontSize: "12px",
              overflow: "auto",
              padding: "10px",
              backgroundColor: "#fff",
              borderRadius: "3px",
            }}
          >
            {`function Button({ variant, size, disabled }) {
  return (
    <button className={classNames(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-large': size === 'large',
        'btn-small': size === 'small',
        'btn-disabled': disabled,
      }
    )}>
      Click me
    </button>
  );
}

// Usage:
<Button variant="primary" size="large" />
// className: "btn btn-primary btn-large"

<Button variant="secondary" size="small" disabled />
// className: "btn btn-secondary btn-small btn-disabled"`}
          </pre>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#e3f2fd",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
              Rendered Examples:
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Primary Large
              </button>
              <button
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#757575",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Secondary Small
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ccc",
                  color: "#666",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "not-allowed",
                  opacity: 0.6,
                }}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Handling Different Input Types</h3>
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
              ✅ Included
            </p>
            <ul style={{ margin: "0", paddingLeft: "20px" }}>
              <li>Non-empty strings</li>
              <li>Non-zero numbers</li>
              <li>Object keys with truthy values</li>
              <li>Non-empty arrays</li>
            </ul>
          </div>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#ffebee",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
              ❌ Ignored
            </p>
            <ul style={{ margin: "0", paddingLeft: "20px" }}>
              <li>null, undefined</li>
              <li>false, 0, empty string</li>
              <li>Object keys with falsey values</li>
              <li>Empty arrays</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>
            ✅ Accepts multiple argument types (strings, objects, arrays,
            numbers)
          </li>
          <li>✅ Recursively flattens nested arrays</li>
          <li>✅ Filters out falsey values (null, undefined, false, 0, '')</li>
          <li>✅ Conditional class inclusion via object values</li>
          <li>
            ✅ Returns space-separated string with no leading/trailing
            whitespace
          </li>
          <li>
            ✅ Widely used in React applications (similar to clsx,
            tailwind-merge)
          </li>
        </ul>
      </section>
    </div>
  );
};

const meta = {
  title: "JS/medium/classNames",
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
