Solution
We'll build on top of Modal Dialog's solution. Other than adding the right ARIA roles and states, which is straightforward, we also need to link the title and content elements.

Linking the title and content to the modal dialog element is done via the aria-labelledby attribute and aria-describedby attribute respectively, by using the id values of the title and content as the aria- values.

Since there can be multiple modal dialog component instances on the page and ids are meant to be unique within the page, we cannot hardcode values for these attributes.

We can expose props for these id values and let it be the user's job to ensure that the values are unique. However, these id values are rarely used beyond fulfilling a11y requirements and it is not meaningful work for users. We should generate the IDs for users if possible.

We can generate two IDs – one for the title and another for the content, and use them as such in the markup:


<div aria-labelledby={titleId} aria-describedby={contentId}>
  <h1 id={titleId}>...</h1>
  <div id={contentId}>...</div>
</div>
In frameworks like React, the useId hook can be used to generate IDs that will be unique per modal dialog instance.

Splitting the component
Since hooks cannot be called conditionally and there's no need to call the useId hook when the modal dialog is not open, the component can be split into two with the bulk of the component within ModalDialogImpl so that the useId hooks are not called unnecessarily.

Test cases
Inspect the rendered HTML to see that the right attributes were added to the DOM.
You can go a step further by using accessibility testing tools like axe to validate the a11y of the elements.
Accessibility
We're not totally done with accessibility yet, there's still other behavior to add, such as keyboard support and focus management which will be covered in Modal Dialog III and Modal Dialog IV respectively.

Resources
Dialog (Modal) | ARIA Authoring Practices Guide
Dialog – Radix Primitives
Dialog | Reach UI
Dialog - Headless UI



```js
import { ComponentProps, useId } from 'react';
import { createPortal } from 'react-dom';

export default function ModalDialog({
  open = false,
  ...props
}: Readonly<{
  open?: boolean;
}> &
  ComponentProps<typeof ModalDialogImpl>) {
  if (!open) {
    return null;
  }

  return <ModalDialogImpl {...props} />;
}

function ModalDialogImpl({
  children,
  title,
  onClose,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}>) {
  const titleId = useId();
  const contentId = useId();

  return createPortal(
    <div className="modal-overlay">
      <div
        aria-describedby={contentId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal"
        role="dialog">
        <h1 className="modal-title" id={titleId}>
          {title}
        </h1>
        <div id={contentId}>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}

```

