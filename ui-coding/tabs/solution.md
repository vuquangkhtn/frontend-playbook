Solution
Implementing a basic (not fully accessible) Tabs component in React is quite simple due to the fact that only one state value is needed, the currently active tab item. React also helps to keep the state and the UI in sync, which is more troublesome to do so in Vanilla JavaScript.

For simplicity sake, we'll create an uncontrolled Tabs component where the state is managed within the Tabs component. During interviews, do clarify with your interviewer if they want you to implement a controlled or uncontrolled component.

Props (API Design)
Part of the complexity of building a component is designing the API for it. In the case of React, it would be the props of the component. At the bare minimum, we will need the following props:

items: A list of item objects. Each item is an object with the fields:
value: A unique identifier for the tab item.
label: The text label to show in the tab item.
panel: The contents to show in the tab panel when the item is active.
defaultValue: The default tab item/panel to show. In case the defaultValue is not provided, we'll use the first item as the value. This is assuming that items is non-empty.
For controlled components, there will be a value and onChange props instead of a defaultValue prop.

Test cases
All the provided items should be displayed.
The default active item should be reflected correctly.
Selecting the tab items updates the tabpanel's contents with the active tabs's panel details.
Test that you are able to initialize multiple instances of the component, each with independent states.
Accessibility
Accessibility is an important factor for making good Tabs components. The ARIA Authoring Practices Guide for Tabs has a long list of guidelines for the ARIA roles, states, and properties to add to the various elements of a Tab. Tabs II and Tabs III will focus on improving the accessibility of Tabs component.

Resources
Tabs Patterns | ARIA Authoring Practices Guide
Tabs – Radix Primitives
Tabs – React Aria
Tabs - Headless UI
Tab – Ariakit
Tabs | Reach UI


```js
import Tabs from './Tabs';

export default function App() {
  return (
    <div className="wrapper">
      <Tabs
        items={[
          {
            value: 'html',
            label: 'HTML',
            panel:
              'The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.',
          },
          {
            value: 'css',
            label: 'CSS',
            panel:
              'Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.',
          },
          {
            value: 'javascript',
            label: 'JavaScript',
            panel:
              'JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.',
          },
        ]}
      />
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
}

.tabs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tabs-list {
  display: flex;
  gap: 6px;
}

.tabs-list-item {
  --active-color: blueviolet;

  background: none;
  border: 1px solid #000;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 10px;
}

.tabs-list-item:hover {
  border-color: var(--active-color);
  color: var(--active-color);
}

.tabs-list-item--active,
.tabs-list-item--active:hover {
  border-color: var(--active-color);
  background-color: var(--active-color);
  color: #fff;
}

```

Tab.js
```js
import { useState } from 'react';

export default function Tabs({ defaultValue, items }) {
  const [value, setValue] = useState(
    defaultValue ?? items[0].value,
  );

  return (
    <div className="tabs">
      <div className="tabs-list">
        {items.map(({ label, value: itemValue }) => {
          const isActiveValue = itemValue === value;

          return (
            <button
              key={itemValue}
              type="button"
              className={[
                'tabs-list-item',
                isActiveValue && 'tabs-list-item--active',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                setValue(itemValue);
              }}>
              {label}
            </button>
          );
        })}
      </div>
      <div>
        {items.map(({ panel, value: itemValue }) => (
          <div key={itemValue} hidden={itemValue !== value}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}

```