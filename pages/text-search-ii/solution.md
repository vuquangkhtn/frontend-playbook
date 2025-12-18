This question evaluates one's ability to manipulate arrays and strings in JavaScript, which is certainly an essential skill for Front End development.

Clarification questions
Your interviewer might not necessarily spell out all the requirements for you upfront. Ideally you start by thinking about all the possible situations and edge cases.

What if the queries array is an empty array? Or the input string text is an empty string?
Return the string as-is.
What if any query inside the queries array is an empty string?
Skip that query.
Solution
One might think of leveraging regular expressions (regex), via RegExp. Regex is very hard to use here but because the characters within the string can match multiple queries. There are ways to get around that but it's non-trivial.

One idea is to process one query at a time, adding the <b> tag for the current query, but this will ruin the string for subsequent queries. Imagine this scenario:


textSearch('aaabc', ['aaa', 'abc']);
After processing 'aaa', the string is now <b>aaa</b>bc, which won't match 'abc'. Hence this approach is not feasible too.

Working backwards
Let's try to think backwards from the desired output: we want to output a string with the substrings that exist in the queries array wrapped in <b> tags. Therefore we need to know where exactly to insert the opening <b> tags and closing </b> tags. We can create a boolean array of same length as the text with every value defaulting to false. The value of boldChars[index] indicates whether the character at that index in the original string needs to be bold.


// #1: Basic case.
// text: "aaabcaa", queries: ['abc']
// boldChars: [false, false, true, true, true, false, false]
// result: "aa<b>abc</b>aa"

// #2: Non-overlapping case.
// text: "aaabcaabc", queries: ['abc']
// boldChars: [false, false, true, true, true, false, true, true, true]
// result: "aa<b>abc</b>a<b>abc</b>"

// #3: Overlapping case.
// text: "baabcaa", queries: ['abc', 'aa']
// boldChars: [false, true, true, true, true, true true]
// result: "a<b>aabcaa</b>"
The beginning of a span of consecutive chunks of true is where we insert the opening tag <b> and the end is where we add a closing </b>.

To identify which characters need to be bold, we do a naive substring match at each character in text for each query. Flipping the boolean value at each matching character's index to true. However, because of the "one character can only match the same query once" condition, we have to increment i to go past the current query when there's a match.

```ts
export default function textSearch(
  text: string,
  queries: Array<string>,
): string {
  if (text.trim() === '') {
    return text;
  }

  const boldChars = Array.from({ length: text.length }, () => 0);

  for (const query of queries) {
    if (query.trim() === '') continue;
    for (let i = 0; i < text.length; ) {
      const substr = text.slice(i, i + query.length);
      if (substr.toLowerCase() === query.toLowerCase()) {
        boldChars.fill(1, i, i + query.length);
        // Start from next character if there's a match since one
        // character cannot match the same query more than once.
        i = i + query.length;
      } else {
        i++;
      }
    }
  }

  let highlightedString = '';
  for (let i = 0; i < text.length; i++) {
    // When the current character should be bolded
    // and the previous character should not be bolded,
    // append an opening tag to the final string.
    const shouldAddOpeningTag = boldChars[i] === 1 && boldChars[i - 1] !== 1;
    // When the current character should be bolded
    // and the next character should not be bolded,
    // append a closing tag to the final string.
    const shouldAddClosingTag = boldChars[i] === 1 && boldChars[i + 1] !== 1;
    let char = text[i];

    if (shouldAddOpeningTag) {
      char = '<b>' + char;
    }

    if (shouldAddClosingTag) {
      char = char + '</b>';
    }
    highlightedString += char;
  }

  return highlightedString;
}

```

Notes
We use Array.prototype.fill() to mutate the boolean array conveniently when we find a substring match. The method fill is one of the few methods that mutate arrays. As of writing, there are 9 methods in total that mutates arrays: pop, push, reverse, shift, sort, splice, unshift, copyWithin and fill. Check out [Does it mutate](https://doesitmutate.xyz/) where there is a nice list of mutating array methods with more details.