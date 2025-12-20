Note: This is an advanced version of Progress Bars III, you should complete that question first before attempting this question.

Solution
The question can be split into three parts: (1) State, (2) Animation, and (3) Interactions.

State
Since we need to allow for pausing and resuming of the animations, the simple states we used in the previous Progress Bars questions will no longer be sufficient. We need to be able to track each bar's completion percentage.

A list of progress bars can be modelled with using an array of numeric values, where each value ranges from 0-100, indicating the completion percentage of the bar. The initial state of an empty progress bar will be [0] and two full progress bars is represented by [100, 100].

Appending new bars is simply adding a 0 to the end of the array, via Array.prototype.concat(0).

Animation
To have fine-grain control over the animation, we cannot rely on CSS transitions anymore and have to use the setTimeout/setInterval browser APIs in JavaScript.

It'll be easier to think about the animation as a loop run at fixed intervals. In every loop, we can increment the relevant progress bars' completion percentages by a small amount to give the impression of a smooth gradual animation.

setInterval returns a timerId value which we will save in a state variable so that we can retrieve it when stopping the animation, via setTimeout. The value of timerId will be null if there's no timer running. To make the animation look smooth, we should pick a time interval that is below 16ms (for a 60fps experience). To fill up a bar from 0 to 100 in 2000ms, one possible combination is to update the completion percentage by 0.5% every 10ms.

Interactions
Start
The start function starts the timer via setInterval which fires a callback at (nearly) fixed intervals. Each time the callback is fired, we find the first 3 bars that are not full and increase their values by 0.5.

Note that we need to use the callback form of setProgression, which receives the updated progression value as the parameter. This is necessary because the setProgression callback's closure will be referencing a stale version of progression and the callback form of setProgression will provide us with the most updated progression value.

In idiomatic React, we avoid mutation as much as possible, so we make a copy of the progression array first (via slice()) before mutation the index of the non-full progress bar.

If we can't find a non-full progress bar, it means all the bars are full and nothing needs to be done.

Pausing
Pausing is straightforward. We cancel any existing timers and set the timerId to be null.

Appending a New Bar
To append a new empty bar, we can use progression.concat(0), which clones the array and adds 0 to the end.

Reset
Simply set progression back to the initial value and call the stop() function.

Test cases
Add
Hitting "Add" adds a new empty bar is appended to the bottom of the list.
The bar should eventually fill up if the animation is ongoing.
Adding new bars should not change the animation state.
If all the bars are full and the animation is ongoing and a new bar is added, the newly added bar should start filling up.
Start
Hitting "Start" starts filling up to 3 bars in parallel.
Pause
Hitting "Pause" when the bars are filling up should stop the animation and the button should show "Start".
Reset
Hitting "Reset" clears all bars and the "Start"/"Pause" button should show "Start" if it was showing "Pause".
Testing Concurrency
Hit "Add" 3 times to have 4 bars in total, then hit "Start". The first 3 should start filling up and complete together and the fourth only starts filling up after the first 3 completes.
Hit "Add" once to have 2 bars in total, then hit "Start". After 1 second, hit "Add" again. The third bar should start filling up as soon as it's added.
Hit "Add" once to have 2 bars in total, then hit "Start". After 1 second, hit "Add" twice. The third bar should start filling up as soon as it's added but the fourth bar only starts filling up after the first bar is completed.

```js
import { useState } from 'react';

function ProgressBar({ progress }) {
  return (
    <div className="bar">
      <div
        className="bar-contents"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

const INITIAL_PROGRESSION = [0];
const CONCURRENCY_LIMIT = 3;

export default function App() {
  const [progression, setProgression] = useState(
    INITIAL_PROGRESSION,
  );
  const [timerId, setTimerId] = useState(null);

  function start() {
    const timer = window.setInterval(() => {
      setProgression((currProgression) => {
        // Find the bars which aren't full.
        const nonFullBars = currProgression
          .map((value, index) => ({ value, index }))
          .filter(({ value }) => value < 100);
        // All bars are full, none to increment.
        if (nonFullBars.length === 0) {
          return currProgression;
        }

        // Get the first LIMIT non-full bars and increment them.
        const barsToIncrement = nonFullBars.slice(
          0,
          CONCURRENCY_LIMIT,
        );
        const newProgression = currProgression.slice();
        for (const { index } of barsToIncrement) {
          newProgression[index] += 0.5;
        }
        return newProgression;
      });
    }, 10);

    setTimerId(timer);
  }

  function stop() {
    window.clearInterval(timerId);
    setTimerId(null);
  }

  function appendBar() {
    setProgression(progression.concat(0));
  }

  function reset() {
    stop();
    setProgression(INITIAL_PROGRESSION);
  }

  // Derived state to determine if the bars are progressing.
  const isProgressing = timerId != null;

  return (
    <div className="wrapper">
      <div className="buttons">
        <button
          onClick={() => {
            appendBar();
          }}>
          Add
        </button>
        <button
          onClick={() => {
            isProgressing ? stop() : start();
          }}>
          {isProgressing ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            reset();
          }}>
          Reset
        </button>
      </div>
      <div className="bars">
        {progression.map((progress, index) => (
          <ProgressBar key={index} progress={progress} />
        ))}
      </div>
      <pre>
        {JSON.stringify(
          { isProgressing, progression },
          null,
          2,
        )}
      </pre>
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

.buttons {
  display: flex;
  column-gap: 8px;
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
  transform-origin: left;
}

```