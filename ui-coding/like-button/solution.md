Solution
The focus of this question is in the handling of the various states when there's a pending request.

Data model
We'll need a few state variables:

liked: Tracks whether the button is in the default state or the liked state. Since there are only two states, we can use a boolean type to represent it.
isPending: Determines if there's a pending background request.
errorMessage: Error message obtained from the back end when the API request fails.
Making API requests
Writing code to fetch data via an API request is pretty standard. In general, you should use the following flow:

Set the UI to show a loading state
Clear the error message
Initiate the API request via fetch
Determine if the request has succeeded
If the response succeeds, update the UI to indicate success
If the response fails, update the UI to indicate failure by showing an error message
Remove the loading state
The above is captured in the likeUnlikeAction function.

Rendering
The rendering code is pretty straightforward since there isn't much dependency among the state variables when rendering the UI.

Test cases
"Default" state
Hovering the button should show the "Hovered" state.
Clicking on the button should show a loading spinner.
If the request succeeds, the button should transition into the "Liked" state.
If the request fails, the button should go back to the "Default" state and an error message is shown below the button.
"Liked" state
Hovering the button in this state is undefined behavior. It's fine to not show any difference when hovering.
Clicking on the button should show a loading spinner.
If the request succeeds, the button should transition into the "Default" state.
If the request fails, the button should go back to the "Liked" state and an error message is shown below the button.
Notes
Some users might have the habit of double clicking on UI elements. By disabling the button after the first click, we avoid running into the situation where multiple requests are pending at the same time which is probably unintended and can lead to confusing outcomes.

```
import { useState } from 'react';
import { HeartIcon, SpinnerIcon } from './icons';

function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export default function App() {
  // Determines if the button is in the default/liked state.
  const [liked, setLiked] = useState(false);
  // Whether there's a pending background API request.
  const [isPending, setIsPending] = useState(false);
  // Error message to be shown if the API request failed.
  const [errorMessage, setErrorMessage] = useState(null);

  async function likeUnlikeAction() {
    try {
      setIsPending(true);
      setErrorMessage(null);

      const response = await fetch(
        'https://questions.greatfrontend.com/api/questions/like-button',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: liked ? 'unlike' : 'like',
          }),
        },
      );

      if (!response.ok) {
        const res = await response.json();
        setErrorMessage(res.message);
        return;
      }

      setLiked(!liked);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="button-container">
      <button
        className={classNames(
          'like-button',
          liked
            ? 'like-button--liked'
            : 'like-button--default',
        )}
        disabled={isPending}
        onClick={() => {
          likeUnlikeAction();
        }}>
        {isPending ? <SpinnerIcon /> : <HeartIcon />}
        {liked ? 'Liked' : 'Like'}
      </button>
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.error-message {
  font-size: 12px;
  margin-top: 8px;
}

.like-button {
  --default-color: #888;
  --active-color: red;

  align-items: center;
  border-style: solid;
  border-radius: 32px;
  border-width: 2px;
  display: flex;
  cursor: pointer;
  font-weight: bold;
  gap: 8px;
  height: 32px;
  padding: 4px 8px;
}

.like-button--default {
  background-color: #fff;
  border-color: var(--default-color);
  color: var(--default-color);
}

.like-button:hover {
  border-color: var(--active-color);
  color: var(--active-color);
}

.like-button--liked,
.like-button--liked:hover {
  background-color: var(--active-color);
  border-color: var(--active-color);
  color: #fff;
}

.like-button-icon {
  display: flex;
}
```

Icon
```js
export function SpinnerIcon({ className }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor">
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle
            strokeOpacity=".5"
            cx="18"
            cy="18"
            r="18"
          />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
}

export function HeartIcon({ className }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      width="16"
      height="16">
      <g>
        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
      </g>
    </svg>
  );
}

```