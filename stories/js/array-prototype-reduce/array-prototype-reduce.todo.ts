// empty
interface Array<T> {
  myMap<U>(
    callbackFn: (value: T, index: number, array: Array<T>) => U,
    thisArg?: any,
  ): Array<U>;
}

Array.prototype.myReduce = function (callbackFn, thisArg) {
  throw 'Not implemented!';
};