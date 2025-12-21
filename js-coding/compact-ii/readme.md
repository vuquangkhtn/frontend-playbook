Implement a function compact(value) that returns a new object with all falsey values removed, including falsey values that are deeply-nested. You can assume the value only contains JSON-serializable values (null, boolean, number, string, Array, Object) and will not contain any other objects like Date, Regex, Map or Set.

The values false, null, 0, '', undefined, and NaN are falsey (you should know this by heart!).

Arguments
value (Array|Object): The array/object to compact.
Returns
(Array|Object): Returns the new compact array/object.

Examples

compact([0, 1, false, 2, '', 3, null]); // => [1, 2, 3]
compact({ foo: true, bar: null }); // => { foo: true }