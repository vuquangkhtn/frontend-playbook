Solution
We can separate out the solution into two parts, the update loop and the rendering.

Update loop
We need a timer to refresh the page and display the current time every second. To create the timer, we can use a setInterval and kick off the update loop in a useEffect.

Do remember to clear the timer upon unmounting of the component to prevent "setState on unmounted component" errors and memory leaks.

Store the JavaScript Date object as state as it contains all the data we need.

For better reusability, these logic can be abstracted into a custom useCurrentDate hook.

This part is exactly the same as the Analog Clock question.

Rendering
Now that we have access to the most updated Date in the Clock component, we can render it. Firstly create two smaller components for the Digit and Separator.

Digit: renders numbers from 0-9 using the segment display. We make use of two square <div>s and CSS borders to achieve the effect. For each number, create a configuration of the borders that need to be shown and retrieve the configuration for that number.
Separator: renders the two circles that look like colons.
To get the first digit of an hour/minute/second, we can divide by 10 and round it down. To get the second digit, we do modulo 10 to leave only the value in the ones-place.

Test cases
See that the clock updates every second.
Observe the clock for at least 10 seconds to see that each digit is displayed correctly.
Notes
The update frequency of the timer depends on how accurate we want the clock to be. The maximum we can set is 1000ms, however, the clock's accuracy might be off by 1000ms in the case we load the page on the last millisecond of the second. However, using too small of an interval can be quite expensive. Hence a middleground we've chosen is 100ms. The clock can only ever be off by 100ms, which is not very noticeable by humans.

The current date/time should be polled in each loop, as opposed to recording the time when the clock was first rendered and incrementing based on the interval duration of the timer because the invocations of the loop can be delayed by processes hogging the main thread and the loop may not run at every fixed interval.

Accessibility
For a11y reasons, use a <time> element with datetime attribute set to the current time in 24-hour format so that screen readers can read this component. Otherwise the component will be ignored by screen readers, which is bad. Add the aria-hidden attribute to the internals of <time> since they are for presentation purposes and not useful to screen readers.

```js
import { useEffect, useState } from 'react';

const ALL_SIDES = [
  'digit-square-border-top',
  'digit-square-border-left',
  'digit-square-border-right',
  'digit-square-border-bottom',
];

const NUMBER_TO_CLASSES = {
  0: {
    top: [
      'digit-square-border-top',
      'digit-square-border-left',
      'digit-square-border-right',
    ],
    bottom: [
      'digit-square-border-bottom',
      'digit-square-border-left',
      'digit-square-border-right',
    ],
  },
  1: {
    top: ['digit-square-border-right'],
    bottom: ['digit-square-border-right'],
  },
  2: {
    top: [
      'digit-square-border-top',
      'digit-square-border-right',
      'digit-square-border-bottom',
    ],
    bottom: [
      'digit-square-border-top',
      'digit-square-border-left',
      'digit-square-border-bottom',
    ],
  },
  3: {
    top: [
      'digit-square-border-top',
      'digit-square-border-right',
      'digit-square-border-bottom',
    ],
    bottom: [
      'digit-square-border-top',
      'digit-square-border-right',
      'digit-square-border-bottom',
    ],
  },
  4: {
    top: [
      'digit-square-border-left',
      'digit-square-border-right',
      'digit-square-border-bottom',
    ],
    bottom: [
      'digit-square-border-right',
      'digit-square-border-top',
    ],
  },
  5: {
    top: [
      'digit-square-border-top',
      'digit-square-border-left',
      'digit-square-border-bottom',
    ],
    bottom: [
      'digit-square-border-top',
      'digit-square-border-right',
      'digit-square-border-bottom',
    ],
  },
  6: {
    top: [
      'digit-square-border-top',
      'digit-square-border-left',
      'digit-square-border-bottom',
    ],
    bottom: ALL_SIDES,
  },
  7: {
    top: [
      'digit-square-border-top',
      'digit-square-border-right',
    ],
    bottom: ['digit-square-border-right'],
  },
  8: {
    top: ALL_SIDES,
    bottom: ALL_SIDES,
  },
  9: {
    top: ALL_SIDES,
    bottom: [
      'digit-square-border-top',
      'digit-square-border-right',
      'digit-square-border-bottom',
    ],
  },
};

function Digit({ number }) {
  const { top, bottom } = NUMBER_TO_CLASSES[number];
  return (
    <div>
      <div
        className={[
          'digit-square',
          'digit-square-top',
          ...top,
        ].join(' ')}
      />
      <div
        className={[
          'digit-square',
          'digit-square-bottom',
          ...bottom,
        ].join(' ')}
      />
    </div>
  );
}

function Separator() {
  return (
    <div className="separator">
      <div className="separator-dot" />
      <div className="separator-dot" />
    </div>
  );
}

function useCurrentDate() {
  const [date, setDate] = useState(new Date());

  // Kick off the timer.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setDate(new Date());
    }, 100);

    // Clear the timer upon unmount.
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return date;
}

function padTwoDigit(number) {
  return number >= 10 ? String(number) : `0${number}`;
}

export default function App() {
  const date = useCurrentDate();

  let hours = date.getHours() % 12;
  hours = hours === 0 ? 12 : hours;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const dateTimeDisplay = `${padTwoDigit(
    date.getHours(),
  )}:${padTwoDigit(minutes)}:${padTwoDigit(seconds)}`;

  // Use a <time> element with `datetime` attribute set
  // to the current time in 24-hour format so that
  // screen readers can read this component.
  return (
    <time className="clock" dateTime={dateTimeDisplay}>
      <Digit number={parseInt(hours / 10, 10)} />
      <Digit number={hours % 10} />
      <Separator />
      <Digit number={parseInt(minutes / 10, 10)} />
      <Digit number={minutes % 10} />
      <Separator />
      <Digit number={parseInt(seconds / 10, 10)} />
      <Digit number={seconds % 10} />
    </time>
  );
}

```

App.js
```js
import Clock from './Clock';

export default function App() {
  return (
    <div className="wrapper">
      <Clock />
    </div>
  );
}

```

style.css
```js
body {
  font-family: sans-serif;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock {
  --segment-width: 10px;
  --segment-size: 40px;
  --segment-color: #fff;

  background-color: #000;
  border: 10px solid #ccc;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  padding: 20px;
}

.digit-square {
  border-style: solid;
  border-color: transparent;
  border-width: var(--segment-width);
  box-sizing: border-box;
  height: var(--segment-size);
  width: var(--segment-size);
}

.digit-square-top {
  border-bottom-width: calc(var(--segment-width) / 2);
}

.digit-square-bottom {
  border-top-width: calc(var(--segment-width) / 2);
}

.digit-square-border-top {
  border-top-color: var(--segment-color);
}

.digit-square-border-left {
  border-left-color: var(--segment-color);
}

.digit-square-border-right {
  border-right-color: var(--segment-color);
}

.digit-square-border-bottom {
  border-bottom-color: var(--segment-color);
}

.separator {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.separator-dot {
  background-color: var(--segment-color);
  border-radius: var(--segment-width);
  height: var(--segment-width);
  width: var(--segment-width);
}

```