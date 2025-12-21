This question is the front end version of the Same Tree question on LeetCode. It tests your knowledge of recursion / tree traversals and the Document Object Model (DOM).

Let's look at a minimal example of a DOM tree.


<span>foo</span>
In the DOM, every HTML tag is an object. Nested tags or texts are children of the enclosing tag. In this example, the text foo is the child of the span tag, which can be accessed by the childNodes property.

Solution
Our function needs to determine if two trees are identical. We can achieve this by traversing two root nodes at the same time and compare them to see if they are the same, recurse into their children nodes and repeat this process until we have found a mismatch or we have visited all of the nodes in either one of the two trees.

Therefore, our tasks can be divided into two subtasks:

Traverse the DOM trees.
Compare the current DOM nodes.
If you have worked on the deep equal question, you would realize that the approach described above is exactly the one we used for the deep equal question as well. In fact, it is a common technique across most of the object/tree-related questions:

We want to efficiently visit an object (a tree).
We need to do something when we process each property of that object (a node in a tree).
Here is the solution:

```ts
/**
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @return {boolean}
 */
export default function identicalDOMTrees(nodeA, nodeB) {
  if (nodeA.nodeType !== nodeB.nodeType) {
    return false;
  }

  if (nodeA.nodeType === Node.TEXT_NODE) {
    return nodeA.textContent === nodeB.textContent;
  }

  // We can assume it's an element node from here on.
  if (nodeA.tagName !== nodeB.tagName) {
    return false;
  }

  if (nodeA.childNodes.length !== nodeB.childNodes.length) {
    return false;
  }

  if (nodeA.attributes.length !== nodeB.attributes.length) {
    return false;
  }

  const hasSameAttributes = nodeA
    .getAttributeNames()
    .every(
      (attrName) =>
        nodeA.getAttribute(attrName) === nodeB.getAttribute(attrName),
    );

  if (!hasSameAttributes) {
    return false;
  }

  return Array.prototype.every.call(nodeA.childNodes, (childA, index) =>
    identicalDOMTrees(childA, nodeB.childNodes[index]),
  );
}

```

Notes on native DOM APIs
There are quite a bit of DOM-specific APIs you will have to use to implement such a function. And it is ok if you are not familiar with them. In practice, you usually do not need to write low-level DOM manipulation code anymore.

Here are the DOM APIs we have covered in this solution:

We use nodeType when checking the types of nodes. There is a similar API called tagName that only works for HTML elements, not for text nodes and comment nodes. Check out this tutorial if you want to learn more about their differences.
We use the childNodes property - as opposed to the children property - to get the list of children nodes. The reason is, again, children only returns elements while childNodes returns all nodes, including text nodes and comment nodes. Check out this MDN page if you want to learn more about their differences.
We "borrowed" the every method from Array.prototype via Array.prototype.every.call(treeA.childNodes) as opposed to just calling every on childNodes. This is because what childNodes returns is not a JavaScript array, rather an array-like data structure called NodeList, which doesn't come with all the array methods right out of box. Calling array methods such as every on it would throw an error. The other way to use array methods on a NodeList is to convert it to an array first via Array.from. i.e. Array.from(treeA.childNodes).every(...).
One-liner solution
There is a new API called isEqualNode that tests whether two nodes are equal. Check out Node.isEqualNode() API on MDN.


function identicalDOMTrees(treeA, treeB) {
  return treeA.isEqualNode(treeB);
}