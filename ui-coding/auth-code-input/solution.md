Solution
The complexity of an auth code input component lies in the user experience, the custom input handling, and focus management:

Instead of a single <input>, the code is split across N <input> fields
Focus management is extremely hard to get right for an auth code input component:
Entering values
Users should be able to type in the values without using any arrow keys
The focus should shift automatically after an input field is filled
Erasing values
Users should to be able to erase all the input fields just by using the Backspace key
Hitting the Backspace key should erase the current value. It should also focus on the previous value if the current input field is empty
Traversing between fields
Traversal of input fields should be possible using just the usual arrow keys and Tab key
When users is focused on an input field, they expect to be able to type the new value – any existing values should be replaced and focus should move to the next field
State
There aren't too many state variables necessary as the complexity lies in focus management.

Naturally, we will need state to store the code. Strictly speaking, uncontrolled inputs can be used but keeping the input values within state will enable us to enable/disable the "Reset" and "Submit" button appropriately.

It will be necessary to have finegrain control over which input field is focused, thus a focusedIndex state value will be helpful.

Thus, two state values are present:

code: This state stores the auth code entered by the user as a string.
focusedIndex: This state stores the index of the currently focused input field.
Input handling
In React, a behavior of the onChange prop on <input> that people might not pay attention to is that it is only fired when the value of an input changes. For the input fields in this component, we want to respond to keypress events even if the user enters the same value within the field, as we want to move to the next input field if a valid number was entered.

Since we also need to handle other keyboard events like left/right arrows (move to previous/next fields), backspace (erase current value and move to next field), we can add a listener for the keydown event that handles these special keys as well as the number keys. This is one of the rare instances where you respond to input without using the onChange callback. This allows us to ignore whatever is in the input field, replace with a new value, and focus on the next field.

To handle the following keys:

Left Arrow: Shifts the focus to the left of the currently focused input field.
Right Arrow: Shifts the focus to the right of the currently focused input field.
Backspace: If the currently focused input field is filled, delete it. Otherwise, shift the focus to the previous input field and delete any character present from the previous input field.
Others: Check if the newly-entered value is valid. If so, update code and shift the focus to the next input field.
Convenient way of deleting and replacing of values
Normally, when focusing on input fields, a cursor is created within the field to allow modification of the value. However for auth code inputs, each input field only allows a single digit, and it's not meaningful to render the cursor at all if the input field is already filled. It would be more useful to let the user delete the field or replace existing value with a single keystroke – via the Backspace key or a new number key respectively. By listening to keydown events, we can respond appropriately as explained in the previous section. This is harder to achieve using the onChange callback.

Pasting values
Often, rather than entering the numbers manually, users will copy out the auth code from an email or a message to be pasted in. Hence we also support pasting of auth codes. This is done by adding a paste event listener to the <input>s and using event.clipboardData.getData('text') to get the clipboard value. Validation should be done on the clipboard value to ensure the pasted values is valid, and if so, fills the input fields accordingly.

The current implementation replaces the values from the start, regardless of which input field received the paste event. Hence it is not possible to complete the code a partially-filled component by pasting the rest of the code.

This behavior might not be the most ideal, but is acceptable given that:

When the auth code is copied, it is usually the entire code.
Usually, the auth code is pasted when focus is on the first input field.
Test cases
Entering input
Upon initial load, the first input is focused
Entering a valid input should fill the input field and move the focus to the next input field
Invalid input should not be allowed in input field
No interaction should be allowed when a network request is in progress
Deleting input
Pressing Backspace should delete the current input (if filled) or move to previous input field and delete any input present from previous input field
Navigating input fields
Pressing Tab / Shift + Tab and left/right arrow buttons should move the focus to left/right based on the pressed key
After navigation, the input fields should be able to be replaced with a new number without any additional keystrokes
Pasting input
Pasting a code should paste the code if the pasted code is valid input
"Reset" button
Should be disabled if no input is present
Clicking on it should erase all input fields and focus on the first input
"Submit" button
Submit should be enabled only when all input field are filled with valid input
Accessibility
Use of semantic HTML elements like <form>, <input>, <button>, etc. will automatically provide with some accessibility.

Tab will move the focus to the next field
Shift + Tab will move the focus to the previous field
Note: Other key presses are handled via onKeyDown function.

