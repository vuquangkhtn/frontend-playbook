Solution
This question evaluates your knowledge of form validation and dependent form fields.

Rendering
We can use <input type="date"> to render native datepickers, which has over 96% browser support globally at the time of writing. Native datepickers also come with the min attributes, which we can use for ensuring that only valid dates are chosen.

The input fields and buttons are also wrapped in a <form> so that we can leverage native form submission and validation. Submission can be trigged by clicking the "Book" button or hitting Enter on any of the form fields. The browser will first validate the inputs and trigger the submit event if the fields are valid.

State
Since we need to toggle the display of the return field, we will need a state value to track whether the selected flight is "One-way" or "Round-trip" to know whether to render the return date input.

The formatDate function converts a JavaScript Date object into a YYYY-MM-DD string which is the format expected by <input type="date">.

Using a form that constantly tracks the input values (controlled form) is more convenient than native forms approach (uncontrolled forms), as having state for the date values allows us to specify the current departure date as the min of the return date <input> field and leverage the browser's form validation during submission. Otherwise, we'll have to write custom validation logic in the submission handler.

Controlled forms are achieved in React by calling the state setter in the <input>'s onChange callback. This makes it straightforward to capture the current value of these elements directly in our component's state, and any state changes are instantly updated in the UI.

Test cases
One-way flight
Only one datepicker is shown.
Submission is blocked when a date in the past is selected.
Submitting with a date in the future shows the success message.
Round-trip flight
Two datepickers are shown.
Submission is blocked when dates in the past are selected.
Submission is blocked when the return date is earlier than the start date.
Submitting with dates in the future shows the success message.
Accessibility
Since the <input> fields don't have visible labels, aria-labels can be used to label the fields for screenreaders.
Wrapping the fields in a <form> enables default form submission behavior.
User Experience
The datepickers are prefilled with tomorrow's date as a nice default.

```js
import { useState } from 'react';

const TODAY = formatDate(new Date());
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1)
    .toString()
    .padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return [year, month, day].join('-');
}

export default function App() {
  const [flightOption, setFlightOption] =
    useState('one-way');
  const [departureDate, setDepartureDate] = useState(
    formatDate(new Date(Date.now() + DAY_IN_MILLISECONDS)), // Tomorrow.
  );
  const [returnDate, setReturnDate] =
    useState(departureDate);

  function submitForm(event) {
    event.preventDefault();
    if (flightOption === 'one-way') {
      alert(
        `You have booked a one-way flight on ${departureDate}`,
      );
      return;
    }

    alert(
      `You have booked a round-trip flight, departing on ${departureDate} and returning on ${returnDate}`,
    );
  }

  return (
    <div>
      <form className="flight-booker" onSubmit={submitForm}>
        <select
          value={flightOption}
          onChange={(event) => {
            setFlightOption(event.target.value);
          }}>
          <option value="one-way">One-way flight</option>
          <option value="round-trip">
            Round-trip flight
          </option>
        </select>
        <input
          aria-label="Departure date"
          type="date"
          value={departureDate}
          onChange={(event) => {
            setDepartureDate(event.target.value);
          }}
          min={TODAY}
        />
        {flightOption === 'round-trip' && (
          <input
            aria-label="Return date"
            type="date"
            value={returnDate}
            min={departureDate}
            onChange={(event) => {
              setReturnDate(event.target.value);
            }}
          />
        )}
        <button>Book</button>
      </form>
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.flight-booker {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
  max-width: 320px;
}

```