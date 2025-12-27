import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import "./array-prototype-reduce.solution";
import { useState } from "react";

const Demo = () => {
  const [reduceType, setReduceType] = useState<
    "sum" | "product" | "concat" | "count"
  >("sum");
  const arr = [1, 2, 3, 4, 5];

  const getReduceFn = (type: string) => {
    switch (type) {
      case "sum":
        return (prev: number, curr: number) => prev + curr;
      case "product":
        return (prev: number, curr: number) => prev * curr;
      case "concat":
        return (prev: string, curr: number) => prev + curr;
      case "count":
        return (prev: number) => prev + 1;
      default:
        return (prev: number, curr: number) => prev + curr;
    }
  };

  const getInitialValue = (type: string) => {
    switch (type) {
      case "sum":
        return 0;
      case "product":
        return 1;
      case "concat":
        return "";
      case "count":
        return 0;
      default:
        return 0;
    }
  };

  const result = arr.myReduce(
    getReduceFn(reduceType),
    getInitialValue(reduceType)
  );

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Array.prototype.reduce Demo</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>What is Array.prototype.reduce?</h3>
        <p>
          The <code>reduce()</code> method executes a reducer function on each
          element of the array, resulting in a single value. It accumulates
          values from left to right and returns the final accumulated result.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Interactive Example</h3>
        <p>
          <strong>Base Array:</strong> <code>[{arr.join(", ")}]</code>
        </p>

        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
          }}
        >
          <h4>Reduction Type:</h4>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="reduce"
                value="sum"
                checked={reduceType === "sum"}
                onChange={(e) =>
                  setReduceType(
                    e.target.value as "sum" | "product" | "concat" | "count"
                  )
                }
              />
              Sum (1+2+3+...)
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="reduce"
                value="product"
                checked={reduceType === "product"}
                onChange={(e) =>
                  setReduceType(
                    e.target.value as "sum" | "product" | "concat" | "count"
                  )
                }
              />
              Product (1×2×3×...)
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="reduce"
                value="concat"
                checked={reduceType === "concat"}
                onChange={(e) =>
                  setReduceType(
                    e.target.value as "sum" | "product" | "concat" | "count"
                  )
                }
              />
              Concatenate
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="reduce"
                value="count"
                checked={reduceType === "count"}
                onChange={(e) =>
                  setReduceType(
                    e.target.value as "sum" | "product" | "concat" | "count"
                  )
                }
              />
              Count Elements
            </label>
          </div>
        </div>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#fff3e0",
            borderRadius: "4px",
          }}
        >
          <p>
            <strong>Result:</strong> <code>{result}</code>
          </p>
          <p style={{ color: "#666", fontSize: "12px", marginTop: "5px" }}>
            {reduceType === "sum" && "Sum of all elements"}
            {reduceType === "product" && "Product of all elements"}
            {reduceType === "concat" && "Elements concatenated as string"}
            {reduceType === "count" && "Total count of elements"}
          </p>
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
            title="Sum"
            code="[1,2,3,4].myReduce((a,b)=>a+b, 0)"
            result={[1, 2, 3, 4].myReduce((a: number, b: number) => a + b, 0)}
          />
          <Example
            title="Product"
            code="[1,2,3,4].myReduce((a,b)=>a*b, 1)"
            result={[1, 2, 3, 4].myReduce((a: number, b: number) => a * b, 1)}
          />
          <Example
            title="Concatenate"
            code="[1,2,3].myReduce((a,b)=>a+b, '')"
            result={[1, 2, 3].myReduce((a: string, b: number) => a + b, "")}
          />
          <Example
            title="Count"
            code="[1,2,3,4].myReduce((a)=>a+1, 0)"
            result={[1, 2, 3, 4].myReduce((a: number) => a + 1, 0)}
          />
          <Example
            title="Min Value"
            code="[5,2,8,1].myReduce((a,b)=>Math.min(a,b))"
            result={[5, 2, 8, 1].myReduce((a: number, b: number) =>
              Math.min(a, b)
            )}
          />
          <Example
            title="Max Value"
            code="[5,2,8,1].myReduce((a,b)=>Math.max(a,b))"
            result={[5, 2, 8, 1].myReduce((a: number, b: number) =>
              Math.max(a, b)
            )}
          />
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Detailed Step-by-Step Example</h3>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
            Computing <code>[1, 2, 3].reduce((a, b) =&gt; a + b, 0)</code>:
          </p>
          <ul style={{ marginLeft: "20px", lineHeight: "1.6" }}>
            <li>
              <strong>Initial:</strong> accumulator = 0
            </li>
            <li>
              <strong>Step 1:</strong> 0 + 1 = 1
            </li>
            <li>
              <strong>Step 2:</strong> 1 + 2 = 3
            </li>
            <li>
              <strong>Step 3:</strong> 3 + 3 = 6
            </li>
            <li>
              <strong>Result:</strong> 6
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Accumulates values from left to right</li>
          <li>✅ Callback receives: accumulator, currentValue, index, array</li>
          <li>
            ✅ Optional initialValue (defaults to first element if omitted)
          </li>
          <li>✅ Returns a single accumulated value (any type)</li>
          <li>✅ Skips empty slots in sparse arrays</li>
          <li>
            ✅ Throws error if array is empty and no initialValue provided
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
  result: number | string;
}) => (
  <div
    style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}
  >
    <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>{title}</p>
    <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}>
      <code>{code}</code>
    </p>
    <p style={{ margin: "0", color: "#d32f2f" }}>
      <code>{result}</code>
    </p>
  </div>
);

const meta = {
  title: "JS/easy/Array.prototype.reduce",
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
