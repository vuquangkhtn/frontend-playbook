import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import camelCaseKeys from './camel-case-keys.solution';
import { useState, useEffect } from 'react';

const Demo = () => {
  const [inputJson, setInputJson] = useState(
    JSON.stringify({ foo_bar: true, baz_qux: 'hello' }, null, 2)
  );
  const [error, setError] = useState<string>('');
  const [input, setInput] = useState<any>(null);

  useEffect(() => {
    try {
      setInput(JSON.parse(inputJson));
      setError('');
    } catch (e) {
      setError('Invalid JSON');
      setInput(null);
    }
  }, [inputJson]);

  const result = input ? camelCaseKeys(input) : null;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>camelCaseKeys Demo</h2>

      <section style={{ marginBottom: '30px' }}>
        <h3>What is camelCaseKeys?</h3>
        <p>
          The <code>camelCaseKeys()</code> function converts all object keys from 
          snake_case to camelCase. It recursively processes nested objects and arrays 
          without modifying the original data.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Interactive Demo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Input (JSON):</h4>
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              style={{
                width: '100%',
                height: '300px',
                padding: '10px',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: error ? '2px solid red' : '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
            {error && (
              <p style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                ⚠️ {error}
              </p>
            )}
          </div>

          <div>
            <h4>Output (camelCased):</h4>
            <pre
              style={{
                width: '100%',
                height: '300px',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
              }}
            >
              {result ? JSON.stringify(result, null, 2) : 'Invalid input'}
            </pre>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Usage Examples</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Example
            title="Simple Object"
            input={{ foo_bar: true }}
            output={camelCaseKeys({ foo_bar: true })}
          />
          <Example
            title="Multiple Keys"
            input={{ foo_bar: true, baz_qux: 'hello', test_value: 123 }}
            output={camelCaseKeys({ foo_bar: true, baz_qux: 'hello', test_value: 123 })}
          />
          <Example
            title="Nested Object"
            input={{ foo_bar: true, bar_baz: { baz_qux: '1' } }}
            output={camelCaseKeys({ foo_bar: true, bar_baz: { baz_qux: '1' } })}
          />
          <Example
            title="Array of Objects"
            input={[{ baz_qux: true }, { foo: true }]}
            output={camelCaseKeys([{ baz_qux: true }, { foo: true }])}
          />
          <Example
            title="Complex Nesting"
            input={{
              foo_bar: true,
              bar_baz: [{ baz_qux: true }, { hello_world: 'test' }],
            }}
            output={camelCaseKeys({
              foo_bar: true,
              bar_baz: [{ baz_qux: true }, { hello_world: 'test' }],
            })}
          />
          <Example
            title="Mixed Case Keys"
            input={{ foo_bar: 'a', already_camel: 'b', simple: 'c' }}
            output={camelCaseKeys({ foo_bar: 'a', already_camel: 'b', simple: 'c' })}
          />
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>Key Conversion Examples</h3>
        <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Input Key</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Output Key</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Changed</th>
              </tr>
            </thead>
            <tbody>
              {[
                { input: 'foo', output: 'foo', changed: false },
                { input: 'foo_bar', output: 'fooBar', changed: true },
                { input: 'foo_bar_baz', output: 'fooBarBaz', changed: true },
                { input: 'hello_world_test', output: 'helloWorldTest', changed: true },
                { input: 'already_camel', output: 'alreadyCamel', changed: true },
                { input: 'x_y_z', output: 'xYZ', changed: true },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>
                    <code>{row.input}</code>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <code>{row.output}</code>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    {row.changed ? '✅' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Key Features</h3>
        <ul>
          <li>✅ Converts snake_case keys to camelCase</li>
          <li>✅ Recursively handles nested objects</li>
          <li>✅ Processes arrays of objects</li>
          <li>✅ Preserves non-object values unchanged</li>
          <li>✅ Returns new object without mutation</li>
          <li>✅ Useful for API response transformation</li>
        </ul>
      </section>
    </div>
  );
};

const Example = ({
  title,
  input,
  output,
}: {
  title: string;
  input: any;
  output: any;
}) => (
  <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{title}</p>
    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '11px' }}>
      <strong>Input:</strong> <code>{JSON.stringify(input)}</code>
    </p>
    <p style={{ margin: '0', color: '#2196F3', fontSize: '11px' }}>
      <strong>Output:</strong> <code>{JSON.stringify(output)}</code>
    </p>
  </div>
);

const meta = {
  title: 'JS/camel-case-keys',
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
