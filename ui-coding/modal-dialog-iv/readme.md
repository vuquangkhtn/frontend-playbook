Note: This is an advanced version of Modal Dialog III, you should complete that question first before attempting this question.

In Modal Dialog II and Modal Dialog III, we built a functional modal dialog component that has the necessary WAI-ARIA roles, states, and properties and the necessary interactions to close the dialog respectively.

For a completely accessible modal dialog component, we should also add the remaining keyboard interactions related to focus management.

Requirements
Implement the following keyboard interactions for dialogs:

Note: the term "tabbable element" refers to any element with a tabindex value of zero or greater.

Focus placements when dialog is opened/closed:
When a dialog opens, focus moves to the first element inside the dialog
When a dialog closes, focus returns to the element that invoked the dialog
Note: There are some nuances regarding which elements to focus on, which you can read on the ARIA Authoring Practices Guide but can be ignored for this question
Focus trapping:
The Tab key moves focus to the next tabbable element inside the dialog. If focus is on the last tabbable element inside the dialog, moves focus to the first tabbable element inside the dialog
The Shift + Tab keys moves focus to the previous tabbable element inside the dialog. If focus is on the first tabbable element inside the dialog, moves focus to the last tabbable element inside the dialog
Another required keyboard interaction is Escape to close the dialog but this has already been implemented in Modal Dialog III.

Notes
The focus of this question is on adding the focus management functionality, not the styling and structure. The solution to Modal Dialog III has been provided here for you to build on top of. You can reuse the existing styling and structure.

The contents of the dialog has been modified to include more focusable/tabbable elements to facilitate testing of the focus trapping behavior. A 2px red ring has been added to focused elements to make it more obvious which element is in focus.