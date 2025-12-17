Note: This question is an extension of Event Emitter II, you are recommended to complete that question first.

Clarification questions
The following are good questions to ask the interviewer to demonstrate your thoughtfulness. Depending on their response, you might need to adjust the implementation accordingly.

How should values be compared for the 'change' event?
Strict equality can be used.
Can the same callback be added multiple times for the same attribute and event?
Yes, it can be. It will be called once for each time it is added when the event is emitted, in the order the callbacks were added.
Can non-existent events be emitted?
Yes, but nothing should happen and the code should not error or crash.
What should the this value of the callbacks be if it's not specified?
It can be null.
Can model.off() be called more than once?
Yes it can be, it should ignore callbacks that aren't added.
Can callbacks contain code that invoke methods on the emitter instance?
Yes, but we can ignore that scenario for this question.
What if the added callbacks throw an error when an event is fired?
The error should be caught and not halt the rest of the execution. However, we will not test for this case.
We will handle all the above cases except for the last two cases.

Solution
Data structure
Firstly, we have to decide on the data structure to store the events and the callbacks.

There's a few hierarchy of attribute > event ('change', 'unset') > callback here, and the shape of our data can reflect this hierarchy. The tradeoffs between data structures for event callbacks have been discussed in Event Emitter II and one plausible choice is to have a Map of attribute strings to objects where the key is the event name and value is array of callbacks and contexts.


type CallbackData = { fn: Function; context: any };
type AttributeData = {
  value: unknown;
  events: {
    change: Array<CallbackData>;
    unset: Array<CallbackData>;
  };
};

export default class BackboneModel {
  _attributes: Map<string, AttributeData>;
}
A concrete example:


Map(2) {
  'name': {
    value: 'John Doe',
    events: {
      change: [
        { fn: Function1, context: Object },
        { fn: Function2, context: Object },
      ],
      unset: [
        { fn: Function3, context: Object },
      ],
    }
  },
  'age': {
    value: 30,
    events: {
      change: [],
      unset: [
        { fn: Function4, context: Object }
      ]
    }
  },
};
Pros:
Fast lookup of callbacks given an attribute and the event.
Cons:
Cannot remove specific callbacks for an event if the callback was added multiple times. However, this is not a requirement of the question.

Implementation
Here's an explanation for the constructor and each method of the BackboneModel class:

Constructor
The constructor initializes a new instance of the BackboneModel class. It takes an optional initialValues parameter, which is a record of initial attribute values for the model. The constructor sets up the internal _attributes map, where each attribute is associated with an object containing its current value and event callbacks for 'change' and 'unset' events. If initialValues is provided, it iterates through each entry and sets up the initial attribute values.

model.get()
The get method retrieves the current value of the specified attribute. If the attribute exists in the model, it returns its current value; otherwise, it returns undefined.

model.set()
The set method sets the value of the specified attribute. It checks if the attribute already exists in the model. If it does, it triggers 'change' callbacks only if the new value is different from the current one. It then updates the attribute's value and stores it in the internal _attributes map.

The callbacks should be invoked with the respective this, if it was specified during model.on('change', ...).

model.has()
The has method checks if the model has a specific attribute. It returns true if the attribute exists in the model, and false otherwise.

model.unset()
The unset method removes a specific attribute from the model. It triggers 'unset' callbacks and then removes the attribute from the internal _attributes map.

The callbacks should be invoked with the respective this, if it was specified during model.on('unset', ...).

model.on()
The on method adds a callback function to the list of callbacks for a specific event ('change' or 'unset') on a given attribute. If the attribute does not exist, the method does nothing.

model.off()
The off method removes a callback function from the list of callbacks for a specific event ('change' or 'unset') on a given attribute. If the attribute does not exist, the method does nothing.

Class-based solution
```ts
type EventName = 'change' | 'unset';

interface IBackboneModel {
  get(attribute: string): unknown | undefined;
  set(attribute: string, value: unknown): void;
  has(attribute: string): boolean;
  unset(attribute: string): void;
  on(
    eventName: EventName,
    attribute: string,
    callback: Function,
    context?: any,
  ): void;
  off(eventName: EventName, attribute: string, callback: Function): void;
}

type CallbackData = { fn: Function; context: any };
type AttributeData = {
  value: unknown;
  events: {
    change: Array<CallbackData>;
    unset: Array<CallbackData>;
  };
};

// You are free to use alternative approaches of
// defining BackboneModel as long as the
// default export can be instantiated.
export default class BackboneModel implements IBackboneModel {
  _attributes: Map<string, AttributeData>;

  constructor(initialValues: Record<string, unknown> = {}) {
    this._attributes = new Map();
    Object.entries(initialValues).forEach(([attribute, value]) => {
      this._attributes.set(attribute, {
        value,
        events: {
          change: [],
          unset: [],
        },
      });
    });
  }

  get(attribute: string): unknown | undefined {
    return this._attributes.get(attribute)?.value;
  }

  set(attribute: string, value: unknown): void {
    const attributeData: AttributeData = this.has(attribute)
      ? this._attributes.get(attribute)!
      : {
          value,
          events: {
            change: [],
            unset: [],
          },
        };

    // Only invoke callbacks if there's a change in the values.
    if (attributeData.value !== value) {
      // Invoke callbacks listening for the `change` event.
      attributeData.events.change.forEach((callback) => {
        callback.fn.call(
          callback.context ?? null,
          attribute,
          value,
          attributeData.value,
        );
      });
    }

    attributeData.value = value;
    this._attributes.set(attribute, attributeData);
  }

  has(attribute: string): boolean {
    return this._attributes.has(attribute);
  }

  unset(attribute: string): void {
    const attributeData = this._attributes.get(attribute);
    // No-op for non-existent attributes.
    if (attributeData == null) {
      return;
    }

    // Invoke callbacks listening for the `unset` event.
    attributeData.events.unset.forEach((callback) => {
      callback.fn.call(callback.context ?? null, attribute);
    });
    // Remove the attribute entirely.
    this._attributes.delete(attribute);
  }

  on(
    eventName: EventName,
    attribute: string,
    callback: Function,
    context?: any,
  ): void {
    const attributeData = this._attributes.get(attribute);
    // No-op for non-existent attributes.
    if (attributeData == null) {
      return;
    }

    // Add to the list of callbacks.
    attributeData.events[eventName].push({
      fn: callback,
      context,
    });
  }

  off(eventName: EventName, attribute: string, callback: Function): void {
    const attributeData = this._attributes.get(attribute);
    // No-op for non-existent attributes.
    if (attributeData == null) {
      return;
    }

    // Remove from the added list of callbacks.
    attributeData.events[eventName] = attributeData.events[eventName].filter(
      ({ fn }) => fn !== callback,
    );
  }
}

```

Edge cases
The same callback function can be added more than once for the same event. Calling model.off() should remove all matching callbacks from that attribute's event callbacks.
Methods called with non-existing attributes should be no-op.
Techniques
Object-oriented programming
Using the right data structures
Closures
Resources
[Backbone.Model](https://backbonejs.org/#Model)