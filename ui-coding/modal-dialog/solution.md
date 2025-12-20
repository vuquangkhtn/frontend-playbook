Solution
Modal dialogs can be implemented as both controlled and non-controlled components (the dialog controls its own closed state), but it is more commonly used as controlled components.

Since the modal dialog component does not contain that many elements, we can keep things simple and define a single ModalDialog component.

Props
The ModalDialog component takes the following props:

title: String to be shown at the top of the modal dialog.
children: The content to be displayed in the modal. It can either be a custom prop or children prop, but the latter is a more common way to render contents.
open: A boolean to control the visibility of the modal (defaults to false). If it is false, nothing is rendered to the DOM.
onClose: Callback triggered when the modal dialog is meant to be closed.
State
Since the modal dialog component is a controlled component, given the current basic requirements there's no need for any state within the modal. However, the modal dialog is controlled externally and state is required outside to toggle the visibility of the modal.

Rendering and layout
The key elements for the modal dialog are the (1) overlay, (2) modal dialog, (3) modal title:

Overlay: The overlay is meant to cover the whole screen. A combination of position: fixed and inset: 0 will render the element to cover the entire screen. Set a semi-transparent color for the background, e.g. rgba(0, 0, 0, 0.7).
Modal dialog: The modal dialog can be placed within the overlay element. Centering the modal dialog on the screen is thus done by the overlay, which sets the contents to be centered within itself. There are multiple ways to achieve centering and the simplest modern way is to use display: flex; align-items: center; justify-content: center styles.
Modal title: Modal dialogs represent a new context separate from the main page content. Using <h1> establishes the modal's content as its own document outline, which clearly indicates the primary heading of this new context to screen readers.
Breaking out of DOM hierarchy
Rendering modal dialogs is tricky due to the fact that modals are being displayed over the page and does not follow the normal flow of page elements.

Hence it is mandatory to render the modal outside of the DOM hierarchy of the parents. Otherwise, if the parents contain styling that clips its contents, the modal contents might not be fully visible. Here's an example from the React docs demonstrating the issue.

In React, rendering outside the DOM hierarchy of the parent component can be achieved using React Portals. Other common use cases of portals include tooltips, dropdown menus, popovers.

Test cases
Functionality:
Opening and closing:
Verify the modal opens when triggered
Ensure the modal closes when the close button is clicked
Test any other methods provided to open/close the modal (if applicable)
Content customization:
Test passing different title strings
Verify various types of content in the body (text, HTML, React components)
Ensure the close button is always present
Overlay:
Confirm the presence of a semi-transparent background overlay
Verify the overlay covers the entire viewport
Layout and positioning:
Check if the modal is centered horizontally on different screen sizes
Verify vertical centering on various screen heights
Test centering with different modal content sizes
Accessibility
There are a lot of a11y considerations for modal dialogs, possibly too many to implement during interviews.

For your knowledge, here are some of the more important ones:

ARIA attributes:
Use role="dialog" on the modal container.
Add aria-modal="true" to indicate that the modal is blocking interaction with the page content.
Use aria-labelledby to associate the modal's title with the dialog.
Use aria-describedby if there's additional descriptive text.
Keyboard navigation:
Ensure the modal can be opened and closed using keyboard controls.
Provide a way to close the modal using the Esc key.
Focus management:
Set focus to the first focusable element in the modal when it opens.
Trap focus within the modal when it's open, preventing users from tabbing outside the modal.
Return focus to the triggering element when the modal closes.
The subsequent questions will involve implementing these a11y considerations:

Modal Dialog II: Adding ARIA attributes.
Modal Dialog III: Adding keyboard navigation.
Modal Dialog IV: Adding focus management.

```js
import { createPortal } from 'react-dom';

export default function ModalDialog({
  children,
  open = false,
  title,
  onClose,
}: Readonly<{
  children: React.ReactNode;
  open?: boolean;
  title: string;
  onClose: () => void;
}>) {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h1 className="modal-title">{title}</h1>
        <div>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}

```