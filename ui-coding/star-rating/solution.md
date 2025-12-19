Solution
The solution is much shorter using framework/library as compared to the Vanilla version.

We can create a Star component that takes in a filled prop which conditionally renders the appropriate classnames.

The component will need a state hoveredIndex which is used to track the index of the currently hovered star.

To determine whether a Star should be highlighted/filled, we check if any stars are currently hovered, if so, that takes priority and any star with index <= hoveredIndex should be highlighted. Otherwise, any star where index < value can be highlighted/filled.

Notes
The Star Rating widget can be improved in the following ways:

Allow the value to be part of a form submit event data by embedding an <input>.
Add keyboard support for better a11y.
Add RTL (right-to-left) support.
Test cases
Click on each star and move the cursor away, see that the highlighted state is correct.
Hover over each star, see that every star under the cursor and to its left are highlighted.
Remove cursor over widget, see that the highlighted state is back to before the hovering.
Render multiple components, ensure that each can maintain its own state and interacting with a widget does not affect other onscreen components.

App.js
```js
import { useState } from 'react';

import StarRating from './StarRating';

export default function App() {
  const [rating, setRating] = useState(3);

  return (
    <div>
      <StarRating
        max={5}
        value={rating}
        onChange={setRating}
      />
    </div>
  );
}

```

StarRating.js
```js
import { useState } from 'react';

function Star({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={[
        'star-icon',
        filled ? 'star-icon-filled' : '',
      ].join(' ')}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

export default function StarRating({
  value,
  max,
  onChange,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div>
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={index}
          tabIndex={0}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onChange(index + 1)}>
          <Star
            filled={
              hoveredIndex != null
                ? index <= hoveredIndex
                : index < value
            }
          />
        </span>
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

.star-icon {
  --icon-size: 32px;

  cursor: pointer;
  height: var(--icon-size);
  width: var(--icon-size);
}

.star-icon-filled {
  fill: yellow;
}

```