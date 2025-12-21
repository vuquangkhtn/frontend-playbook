This is a practical question which is used in many content-heavy sites such as blogs, documentation websites, Google Docs, and as mentioned in the question, screen readers.

Clarification questions
What should be returned if there are no headings on the page?
Return an empty string.
Solution
The solution can be split into two parts:

Traversing the document, identifying the heading tags and creating the hierarchy tree.
Stringifying the hierarchy tree as an HTML string.
Traversing the document and creating the headings hierarchy tree
Since the DOM is a tree and we have to traverse it in a depth-first fashion, recursion works well here. Starting from the root element (the <body>), we can process the current element, then traverse its children in a depth-first manner.

Use Element.tagName to identify whether an element is a heading element. Remember that tagNames are in uppercase.

The headings hierarchy also resembles a tree. Each node in the hierarchy tree contains two properties:

text: Label for the node.
children: An array of nodes.
The resulting headings hierarchy tree of a proper HTML document will follow the rule that a node's children, if present will always be one heading level lower than itself.

We'll use a stack to keep a reference to the most recent heading elements we have traversed and currentLevel, an integer variable to track the level of the most recent heading element. The level is important because it affects how we push elements into the headings hierarchy.

As we traverse the tree, if the current element is not a heading tag, we can ignore it. Otherwise we create a hierarchy node, with the text being the element's textContent and children being an empty array. Then we look at the level of the current element:

If the level is greater than the currentLevel, we add this node as a children of the most recent heading node (the top node of the stack).
If the level is the same as the currentLevel, we need to add this node as a sibling of the most recent heading node. We can do this by popping from the stack to get access of the parent of the most recent heading node. Then .push() the node into the children of the parent.
If the level is smaller than the currentLevel, depending on the level difference, we might need to .pop() more than once. Heading levels won't be skipped when it is increasing, but it is perfectly valid for a <h4> to be followed by a <h2>. Because of the headings hierarchy tree rules, the number of times we need to pop is the level difference + 1. After popping that number of times, we will have access to the right parent node and we can push the current node into the parent node's children.
Stringifying the hierarchy tree as an HTML string
Again, we'll make use of recursion here. We'll define two helper functions, one to stringify a node, and another to stringify the children.

stringifyNode: Each node will be rendered as an <li> element. We render the text and children, if present.
stringifyChildren: Each children is an array, which is rendered as a <ul>. And we can call stringifyNode on each node in the children. We shouldn't be rendering empty <ul>, so we should check whether children.length is bigger than 0 before creating the string.

```ts
type Node = {
  text: string | null;
  children: Array<Node>;
};

function stringify(contents: Node): string {
  function stringifyNode(node: Node): string {
    return `<li>${node.text}${stringifyChildren(node.children)}</li>`;
  }

  function stringifyChildren(children: Array<Node>): string {
    return children.length > 0
      ? `<ul>${children.map(stringifyNode).join('')}</ul>`
      : '';
  }

  return stringifyChildren(contents.children);
}

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default function tableOfContents(doc: Document): string {
  const rootNode = {
    text: null,
    children: [],
  };
  const stack: Array<Node> = [rootNode];
  let currentLevel = 0;

  function traverse(element: Element) {
    if (element == null || element.tagName == null) {
      return;
    }

    if (headingTags.has(element.tagName.toLowerCase())) {
      const level = parseInt(element.tagName[1], 10);
      const node = {
        text: element.textContent,
        children: [],
      };

      for (let i = level; i < currentLevel + 1; i++) {
        stack.pop();
      }

      stack[stack.length - 1].children.push(node);
      stack.push(node);
      currentLevel = level;
    }

    for (const child of element.children) {
      traverse(child);
    }
  }

  traverse(doc.body);

  return stringify(stack[0]);
}

```

Edge cases
Ignore irrelevant nodes in the DOM tree such as comment nodes and text nodes.
DOM trees which have deep levels of nesting.
DOM trees which do not have any headings at all.
Techniques
Recursion.
DOM traversal basics - Element.textContent, Element.tagName.