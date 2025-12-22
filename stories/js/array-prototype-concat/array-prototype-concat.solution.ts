interface Array<T> {
  myConcat(...items: Array<T | Array<T>>): Array<T>;
}

Array.prototype.myConcat = function (...items) {
  const newArray = [...this];
  
  for (const item of items) {
    if (Array.isArray(item)) {
      newArray.push(...item)
    } else {
      newArray.push(item)
    }
  }

  return newArray;
};