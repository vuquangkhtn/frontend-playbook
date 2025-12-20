Solution
The following explanation assumes you have a good understanding of Transfer List's React solution.

State
The state structure remains the same and the choice of Map is flexible enough to handle the new use case of adding items to the list.

Rendering
The main additions in this question are:

Input form
We'll wrap the <input> in a <form> for built-in keyboard handling, a11y, and UX.

Bulk Selection Checkbox
Did you know that an HTML checkbox actually has 3 states? They are checked, unchecked, and indeterminate. Indeterminate state is not commonly used and cannot be set via HTML attributes. Hence we need to obtain a reference to the checkbox instance and do checkboxInputElement.indeterminate = true. This can be done in React via the useRef hook.

We can write a new function called determineListSelectionState that accepts the items and determine the selection state of the list, whether no items are selected, some items are selected, or all items are selected. With this selection. With this state, we can render the appropriate appearance for the bulk selection checkbox. This state is also useful for determining what happens when the bulk selection checkbox is clicked/triggered. We can create a new function called setAllItemsSelectionState to return a new set of list items which are set to a specific selection state.

Test cases
Adding items
New items can be added to their respective lists.
New items are added to the bottom of the lists.
Selecting items
Items can be checked/unchecked.
"Bulk selection" checkbox
Shows empty/indeterminate/checked when there are no/some/all items checked respectively.
Clicking on it unselects / selects all the items depending on the selection state of the items.
Checkbox is disabled when there are no items in the list.
Selection counts and total counts are reflected correctly.
"Transfer selected items" buttons
Button is disabled when no items are selected in the source list.
Upon clicking, selected items are transferred from the source list to the bottom of the destination list.
Accessibility
Use of <form> submit for adding new items to the list.
<input type="checkbox"> are paired with <label>s. Clicking on labels also selects/deselect the item.
Since the <button>s do not have a visible label, use aria-labels to indicate their purpose. As a result, make the button contents hidden from screen readers via aria-hidden="true".
All required functionality should be achievable just by using the keyboard.

User Experience
To ensure a good user experience, we can implement the following:

Disallow non-empty items to be added to the list.
Input stays focused after an item has been added.

Try out the solution
Files

