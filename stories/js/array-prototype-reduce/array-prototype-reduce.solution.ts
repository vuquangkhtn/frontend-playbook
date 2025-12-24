interface Array<T> {
  myReduce<U>(
    callbackFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue?: U,
  ): U;
}

Array.prototype.myReduce = function (callbackFn, initialValue) {
  if (!Array.isArray(this)) {
    throw 'Error';
  } 

  if (this.length === 0) {
    if (initialValue !== undefined) {
      return initialValue;
    } 
    throw 'Error';
  }

  let val;
  if (initialValue !== undefined) {
    val = callbackFn(initialValue, this[0], 0, this);
  } else {
    val = this[0]
  }

  for (let i=1; i<this.length; i++) {
    if (Object.hasOwn(this, i)) {
      val = callbackFn(val, this[i], i, this);
    }
  }

  return val;
};
