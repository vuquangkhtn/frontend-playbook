# Use Cycle

Implement a useCycle hook that cycles through a sequence of values each time its function is called.

```ts
export default function Component() {
  const [mode, cycle] = useCycle('low', 'medium', 'high');

  return (
    <div>
      <p>State: {mode}</p>
      <button onClick={cycle}>Cycle</button>
    </div>
  );
}
```

## Arguments
The `useCycle` hook should accept an indefinite number of arguments, each representing a value in the sequence to cycle through.

## Returns
A tuple containing the following elements:

- `value`: The current value
- `cycle`: A function that changes the current value to the next one in the sequence, or the first one if the current value is the last in the sequence