Open files in workspace
index.html
App.js
index.js
styles.css

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```js
import { useEffect, useId, useRef, useState } from 'react';

function CheckboxItem({ onChange, label, checked }) {
  // Let React generate a unique ID for each item so as to maximize
  // reusability of the component.
  const id = useId();

  return (
    <div className="transfer-list__section__items__item">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function BulkSelectionCheckbox({
  disabled,
  onChange,
  state,
  selectedCount,
  totalCount,
}) {
  const ref = useRef();
  const bulkSelectionId = useId();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    switch (state) {
      case 'none':
        setChecked(false);
        ref.current.indeterminate = false;
        break;
      case 'partial':
        setChecked(false);
        ref.current.indeterminate = true;
        break;
      case 'all':
        setChecked(true);
        ref.current.indeterminate = false;
        break;
    }
  }, [state]);

  return (
    <div className="transfer-list__section__items__item">
      <input
        ref={ref}
        disabled={disabled}
        type="checkbox"
        id={bulkSelectionId}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={bulkSelectionId}>
        {selectedCount} / {totalCount} Selected
      </label>
    </div>
  );
}

function ItemList({ items, setItems }) {
  const [newItem, setNewItem] = useState('');
  const listState = determineListSelectionState(items);

  return (
    <div className="transfer-list__section">
      <form
        onSubmit={(event) => {
          // Prevent page reload on form submission.
          event.preventDefault();

          // Trim value.
          const newItemValue = newItem.trim();

          // No-op if input is empty.
          if (newItemValue === '') {
            return;
          }

          // Add new item to list.
          const newItems = new Map(items);
          newItems.set(newItem, false);
          setItems(newItems);

          setNewItem('');
        }}>
        <input
          type="text"
          value={newItem}
          onChange={(event) => {
            setNewItem(event.target.value);
          }}
        />
      </form>
      <hr />
      <BulkSelectionCheckbox
        selectedCount={countSelectedItems(items)}
        totalCount={items.size}
        state={listState}
        disabled={items.size === 0}
        onChange={() => {
          switch (listState) {
            case 'none':
            case 'partial':
              setItems(
                setAllItemsSelectionState(items, true),
              );
              break;
            case 'all':
              setItems(
                setAllItemsSelectionState(items, false),
              );
              break;
          }
        }}
      />
      <hr />
      <ul className="transfer-list__section__items">
        {Array.from(items.entries()).map(
          ([label, checked]) => (
            <li key={label}>
              <CheckboxItem
                label={label}
                checked={checked}
                onChange={() => {
                  const newItems = new Map(items);
                  newItems.set(label, !items.get(label));
                  setItems(newItems);
                }}
              />
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

const DEFAULT_ITEMS_LEFT = [
  'HTML',
  'JavaScript',
  'CSS',
  'TypeScript',
];
const DEFAULT_ITEMS_RIGHT = [
  'React',
  'Angular',
  'Vue',
  'Svelte',
];

// Convert the default array of items into a map with the item
// name as a key and the value as a boolean.
function generateItemsMap(items) {
  return new Map(items.map((label) => [label, false]));
}

function countSelectedItems(items) {
  return Array.from(items.values()).filter((val) =>
    Boolean(val),
  ).length;
}

// Determine the selected state of the list.
function determineListSelectionState(items) {
  const selectedItems = countSelectedItems(items);
  const totalItems = items.size;

  // Also handles the case where the list is empty.
  if (selectedItems === 0) {
    return 'none';
  }

  if (selectedItems < totalItems) {
    return 'partial';
  }

  return 'all';
}

// Transfer all items from a source list to a destination list.
function setAllItemsSelectionState(items, newState) {
  const newItems = new Map(items);

  Array.from(newItems.keys()).forEach((key) => {
    newItems.set(key, newState);
  });

  return newItems;
}

// Transfer selected items from a source list to a destination list.
function transferSelectedItems(
  itemsSrc,
  setItemsSrc,
  itemsDst,
  setItemsDst,
) {
  const newItemsSrc = new Map(itemsSrc);
  const newItemsDst = new Map(itemsDst);

  // Remove selected items from source list and add to the destination list.
  itemsSrc.forEach((value, key) => {
    if (!value) {
      return;
    }

    newItemsDst.set(key, value);
    newItemsSrc.delete(key);
  });
  setItemsSrc(newItemsSrc);
  setItemsDst(newItemsDst);
}

export default function App() {
  const [itemsLeft, setItemsLeft] = useState(
    generateItemsMap(DEFAULT_ITEMS_LEFT),
  );
  const [itemsRight, setItemsRight] = useState(
    generateItemsMap(DEFAULT_ITEMS_RIGHT),
  );

  return (
    <div className="transfer-list">
      <ItemList items={itemsLeft} setItems={setItemsLeft} />
      <div className="transfer-list__actions">
        <button
          aria-label="Transfer selected items to left list"
          disabled={
            determineListSelectionState(itemsRight) ===
            'none'
          }
          onClick={() => {
            transferSelectedItems(
              itemsRight,
              setItemsRight,
              itemsLeft,
              setItemsLeft,
            );
          }}>
          <span aria-hidden={true}>&lt;</span>
        </button>
        <button
          aria-label="Transfer selected items to right list"
          disabled={
            determineListSelectionState(itemsLeft) ===
            'none'
          }
          onClick={() => {
            transferSelectedItems(
              itemsLeft,
              setItemsLeft,
              itemsRight,
              setItemsRight,
            );
          }}>
          <span aria-hidden={true}>&gt;</span>
        </button>
      </div>
      <ItemList
        items={itemsRight}
        setItems={setItemsRight}
      />
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

.transfer-list {
  border: 1px solid #ccc;
  display: flex;
  max-width: 768px;
  margin: 0 auto;
}

.transfer-list__section {
  padding: 20px;
  overflow: hidden;
  flex-grow: 1;
}

.transfer-list__section__items {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}

.transfer-list__section__items__item {
  display: flex;
  gap: 8px;
}

.transfer-list__actions {
  border-color: #ccc;
  border-width: 0 1px 0 1px;
  border-style: solid;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20px;
  row-gap: 12px;
}

```