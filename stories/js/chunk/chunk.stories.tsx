import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

// Chunk function implementation
const chunk = <T,>(array: Array<T>, size = 1): Array<Array<T>> => {
  if (!Array.isArray(array) || size < 1) {
    return [];
  }

  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }

  return result;
};

const Demo = () => {
  const [inputText, setInputText] = useState('1,2,3,4,5,6,7,8,9,10');
  const [chunkSize, setChunkSize] = useState(3);

  const parseInput = (text: string): (string | number)[] => {
    return text
      .split(',')
      .map((s) => {
        const num = parseFloat(s.trim());
        return isNaN(num) ? s.trim() : num;
      })
      .filter((item) => item !== '');
  };

  const inputArray = parseInput(inputText);
  const result = chunk(inputArray, chunkSize);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>chunk() Demo</h2>

      <section style={{ marginBottom: '30px' }}>
        <h3>What is chunk()?</h3>
        <p>
          The <code>chunk()</code> function splits an array into groups of a specified 
          size. If the array length is not evenly divisible by the chunk size, the last 
          chunk will contain the remaining elements.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Interactive Example</h3>
        <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              <strong>Input Array (comma-separated):</strong>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  display: 'block',
                  marginTop: '5px',
                  padding: '8px',
                  width: '100%',
                  maxWidth: '500px',
                  boxSizing: 'border-box',
                }}
                placeholder="e.g., 1,2,3,4,5,6"
              />
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              <strong>Chunk Size:</strong>
              <input
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(Math.max(1, Number(e.target.value)))}
                style={{ marginLeft: '10px', padding: '4px', width: '80px' }}
                min="1"
              />
            </label>
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Input:</strong> <code>[{inputArray.join(', ')}]</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Chunk Size:</strong> <code>{chunkSize}</code>
          </p>
          <p>
            <strong>Result:</strong>
          </p>
          <div style={{ marginTop: '8px', paddingLeft: '20px' }}>
            {result.map((chunk, idx) => (
              <p key={idx} style={{ margin: '4px 0' }}>
                <code>[{chunk.join(', ')}]</code>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Visual Representation</h3>
        <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(chunkSize, inputArray.length)}, 1fr)`, gap: '10px' }}>
            {result.map((chunkData, chunkIdx) => (
              <div key={chunkIdx} style={{ marginBottom: '15px', gridColumn: `1 / -1` }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#666' }}>
                  Chunk {chunkIdx + 1}:
                </p>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {chunkData.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#2196F3',
                        color: '#fff',
                        borderRadius: '4px',
                        textAlign: 'center',
                        minWidth: '50px',
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Usage Examples</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Example 
            title="Default Size (1)" 
            code="chunk([1, 2, 3])" 
            result={chunk([1, 2, 3])}
          />
          <Example 
            title="Size 2" 
            code="chunk([1, 2, 3, 4], 2)" 
            result={chunk([1, 2, 3, 4], 2)}
          />
          <Example 
            title="Size 3" 
            code="chunk([1,2,3,4,5], 3)" 
            result={chunk([1, 2, 3, 4, 5], 3)}
          />
          <Example 
            title="Uneven Division" 
            code="chunk([1,2,3,4,5], 2)" 
            result={chunk([1, 2, 3, 4, 5], 2)}
          />
          <Example 
            title="Size > Length" 
            code="chunk([1, 2], 5)" 
            result={chunk([1, 2], 5)}
          />
          <Example 
            title="Empty Array" 
            code="chunk([], 3)" 
            result={chunk([], 3)}
          />
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Real-World Use Cases</h3>
        <ul>
          <li>
            <strong>Pagination:</strong> Split items into pages of 10, 20, 50 items each
          </li>
          <li>
            <strong>Grid Layout:</strong> Arrange items in a grid with specific columns
          </li>
          <li>
            <strong>Batch Processing:</strong> Process data in batches of N items
          </li>
          <li>
            <strong>API Requests:</strong> Split large datasets into smaller requests
          </li>
          <li>
            <strong>CSV Export:</strong> Organize data into rows with fixed columns
          </li>
          <li>
            <strong>Display Optimization:</strong> Show items in groups for better performance
          </li>
        </ul>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Splits array into chunks of specified size</li>
          <li>✅ Handles remainder elements in final chunk</li>
          <li>✅ Default size of 1 creates single-element chunks</li>
          <li>✅ Does not modify the original array</li>
          <li>✅ Works with any data type (numbers, strings, objects)</li>
          <li>✅ Returns empty array for empty input</li>
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
  result: (string | number)[][];
}) => (
  <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{title}</p>
    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
      <code>{code}</code>
    </p>
    <p style={{ margin: '0', color: '#1565c0', fontSize: '12px', wordBreak: 'break-all' }}>
      <code>{JSON.stringify(result)}</code>
    </p>
  </div>
);

const meta = {
  title: 'JS/chunk',
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
