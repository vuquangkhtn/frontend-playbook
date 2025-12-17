# Use Click Outside

Implement a useClickOutside hook that detects clicks outside of a specified element.

```ts
export default function Component() {
  const target = useRef(null);
  useClickOutside(target, () => console.log('Clicked outside'));

  return (
    <div>
      <div ref={target}>Click outside me</div>
      <div>Maybe here?</div>
    </div>
  );
}
```
## Arguments
- ref: RefObject<T>: The ref object of the element to detect clicks outside of
- handler: (event) => void: The event handler function to call when a click outside is detected
- eventType: 'mousedown' | 'touchstart': The event type to listen for. Defaults to 'mousedown'
- eventOptions: boolean | AddEventListenerOptions: The AddEventListenerOptions options object that specifies characteristics about the event listener. This is an optional argument
## Returns
Nothing.

