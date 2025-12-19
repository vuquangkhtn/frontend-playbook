Solution
This question looks simple on first glance but is actually more complex than it seems. Note that setInterval's delay parameter is unreliable. The actual amount of time that elapses between calls to the callback may be longer than the given delay due to various reasons. Because of this behavior, we cannot assume that each time the interval callback is fired, the same duration as passed. We will need to read the current time within the callback code to ensure that we are using the most updated timings.

State
The tricky part of this question is deciding what goes into the component state and how to manage them. We need a few states:

totalDuration: Total time that has passed so far.
timerId: Timer ID of the currently running interval timer, or null if there's no currently running timer.
lastTickTiming: This is the time that the last interval callback has run. We will keep incrementing the totalDuration by the delta between the current time (Date.now()) and the lastTickTiming. Using this approach, the totalDuration will still be accurate even if the callbacks run at irregular intervals. We use useRef to create this value since it's not used in the render code.
Since there are a few buttons in the requirements that has duplicate functionality, we should define these functionality as a few functions that will be triggered by the buttons:

startTimer
This function kicks off the timer and updates the totalDuration value each time the setInterval callback is run with the delta between the last update time (lastTickTiming) and the current time. We use a interval timing of 1ms since stopwatches are very time sensitive and millisecond-level precision is desired.

stopInterval
A simple function to stop the interval timer from running (via clearInterval) and clear the current timerId. This is being used by the "Stop" button and "Reset" button.

resetTimer
We want to reset the component to its initial state in this function. It stops the interval timer by calling stopInterval() and also resets the total duration to 0. It's not important to reset the value of lastTickTiming because it will be set at the start of startTimer(), before the first interval callback is executed. Used by the "Reset" button.

toggleTimer
A function to toggle between calling stopInterval() and startTimer() depending on whether there's a current timer. Used by the time display and the "Start"/"Stop" button.

Test cases
Click the "Start" button to start the timer. Observe that:
The time increases constantly and shows the correct value.
The "Start" button now shows "Stop".
Click "Stop" while the timer is running. Observe that:
The time stops increasing.
The "Stop" button now shows "start".
Click the "Start" button after having stopped the timer. Observe that:
The time increases from the stopped timing and shows the correct value.
The "Start" button now shows "Stop".
Click the "Reset" button while:
The timer is running. The timer should stop and be reset to 0.
The timer is stopped/paused. The timer should be reset to 0.
Repeat the above but click on the time instead of the "Start"/"Stop" button.
a11y
Use Tab to cycle through the buttons.
Be able to use both Spacebar and Enter to interact with the 3 interactive elements.
Accessibility
People who are unfamiliar with a11y will add an onClick/'click' event to the DOM element rendering the time (usually a <div>) and consider it complete. However, this the timer is not a11y-friendly just by doing so. Some might add tabIndex="0" (to allow focus) and role="button" to the element, which certainly improves the a11y, but is not the best.

For the best a11y, we can and should use a <button> to render the timing, which comes with additional a11y benefits like focus and keyboard support. By using a <button>, you get automatic focus support (be able to use Tab to focus onto the timer) and keyboard support (hit the Spacebar to start/stop the timer). The latter will not be possible without custom code to add key event listeners to non-interactive elements.

User Experience
user-select: none is added to the timer so that the digits aren't selected if a user double clicks on them. Selecting the digits is usually not desired.

```js
import { useRef, useState } from 'react';

const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const MS_IN_HOUR =
  MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MS_IN_SECOND;
const MS_IN_MINUTE = SECONDS_IN_MINUTE * MS_IN_SECOND;

function formatTime(timeParam) {
  let time = timeParam;
  const parts = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0,
  };
  if (time > MS_IN_HOUR) {
    parts.hours = Math.floor(time / MS_IN_HOUR);
    time %= MS_IN_HOUR;
  }

  if (time > MS_IN_MINUTE) {
    parts.minutes = Math.floor(time / MS_IN_MINUTE);
    time %= MS_IN_MINUTE;
  }

  if (time > MS_IN_SECOND) {
    parts.seconds = Math.floor(time / MS_IN_SECOND);
    time %= MS_IN_SECOND;
  }

  parts.ms = time;

  return parts;
}

function padTwoDigit(number) {
  return number >= 10 ? String(number) : `0${number}`;
}

export default function Stopwatch() {
  const lastTickTiming = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  // Timer ID of the active interval, if one is running.
  const [timerId, setTimerId] = useState(null);

  // Derived state to determine if there's a timer running.
  const isRunning = timerId != null;

  function startTimer() {
    lastTickTiming.current = Date.now();
    setTimerId(
      window.setInterval(() => {
        const now = Date.now();
        const timePassed = now - lastTickTiming.current;
        setTotalDuration(
          (duration) =>
            // Use the callback form of setState to ensure
            // we are using the latest value of duration.
            duration + timePassed,
        );
        lastTickTiming.current = now;
      }, 1),
    );
  }

  function stopInterval() {
    window.clearInterval(timerId);
    setTimerId(null);
  }

  function resetTimer() {
    stopInterval();
    setTotalDuration(0);
  }

  function toggleTimer() {
    if (isRunning) {
      stopInterval();
    } else {
      startTimer();
    }
  }

  const formattedTime = formatTime(totalDuration);

  return (
    <div>
      <button
        className="time"
        onClick={() => {
          toggleTimer();
        }}>
        {formattedTime.hours > 0 && (
          <span>
            <span className="time-number">
              {formattedTime.hours}
            </span>
            <span className="time-unit">h</span>
          </span>
        )}{' '}
        {formattedTime.minutes > 0 && (
          <span>
            <span className="time-number">
              {formattedTime.minutes}
            </span>
            <span className="time-unit">m</span>
          </span>
        )}{' '}
        <span>
          <span className="time-number">
            {formattedTime.seconds}
          </span>
          <span className="time-unit">s</span>
        </span>{' '}
        <span className="time-number time-number--small">
          {padTwoDigit(Math.floor(formattedTime.ms / 10))}
        </span>
      </button>
      <div>
        <button
          onClick={() => {
            toggleTimer();
          }}>
          {isRunning ? 'Stop' : 'Start'}
        </button>{' '}
        <button
          onClick={() => {
            resetTimer();
          }}>
          Reset
        </button>
      </div>
    </div>
  );
}

```

app.ts
```js
import Stopwatch from './Stopwatch';

export default function App() {
  return (
    <div className="wrapper">
      <Stopwatch />
    </div>
  );
}
```