interface Array<T> {
  myFilter(
    callbackFn: (value: T, index: number, array: Array<T>) => boolean,
    thisArg?: any,
  ): Array<T>;
}

Array.prototype.myFilter = function (callbackFn, thisArg) {
  const arr = [];
  
  for (let i=0; i<this.length; i++) {
    if (this[i] !== undefined && callbackFn.call(thisArg, this[i], i, this)) {
      arr.push(this[i]);
    }
  }

  return arr;
};