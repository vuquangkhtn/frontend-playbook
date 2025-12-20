Solution
This question evaluates whether you know how to attach events to form inputs and manipulate the values of other inputs in response.

Since the input fields are pretty symmetrical, we can extract out a conversion function to update the other input via a formula.

Probably the most tricky part of the question is the number formatting. Refer to the notes below.

Notes
Use a <label> for the form fields to indicate what the input is for.
Using <input type="number"> is helpful for allowing only numerical values and stepper controls.
Number formatting is tricky:
Number() constructor: converts a value into a number or NaN if not possible. note that this returns Number(anyFalseyValue) gives 0, so we need to differentiate the empty string case from a real 0.
Number.IsNaN(): determine if a value is a number.
/\.\d{5}/: this regex tests is a number has 5 or more decimal places.
Test cases
Basic cases:
Enter 0 C and see 32 F (without decimals)
Enter 32 F and see 0 C.
Invalid inputs
Enter alphabets in either field, the other should be empty.
Decimal cases:
Enter 1 C and see 33.8 F (1 d.p.)
Enter 1 F and see -17.2222 C (4 d.p.)

```js
import { useState } from 'react';

function format(number) {
  // Show 4 d.p. if number has more than 4 decimal places.
  return /\.\d{5}/.test(number)
    ? Number(number).toFixed(4)
    : number;
}

export default function App() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  function convert(value, setDestination, calculateValue) {
    const numericValue = Number(value);
    const isValid =
      !Number.isNaN(numericValue) && Boolean(value);
    setDestination(
      isValid ? format(calculateValue(numericValue)) : '',
    );
  }

  return (
    <div>
      <div className="temperature-converter">
        {/* Use a label for better a11y. */}
        <label className="temperature-converter-column">
          <input
            className="temperature-converter-column-top-row"
            type="number"
            value={celsius}
            onChange={(event) => {
              const newValue = event.target.value;
              setCelsius(newValue);
              convert(
                newValue,
                setFahrenheit,
                (value) => (value * 9) / 5 + 32,
              );
            }}
          />
          <div className="temperature-converter-column-bottom-row">
            Celsius
          </div>
        </label>
        <div className="temperature-converter-column">
          <div className="temperature-converter-column-top-row">
            =
          </div>
        </div>
        {/* Use a label for better a11y. */}
        <label className="temperature-converter-column">
          <input
            className="temperature-converter-column-top-row"
            type="number"
            value={fahrenheit}
            onChange={(event) => {
              const newValue = event.target.value;
              setFahrenheit(newValue);
              convert(
                newValue,
                setCelsius,
                (value) => ((value - 32) * 5) / 9,
              );
            }}
          />
          <div className="temperature-converter-column-bottom-row">
            Fahrenheit
          </div>
        </label>
      </div>
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.temperature-converter {
  display: flex;
}

.temperature-converter
  .temperature-converter-column-top-row {
  align-items: center;
  display: flex;
  font-size: 18px;
  height: 24px;
  padding: 4px;
  text-align: center;
}

.temperature-converter
  .temperature-converter-column-bottom-row {
  padding: 4px;
  text-align: center;
}

```