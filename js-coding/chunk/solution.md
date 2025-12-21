Solution
Approach 1: Using push()
The chunk function takes two parameters: array (the input array to be chunked) and size (the desired size of each chunk).
It performs the same initial checks to ensure array is a valid array and size is positive. If not, it returns an empty array [].
Two variables are initialized: result to store the chunks and chunk to build each individual chunk.
A for loop iterates through the array. In each iteration, the current element is added to the chunk array.
After adding an element to the chunk, it checks if the chunk has reached the desired size or if it has reached the end of the array. If either condition is true, it means a chunk is complete, and it's added to the result array.
If the chunk is complete, a new, empty chunk array is created to start building the next chunk.
The loop continues until all elements of the array have been processed.
Finally, the function returns the result array containing the chunks.

JavaScript

TypeScript

Open files in workspace

/**
 * @template T
 * @param {Array<T>} array The array to process.
 * @param {number} [size=1] The length of each chunk.
 * @returns {Array<Array<T>>} The new array of chunks.
 */
export default function chunk(array, size = 1) {
  if (!Array.isArray(array) || size < 1) {
    return [];
  }

  const result = [];
  let chunk = [];

  for (let i = 0; i < array.length; i++) {
    chunk.push(array[i]);
    if (chunk.length === size || i === array.length - 1) {
      result.push(chunk);
      chunk = [];
    }
  }

  return result;
}
Approach 2: Using slice()
A more elegant solution that is shorter and requires fewer variables is to extract out the exact slice of the elements from the array.


JavaScript

TypeScript

Open files in workspace

/**
 * @template T
 * @param {Array<T>} array The array to process.
 * @param {number} [size=1] The length of each chunk.
 * @returns {Array<Array<T>>} The new array of chunks.
 */
export default function chunk(array, size = 1) {
  if (!Array.isArray(array) || size < 1) {
    return [];
  }

  const result = [];

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }

  return result;
}
Resources
Lodash _.chunk