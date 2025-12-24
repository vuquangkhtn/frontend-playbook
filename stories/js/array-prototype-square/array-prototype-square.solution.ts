interface Array<T> {
  square(): Array<number>;
}

Array.prototype.square = function () {
  if (!Array.isArray(this)) {
    throw 'Not an array';
  }

  return this.map((num) => {
    return num**2;
  });
};