interface Array<T> {
  myAt(index: number): T | undefined;
}

Array.prototype.myAt = function (index: number) {
  if (index >= this.length || index < -this.length) {
    return undefined;
  }

  return index >= 0 ? this[index] : this[this.length + index];
};