AutoCode
```js
import { useState } from 'react';
import InputDigit from './InputDigit';

const singleNumRegex = /^\d$/;
const numRegex = /^\d+$/;

export default function AuthCodeInput({
  length,
  isDisabled = false,
  onSubmit,
}: Readonly<{
  length: number;
  isDisabled: boolean;
  onSubmit: (code: string) => void;
}>) {
  const [code, setCode] = useState(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);

  function clampIndex(index: number) {
    if (index <= 0) {
      return 0;
    }

    if (index >= length) {
      return length - 1;
    }

    return index;
  }

  function onFocus(index: number) {
    setFocusedIndex(index);
  }

  function onKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    switch (event.key) {
      case 'ArrowLeft':
        setFocusedIndex(clampIndex(focusedIndex - 1));
        break;
      case 'ArrowRight':
        setFocusedIndex(clampIndex(focusedIndex + 1));
        break;
      case 'Backspace':
        if (code[index]) {
          setCode(
            code.map((codeDigit, idx) =>
              index === idx ? '' : codeDigit,
            ),
          );
        } else if (index - 1 >= 0) {
          setCode(
            code.map((codeDigit, idx) =>
              index - 1 === idx ? '' : codeDigit,
            ),
          );
          setFocusedIndex(clampIndex(index - 1));
        }
        break;
      default: {
        const value = event.key;
        if (!singleNumRegex.test(value)) {
          return;
        }

        setCode(
          code.map((codeDigit, idx) =>
            index === idx ? String(value) : codeDigit,
          ),
        );
        setFocusedIndex(clampIndex(focusedIndex + 1));
        break;
      }
    }
  }

  function onPaste(
    event: React.ClipboardEvent<HTMLInputElement>,
  ) {
    event.preventDefault();
    const pastedCode = event.clipboardData.getData('text');

    if (!numRegex.test(pastedCode)) {
      return;
    }

    setCode(
      code.map(
        (codeDigit, idx) => pastedCode[idx] ?? codeDigit,
      ),
    );
    setFocusedIndex(clampIndex(pastedCode.length));
  }

  function onReset() {
    setCode(Array(length).fill(''));
    setFocusedIndex(0);
  }

  const isSubmitEnabled = code.every((codeDigit) =>
    Boolean(codeDigit),
  );
  const isResetEnabled = code.some((codeDigit) =>
    Boolean(codeDigit),
  );

  return (
    <div className="wrapper">
      <form
        className="container"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(code.join(''));
        }}>
        <div className="flex-container">
          {code.map((codeDigit, index) => (
            <InputDigit
              key={index}
              value={codeDigit}
              isFocused={focusedIndex === index}
              disabled={isDisabled}
              onFocus={() => onFocus(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              onPaste={onPaste}
            />
          ))}
        </div>
        <div className="flex-container">
          <button
            type="reset"
            className="button button--secondary"
            disabled={!isResetEnabled || isDisabled}
            onClick={onReset}>
            Reset
          </button>
          <button
            type="submit"
            className="button button--primary"
            disabled={!isSubmitEnabled || isDisabled}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

```

InputDigit
```js
import {
  InputHTMLAttributes,
  useEffect,
  useRef,
} from 'react';

export default function InputDigit({
  value,
  isFocused,
  ...props
}: Readonly<{
  value: number;
  isFocused: boolean;
}> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'checked'>) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="input-box"
      maxLength={1}
      inputMode="numeric"
      autoComplete="one-time-code"
      value={value}
      {...props}
    />
  );
}

```

App
```js
import { useState } from 'react';

import AuthCodeInput from './AuthCodeInput';

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(code: string) {
    setIsSubmitting(true);
    fetch(
      'https://questions.greatfrontend.com/api/questions/auth-code-input',
      {
        method: 'POST',
        body: JSON.stringify({ otp: code }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => res.text())
      .then((res) => alert(res))
      .catch(() =>
        alert(
          'Something went wrong. Please try again later.',
        ),
      )
      .finally(() => setIsSubmitting(false));
  }

  return (
    <AuthCodeInput
      length={6}
      onSubmit={onSubmit}
      isDisabled={isSubmitting}
    />
  );
}

export default App;

```

style
```css
* {
  box-sizing: border-box;
  margin: 0;
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100vh;
  width: 100vw;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.input-box {
  --size: 3rem;
  height: var(--size);
  width: var(--size);
  text-align: center;
  border: none;
  outline: none;
  background: #eee;
  font-weight: 600;
  font-size: 1.5rem;
}

.input-box::selection {
  background-color: #000;
  color: #fff;
}

.input-box:focus {
  color: #000;
  outline: 2px solid #000;
}

.input-box:disabled {
  cursor: not-allowed;
}

.button {
  border: 2px solid black;
  outline: none;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.button:focus {
  outline: 2px solid #000;
  outline-offset: 1px;
}

.button:disabled {
  opacity: 0.25;
  cursor: not-allowed;
  transition: all 0.3s linear;
}

.button--primary {
  background-color: #000;
  color: #fff;
}

.button--secondary {
  background-color: transparent;
  color: black;
}

```