This question assesses you on basic DOM traversal APIs and recursion. The approach to solve this question is similar to getElementsByClassName.

Clarification questions
Do we have to support the tagName = '*' case?
No, not for this question.
Will the tag name argument be all lower case?
Not necessarily. E.g. document.getElementsByTagName(element, 'Div') is valid.
Solution
The solution is pretty straightforward if you are familiar with the HTML DOM APIs. In particular, we need to know the following:

Element.tagName which returns an uppercase string of an element's tag name (e.g. 'DIV', 'SPAN').
Element.children which returns a live HTMLCollection of the child elements. We use this over Node.childNodes which returns a live NodeList of child Nodes because childNodes will include non-element nodes like text and comment nodes, which are not relevant in this question.
However HTMLCollection does not have .forEach, so we have to iterate through it using traditional for loops.
We can maintain an elements array to collect the matching elements while recursively traversing the root element. A depth-first traversal is performed.

Remember that the element argument itself is not included in the results.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Element} element
 * @param {string} tagName
 * @return {Array<Element>}
 */
export default function getElementsByTagName(element, tagNameParam) {
  const elements = [];
  const tagName = tagNameParam.toUpperCase();

  function traverse(el) {
    if (el == null) {
      return;
    }

    if (el.tagName === tagName) {
      elements.push(el);
    }

    for (const child of el.children) {
      traverse(child);
    }
  }

  for (const child of element.children) {
    traverse(child);
  }

  return elements;
}
Edge cases
Element argument is not included in the results even if it matches the tag name.
Non-lowercase tag name arguments.
Techniques
Recursion
DOM APIs
How to check an Element's tag name
How to traverse an Element's children
Notes
Element.tagName is uppercase (e.g. 'DIV', 'SPAN'), so be sure to use case-insensitive string comparisons
Resources
Element: getElementsByTagName() method - Web APIs | MDN