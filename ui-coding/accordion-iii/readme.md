Note: This is an advanced version of Accordion II, you should complete that question first before attempting this question. This question is not available in Vanilla JavaScript as it will require a fair bit of code to add keyboard interactions without a JavaScript framework.

In Accordion II, we built a functional accordion component that has the necessary WAI-ARIA roles, states, and properties, which is actually pretty accessible. However, we can go one step further and add some optional keyboard interactions.

Requirements
We'll be following a modified subset of the necessary keyboard interactions for accordions:

When Enter or Space is hit and focus is on the accordion header
For a collapsed panel, expands the associated panel.
For an expanded panel, collapses the associated panel.
Tab: Moves focus to the next focusable element; all focusable elements in the accordion are included in the page Tab sequence.
Shift + Tab: Moves focus to the previous focusable element; all focusable elements in the accordion are included in the page Tab sequence.
Down Arrow: If focus is on an accordion header, moves focus to the next accordion header. If focus is on the last accordion header, either does nothing or moves focus to the first accordion header.
Up Arrow: If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.
Home: When focus is on an accordion header, moves focus to the first accordion header.
End: When focus is on an accordion header, moves focus to the last accordion header.
Notes
The focus of this question is on adding keyboard functionality, not the styling. We have provided the solution to Accordion II here for you to build on top of. You can reuse the existing styling.