Implement a function conformsTo(object, source) that checks if object conforms to source by invoking the predicate properties of source with the corresponding property values of object


conformsTo(object, source);
Arguments
object (Object): The object to inspect.
source (Object): The object of property predicates to conform to.
Returns
(boolean): Returns true if object conforms, else false.

Examples

conformsTo({ a: 1, b: 2 }, { b: (n) => n > 1 });
// => true

conformsTo({ a: 1, b: 2 }, { b: (n) => n > 2 });
// => false
The function should return false when object is empty.


conformsTo({}, { b: (n) => n > 1 }); // => false
Constraints
object: Javascript object.
source: Javascript object. Its own properties must be predicate functions.
Resources
Lodash _.conformsTo