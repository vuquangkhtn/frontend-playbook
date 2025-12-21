# Use Click Anywhere

Implement a useClickAnywhere hook that handles click events anywhere on the document.

```ts
export default function Component() {
  const [count, setCount] = useState(0);

  useClickAnyWhere(() => {
    setCount((prev) => prev + 1);
  });

  return <p>Click count: {count}</p>;
}
```
## Arguments
`handler: (event: MouseEvent) => void`: The function to be called when a click event is detected anywhere on the document
## Returns
Nothing.