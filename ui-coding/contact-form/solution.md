Solution
This is a basic question which evaluates your knowledge of the web platform. Forms and form submissions can entirely be built without any JavaScript! As a Front End Engineer, it's important to know what the platform provides and not resort to JavaScript for everything.

The first thing we need to do is to wrap the fields in a <form>, which is already given in the template. To tell the <form> which URL to submit the data to, we use the action attribute with the API URL as the value. The API URL is expecting a HTTP POST request, hence we also use method="post" on the <form>.

Form fields with the name attribute will have the attribute value become the key in the form data. Hence we can add name="name", name="email", name="message" to the various form fields. Do also add <label>s to label your <input>s.

Lastly, submit buttons can be implemented in two ways:

<button type="submit">: By default, <button>s have type="submit" as default and when used in <form>s, will trigger a form submission.
<input type="submit">: The element will be rendered as a button and clicking the <input> will trigger a form submission.
Test cases
Fields
All the fields can be updated.
Submission
Clicking on the submit button triggers form submission.
Hitting enter on the fields triggers form submissions if form is valid (except for <textarea> which will add a new line)
Success alert is seen if all fields are filled during submission.
Accessibility
Link <label>s to <input> so that clicking on the <label> will focus on the corresponding <input>.
Use <label for="some-id"> and <input id="some-id"> to define the relation between <label> and <input>.
Avoid nesting <input> inside of <label> because some assistive technologies (e.g. Dragon NaturallySpeaking) do not support it.
Follow up
Now that you are familiar with form submission, try out a follow up question, Signup Form, where you will be asked to make an AJAX-based form request and client-side validation.


```js
import submitForm from './submitForm';

export default function App() {
  return (
    <form
      // Ignore the onSubmit prop, it's used by GFE to
      // intercept the form submit event to check your solution.
      onSubmit={submitForm}
      action="https://questions.greatfrontend.com/api/questions/contact-form"
      method="post">
      <div>
        <label htmlFor="name-input">Name</label>
        <input id="name-input" name="name" type="text" />
      </div>
      <div>
        <label htmlFor="email-input">Email</label>
        <input id="email-input" name="email" type="email" />
      </div>
      <div>
        <label htmlFor="message-input">Message</label>
        <textarea
          id="message-input"
          name="message"></textarea>
      </div>
      <div>
        <button>Send</button>
      </div>
    </form>
  );
}

```

```js
const SUBMIT_URL =
  'https://questions.greatfrontend.com/api/questions/contact-form';

export default async function submitForm(event) {
  event.preventDefault();
  const form = event.target;

  try {
    if (form.action !== SUBMIT_URL) {
      alert('Incorrect form action value');
      return;
    }

    if (form.method.toLowerCase() !== 'post') {
      alert('Incorrect form method value');
      return;
    }

    const formData = new FormData(form);
    const response = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }),
    });

    const text = await response.text();
    alert(text);
  } catch (_) {
    alert('Error submitting form!');
  }
}

```

```css
body {
  font-family: sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}

label {
  font-size: 12px;
}

input,
textarea {
  display: block;
}

```