This solution assumes you have completed the getElementsByTagName question and fully understand its solution.

The getElementsByTagName question assesses you on basic DOM traversal APIs and recursion. This question is an advanced version where multiple tags can be specified.

Solution
Firstly, we need to note the following points, similar to getElementsByTagName:

Element.tagName returns an uppercase string of an element's tag name (e.g. 'DIV', 'SPAN'), so the tag name arguments have to be converted to be the same case before comparison.
Element.children which returns a live HTMLCollection of the child elements. We use this over Node.childNodes which returns a live NodeList of child Nodes because childNodes will include non-element nodes like text and comment nodes, which are not relevant in this question.
However HTMLCollection does not have .forEach, so we have to iterate through it using traditional for loops.
Approach 1: Top-down
The solution approach can be broken down into two parts:

Splitting tagNames into an array of tag name tokens.
Traversing the document argument and finding elements that match the specified tagNames hierarchy.
Splitting tagNames (tokenization)
For this question, the tagNames argument is quite flexible. It can:

Contain leading and trailing spaces.
Contain tags that are of any case – lowercase, uppercase, mixed case. document.querySelectorAll() is case-insensitive.
To tokenize the tagNames string (identify the list of tag names accurately), we can:

Transform the string to uppercase via .toUpperCase() to handle any casing differences. Uppercase is chosen because Element.tagName returns an uppercase string.
Trimming the string via .trim() to remove leading and trailing spaces.
Splitting the string via .split(/\s+/) to split by whitespace, which can also split by consecutive whitespaces.

Traversing the document to find matching elements
The trickiest part of the problem is identifying the matching elements. The last tag in the list is the elements to be matched. All the tags before the last tag are for specifying the hierarchy.


// E.g. tagNames = 'div SPAN sPaN'
// After tokenizing, tagTokens:
[
  'div', // hierarchy tag
  'span', // hierarchy tag
  'span', // element tag (to be matched)
];
Depth-first search (DFS) is used here because in DFS, for each node, the ancestors will be in its recursion stack. By making use of this fact, we can keep a pointer to the position within tagTokens and if the current element's tag matches tagTokens[tagTokenIndex], increment the index for the next traversal. Incrementing the index means that among the elements descendants, we only need to match the remaining tokens. However, we should not increment past the last index as the last index is a special one – the last tag is the tag name to be matched.

When tagTokenIndex is the last index of tagTokens, any elements that match that tag are considered a match, and can be added to results.

The traversal can be kicked off by using the <body> element (via document.body) and a starting index of 0.



```ts
export default function getElementsByTagNameHierarchy(
  document: Document,
  tagNames: string,
): Array<Element> {
  const results: Array<Element> = [];
  const tagTokens = tagNames.toUpperCase().trim().split(/\s+/);
  const lastIndex = tagTokens.length - 1;

  if (tagTokens.length === 0) {
    return results;
  }

  function traverse(el: Element, tagTokenIndex: number) {
    if (el == null) {
      return;
    }

    const currentTagToken = tagTokens[tagTokenIndex];
    const elementMatchesCurrentTag = el.tagName === currentTagToken;
    const isLastTag = tagTokenIndex === lastIndex;

    if (elementMatchesCurrentTag && isLastTag) {
      results.push(el);
    }

    const nextIndex = elementMatchesCurrentTag
      ? Math.min(tagTokenIndex + 1, lastIndex) // So as not to increment past the last index.
      : tagTokenIndex;

    for (const child of el.children) {
      traverse(child, nextIndex);
    }
  }

  traverse(document.body, 0);

  return results;
}

```

Approach 2. Bottom-up
An alternative solution is to use the same approach as how browsers match selectors, by matching from the bottom-up. Browsers usually match selectors from right to left. This is more efficient because it allows the browser to quickly eliminate large sets of elements. For example, in the selector div p, the browser first finds all <p> elements, then checks if they have a parent or ancestor that's a <div>.

The first step is to find all the matching tags (the last tag in the list). This is essentially the getElementsByTagName question. For each of these tags, traverse the parent chain of nodes with element.parentNode and check the ancestor hierarchy. This approach is clearer to understand but is longer to implement.

```ts
export default function getElementsByTagNameHierarchy(
  document: Document,
  tagNames: string,
): Array<Element> {
  const tagTokens = tagNames.toUpperCase().trim().split(/\s+/);

  if (tagTokens.length === 0) {
    return [];
  }

  const elements: Array<Element> = [];
  const lastTag = tagTokens[tagTokens.length - 1];

  function findMatchingTags(el: Element) {
    if (el == null) {
      return;
    }

    if (el.tagName === lastTag) {
      elements.push(el);
    }

    for (const child of el.children) {
      findMatchingTags(child);
    }
  }

  // First step: find all the elements matching the last tag.
  findMatchingTags(document.body);

  function checkAncestorHierarchy(el: Element) {
    let currentIndex = tagTokens.length - 1;
    let currentEl: Node | null = el;
    let matchingElements = 0;

    while (
      currentEl != null &&
      currentIndex >= 0 &&
      matchingElements !== tagTokens.length
    ) {
      if (
        currentEl instanceof Element &&
        tagTokens[currentIndex] === currentEl.tagName
      ) {
        matchingElements++;
        currentIndex--;
      }

      currentEl = currentEl.parentNode;
    }

    return matchingElements === tagTokens.length;
  }

  // Second step: check each tag's ancestor hierarchy and return the matching ones.
  return elements.filter((el) => checkAncestorHierarchy(el));
}

```

Edge cases
Leading/trailing spaces in tag names string.
Additional spaces between tag names.
Non-lowercase tag name items.
Techniques
Recursion
DOM APIs
How to check an Element's tag name
How to traverse an Element's children
Notes
Element.tagName is uppercase (e.g. 'DIV', 'SPAN'), so be sure to use case-insensitive string comparisons.
Resources
Document: querySelectorAll() method - Web APIs | MDN
Element: getElementsByTagName() method - Web APIs | MDN