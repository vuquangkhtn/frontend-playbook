Solution
The solution can be broken down into two parts: (1) Rendering and (2) State updates

Rendering
As you can tell, the data provided is recursive in nature and can be of any depth. Hence our component must also support rendering nested checkboxes of arbitrary depth via recursion.

In terms of front end components, recursion means that the components can be rendering itself, or render a component that renders itself. It's important to design the recursive components well to allow for reusability.

The most intuitive way to render recursive hierarchical structures is using <ul> and <li>. <ul>s can be nested within <li>s:


<ul>
  <li>
    <div><input type="checkbox"><label>Electronics</div>
    <ul>
      <li><div><input type="checkbox"><label>Mobile phones</div></li>
      <li><div><input type="checkbox"><label>Laptop</div></li>
    </ul>
  </li>
  <li>
    <div><div><input type="checkbox"><label>Book</div></div>
  </li>
</ul>
As long as the <ul>s are rendered with an indentation (e.g. padding-left), nested <ul>s will automatically be indented by the right amount – a summation of its own padding and ancestors' paddings.

We can create a CheckboxList component, that accepts an array of CheckboxItems and renders the list of <input type="checkbox">s. Depending on whether the CheckboxItem has children, it will recursively render the children using CheckboxList.

Indeterminate checkboxes
Did you know that besides the checked and unchecked states, <input type="checkbox> have an indeterminate state? Indeterminate state is often used to represent a "partially checked" state.

By default, browsers render checkboxes in the indeterminate state using a dash/hyphen within the box. One quirk about indeterminate checkboxes is that there's no HTML attribute for it, and it can only be set using JavaScript:


const $checkboxElement = document.querySelector(
  'input[type="checkbox"]',
);
$checkboxElement.indeterminate = true;
We can create a component CheckboxInput that abstracts this logic away. The component will accept a checked prop that is either a boolean value or the string indeterminate.

When an checkbox input element's indeterminate property is true, it does not matter what the value of checked is, the indeterminate dashed state will be displayed. This begs the question, what should the value of checked be when a checkbox is set to indeterminate? When a user clicks on an indeterminate checkbox, it typically becomes checked. So it's better to make the checkbox's checked property to be false when it is indeterminate, such that clicking on indeterminate checkboxes will turn it into checked.

State updates
After covering the layout and structure, the next step will be to manage the state updates of the checkboxes.

When a checkbox is clicked/triggered, the following operations occur:

Update checkbox state.
Update the checkbox descendants' state.
Update the checkbox's ancestors' state.
Let's go through each operation in detail:

1. Update checkbox state
The checkbox's state is updated, depending on its current state:

Unchecked: It will become checked.
Checked: It will become unchecked.
Indeterminate: It will become checked.
2. Update descendants' state
The checkbox's descendants are updated recursively to be of the same state, either checked or unchecked.

Because parents need to update the descendants' state, potentially across the entire tree if the top-most checkbox is triggered, the overall state should be lifted up and housed within the root component as the source of truth, instead of having each checkbox manage its own state.

Step 1 and 2 is implemented within the updateCheckboxAndDescendants function, which takes in a checkbox item, the new value, and recursively sets itself + all descendants to be that new value.

3. Update ancestors' state
The checkbox's ancestors are updated based on the modified checkbox's new state. They could be updated to any of the possible states.

Ancestors need to inspect its direct children's checked state to determine its new state. It does not need to look at grandchildren and beyond, because a parent's state reflects the child's state. As long as the new state is updated in a bottom-up fashion (starting from the leaf nodes), parents only need to look at its direct children's state.

Step 3 is implemented as the resolveCheckboxStates function. It firstly resolves the descendants' states, whether they should be updated to true/false/indeterminate and work its way upwards, terminating at a top-level checkbox. Note that only checkboxes in the direct ancestry chain of the modified checkbox will be affected.

Putting it together
The root component will house the hierarchy and state of all the checkboxes. The default data is already in this format.

