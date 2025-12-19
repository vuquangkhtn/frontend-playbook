Solution
We'll build on top of Tabs' solution. Other than adding the right ARIA roles and states, which is straightforward, we also need to link the tab items with the corresponding tabpanels. Hence we create two functions, getTabListItemId and getTabPanelId to do this.

getTabListItemId generates a unique ID string to use as the value of the id attribute of tab items. This ID will be used as the value of the aria-labelledby attribute of the corresponding tabpanel.
getTabPanelId generates a unique ID string to use as the value of the id attribute of tabpanels. This ID will be used as the value of the aria-controls attribute of the corresponding tab item.
Since there can be multiple Tabs component instances on the page and we cannot guarantee that the tab item values will be globally unique, each Tabs instance needs to have a unique identifier. The useId React hook can be used to generate unique ID for each Tabs instance. The final ID string will be a concatenation of the Tabs instance's ID, the item value, and whether it's a tab item or a tabpanel.

Test cases
Inspect the rendered HTML to see that the right attributes were added to the DOM.
You can go a step further by using accessibility testing tools like axe to validate the a11y of the elements.
Accessibility (A11y)
We're not totally done with accessibility yet, there's still keyboard support to add, which will be covered in Tabs III.

Resources
Tabs Patterns | ARIA Authoring Practices Guide
Tabs – Radix Primitives
Tabs – React Aria
Tabs - Headless UI
Tab – Ariakit
Tabs | Reach UI

App.js
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

style.css
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
import { useId, useState } from 'react';

function getTabListItemId(tabsId, value) {
  return tabsId + '-tab-' + value;
}

function getTabPanelId(tabsId, value) {
  return tabsId + '-tabpanel-' + value;
}

export default function Tabs({ defaultValue, items }) {
  const tabsId = useId();
  const [value, setValue] = useState(
    defaultValue ?? items[0].value,
  );

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {items.map(({ label, value: itemValue }) => {
          const isActiveValue = itemValue === value;

          return (
            <button
              id={getTabListItemId(tabsId, itemValue)}
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
              }}
              role="tab"
              aria-controls={getTabPanelId(
                tabsId,
                itemValue,
              )}
              aria-selected={isActiveValue}>
              {label}
            </button>
          );
        })}
      </div>
      <div>
        {items.map(({ panel, value: itemValue }) => (
          <div
            key={itemValue}
            id={getTabPanelId(tabsId, itemValue)}
            aria-labelledby={getTabListItemId(
              tabsId,
              itemValue,
            )}
            role="tabpanel"
            hidden={itemValue !== value}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}

```