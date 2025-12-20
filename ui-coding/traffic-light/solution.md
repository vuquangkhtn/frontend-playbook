Solution
Data Model
Traffic lights are simple state machines where each color is a state and each state is shown for a fixed duration before moving to the next. We can capture the state information (how long to remain in each color for and which color to transition to) using a simple JavaScript object:


const config = {
  red: {
    duration: 4000,
    next: 'green',
  },
  yellow: {
    duration: 500,
    next: 'red',
  },
  green: {
    duration: 3000,
    next: 'yellow',
  },
};
Within the TrafficLight component, we only need a single state variable, which is the current color. We also set a timer via setTimeout to transition to the next color by looking up the config object to know what the next color is and when to do so. Do remember to clear the timer upon unmounting of the component to prevent "setState on unmounted component" errors and memory leaks.

Rendering
The rendering of this component is pretty straightforward and can be achieved with Flexbox. With Flexbox, it's also easy to change the layout of the lights from a vertical one to a horizontal one just by changing the flex-direction property.

Component API
It's a good practice to make components reusable by allowing customization of:

What the states are.
Next states.
Each state's duration.
The initial state.
Traffic light layout (certain countries use certain layouts).
We also define the color of each light within the config object so that the TrafficLight component is both state and color agnostic. It's even possible to create 2-colored and 4-colored traffic lights just by modifying the config object without having to modify the TrafficLight component's implementation.

Test cases
Observe that each light show up for the specified duration.
Observe that the lights transition to the next state correctly after the specified duration.

Accessibility
For a11y reasons, we add an aria-label to the component to indicate the current light and aria-live="polite" to announce the current active light. The contents of the component (the lights) are for visual purposes and aren't important to screen readers, they can be hidden with aria-hidden="true".

app.js
```js
import TrafficLight from './TrafficLight';

const config = {
  red: {
    backgroundColor: 'red',
    duration: 4000,
    next: 'green',
  },
  yellow: {
    backgroundColor: 'yellow',
    duration: 500,
    next: 'red',
  },
  green: {
    backgroundColor: 'green',
    duration: 3000,
    next: 'yellow',
  },
};

export default function App() {
  return (
    <div className="wrapper">
      <TrafficLight config={config} />
      <TrafficLight config={config} layout="horizontal" />
    </div>
  );
}

```

traffic-light.js
```js
import { useEffect, useState } from 'react';

function Light({ backgroundColor }) {
  return (
    <div
      aria-hidden={true}
      className="traffic-light"
      style={{ backgroundColor }}
    />
  );
}

export default function TrafficLight({
  initialColor = 'green',
  config,
  layout = 'vertical',
}) {
  const [currentColor, setCurrentColor] =
    useState(initialColor);

  useEffect(() => {
    const { duration, next } = config[currentColor];

    const timerId = setTimeout(() => {
      setCurrentColor(next);
    }, duration);

    return () => {
      clearTimeout(timerId);
    };
  }, [currentColor]);

  return (
    <div
      aria-live="polite"
      aria-label={`Current light: ${currentColor}`}
      className={[
        'traffic-light-container',
        layout === 'vertical' &&
          'traffic-light-container--vertical',
      ]
        .filter((cls) => !!cls)
        .join(' ')}>
      {Object.keys(config).map((color) => (
        <Light
          key={color}
          backgroundColor={
            color === currentColor
              ? config[color].backgroundColor
              : undefined
          }
        />
      ))}
    </div>
  );
}

```

style.css
```css
body {
  font-family: sans-serif;
}

.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.traffic-light-container {
  background-color: #000;
  border-radius: 8px;
  display: flex;
  padding: 8px;
  gap: 8px;
}

.traffic-light-container--vertical {
  flex-direction: column;
}

.traffic-light {
  --size: 50px;
  background-color: #555;
  border-radius: var(--size);
  height: var(--size);
  width: var(--size);
}

```