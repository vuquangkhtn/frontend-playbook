The getElementsByTagName() method exists on the Document and Element objects and returns an HTMLCollection of descendant elements within the Document/Element given a tag name.

It will be useful to find tags that follow a certain ancestor hierarchy. This is already possible by using document.querySelectorAll(), e.g. document.querySelectorAll('div span') which finds all the <span>s that are descendants (not necessarily direct) of a <div> within the document.

Implement a function getElementsByTagNameHierarchy(), that with a similar functionality, but with some differences:

A pure function which takes in two parameters:
The document object to search within.
A string consisting of a space-delimited list of tags. Note that there can be an arbitrary number of tags. If only one tag is specified, the function behaves like getElementByTagName().
Returns an array of Elements, instead of an HTMLCollection of Elements.
E.g. getElementsByTagNameHierarchy(document, 'div span') and returns an array of elements matching that selector within the document.

Do not use document.querySelectorAll() which will otherwise make the problem trivial. You will not be allowed to use it during real interviews.

Examples

const doc = new DOMParser().parseFromString(
  `<div>
    <span id="foo">
      <span id="bar">Bar</span>
      Foo
    </span>
    <p>Paragraph</p>
    <span id="baz">Baz</span>
  </div>`,
  'text/html',
);

getElementsByTagNameHierarchy(doc, 'div span');
// [span#foo, span#bar, span#baz] <-- This is an array of elements.
Resources
Document: querySelectorAll() method - Web APIs | MDN
Element: getElementsByTagName() method - Web APIs | MDN
