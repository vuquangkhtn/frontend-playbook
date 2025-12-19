Solution
State
counter: The current value for the counter.
history: An array that contains the history of actions. The list of actions are in reverse chronological order.
undoHistory: An array that contains the history of actions have have been undo-ed. The list of actions are in reverse chronological order.
performOperation
The performOperation function is used to apply an operation to a counter value. It takes two parameters: counter and operationLabel. counter is the current value of the counter, and operationLabel is a string that specifies which operation to perform.

The OPERATIONS object is a dictionary that maps operation labels to objects that describe the operation. Each operation object has a type property that specifies the type of operation (increment, decrement, multiply, or divide) and a number property that specifies the operand for the operation.

The performOperation function looks up the operation object for the specified operation label from the OPERATIONS object. For example, if operationLabel is '+1', performOperation will look up the object { type: 'increment', number: 1 } from the OPERATIONS object and add 1 to the counter.

onUndo
This function that is called when the "Undo" button is clicked. It is responsible for undoing the last performed operation and updating the counter and the history accordingly.

More specifically, onUndo removes the first item from the history array, and sets the counter value to the old counter value of the removed item. The removed item is then added to the undoHistory array, which stores the list of undone operations.

onRedo
This function is used to redo the last action that was undone by the onUndo function.

When onRedo is called, it retrieves the most recently undone action from the undoHistory state and sets the counter to the newCounter value of that action. It then removes the undone action from the undoHistory state and adds it back to the history state, effectively reapplying the action.

onReset
This function resets everything back to the initial state.

Test cases
Verify that the counter starts at 0.
Click the "/2", "-1", "+1", "x2" buttons multiple times. Observe that:
The counter should update with the correct value after performing the operation.
The history table should have a row added to the top showing the operation, count before the operation and the count after.
Click the "Undo" button multiple times. Observe that:
The counter should update with the correct "old" value.
The top row is removed from the history table.
Click the "Redo" button multiple times. Observe that:
The counter should update with the correct "new" value.
The history table should have the redo-ed row added back to it.
Click the "Reset" button. Observe that:
The "Undo" and "Redo" buttons should be disabled.
The history table should have nothing in it.
The counter should reset to 0.
Click the "/2", "-1", "+1", "x2" buttons after undoing some actions.
The undo-ed actions can no longer do redo-ed.
The "Redo" button should be disabled.
a11y
Use Tab to cycle through the buttons.
Be able to use both Spacebar and Enter to interact with the page.


```js
import { useState } from 'react';

const OPERATIONS = {
  '/2': { type: 'divide', number: 2 },
  '-1': { type: 'decrement', number: 1 },
  '+1': { type: 'increment', number: 1 },
  x2: { type: 'multiply', number: 2 },
};

function performOperation(counter, operationLabel) {
  const operation = OPERATIONS[operationLabel];
  switch (operation.type) {
    case 'increment':
      return counter + operation.number;
    case 'decrement':
      return counter - operation.number;
    case 'multiply':
      return counter * operation.number;
    case 'divide':
      return counter / operation.number;
    default:
      return counter;
  }
}

function UndoableCounterHistory({ history }) {
  if (history.length === 0) {
    return null;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Operation</th>
          <th>Old</th>
          <th>New</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item, index) => (
          <tr key={index}>
            <td>{item.operation}</td>
            <td>{item.oldCounter}</td>
            <td>{item.newCounter}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function UndoableCounter() {
  const [counter, setCounter] = useState(0);
  const [history, setHistory] = useState([]);
  const [undoHistory, setUndoHistory] = useState([]);

  function onReset() {
    setCounter(0);
    setHistory([]);
    setUndoHistory([]);
  }

  function onUndo() {
    const [latest, ...earlierHistory] = history;
    setCounter(latest.oldCounter);
    setUndoHistory([latest, ...undoHistory]);
    setHistory(earlierHistory);
  }

  function onRedo() {
    const [latest, ...earlierUndoHistory] = undoHistory;
    setCounter(latest.newCounter);
    setUndoHistory(earlierUndoHistory);
    setHistory([latest, ...history]);
  }

  function onClickOperation(operation) {
    const oldCounter = counter;
    const newCounter = performOperation(counter, operation);
    setCounter(newCounter);
    setHistory([
      { operation, oldCounter, newCounter },
      ...history,
    ]);
    setUndoHistory([]);
  }

  return (
    <div>
      <div className="row">
        <button
          disabled={history.length === 0}
          onClick={onUndo}>
          Undo
        </button>
        <button
          disabled={undoHistory.length === 0}
          onClick={onRedo}>
          Redo
        </button>
        <button onClick={onReset}>Reset</button>
      </div>
      <hr />
      <div className="row">
        <button onClick={() => onClickOperation('/2')}>
          /2
        </button>
        <button onClick={() => onClickOperation('-1')}>
          -1
        </button>
        <div className="counter">{counter}</div>
        <button onClick={() => onClickOperation('+1')}>
          +1
        </button>
        <button onClick={() => onClickOperation('x2')}>
          x2
        </button>
      </div>
      <hr />
      <div className="row">
        <UndoableCounterHistory history={history} />
      </div>
    </div>
  );
}

```