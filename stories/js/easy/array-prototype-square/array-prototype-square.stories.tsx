import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import "./array-prototype-square.solution";
import { useState } from "react";

const Demo = () => {
  const [inputArray, setInputArray] = useState<string>("1,2,3,4,5");

  const parseArray = (str: string): number[] => {
    return str
      .split(",")
      .map((s) => {
        const num = parseFloat(s.trim());
        return isNaN(num) ? 0 : num;
      })
      .filter((n) => !isNaN(n));
  };

  const arr = parseArray(inputArray);
  const result = arr.square();

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Array.prototype.square Demo</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>What is Array.prototype.square?</h3>
        <p>
          The <code>square()</code> method creates a new array with each element
          squared (multiplied by itself). It does not modify the original array.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Interactive Example</h3>
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
          }}
        >
          <label style={{ display: "block", marginBottom: "10px" }}>
            <strong>Enter Array (comma-separated):</strong>
            <input
              type="text"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              style={{
                display: "block",
                marginTop: "5px",
                padding: "8px",
                width: "100%",
                maxWidth: "400px",
                boxSizing: "border-box",
              }}
              placeholder="e.g., 1,2,3,4,5"
            />
          </label>
          <p style={{ color: "#666", fontSize: "12px", marginTop: "5px" }}>
            Current array: <code>[{arr.join(", ")}]</code>
          </p>
        </div>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#f3e5f5",
            borderRadius: "4px",
          }}
        >
          <p>
            <strong>Original Array:</strong> <code>[{arr.join(", ")}]</code>
          </p>
          <p>
            <strong>Squared Result:</strong> <code>[{result.join(", ")}]</code>
          </p>
          <p style={{ color: "#666", fontSize: "12px", marginTop: "5px" }}>
            Original array unchanged:{" "}
            {JSON.stringify(arr) === JSON.stringify(arr)}
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Square Transformation Breakdown</h3>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Original</th>
                <th style={{ padding: "8px", textAlign: "center" }}>
                  Operation
                </th>
                <th style={{ padding: "8px", textAlign: "right" }}>Squared</th>
              </tr>
            </thead>
            <tbody>
              {arr.map((num, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px", textAlign: "left" }}>{num}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    {num} × {num}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    <strong>{result[idx]}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Usage Examples</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <Example
            title="Simple Squares"
            code="[1,2,3,4].square()"
            result={[1, 2, 3, 4].square()}
          />
          <Example
            title="Negative Numbers"
            code="[-1,-2,-3].square()"
            result={[-1, -2, -3].square()}
          />
          <Example
            title="Mixed Numbers"
            code="[-2,0,3,5].square()"
            result={[-2, 0, 3, 5].square()}
          />
          <Example
            title="Decimals"
            code="[1.5,2.5,3.5].square()"
            result={[1.5, 2.5, 3.5].square()}
          />
          <Example
            title="Large Numbers"
            code="[10,20,30].square()"
            result={[10, 20, 30].square()}
          />
          <Example
            title="Single Element"
            code="[7].square()"
            result={[7].square()}
          />
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Real-World Use Cases</h3>
        <ul>
          <li>
            <strong>Distance Calculation:</strong> In math/physics, calculating
            Euclidean distance:
            <code style={{ marginLeft: "5px" }}>
              [3, 4].square().reduce((a,b)={">"}a+b)
            </code>{" "}
            = 25 (so √25 = 5)
          </li>
          <li>
            <strong>Data Scaling:</strong> Squaring values to emphasize larger
            differences
          </li>
          <li>
            <strong>Variance Calculation:</strong> First step in calculating
            statistical variance
          </li>
        </ul>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Returns a new array with squared values</li>
          <li>✅ Does not modify the original array</li>
          <li>✅ Works with positive and negative numbers</li>
          <li>✅ Works with decimals and integers</li>
          <li>
            ✅ Simple, readable alternative to <code>.map(n ={">"} n * n)</code>
          </li>
        </ul>
      </section>
    </div>
  );
};

const Example = ({
  title,
  code,
  result,
}: {
  title: string;
  code: string;
  result: number[];
}) => (
  <div
    style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}
  >
    <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>{title}</p>
    <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}>
      <code>{code}</code>
    </p>
    <p style={{ margin: "0", color: "#7b1fa2" }}>
      <code>{JSON.stringify(result)}</code>
    </p>
  </div>
);

const meta = {
  title: "JS/easy/Array.prototype.square",
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
