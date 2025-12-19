Solution
The following explanation assumes you have a good understanding of Tabs II's React solution.

Listening for Keyboard Events
Firstly, it's crucial to know the difference between the keypress vs the keydown event. The keypress event is only fired when a key that produces a character value is pressed down. This would exclude the Left, Right, Home, and End keys which are requirements of this question. The keypress event is also deprecated and shouldn't be used. For these reasons, we should be using the keydown event. We'll add the onKeyDown prop to <div role="tablist">.

To know which key is being pressed, we can use event.key or event.code on the event passed to onKeyDown's callback. There are some differences between event.key vs event.code but for the purposes of this question it doesn't make a difference and can be ignored. We'll just use event.code.

Responding to Keyboard Events
Next we read the event.code property and respond with custom code depending on its value. A switch case is suitable for such a situation:

ArrowLeft: Activate the previous tab or "wrap around" to the last one if the focus was on the first. We first find the index of the active tab item, decrease it by one, and use modulo arithmetic to elegantly handle the "wrap around".
ArrowRight: Activate the next tab or "wrap around" to the first one if the focus was on the last. We first find the index of the active tab item, increase it by one, and use modulo arithmetic to elegantly handle the "wrap around".
Home: Activate the first tab.
End: Activate the last tab.
When a new tab is activated, it should come into focus. Since we know the id of each tab element, we can imperatively call .focus() on it by using document.getElementById() with the desired tab element id. This approach is non-idiomatic by usual React standards but is acceptable during interviews.

Tab-ing Behavior
In Tabs II, all our tabs were focusable and you could jump to each tab via the Tab key. However, that behavior is non-standard according to the WAI-ARIA Tabs specification, which states that only the active tab should be focusable. We can achieve this by making the non-active tabs non-focusable by adding the tabIndex={-1} attribute to them. On a related note, we should also make the <div role="tabpanel"> focusable by adding tabIndex={0}.

Test cases
We've intentionally added some focusable elements above and below the Tabs component to make it easier to check the focus order.

Switching tabs
Left key should activate the previous tab element and activate the last tab element if the first tab was active.
Right key should activate the next tab element and activate the first tab element if the last tab was active.
Home key should activate the first tab element.
End key should activate the last tab element.
Focus behavior
Click on the topmost button. After that, hitting Tab should focus on the active tab element, which is not necessarily the first tab.
Click on the bottommost button. After that, hitting Shift + Tab should focus on the tabpanel, not any of the tabs.
When switching between the tabs using the keyboard, the new tab should be focused. Hitting Tab again should shift focus to the tabpanel instead of any other tabs.
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
      <button>A focusable element</button>
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
      <button>Some other focusable element</button>
    </div>
  );
}

```

style.css
```js
body {
  font-family: sans-serif;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

tab.js
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

  function setValueViaIndex(index) {
    const newValue = items[index].value;
    setValue(newValue);
    document
      .getElementById(getTabListItemId(tabsId, newValue))
      .focus();
  }

  return (
    <div className="tabs">
      <div
        className="tabs-list"
        role="tablist"
        onKeyDown={(event) => {
          switch (event.code) {
            case 'ArrowLeft': {
              const index = items.findIndex(
                ({ value: itemValue }) =>
                  itemValue === value,
              );
              setValueViaIndex(
                // Use modulo to wrap around to the end if necessary.
                (index - 1 + items.length) % items.length,
              );
              break;
            }
            case 'ArrowRight': {
              const index = items.findIndex(
                ({ value: itemValue }) =>
                  itemValue === value,
              );
              // Use modulo to wrap around to the start if necessary.
              setValueViaIndex((index + 1) % items.length);
              break;
            }
            case 'Home': {
              // Set the first item ias the active item.
              setValueViaIndex(0);
              break;
            }
            case 'End': {
              // Set the last item ias the active item.
              setValueViaIndex(items.length - 1);
              break;
            }
            default:
              break;
          }
        }}>
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
              tabIndex={isActiveValue ? 0 : -1}
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
            tabIndex={0}
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