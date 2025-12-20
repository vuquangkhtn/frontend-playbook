Solution
Filling the bar proportionately to the progress (a number between 0-100, inclusive) can be accomplished using the style attribute on React elements. Since the value is dynamic, we cannot possibly write classes for it beforehand and we have to use inline styles.

Test cases
Valid values: 25, 50, 75.
Boundary values: 0, 100.
Invalid values: -10, 120.
For small values, the percentage labels are rendered appropriately.
Filled bar does not exceed rounded corners.
Notes
overflow: hidden has to be added to .progress-bar because of the rounded corners, so that the filled progress doesn't stick out of the rounded corners.
Progress values outside the range of [0, 100] should be handled well; they should not cause layout issues.
For small values, there might not be enough space to display the percentage label. We can either not show anything or truncate the display.
We can use CSS transforms (e.g. scale) as opposed to changing the width property, which is better for performance if there's a need for animation.
Accessibility
role="progressbar" and aria values are added to the component for a11y reasons, so that screen readers can accurately depict the component.


```js
const MIN = 0;
const MAX = 100;

export default function ProgressBar({ value }) {
  // Handle invalid values and convert them to be within [0, 100].
  const clampedValue = Math.min(Math.max(value, MIN), MAX);

  return (
    <div className="progress">
      <div
        className="progress-bar"
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={MIN}
        aria-valuemax={MAX}>
        {clampedValue}%
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
  gap: 12px;
}

.progress {
  background-color: rgb(233, 236, 239);
  border: 1px solid #c5c5c5;
  border-radius: 8px;
  height: 20px;
  overflow: hidden;
}

.progress-bar {
  background-color: #0d6efd;
  color: #fff;
  height: 100%;
  overflow: hidden;
  text-align: center;
}

```