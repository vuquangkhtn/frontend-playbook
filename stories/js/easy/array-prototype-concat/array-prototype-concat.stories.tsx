import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import './array-prototype-concat.solution';
import { useState } from 'react';

const Demo = () => {
  const [items, setItems] = useState<(number | number[])[]>([]);
  const baseArr = [1, 2, 3];

  const handleAddArray = () => {
    setItems([...items, []]);
  };

  const handleAddValue = () => {
    setItems([...items, 0]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateArray = (index: number, newArray: number[]) => {
    const updated = [...items];
    updated[index] = newArray;
    setItems(updated);
  };

  const handleUpdateValue = (index: number, newValue: number) => {
    const updated = [...items];
    updated[index] = newValue;
    setItems(updated);
  };

  const result = baseArr.myConcat(...items);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Array.prototype.concat Demo</h2>

      <section style={{ marginBottom: '30px' }}>
        <h3>What is Array.prototype.concat?</h3>
        <p>
          The <code>concat()</code> method is used to merge two or more arrays. 
          It returns a new array without modifying the original arrays.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Interactive Example</h3>
        <p>
          <strong>Base Array:</strong> <code>{JSON.stringify(baseArr)}</code>
        </p>

        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <h4>Arguments to concat:</h4>
          {items.length === 0 ? (
            <p style={{ color: '#666' }}>No arguments added yet</p>
          ) : (
            <ul style={{ marginTop: '10px' }}>
              {items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '3px' }}>
                  {Array.isArray(item) ? (
                    <>
                      Array: <code>[{item.join(', ')}]</code>
                      <input
                        type="text"
                        value={item.join(', ')}
                        onChange={(e) =>
                          handleUpdateArray(
                            idx,
                            e.target.value
                              .split(',')
                              .map((v) => parseInt(v.trim()) || 0)
                              .filter((v) => !isNaN(v))
                          )
                        }
                        placeholder="e.g., 4, 5, 6"
                        style={{ marginLeft: '10px', padding: '4px', width: '150px' }}
                      />
                    </>
                  ) : (
                    <>
                      Value: <code>{item}</code>
                      <input
                        type="number"
                        value={item}
                        onChange={(e) => handleUpdateValue(idx, Number(e.target.value))}
                        style={{ marginLeft: '10px', padding: '4px', width: '100px' }}
                      />
                    </>
                  )}
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    style={{
                      marginLeft: '10px',
                      padding: '4px 8px',
                      backgroundColor: '#ff6b6b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddArray}
              style={{
                padding: '8px 12px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              + Add Array
            </button>
            <button
              onClick={handleAddValue}
              style={{
                padding: '8px 12px',
                backgroundColor: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              + Add Value
            </button>
          </div>
        </div>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          <p>
            <strong>Result:</strong> <code>[{baseArr.myConcat(...items).join(', ')}]</code>
          </p>
          <p style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
            Length: {result.length}
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Usage Examples</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Example title="Single Array" code="[1, 2].myConcat([3, 4])" result={[1, 2].myConcat([3, 4])} />
          <Example title="Multiple Arrays" code="[1].myConcat([2], [3])" result={[1].myConcat([2], [3])} />
          <Example title="Primitive Values" code="[1, 2].myConcat(3, 4)" result={[1, 2].myConcat(3, 4)} />
          <Example title="Mixed Arguments" code="[1].myConcat([2], 3, [4])" result={[1].myConcat([2], 3, [4])} />
          <Example title="No Arguments" code="[1, 2].myConcat()" result={[1, 2].myConcat()} />
          <Example title="Empty Array" code="[].myConcat([1, 2])" result={[].myConcat([1, 2])} />
        </div>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Merges arrays and values into a new array</li>
          <li>✅ Accepts multiple arguments</li>
          <li>✅ Flattens one level of nested arrays</li>
          <li>✅ Does not modify original arrays</li>
          <li>✅ Returns a new array every time</li>
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
  <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{title}</p>
    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
      <code>{code}</code>
    </p>
    <p style={{ margin: '0', color: '#2196F3' }}>
      <code>{JSON.stringify(result)}</code>
    </p>
  </div>
);

const meta = {
  title: 'JS/Array.prototype.concat',
  tags: ['!autodocs'],
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {};

export const DemoStory: Story = {
  name: 'Demo',
  render: () => <Demo />,
};
