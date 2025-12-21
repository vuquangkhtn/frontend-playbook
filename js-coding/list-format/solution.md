This question is inspired by the Intl.ListFormat.prototype.format() API which assists with language-specific list formatting.

Solution
By looking at the examples, we can split the solution into two sections:

Processing the input list – removing empty values, sorting, de-duplicating
Formatting the items into a second string
The first section is pretty straightforward, we can just maintain an items array that we mutate according to the options.

The second section is a little trickier, but we can observe the following:

The length option splits the array into two parts
The first part will be joined with a ', ' and the second will be joined with 'and'. Whether to show 'X other(s)' for the second part is dependent on whether the length value is a valid value within the range [1, items.length]

JavaScript

TypeScript

Open files in workspace

const SEPARATOR = ', ';
const OTHERS_SEPARATOR = ' and ';
const OTHERS_LABEL = 'other';

/**
 * @param {Array<string>} itemsParam
 * @param {{sorted?: boolean, length?: number, unique?: boolean}} [options]
 * @return {string}
 */
export default function listFormat(itemsParam, options = {}) {
  // Filter falsey values.
  let items = itemsParam.filter((item) => !!item);

  if (!items || items.length === 0) {
    return '';
  }

  // No processing is needed if there's only one item.
  if (items.length === 1) {
    return items[0];
  }

  // Sort values.
  if (options.sorted) {
    items.sort();
  }

  // Remove duplicate values.
  if (options.unique) {
    items = Array.from(new Set(items));
  }

  // Length is specified and valid.
  if (options.length && options.length > 0 && options.length < items.length) {
    const firstSection = items.slice(0, options.length).join(SEPARATOR);
    const count = items.length - options.length;
    const secondSection = `${count} ${OTHERS_LABEL + (count > 1 ? 's' : '')}`;
    return [firstSection, secondSection].join(OTHERS_SEPARATOR);
  }

  // Case where length is not specified.
  const firstSection = items.slice(0, items.length - 1).join(SEPARATOR);
  const secondSection = items[items.length - 1];
  return [firstSection, secondSection].join(OTHERS_SEPARATOR);
}
Notes
This function is not as usable as the Intl.ListFormat.prototype.format() API because the separators are hardcoded in English. The Intl API is meant for internationalization (i18n) in the first place and also allows for customization of the separators (the comma and the and), so there shouldn't be any hardcoding of separators if this function is meant for production use.

To make this function better, we could allow customization of the list separator and the "others" separator.

Resources
Intl.ListFormat MDN