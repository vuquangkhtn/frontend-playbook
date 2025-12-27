import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import "./array-prototype-at.solution";
import { useState } from "react";

const Demo = () => {
  const [index, setIndex] = useState(0);
  const arr = [42, 79, 103];

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Array.prototype.at Demo</h2>

      <section style={{ marginBottom: "30px" }}>
        <h3>What is Array.prototype.at?</h3>
        <p>
          The <code>at()</code> method allows you to access array elements by
          index, supporting both positive and negative indices. Negative indices
          count from the end of the array.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Interactive Example</h3>
        <p>
          <strong>Array:</strong> {JSON.stringify(arr)}
        </p>

        <label>
          Index:
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <p>
            <code>arr.myAt({index})</code> ={" "}
            <strong>{arr.myAt(index) ?? "undefined"}</strong>
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Usage Examples</h3>
        <ul>
          <li>
            <code>arr.myAt(0)</code> = {arr.myAt(0)} (first element)
          </li>
          <li>
            <code>arr.myAt(1)</code> = {arr.myAt(1)} (second element)
          </li>
          <li>
            <code>arr.myAt(2)</code> = {arr.myAt(2)} (third element)
          </li>
          <li>
            <code>arr.myAt(-1)</code> = {arr.myAt(-1)} (last element)
          </li>
          <li>
            <code>arr.myAt(-2)</code> = {arr.myAt(-2)} (second to last)
          </li>
          <li>
            <code>arr.myAt(-3)</code> = {arr.myAt(-3)} (third from last)
          </li>
          <li>
            <code>arr.myAt(10)</code> = {arr.myAt(10) ?? "undefined"} (out of
            range)
          </li>
        </ul>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Positive indices: access from the start</li>
          <li>✅ Negative indices: access from the end</li>
          <li>✅ Out-of-range returns: undefined</li>
        </ul>
      </section>
    </div>
  );
};

const meta = {
  title: "JS/easy/Array.prototype.at",
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
