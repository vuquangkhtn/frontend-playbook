# Use Interval

Implement a useInterval hook that creates an interval that invokes a callback function at a specified delay.


export default function Component() {
  const [count, setCount] = useState(0);

  useInterval(() => setCount(count + 1), 1000);

  return (
    <div>
      <p>{count}</p>
    </div>
  );
}
Arguments
callback: () => void: A function to be called at the specified interval
delay: number | null: The delay in milliseconds between each invocation of the callback function. If null, the interval is cleared
Returns
Nothing.