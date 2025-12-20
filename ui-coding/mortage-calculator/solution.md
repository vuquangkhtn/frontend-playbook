This question evaluates whether you understand how to allow users to enter form inputs, validate them and perform calculations based on the inputs.

Form Markup
To collect user data, we use a <form> element and <input> fields.

To validate input, use the built-in input type validators (<input type="number">), or use the Number() constructor to convert user input to numbers and check for NaN values. You can use the required attribute in HTML to ensure that all input fields are filled out and the min attribute to ensure that input fields have a valid minimum value before the submit event callback is fired.

There's no need to use controlled values for the form fields as we only have to calculate during submission..

Form Submission
We can use JavaScript to attach on onClick event to the "Calculate" button that calculates the mortgage payment using the formula. But it'd be better to add a an onSubmit event handler to the <form> so that both clicking on the "Calculate" button and hitting "Enter" in any of the input fields will submit the form. It's also necessary to use event.preventDefault() to intercept the browser submit action which by default triggers a page reload and is not desired here.

Displaying Results
After computing the 3 necessary amounts using the formula, use Intl.NumberFormat() to format the amounts to 2 d.p. with a dollar symbol. Feel free to customize the formatting to your own locale and currency.

Test cases
Basic case
Enter a loan amount, interest rate, and loan term for a simple mortgage scenario, and verify that the monthly mortgage payment and total amount paid are calculated correctly. For example, a 30-year mortgage on a $100,000 loan at 3% interest rate should result in a monthly payment of $421.60, a total amount paid of $151,777.45, and total interest of $51,777.45.
Invalid inputs
Leave the loan amount field blank and submit. Expect to see an error message prompting the user to fill out the field.
Try to enter text instead of numeric characters in any of the fields. <input type="number"> should prevent non-numeric characters from being entered.
Accessibility
Use a <label> for the form fields to indicate what the <input> is for. You can nest <input> within <label> to make the association implicit.
Add aria-live="polite" to the results container element to announce content changes to users of assistive technologies.

```js
import { useState } from 'react';

export default function App() {
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [totalInterest, setTotalInterest] = useState('');

  function onSubmit(event) {
    event.preventDefault(); // Prevent page reload on form submission.

    const data = new FormData(event.target);

    // Get and convert input values.
    const loanAmount = parseFloat(data.get('loan-amount'));
    const monthlyInterestRate =
      parseFloat(data.get('interest-rate')) / 100 / 12;
    const loanTermInMonths =
      parseFloat(data.get('loan-term')) * 12;

    // Calculate monthly mortgage payment.
    const monthlyPaymentAmount =
      (loanAmount * monthlyInterestRate) /
      (1 -
        1 /
          Math.pow(
            1 + monthlyInterestRate,
            loanTermInMonths,
          ));
    const totalPayment =
      monthlyPaymentAmount * loanTermInMonths;

    const currencyFormatter = new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
      },
    );

    // Display monthly payment amount.
    setMonthlyPayment(
      currencyFormatter.format(monthlyPaymentAmount),
    );

    // Display total payment amount.
    setTotalPayment(currencyFormatter.format(totalPayment));

    // Display total interest amount.
    setTotalInterest(
      currencyFormatter.format(totalPayment - loanAmount),
    );
  }

  return (
    <div className="mortgage-calculator">
      <form
        className="mortgage-calculator-form"
        onSubmit={onSubmit}>
        <div>
          <label>
            Loan Amount:{' '}
            <input
              type="number"
              name="loan-amount"
              defaultValue="100000"
              min="1"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Loan Term (years):{' '}
            <input
              type="number"
              name="loan-term"
              defaultValue="30"
              min="1"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Interest Rate (%):{' '}
            <input
              type="number"
              name="interest-rate"
              defaultValue="3"
              step="0.01"
              min="0.01"
              required
            />
          </label>
        </div>
        <div>
          <button type="submit">Calculate</button>
        </div>
      </form>
      <hr />
      <div
        aria-live="polite"
        className="mortgage-calculator-results">
        <div>
          Monthly Payment Amount:{' '}
          <strong>{monthlyPayment}</strong>
        </div>
        <div>
          Total Payment Amount:{' '}
          <strong>{totalPayment}</strong>
        </div>
        <div>
          Total Interest Paid:{' '}
          <strong>{totalInterest}</strong>
        </div>
      </div>
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.mortgage-calculator {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 12px;
}

.mortgage-calculator-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mortgage-calculator-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

```