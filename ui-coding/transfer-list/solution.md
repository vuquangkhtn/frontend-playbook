Solution
Overall, the trickiest part of this question is to select the right data structure to use considering the operations we need to do on the data.

State
The intuitive thing to do would be to use an arrays for each list since arrays are the most natural data structure to represent a list of ordered items. However, marking items as checked/unchecked and removing items from the list will require O(N) time if an array is used.

Since the items are unique, a Map data structure is feasible as it gives us O(1) access, insertion, and removal of items. Moreover, JavaScript Maps are ordered, so the items order can be preserved. The key will be the item name and value is a boolean indicating whether the item is selected/checked. We only need two JavaScript Maps in total, one for each list.

Rendering
There's nothing particularly special about rendering the UI for the transfer lists. Flexboxes can help us render the three columns. Since the UI and the functionality of columns are identical, we can define a component ItemList that takes in a list of items and a setter callback to manipulate the list.

To determine if the buttons should be disabled:

Transfer all buttons: check if the source list is empty.
Transfer selected buttons: write a helper function hasNoSelectedItems, to count if the source list has any selected items, and disable the transfer buttons.
Transferring Items
We can write a function per desired transfer functionality that accepts source/destination lists and their respective setters. These functions reduce code duplication and can be easily reused if there are more than two columns in future.

transferAllItems: combine the items from source and destination lists to create a new destination list.
transferSelectedItems: move the selected items from source to destination lists by removing them from the source list and adding them to the destination list.
Test cases
Selecting items
Items can be checked/unchecked.
"Transfer selected items" buttons
Button is disabled when no items are selected in the source list.
Upon clicking, selected items are transferred from the source list to the bottom of the destination list.
"Transferring all items" buttons
Button is disabled when the source list is empty.
Upon clicking, all items from the source list are transferred to the bottom of the destination list.
Accessibility
<input type="checkbox"> are paired with <label>s. Clicking on labels also selects/deselect the item.
Since the <button>s do not have a visible label, use aria-labels to indicate their purpose. As a result, make the button contents hidden from screen readers via aria-hidden="true".
All required functionality should be achievable just by using the keyboard.


```js
import { useId, useState } from 'react';

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

function ItemList({ items, setItems }) {
  return (
    <div className="transfer-list__section">
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

// Determine if the list has no selected items.
function hasNoSelectedItems(items) {
  return (
    Array.from(items.values()).filter((val) => Boolean(val))
      .length === 0
  );
}

// Transfer all items from a source list to a destination list.
function transferAllItems(
  itemsSrc,
  setItemsSrc,
  itemsDst,
  setItemsDst,
) {
  setItemsDst(new Map([...itemsDst, ...itemsSrc]));
  setItemsSrc(new Map());
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
          aria-label="Transfer all items to left list"
          disabled={itemsRight.size === 0}
          onClick={() => {
            transferAllItems(
              itemsRight,
              setItemsRight,
              itemsLeft,
              setItemsLeft,
            );
          }}>
          <span aria-hidden={true}>&lt;&lt;</span>
        </button>
        <button
          aria-label="Transfer selected items to left list"
          disabled={hasNoSelectedItems(itemsRight)}
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
          disabled={hasNoSelectedItems(itemsLeft)}
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
        <button
          aria-label="Transfer all items to right list"
          disabled={itemsLeft.size === 0}
          onClick={() => {
            transferAllItems(
              itemsLeft,
              setItemsLeft,
              itemsRight,
              setItemsRight,
            );
          }}>
          <span aria-hidden={true}>&gt;&gt;</span>
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