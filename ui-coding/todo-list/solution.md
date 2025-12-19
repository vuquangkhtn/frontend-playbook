Note: Check out the improved version which has numerous UX improvements.

Solution
State
We will need two state values: tasks and newTask.

tasks: Since there's a list of tasks that can be modified, we will need it to be part of the component's state. When rendering a list of elements in React, we need to specify a key for each item. We cannot use the text of the task as the key because they are not guaranteed to be unique. It is typically a bad practice to use array index as keys, but for this question, it is acceptable. The most foolproof method is to generate a unique ID for each task. Libraries like uuid come to mind, but in this case, a simple incrementing counter will do. Since we want ids to be globally unique, it is initialized in the module scope, outside of the component.

newTask: state to represent the new task input field, although that is not strictly necessary if we prefer uncontrolled components. However, it is generally more common to make input fields controlled, aka backed by component state. The initial value for this state should not be null as React will show a warning otherwise.

Adding tasks
New tasks should be added to the end of the tasks array. We can construct a new task object with a new id and the label field, based on the newTask value, create a new list from the previous list with the new item, and set it as the new tasks state.

Deleting tasks
Having a unique id for each task object simplifies things here because we can filter the existing list and exclude the task corresponding to the id to be removed. If you opted to use array index instead of generating unique IDs, you can use Array.prototype.splice to remove elements at that index.

Notes
Using React, the user input will be automatically escaped so there's no need to manually prevent Cross Site Scripting (XSS).

Note: Check out the improved version which has numerous UX improvements.

Accessibility
All form <input>s should be labelled either via <label>s or aria-label attributes. Since the original markup doesn't contain a <label>, we can add aria-label to the <input>.
For screen reader users, they won't be aware that a new task has been added. An aria-live region can be added to inform about the newly-added task. There is unlikely enough time to do this during an interview but you will get bonus points for mentioning it. Read more about ARIA live regions on MDN.
Test cases
Add tasks
Add a new task.
Add multiple tasks.
Add tasks with potentially malicious content like HTML (e.g. <script>, <style> or <link>) and ensure there's no XSS.
Check that <input> is cleared after a task is added.
Delete tasks
Delete an existing task.
Delete multiple tasks.
Delete newly-added tasks.

App.js
```js
import { useState } from 'react';

let id = 0;

const INITIAL_TASKS = [
  { id: id++, label: 'Walk the dog' },
  { id: id++, label: 'Water the plants' },
  { id: id++, label: 'Wash the dishes' },
];

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTask, setNewTask] = useState('');

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          aria-label="Add new task"
          type="text"
          placeholder="Add your task"
          value={newTask}
          onChange={(event) => {
            setNewTask(event.target.value);
          }}
        />
        <div>
          <button
            onClick={() => {
              setTasks(
                tasks.concat({
                  id: id++,
                  label: newTask.trim(),
                }),
              );
              setNewTask('');
            }}>
            Submit
          </button>
        </div>
      </div>
      <ul>
        {tasks.map(({ id, label }) => (
          <li key={id}>
            <span>{label}</span>
            <button
              onClick={() => {
                setTasks(
                  tasks.filter((task) => task.id !== id),
                );
              }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

```

