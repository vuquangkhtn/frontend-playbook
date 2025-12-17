# Use Event Listener

Implement a useEventListener hook that subscribes to browser events by attaching event listeners to DOM elements, the window, or media query lists.


export default function Component() {
  const buttonRef = useRef(null);

  useEventListener('click', () => console.log('Button clicked'), buttonRef, {
    once: true,
  });

  return (
    <div>
      <button ref={buttonRef}>Click me</button>
    </div>
  );
}
Arguments
type (string): The event type to listen for
handler (event) => void: The event handler function
target (RefObject<T>): The ref object of the element to attach the event listener to. If not provided, it defaults to window
options (AddEventListenerOptions): The AddEventListenerOptions options object that specifies characteristics about the event listener. This is an optional argument
Returns
Nothing.