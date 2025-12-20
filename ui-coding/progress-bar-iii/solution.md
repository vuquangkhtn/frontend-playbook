Note: This is an advanced version of Progress Bars II, you should complete that question first before attempting this question.

Solution
The only change we have to make to the solution from Progress Bars II is the way we are determining whether isEmpty={true} (whether a bar is allowed to increment).


<ProgressBar isEmpty={index > numFilledUpBars} />

// The above can be rewritten as:
<ProgressBar isEmpty={index >= numFilledUpBars + 1} />

// Extract the concurrency limit as a variable:
const CONCURRENCY_LIMIT = 1;
<ProgressBar isEmpty={index >= numFilledUpBars + CONCURRENCY_LIMIT} />
// And we can change the value of CONCURRENCY_LIMIT to 3 to solve the question.
With this change, up to 3 non-full bars will have <ProgressBar isEmpty={false} /> which provides the concurrency needed to solve this question.

Test cases
Hitting "Add" appends a new empty progress bar to the bottom of the list.
The first bar starts filling up as soon as it appears.
Hit "Add" 4 times in quick succession to have 4 bars in total. The first 3 bars should start filling up and the fourth only starts filling up after the first one completes.
If an existing bar is filled up, any empty bar starts filling up immediately.

Try out the solution
Files

Open files in workspace
index.html
App.js
index.js
styles.css

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

App.js
```ts
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

const CONCURRENCY_LIMIT = 3;

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
              isEmpty={
                index >= numFilledUpBars + CONCURRENCY_LIMIT
              }
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