Each checkbox receives the minimal state needed for itself and its descendants.
State mutations are done at the root / top-level since it contains the source of truth.
The change/click handlers have to include the index of the current checkbox (position among its siblings). When the root component receives an update due to a checkbox somewhere in its tree being modified, it receives two arguments:

New checkbox state: A boolean value. This will never be indeterminate, because indeterminate state of a checkbox is a result of a user updating descendant checkboxes.
Indices array: An array of integers representing the positions of the checkboxes. E.g. [0, 1] means the second child of the first child starting from the root, aka the "Laptops". This is needed by the top-level component to trace which checkbox has been triggered.
In the root component, the state 

Test cases
Initial rendering:
Test that all checkboxes are rendered correctly according to the provided data structure.
Verify that the initial state of all checkboxes is unchecked.
Leaf node behavior:
Check a leaf node (e.g., "iPhone") and verify it becomes checked.
Uncheck a leaf node and verify it becomes unchecked.
Ancestor/descendant state changes:
Descendant change propagation:
Check a parent (e.g., "Laptops") and verify all its descendants become checked.
Uncheck a parent and verify all its descendants become unchecked.
Ancestor change propagation:
Check all children of a parent (e.g., all under "Mobile phones") and verify the parent becomes checked.
Uncheck one child and verify the parent becomes indeterminate.
Uncheck all children and verify the parent becomes unchecked.
Multi-level hierarchy:
Check a leaf node (e.g., "iPhone") and verify its parent ("Mobile phones") becomes indeterminate and grandparent ("Electronics") becomes indeterminate.
Check all leaf nodes under a mid-level parent (e.g., all under "Mobile phones") and verify the mid-level parent becomes checked and its parent ("Electronics") becomes indeterminate.
Indeterminate state:
Verify that when some but not all children are checked, the parent displays an indeterminate state.
Check if the indeterminate state is visually distinct from checked and unchecked states.
Check that indeterminate state can be propagated to the ancestors as well.
Root-level behavior:
Check all root-level items and verify they can be independently checked/unchecked.
Verify that checking/unchecking a root-level item with children affects all its descendants.
Edge cases:
Test with an empty data set to ensure the component handles it gracefully.
User interactions:
Verify that checkboxes can be toggled using both mouse clicks and keyboard interactions (space bar when focused).
Test tabbing through the checkboxes to ensure proper focus management.

App.tsx
```js
import Checkboxes from './Checkboxes';

export default function App() {
  const checkboxesData = [
    {
      id: 1,
      name: 'Electronics',
      checked: false,
      children: [
        {
          id: 2,
          name: 'Mobile phones',
          checked: false,
          children: [
            {
              id: 3,
              name: 'iPhone',
              checked: false,
            },
            {
              id: 4,
              name: 'Android',
              checked: false,
            },
          ],
        },
        {
          id: 5,
          name: 'Laptops',
          checked: false,
          children: [
            {
              id: 6,
              name: 'MacBook',
              checked: false,
            },
            {
              id: 7,
              name: 'Surface Pro',
              checked: false,
            },
          ],
        },
      ],
    },
    {
      id: 8,
      name: 'Books',
      checked: false,
      children: [
        {
          id: 9,
          name: 'Fiction',
          checked: false,
        },
        {
          id: 10,
          name: 'Non-fiction',
          checked: false,
        },
      ],
    },
    {
      id: 11,
      name: 'Toys',
      checked: false,
    },
  ];

  return (
    <div>
      <Checkboxes defaultCheckboxData={checkboxesData} />
    </div>
  );
}
```

