# Use Key Press

Implement a useKeyPress hook that detects and performs an action for keyboard events


export default function Component() {
  useKeyPress('a', (e) => {
    e.preventDefault();
    console.log('The "a" key was pressed');
  });

  return null;
}
Note: Even though the hook is called useKeyPress, the keypress browser event is deprecated and should not be used.

Arguments
key: string: The key to detect. It must be a valid key value that is usually obtained from KeyboardEvent.key
callback: (event: KeyboardEvent) => void: A function that is called when the key identified by key is pressed
options: An optional object with the following properties:
target: EventTarget: The target element to listen for the key press. This defaults to window
event: 'keydown' | 'keyup': The event to listen for, defaults to 'keydown'
Returns
Nothing.