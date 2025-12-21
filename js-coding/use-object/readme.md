# Use Object

Implement a useObject hook that manages a state of JavaScript Object, also known as POJO (Plain Old JavaScript Object), which is a key-value pair storage initialized with {}.

When the set state function is called with an object, it is merged with the existing object.

It is more convenient to use useObject over plain useState because in the latter case, you would always have to create a new object, mutate it, then set state to use the new object (or create a new object via object spread), which can be quite cumbersome.


export default function Component() {
  const [record, setRecord] = useObject({ a: 1, b: 2 });

  return (
    <div>
      <pre>{JSON.stringify(record, null, 2)}</pre>
      <button onClick={() => setRecord((prev) => ({ a: prev.a + 1 }))}>
        Increase a
      </button>
      <button onClick={() => setRecord((prev) => ({ b: prev.b + 1 }))}>
        Increase b
      </button>
      <button onClick={() => setRecord(() => ({ c: 3 }))}>Add c</button>
    </div>
  );
}
Arguments
initialValue: The initial value of the object
Returns
The hook returns an array with two elements:

The current object state
An updater function which can update the object state
The updater function can receive either:

An object that will be merged with the current state object
An updater function that receives the current state object and returns an object that will be merged with the current state object