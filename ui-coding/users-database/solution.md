Solution
The solution can be broken down into a few parts:

Collecting form data.
Performing actions.
Displaying the final result.
State
We need several pieces of information to keep track of the state of the application:

selected: the state variable for the selected user's id
search: the state variable for the search term
first: the state variable for the first name
last: the state variable for the last name
users: the state variable for the list of users
Collecting form data
We use several input fields for collecting the search term, the first and last names. The search term is used to filter the list of users. The first and last names are used to create / update users.

By using <input required /> on first and last names, we ensure that the fields are validated and cannot be empty.

Performing actions
As user is selected, the first and last name fields are updated with the selected user's data. These fields are empty if there is no selected user.

We use simple buttons for creating / updating / deleting / canceling actions:

Create: if there is no selected user, and the first and last name are not empty, we create a new user and add it to the list of users. The button is disabled otherwise.
Update: if there is a selected user, and the new first and last names are not empty, we update the selected user's first and last name. The button is disabled otherwise.
Delete: if there is a selected user, we remove the selected user from the list of users. The button is disabled otherwise.
Cancel: we de-select the current selected user. The button is disabled if there is no selected user
Displaying the final result
We use a simple select field for the list of users. The value of the select field is the selected state variable. The list of users are computed based on the search term.

Test cases
Search input
The value is updated as the user types
The list of users are updated on search input changes
Listbox
Only one user can be selected at a time
Upon search input changes, show the correctly filtered result of all users in the database
First name and last name inputs
The first name and last name inputs are empty by default and updated as the user types
The first name and last name are required fields for create / update upon form submission
Form
The create button is disabled when first name or last name is empty. New user is added to the list when the create button is clicked
The update buttons are disabled when first name or last name is empty or no user is selected. The selected user is updated when the update button is clicked
The delete button is disabled when no user is selected. The selected user is deleted when the delete button is clicked.
The cancel button is disabled when no user is selected. The selected user is cleared when the cancel button is clicked, first name and last name inputs are empty.
Accessibility
Use of <form> submit for performing actions.
<input type="text"> are paired with <label>s. Clicking on labels also focuses the input.
All required functionality should be achievable just by using the keyboard.

```js
import { useState } from 'react';

const generateId = (() => {
  let id = 0;
  return () => `${id++}`;
})();

export default function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [users, setUsers] = useState([
    { first: 'Hans', last: 'Emil', id: generateId() },
    { first: 'Max', last: 'Mustermann', id: generateId() },
    { first: 'Roman', last: 'Tisch', id: generateId() },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.first
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.last
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const hasSelectedUser = selected != null;

  const canCreateUser =
    !hasSelectedUser && first !== '' && last !== '';

  const canUpdateUser =
    hasSelectedUser && first !== '' && last !== '';

  function create() {
    setUsers(
      users.concat({
        first,
        last,
        id: generateId(),
      }),
    );
    setFirst('');
    setLast('');
  }

  function update() {
    const newUsers = [...users];
    const foundUser = newUsers.find(
      ({ id }) => selected === id,
    );
    foundUser.first = first;
    foundUser.last = last;
    setUsers(newUsers);
  }

  function del() {
    setUsers(users.filter((user) => user.id !== selected));
    cancel();
  }

  function cancel() {
    setSelected(null);
    setFirst('');
    setLast('');
  }

  function onSubmit(event) {
    // To prevent a page reload.
    event.preventDefault();
    const formData = new FormData(
      event.target,
      event.nativeEvent.submitter,
    );
    const intent = formData.get('intent');

    switch (intent) {
      case 'create':
        create();
        break;

      case 'update':
        update();
        break;

      case 'delete':
        del();
        break;

      case 'cancel':
        cancel();
        break;

      default:
        throw new Error(`Invalid intent: ${intent}`);
    }
  }

  return (
    <form className="app" onSubmit={onSubmit}>
      <div>
        <input
          aria-label="Search users"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
      </div>

      <div className="middle-row">
        <select
          size={5}
          className="users-list"
          value={selected}
          onChange={(e) => {
            const newSelected = e.target.value;
            setSelected(newSelected);

            const foundUser = users.find(
              ({ id }) => id === newSelected,
            );
            setFirst(foundUser.first);
            setLast(foundUser.last);
          }}>
          {filteredUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first} {user.last}
            </option>
          ))}
        </select>
        <div className="inputs">
          <label>
            First Name:
            <input
              type="text"
              required
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              required
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="buttons">
        <button
          name="intent"
          value="create"
          disabled={!canCreateUser}>
          Create
        </button>
        <button
          name="intent"
          value="update"
          disabled={!canUpdateUser}>
          Update
        </button>
        <button
          name="intent"
          value="delete"
          disabled={!hasSelectedUser}>
          Delete
        </button>
        <button
          name="intent"
          value="cancel"
          disabled={!hasSelectedUser}>
          Cancel
        </button>
      </div>
    </form>
  );
}

```