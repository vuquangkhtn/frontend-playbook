Solution
The question can be split into two parts: (1) Rendering, (2) State, and (3) Deactivation.

Rendering
Since we're required to render a 3x3 grid of cells, CSS Grid is literally the best tool for the job. We can definitely use other approaches but CSS Grid is a forward-looking technology we should master. If you're unfamiliar with CSS Grids, Grid Garden is an interactive game for you to learn about it.

The following CSS will render a 3x3 grid with 20px of padding and spacing between the cells.


.grid {
  --spacing: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: var(--spacing);
  gap: var(--spacing);
}
To create cells that are perfect squares, we can set the height of the cells to be 0 and make one of the vertical paddings 100% (padding-bottom: 100%), which sets the total height of the cell to be the same as the width.

Remember that we have an odd requirement of the middle cell to be omitted? We can create a declarative and flexible rendering approach where we define a 2D array of 1s and 0s (config) and the grid will be rendered according to the configuration. Because of this, we have to define the grid-template-columns as an inline style that uses the config's number of columns when rendering the CSS grid.

Activating/deactivating the cells can be done by adding a new class for the activated state which adds background-color: green and toggling that class.

State
Only one state is needed, order, which is the order that the cells were clicked. Assuming we flatten the 2D config array into a single dimension, each cell will correspond to an index. We can store this list of indices in the order array, adding to it when a cell is clicked.

Whether the cell is lit up can be determined by whether the cell's index exists in the order array.

Deactivation
Deactivation happens when all the cells have been activated. We know this has happened by comparing the number of items in the order array vs the number of 1s in the config; when they are the same, we can start deactivating the cells.

We can use setInterval with a duration of 300ms and remove the last value of the order array by using order.pop() each time the interval callback is invoked. Note that we need to use the callback form of setOrder, which receives the updated order value as the parameter. This is necessary because the setInterval callback's closure will be referencing a stale version of order and the callback form of setOrder will provide us with the most updated order value.

In idiomatic React, we avoid mutation as much as possible, so we make a copy of the order array first before calling pop() on it to remove the last item.

When the order array is empty, we can clear the interval timer.

Test cases
Click on a cell, it should turn green.
Clicking on cells that are already green should not have any effect.
After clicking all 8 cells, the cells should be deactivated in reverse.

Accessibility
While a11y is not the focus of this question, there are some things we can do to improve both the a11y and user experience of this app.

Use <button>s to render the grid cells so that they are focusable via Tab and activated via Space and Enter. With this, we can activate the grid entirely using the keyboard.
All buttons should have labels, so we add aria-label with the index to describe the cell. The label can be further improved by calling out the column and row numbers instead.
It also helps to disable the button for activated cells and while deactivating, so that the cells can no longer be focused or respond to clicks.
Resources
[Grid Garden - A game for learning CSS grid](https://cssgridgarden.com/)

```js
import { useState } from 'react';

// Make it easy to visualize the board.
// Customize the board rendering just by changing
// this 2D array. Note that all rows have to
// contain the same number of elements in order
// for the grid to render properly.
const config = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

function Cell({ filled, label, onClick, isDisabled }) {
  // Use <button> so that can use the keyboard to move between
  // cells with Tab and activate them with Enter/Space.
  return (
    <button
      aria-label={label}
      type="button"
      className={['cell', filled && 'cell--activated']
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      // disabled prevents cells from responding to clicks.
      disabled={isDisabled}
    />
  );
}

export default function App() {
  const [order, setOrder] = useState([]);
  const [isDeactivating, setIsDeactivating] =
    useState(false);

  // If necessary, disable clicking during deactivation is playing.
  function deactivateCells() {
    setIsDeactivating(true);
    const timer = setInterval(() => {
      // Use the callback version of setOrder to ensure
      // we are reading the most updated order value.
      setOrder((origOrder) => {
        // Make a clone to avoid mutation of the orders array.
        const newOrder = origOrder.slice();
        newOrder.pop();

        if (newOrder.length === 0) {
          clearInterval(timer);
          setIsDeactivating(false);
        }

        return newOrder;
      });
    }, 300);
  }

  return (
    <div className="wrapper">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${config[0].length}, 1fr)`,
        }}>
        {config.flat(1).map((value, index) =>
          value ? (
            <Cell
              key={index}
              label={`Cell ${index}`}
              // Lookup efficiency can be improved by using
              // a separate set/dict but that's overkill given
              // the low number of cells.
              filled={order.includes(index)}
              isDisabled={
                order.includes(index) || isDeactivating
              }
              onClick={() => {
                // Make a clone to avoid mutation of the orders array.
                const newOrder = [...order, index];
                setOrder(newOrder);

                // All the cells have been activated, we can proceed
                // to deactivate them one by one.
                if (
                  newOrder.length ===
                  config.flat(1).filter(Boolean).length
                ) {
                  deactivateCells();
                }
              }}
            />
          ) : (
            <span key={index} />
          ),
        )}
      </div>
      {/* Helper to show the state */}
      <pre>order array: {order.join(', ')}</pre>
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.grid {
  --spacing: 20px;
  display: grid;
  max-width: 300px;
  width: 100%;
  padding: var(--spacing);
  gap: var(--spacing);
  border: 1px solid #000;
}

.cell {
  background-color: transparent;
  border: 1px solid #000;
  height: 0;
  /* Make height and width equal */
  padding-bottom: 100%;
}

.cell--activated {
  background-color: green;
}

```