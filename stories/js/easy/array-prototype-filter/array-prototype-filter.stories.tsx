import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import "./array-prototype-filter.solution";
import { useState } from "react";

const Demo = () => {
  const [filterType, setFilterType] = useState<"even" | "odd" | "custom">(
    "even"
  );
  const [customThreshold, setCustomThreshold] = useState(5);
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const getFilterFn = (type: string) => {
    switch (type) {
      case "even":
        return (n: number) => n % 2 === 0;
      case "odd":
        return (n: number) => n % 2 === 1;
      case "custom":
        return (n: number) => n > customThreshold;
      default:
        return () => true;
    }
  };

  const result = arr.myFilter(getFilterFn(filterType));

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Array.prototype.filter Demo</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>What is Array.prototype.filter?</h3>
        <p>
          The <code>filter()</code> method creates a new array with all elements
          that pass the test implemented by the provided callback function. It
          does not modify the original array.
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
          <h4>Filter Condition:</h4>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="filter"
                value="even"
                checked={filterType === "even"}
                onChange={(e) =>
                  setFilterType(e.target.value as "even" | "odd" | "custom")
                }
              />
              Even Numbers
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="filter"
                value="odd"
                checked={filterType === "odd"}
                onChange={(e) =>
                  setFilterType(e.target.value as "even" | "odd" | "custom")
                }
              />
              Odd Numbers
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                name="filter"
                value="custom"
                checked={filterType === "custom"}
                onChange={(e) =>
                  setFilterType(e.target.value as "even" | "odd" | "custom")
                }
              />
              Greater Than
            </label>
          </div>

          {filterType === "custom" && (
            <div style={{ marginBottom: "10px" }}>
              <label>
                Threshold:
                <input
                  type="number"
                  value={customThreshold}
                  onChange={(e) => setCustomThreshold(Number(e.target.value))}
                  style={{ marginLeft: "10px", padding: "4px", width: "80px" }}
                />
              </label>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#e8f5e9",
            borderRadius: "4px",
          }}
        >
          <p>
            <strong>Result:</strong> <code>[{result.join(", ")}]</code>
          </p>
          <p style={{ color: "#666", fontSize: "12px", marginTop: "5px" }}>
            {result.length} element{result.length !== 1 ? "s" : ""} matched
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
            title="Filter Even"
            code="[1,2,3,4].myFilter(n => n % 2 === 0)"
            result={[1, 2, 3, 4].myFilter((n: number) => n % 2 === 0)}
          />
          <Example
            title="Filter Odd"
            code="[1,2,3,4].myFilter(n => n % 2 === 1)"
            result={[1, 2, 3, 4].myFilter((n: number) => n % 2 === 1)}
          />
          <Example
            title="Filter by Index"
            code="[10,20,30].myFilter((,i) => i % 2 === 0)"
            result={[10, 20, 30].myFilter((_, i) => i % 2 === 0)}
          />
          <Example
            title="Filter Greater Than"
            code="[1,5,3,8,2].myFilter(n => n > 3)"
            result={[1, 5, 3, 8, 2].myFilter((n: number) => n > 3)}
          />
          <Example
            title="Empty Result"
            code="[1,3,5].myFilter(n => n % 2 === 0)"
            result={[1, 3, 5].myFilter((n: number) => n % 2 === 0)}
          />
          <Example
            title="All Match"
            code="[2,4,6].myFilter(n => n % 2 === 0)"
            result={[2, 4, 6].myFilter((n: number) => n % 2 === 0)}
          />
        </div>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Returns a new array without modifying the original</li>
          <li>✅ Callback receives: element, index, and array</li>
          <li>
            ✅ Supports optional <code>thisArg</code> for callback context
          </li>
          <li>✅ Skips empty slots in sparse arrays</li>
          <li>✅ Only includes elements where callback returns truthy value</li>
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
    <p style={{ margin: "0", color: "#2196F3" }}>
      <code>{JSON.stringify(result)}</code>
    </p>
  </div>
);

const meta = {
  title: "JS/easy/Array.prototype.filter",
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
