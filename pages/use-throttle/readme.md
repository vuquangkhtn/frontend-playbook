# Use Throttle

Implement a useThrottle hook that delays value state updates to happen at most every interval-millisecond intervals.


export default function Component() {
  const [position, setPosition] = useState([0, 0]);
  const throttledPosition = useThrottle(position, 1000);

  return (
    <div
      style={{
        position: 'fixed',
        top: throttledPosition[0],
        left: throttledPosition[1],
      }}
      onMouseMove={(e) => setPosition([e.clientY, e.clientX])}
    />
  );
}
Arguments
value: The value to throttle
interval: number: The interval in milliseconds. This defaults to 500 milliseconds
Returns
The hook returns the throttled value.