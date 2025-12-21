getElementsByTagName() is a method which exists on the Document and Element objects and returns an HTMLCollection of descendant elements within the Document/Element given a tag name.

Let's implement our own Element.getElementsByTagName() that is similar but slightly different:

It is a pure function which takes in an element and a tag name string. E.g. getElementsByTagName(document.body, 'div').
Similar to Element.getElementsByTagName(), only descendants of the element argument are searched, not the element itself.
Return an array of Elements, instead of an HTMLCollection of Elements.
Do not use document.querySelectorAll() which will otherwise make the problem trivial.

Examples

const doc = new DOMParser().parseFromString(
  `<div id="foo">
    <span>Span</span>
    <p>Paragraph</p>
    <div id="bar">Div</div>
  </div>`,
  'text/html',
);

getElementsByTagName(doc.body, 'div');
// [div#foo, div#bar] <-- This is an array of elements.
Resources
Element: getElementsByTagName() method - Web APIs | MDN