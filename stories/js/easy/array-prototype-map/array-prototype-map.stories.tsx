import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import './array-prototype-map.solution';
import { useState } from 'react';

const Demo = () => {
  const [mapType, setMapType] = useState<'square' | 'double' | 'custom'>('square');
  const [customMultiplier, setCustomMultiplier] = useState(2);
  const arr = [1, 2, 3, 4, 5];

  const getMapFn = (type: string) => {
    switch (type) {
      case 'square':
        return (n: number) => n * n;
      case 'double':
        return (n: number) => n * 2;
      case 'custom':
        return (n: number) => n * customMultiplier;
      default:
        return (n: number) => n;
    }
  };

  const result = arr.myMap(getMapFn(mapType));

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Array.prototype.map Demo</h2>

      <section style={{ marginBottom: '30px' }}>
        <h3>What is Array.prototype.map?</h3>
        <p>
          The <code>map()</code> method creates a new array populated with the results 
          of calling a callback function on every element in the array. It transforms 
          each element and returns a new array without modifying the original.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Interactive Example</h3>
        <p>
          <strong>Base Array:</strong> <code>[{arr.join(', ')}]</code>
        </p>

        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <h4>Transformation:</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="transform"
                value="square"
                checked={mapType === 'square'}
                onChange={(e) => setMapType(e.target.value as 'square' | 'double' | 'custom')}
              />
              Square (n²)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="transform"
                value="double"
                checked={mapType === 'double'}
                onChange={(e) => setMapType(e.target.value as 'square' | 'double' | 'custom')}
              />
              Double (n × 2)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="transform"
                value="custom"
                checked={mapType === 'custom'}
                onChange={(e) => setMapType(e.target.value as 'square' | 'double' | 'custom')}
              />
              Custom Multiply
            </label>
          </div>

          {mapType === 'custom' && (
            <div style={{ marginBottom: '10px' }}>
              <label>
                Multiplier:
                <input
                  type="number"
                  value={customMultiplier}
                  onChange={(e) => setCustomMultiplier(Number(e.target.value))}
                  style={{ marginLeft: '10px', padding: '4px', width: '80px' }}
                />
              </label>
            </div>
          )}
        </div>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <p>
            <strong>Result:</strong> <code>[{result.join(', ')}]</code>
          </p>
          <p style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
            {result.length} element{result.length !== 1 ? 's' : ''} transformed
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Usage Examples</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Example title="Square" code="[1,2,3].myMap(n => n * n)" result={[1, 2, 3].myMap((n: number) => n * n)} />
          <Example title="Double" code="[1,2,3].myMap(n => n * 2)" result={[1, 2, 3].myMap((n: number) => n * 2)} />
          <Example title="Multiply by Index" code="[10,20,30].myMap((n,i) => n * i)" result={[10, 20, 30].myMap((n: number, i) => n * i)} />
          <Example title="Stringify" code="[1,2,3].myMap(n => 'num' + n)" result={[1, 2, 3].myMap((n: number) => 'num' + n)} />
          <Example title="Square Root" code="[4,9,16].myMap(Math.sqrt)" result={[4, 9, 16].myMap((n: number) => Math.sqrt(n))} />
          <Example title="Negate" code="[1,-2,3].myMap(n => -n)" result={[1, -2, 3].myMap((n: number) => -n)} />
        </div>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Returns a new array with transformed elements</li>
          <li>✅ Does not modify the original array</li>
          <li>✅ Callback receives: element, index, and array</li>
          <li>✅ Supports optional <code>thisArg</code> for callback context</li>
          <li>✅ Preserves sparse arrays (empty slots stay empty)</li>
          <li>✅ Can transform to different types (numbers to strings, etc.)</li>
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
  result: (number | string)[];
}) => (
  <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{title}</p>
    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
      <code>{code}</code>
    </p>
    <p style={{ margin: '0', color: '#1976D2' }}>
      <code>{JSON.stringify(result)}</code>
    </p>
  </div>
);

const meta = {
  title: 'JS/Array.prototype.map',
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
