Since the browser has native form validation capabilities, we will make use of it so that we can write less JavaScript.

HTML-based validation doesn't allow for customization of the error styling. Hence these days, it's no surprise that many forms opt for JavaScript-based validation to have more control over the validation styling. In interview settings, there are tight time constraints. If there is no requirement for specific validation styling, using HTML-based validation will save you some time and also demonstrate your HTML knowledge to the interviewer which is a positive signal.

This question is a good opportunity to get familiar with HTML-based validation if you aren't already. There's very little JavaScript we need to write if we use HTML-based validation. Only the matching password confirmation has to be done using JavaScript.

The following attributes on <input> are especially helpful for validating form values before submission can occur:

required: input value must be non-empty.
pattern: input value must match the specified regular expression.
minlength: input value must contain the minimum number of characters.
There are more validation attributes but the above are the ones relevant to signup forms.

All the fields are required, so we can add this attribute to all the <input>s.

Username: To validate a minimum of 4 characters, use minlength="4". To validate the alphanumeric constraint, we use a simple regex of ^[a-zA-Z0-9]+$.
Email: By using type="email", the browser will validate that the value matches an email format if it's non-empty.
Password/Confirm password: Use minlength="6" for minimum length validation and type="password" to hide the values.
Since we also need to validate that the password matches, we can add a 'submit' event listener to the form, use event.preventDefault() to intercept the browser submit, and validate using JavaScript. If the password validation fails, we show the error message below the password confirmation field.


Test cases
Username input
Empty: ❌ Fail validation
Shorter than 4 characters: ❌ Fail validation
Contains on-alphanumeric characters: ❌ Fail validation
Alphanumeric values 3 characters or more: ✅ Pass validation
Email input
Empty: ❌ Fail validation
Without username: ❌ Fail validation
Without domain: ❌ Fail validation
Valid email: ✅ Pass validation
Password input
Empty: ❌ Fail validation
Shorter than 6 characters: ❌ Fail validation
At least 6 characters: ✅ Pass validation
Confirm Password input
Empty: ❌ Fail validation
Shorter than 6 characters: ❌ Fail validation
Does not match password input: ❌ Fail validation
Matches password input: ✅ Pass validation
Submit button
Clicking on it triggers submission of the form if there are no validation errors
Accessibility
Link <label>s to <input> so that clicking on the <label> will focus on the corresponding <input>.
Use <label for="some-id"> and <input id="some-id"> to define the relation between <label> and <input>.
You can nest <input>s inside of <label>s but note that some assistive technologies (e.g. Dragon NaturallySpeaking) do not support it.
Apply a styling for <input> focus to clearly tell users which field they're on.
Link the error message up with the password confirmation field by using aria-describedby to indicate that the error message is for that <input> field.

index.html
```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <form>
      <div>
        <label for="username-input">Username</label>
        <input
          id="username-input"
          name="username"
          required
          type="text"
          pattern="^[a-zA-Z0-9]+$"
          minlength="4" />
      </div>
      <div>
        <label for="email-input">Email</label>
        <input
          id="email-input"
          name="email"
          required
          type="email" />
      </div>
      <div>
        <label for="password-input">Password</label>
        <input
          id="password-input"
          name="password"
          required
          type="password"
          minlength="6" />
      </div>
      <div>
        <label for="password-confirm-input">
          Confirm Password
        </label>
        <input
          id="password-confirm-input"
          name="password_confirm"
          required
          type="password"
          minlength="6"
          aria-describedby="password-mismatch-error" />
        <div
          class="error hidden"
          id="password-mismatch-error">
          The passwords do not match
        </div>
      </div>
      <div>
        <button type="submit">Sign Up</button>
      </div>
    </form>
    <script src="src/index.js"></script>
  </body>
</html>

```

```js
import './styles.css';

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} passwordConfirm
 */
async function submitForm(
  username,
  email,
  password,
  passwordConfirm,
) {
  try {
    const response = await fetch(
      'https://questions.greatfrontend.com/api/questions/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: passwordConfirm,
        }),
      },
    );

    const { message } = await response.json();
    alert(message);
  } catch (_) {
    alert('Error submitting form!');
  }
}

(() => {
  const $form = document.querySelector('form');
  const $passwordConfirmInput = document.getElementById(
    'password-confirm-input',
  );
  const $passwordMismatchError = document.getElementById(
    'password-mismatch-error',
  );

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Reset the password confirm field.
    $passwordConfirmInput.removeAttribute('aria-invalid');
    $passwordMismatchError.classList.add('hidden');

    // Construct a FormData object based on form values.
    const formData = new FormData($form);
    const password = formData.get('password');
    const passwordConfirm = formData.get(
      'password_confirm',
    );

    // The only fields we cannot leverage the browser to validate
    // is the password confirmation, so we use JavaScript to achieve that.
    if (password !== passwordConfirm) {
      $passwordConfirmInput.setAttribute(
        'aria-invalid',
        'true',
      );
      $passwordMismatchError.classList.remove('hidden');
      return;
    }

    await submitForm(
      formData.get('username'),
      formData.get('email'),
      formData.get('password'),
      formData.get('password_confirm'),
    );
  });
})();

```