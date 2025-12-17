Clarification questions
What should happen if there are no elements match the selector? In jQuery when there are no matched elements, nothing occurs, so we can follow that.
What do we return if we try to get the value of a CSS property that isn't set on the element? We should return undefined as per jQuery.
Solution
Approach 1: Object instance
The toughest part of this question is how to implement method chaining on objects. We have to maintain a reference to the element, which can be done either via closures or using a class property. Classes are overkill here, so we will use the closure approach. We can just return an object with a single css() method. To allow for method chaining, the method has to return this at the end.

Getting and setting the CSS properties is straightforward with the use of the HTMLElement.style property.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {string} selector
 * @return {{css: Function}}
 */
export default function $(selector) {
  const element = document.querySelector(selector);

  return {
    /**
     * @param {string} prop
     * @param {boolean|string|number} value
     * @return {Object|void|string}
     */
    css: function (prop, value) {
      // Getter case.
      if (value === undefined) {
        // No matching elements.
        if (element == null) {
          return undefined;
        }

        const value = element.style[prop];
        return value === '' ? undefined : value;
      }

      // Setter case.
      if (element != null) {
        element.style[prop] = value;
      }

      return this;
    },
  };
}
Approach 2: Classes
An alternative solution here is to use classes to retain a reference to the selected element. The implementation of the css() method is largely similar.


Open files in workspace

class jQuery {
  constructor(selector) {
    this.element = document.querySelector(selector);
  }

  css(prop, value) {
    // Getter case.
    if (value === undefined) {
      // No matching elements.
      if (this.element == null) {
        return undefined;
      }

      const value = this.element.style[prop];
      return value === '' ? undefined : value;
    }

    // Setter case.
    if (this.element != null) {
      this.element.style[prop] = value;
    }

    return this;
  }
}

export default function $(element) {
  return new jQuery(element);
}
Edge cases
No elements match the selector. We should handle gracefully instead of erroring.
Return undefined instead of empty string if CSS property does not exist on element.
Techniques
Closures.
Object chaining.
Notes
Arrow functions have a lexical scoping to the this context, hence they should not be used as methods on objects as the this will not be referring to the object. Thus the css method cannot be defined as an arrow function if the return value is the this object.
Resources
jQuery.css() | jQuery API Documentation