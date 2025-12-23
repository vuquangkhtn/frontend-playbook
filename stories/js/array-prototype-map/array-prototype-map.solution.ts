interface Array<T> {
  myMap<U>(
    callbackFn: (value: T, index: number, array: Array<T>) => U,
    thisArg?: any,
  ): Array<U>;
}

Array.prototype.myMap = function (callbackFn, thisArg) {
  const arr = [];
  for (let i=0; i<this.length; i++) {
    if (Object.hasOwn(this, i)) {
      arr.push(callbackFn.call(thisArg, this[i], i, this));
    } else {
      arr.push(this[i]);
    }
  }

  return arr;
};