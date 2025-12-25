export default function chunk<T>(array: Array<T>, size = 1): Array<Array<T>> {
  if (array.length === 0) return [];
  
  const result: Array<Array<T>> = [];

  let currentArr: Array<T> = [];
  for (const item of array) {
    // reset
    if (currentArr.length === size) {
      result.push(currentArr);
      currentArr = [];
    }

    currentArr.push(item);
  }

  // remaining
  if (currentArr.length <= size) {
    result.push(currentArr);
  }

  return result;
}