```js
import { useState } from 'react';
import CheckboxList, { CheckboxItem } from './CheckboxList';

/**
 * Recursively set descendants of the modified checkbox
 * to the new value.
 */
function updateCheckboxAndDescendants(
  checkboxItem: CheckboxItem,
  checked: boolean,
) {
  checkboxItem.checked = checked;
  if (!checkboxItem.children) {
    return;
  }

  checkboxItem.children.forEach((childItem) =>
    updateCheckboxAndDescendants(childItem, checked),
  );
}

/**
 * Update checkbox states based on the modified checkbox's new state.
 * Only direct ancestors of the modified checkbox are affected.
 */
function resolveCheckboxStates(
  checkboxItem: CheckboxItem,
  indices: ReadonlyArray<number>,
) {
  if (indices.length > 0 && checkboxItem.children) {
    resolveCheckboxStates(
      checkboxItem.children[indices[0]],
      indices.slice(1),
    );
  }

  if (!checkboxItem.children) {
    return;
  }

  // Determine new checkbox state based on children.
  const checkedChildren = checkboxItem.children.reduce(
    (total, item) => total + Number(item.checked === true),
    0,
  );
  const uncheckedChildren = checkboxItem.children.reduce(
    (total, item) => total + Number(item.checked === false),
    0,
  );

  if (checkedChildren === checkboxItem.children.length) {
    checkboxItem.checked = true;
  } else if (
    uncheckedChildren === checkboxItem.children.length
  ) {
    checkboxItem.checked = false;
  } else {
    checkboxItem.checked = 'indeterminate';
  }
}

export default function Checkboxes({
  defaultCheckboxData,
}: Readonly<{
  defaultCheckboxData: ReadonlyArray<CheckboxItem>;
}>) {
  const [checkboxData, setCheckboxData] = useState(
    defaultCheckboxData,
  );

  return (
    <CheckboxList
      items={checkboxData}
      onCheck={(checked, indices) => {
        // Simple way to make a clone.
        const newCheckboxData = JSON.parse(
          JSON.stringify(checkboxData),
        );

        const nonFirstLevelIndices = indices.slice(1);
        const modifiedCheckboxItem =
          nonFirstLevelIndices.reduce(
            (modifiedItem, index) =>
              modifiedItem.children[index],
            newCheckboxData[indices[0]],
          );

        updateCheckboxAndDescendants(
          modifiedCheckboxItem,
          checked,
        );
        resolveCheckboxStates(
          newCheckboxData[indices[0]],
          nonFirstLevelIndices,
        );

        setCheckboxData(newCheckboxData);
      }}
    />
  );
}
```

```js
import {
  InputHTMLAttributes,
  useEffect,
  useId,
  useRef,
} from 'react';

export type CheckboxValue = boolean | 'indeterminate';

export default function CheckboxInput({
  checked,
  label,
  ...props
}: Readonly<{
  checked: CheckboxValue;
  label: string;
}> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'checked'>) {
  const id = useId();
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.indeterminate = checked === 'indeterminate';
  }, [checked]);

  return (
    <div className="checkbox">
      <input
        id={id}
        ref={ref}
        type="checkbox"
        checked={
          checked === true || checked === false
            ? checked
            : false
        }
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

```

```
import CheckboxInput, {
  CheckboxValue,
} from './CheckboxInput';

export interface CheckboxItem {
  id: number;
  name: string;
  checked: CheckboxValue;
  children?: CheckboxItem[];
}

export default function CheckboxList({
  items,
  onCheck,
}: Readonly<{
  items: ReadonlyArray<CheckboxItem>;
  onCheck: (
    value: boolean,
    indices: ReadonlyArray<number>,
  ) => void;
}>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id}>
          <div>
            <CheckboxInput
              checked={item.checked}
              label={item.name}
              onChange={(event) => {
                onCheck(event.target.checked, [index]);
              }}
            />
          </div>
          {item.children && item.children.length > 0 && (
            <CheckboxList
              items={item.children}
              onCheck={(newValue, indices) => {
                onCheck(newValue, [index, ...indices]);
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

```

```css
body {
  font-family: sans-serif;
}

ul {
  list-style: none;
  margin: 0;
  padding-left: 20px;
}

li {
  padding: 0;
}

.checkbox {
  display: inline-flex;
  line-height: 1.5;
  gap: 4px;
  font-size: 16px;
}

```