# Use Debounce

Implement a useDebounce hook that delays state updates until a specified delay has passed without any further changes to the provided value.


export default function Component() {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 1000);

  return (
    <div>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <p>Debounced keyword: {debouncedKeyword}</p>
    </div>
  );
}
The observable outcome of using useDebounce is quite similar to React's useDeferredValue, the former returns an updated value after a fixed duration while the latter always returns the updated value but updates to the DOM relies on React's priority system.

Arguments
value: The value to debounce
delay: number: The delay in milliseconds
Returns
The hook returns the debounced value.