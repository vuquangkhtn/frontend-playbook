Solution
We can separate out the solution into two parts, the update loop and the rendering.

Update loop
We need a timer to refresh the page and display the current time every second. To create the timer, we can use a setInterval and kick off the update loop in a useEffect.

Do remember to clear the timer upon unmounting of the component to prevent "setState on unmounted component" errors and memory leaks.

Store the JavaScript Date object as state as it contains all the data we need.

For better reusability, these logic can be abstracted into a custom useCurrentDate hook.

This part is exactly the same as the Digital Clock question.

Rendering
To make the clock more reusable and customizable, we can make the clock size as a property. The clock hands can then be a proportion of the clock's size.

To render the clock hands in the right position, we use a combination of position: absolute and CSS transforms:

position: absolute with top and left of half the clock size to make the hands start from the center of the clock. However, the hands will be pointing downwards.
Use transform: rotate(180deg) on the clock to make the hands point upwards. This step is optional if we add an 180 degree offset to the rotation angle of the hands.
Use transform-origin: center top to make the hands rotate around the center of the clock.
Use transform: rotate(Xdeg) on the hands to rotate them into the final angle.
Test cases
See that the second hand updates every second.
Observe the clock for a minute to see that the minute hand updates correctly (gradually moved since the observation started).
Check that the hour hand's position is different when it's not an exact hour, aka the hour hand's position at 12.00pm and 12.30pm should be different.
Notes
The update frequency of the timer depends on how accurate we want the clock to be. The maximum we can set is 1000ms, however, the clock's accuracy might be off by 1000ms in the case we load the page nearing the last millisecond of the second. However, using too small of an interval can be quite expensive because of too frequent updates. Hence a middleground we've chosen is 100ms. The clock can only ever be off by 100ms, which is not very noticeable by humans.

The current date/time should be polled in each loop, as opposed to recording the time when the clock was first rendered and incrementing based on the interval duration of the timer because the invocations of the loop can be delayed by processes hogging the main thread and the loop may not run at every fixed interval.

Accessibility
For a11y reasons, use a <time> element with datetime attribute set to the current time in 24-hour format so that screen readers can read this component. Otherwise the component will be ignored by screen readers, which is bad. Add the aria-hidden attribute to the internals of <time> since they are for presentation purposes and not useful to screen readers.


```js
import { useEffect, useState } from 'react';

function Hand({ height = 1, width = 1, angle }) {
  return (
    <div
      aria-hidden={true}
      className="clock-hand"
      style={{
        transform: `rotate(${angle}deg) scaleY(${height}) scaleX(${width})`,
      }}
    />
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

export default function Clock() {
  const date = useCurrentDate();
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return (
    <ClockImpl
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      size={300}
    />
  );
}

const FULL_ROTATION_DEGREES = 360;

// Separate out into a component that takes the time as a prop,
// so as to make it easy to test the rendering for specific times.
function ClockImpl({ hours, minutes, seconds, size }) {
  const secondsPercentage = seconds / 60;
  // To have second-level precision in the minute hand angle.
  const minutesPercentage =
    (minutes + secondsPercentage) / 60;
  // To have minute-level precision in the hour hand angle.
  const hoursPercentage =
    ((hours % 12) + minutesPercentage) / 12;

  const hourAngle = hoursPercentage * FULL_ROTATION_DEGREES;
  const minutesAngle =
    minutesPercentage * FULL_ROTATION_DEGREES;
  const secondsAngle =
    secondsPercentage * FULL_ROTATION_DEGREES;

  const dateTimeDisplay = `${padTwoDigit(
    hours,
  )}:${padTwoDigit(minutes)}:${padTwoDigit(seconds)}`;

  return (
    <time
      className="clock"
      dateTime={dateTimeDisplay}
      style={{
        '--size': `${size}px`,
      }}>
      <Hand height={0.5} angle={hourAngle} width={3} />
      <Hand height={0.9} angle={minutesAngle} width={2} />
      <Hand height={0.8} angle={secondsAngle} />
    </time>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock {
  display: block;
  flex-shrink: 0;
  position: relative;
  width: var(--size);
  height: var(--size);
  border-radius: 100%;
  border: 2px solid #ccc;
  transform: rotate(180deg);
}

.clock-hand {
  background-color: #ccc;
  position: absolute;
  width: 1px;
  height: calc(var(--size) / 2);
  left: calc(var(--size) / 2);
  top: calc(var(--size) / 2);
  transform-origin: top center;
}

```