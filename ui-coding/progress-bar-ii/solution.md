Note: This solution builds on top of the solution for Progress Bars, so make sure to check that question's solution first.

Solution
The question can be split into two parts: (1) State, (2) Orchestration of Transitions.

State
On top of the number of bars that we need, we'll need to know how many of the current bars have been filled up and which bars can start to fill up. We introduce a new numeric variable state called numFilledUpBars to track the number of bars that have been filled up. Any bar that has an index that's greater than numFilledUpBars should not start filling up yet. To know when to increment numFilledUpBars, we'll add an onCompleted prop to ProgressBar that fires when a progress bar is full.

Orchestration of Transitions
Using the numFilledUpBars state, we'll determine an isEmpty value to be passed to the ProgressBar as a prop. ProgressBars that have isEmpty={true} should not be animating yet.

We can use the onTransitionEnd prop on React DOM elements to detect when a CSS transition is complete, and firing onCompleted prop. Within the main App, the numFilledUpBars will be incremented whenever an onCompleted callback is triggered.

Test cases
Hitting "Add" appends a new empty progress bar to the bottom of the list
The first bar starts filling up as soon as it appears.
Can add multiple progress bars, which fill up gradually one after another.
If all existing bars are filled up, a newly added bar starts filling up immediately.

```js
import { useEffect, useState } from 'react';

function ProgressBar({ isEmpty, onCompleted }) {
  const [startTransition, setStartTransition] =
    useState(false);

  // Start transition when the bar is no longer empty.
  useEffect(() => {
    if (isEmpty || startTransition) {
      return;
    }

    setStartTransition(true);
  }, [isEmpty]);

  return (
    <div className="bar">
      <div
        className={[
          'bar-contents',
          startTransition && 'bar-contents--filled',
        ]
          .filter(Boolean)
          .join(' ')}
        onTransitionEnd={() => {
          onCompleted();
        }}
      />
    </div>
  );
}

export default function App() {
  const [bars, setBars] = useState(0);
  const [numFilledUpBars, setNumFilledUpBars] = useState(0);

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
            <ProgressBar
              isEmpty={index > numFilledUpBars}
              key={index}
              onCompleted={() => {
                setNumFilledUpBars(numFilledUpBars + 1);
              }}
            />
          ))}
      </div>
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

``