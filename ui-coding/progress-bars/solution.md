Solution
The solution can be split into three parts: (1) State, (2) Styling, and (3) Animation.

State
Since the progress bars do not interact with each other and the animation uses a "fire-and-forget" model, we only need a single numerical value as state, which is the number of bars onscreen. Hitting the "Add" button increases the number of bars to be rendered.

Styling
Have a look at the Progress Bar question for how to style a progress bar given a value out of 100. However, we'll use CSS transforms instead of changing the width as CSS transforms run on the GPU which results in better performance for animations.

Animation
As mentioned above, each progress bar's animation uses a "fire-and-forget" model, meaning they are not interruptible and do not interact with each other. CSS transitions work very well for animating the bars from 0 to 100 and there's no need to resort to JavaScript. Note that transform-origin: left is necessary so that the filled bar is "anchored" on the left and expands rightwards. Without that, the transition will appear to expand outwards from the center.


.bar-contents {
  background-color: green;
  height: 100%;
  transform: scaleX(0);
  transform-origin: left;
  transition-duration: 2000ms;
  transition-property: transform;
  transition-timing-function: linear;
}

.bar-contents--filled {
  transform: scaleX(1);
}
Test cases
Hitting "Add" appends a new empty progress bar to the bottom of the list which starts filling up as soon as it appears.
Can add multiple progress bars, which fill up independently.

```js
import { useEffect, useState } from 'react';

function ProgressBar() {
  const [startTransition, setStartTransition] =
    useState(false);

  // Start transition after first render and never
  // apply this effect ever again.
  useEffect(() => {
    if (startTransition) {
      return;
    }

    setStartTransition(true);
  });

  return (
    <div className="bar">
      <div
        className={[
          'bar-contents',
          startTransition && 'bar-contents--filled',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  );
}

export default function App() {
  const [bars, setBars] = useState(0);

  return (
    <div className="wrapper">
      <div>
        <button
          onClick={() => {
            setBars(bars + 1);
          }}>
          Add
        </button>
      </div>
      <div className="bars">
        {Array(bars)
          .fill(null)
          .map((_, index) => (
            <ProgressBar key={index} />
          ))}
      </div>
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.bars {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.bar {
  background-color: #ccc;
  height: 8px;
}

.bar-contents {
  background-color: green;
  height: 100%;
  transform: scaleX(0);
  transform-origin: left;
  transition-duration: 2000ms;
  transition-property: transform;
  transition-timing-function: linear;
}

.bar-contents--filled {
  transform: scaleX(1);
}

```