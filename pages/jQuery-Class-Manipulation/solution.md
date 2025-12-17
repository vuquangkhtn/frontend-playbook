Note: If you haven't completed the jQuery.css question, you should attempt that first.

Clarification questions
What should happen if there are no elements match the selector?
In jQuery when there are no matched elements, nothing occurs, so we can follow that.
Can there be duplicate classes in the parameters and on the element?
Yes there can be.
Solution
Method chaining is not the focus of the question given you just have to return this at the end of every method in the skeleton which already contains the structure of an object-based approach. Hence it's important to have completed the jQuery.css question first.

The bulk of the complexity is in the toggleClass method. We first need to parse the className parameter and the element's className properties into a set of class strings. Then that's followed by manipulation of the element's class set according to the className input. We iterate through the classes in the className input and depending on whether state is explicitly defined and whether the element's classes contain the input class, add/delete the class from the set.

Lastly, we modify the element's className by concatenating the classes back into a single string.

addClass and removeClass can be implemented trivially by using toggleClass with state set as true and false respectively.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {string} className
 * @return {Set<string>}
 */
function classNameTokenSet(className) {
  return new Set(className.trim().split(/\s+/));
}

/**
 * @param {string} selector
 * @return {{toggleClass: Function, addClass: Function, removeClass: Function}}
 */
export default function $(selector) {
  const element = document.querySelector(selector);

  return {
    /**
     * @param {string} className
     * @param {boolean} state
     * @return {Object|void}
     */
    toggleClass: function (className, state) {
      // No-op if there is no matching element.
      if (element == null) {
        return this;
      }

      const classes = classNameTokenSet(className);
      const elementClasses = classNameTokenSet(element.className);

      classes.forEach((cls) => {
        const shouldRemove =
          state === undefined ? elementClasses.has(cls) : !state;
        shouldRemove
          ? elementClasses.delete(cls) // Remove if state is not defined and element contains the class or state is false.
          : elementClasses.add(cls);
      });

      element.className = Array.from(elementClasses).join(' ');
      return this;
    },
    /**
     * @param {string} className
     * @return {Object}
     */
    addClass: function (className) {
      this.toggleClass(className, true);
      return this;
    },
    /**
     * @param {string} className
     * @return {Object}
     */
    removeClass: function (className) {
      this.toggleClass(className, false);
      return this;
    },
  };
}Alternative Solution
An alternative class-based approach can be found below which is a bit longer and overkill.


Open files in workspace

function classNameTokenSet(className) {
  return new Set(className.trim().split(/\s+/));
}

class jQuery {
  constructor(selector) {
    this.element = document.querySelector(selector);
  }

  toggleClass(className, state) {
    // No-op if there is no matching element.
    if (this.element == null) {
      return undefined;
    }

    const classes = classNameTokenSet(className);
    const elementClasses = classNameTokenSet(this.element.className);

    classes.forEach((cls) => {
      const shouldRemove =
        state === undefined ? elementClasses.has(cls) : !state;
      shouldRemove
        ? elementClasses.delete(cls) // Remove if state is not defined and element contains the class or state is false.
        : elementClasses.add(cls);
    });

    this.element.className = Array.from(elementClasses).join(' ');
    return this;
  }
  addClass(className) {
    this.toggleClass(className, true);
    return this;
  }
  removeClass(className) {
    this.toggleClass(className, false);
    return this;
  }
}

export default function $(element) {
  return new jQuery(element);
}
Edge cases
No elements match the selector. We should handle gracefully instead of erroring.
The className string can contain duplicate classes.
The className string can contain leading/trailing whitespace and also more than one space character between classes.
The element's className can contain uppercase classes which shouldn't be matched in Standards Mode for browsers.
Techniques
CSS fundamentals.
Notes
Arrow functions has a lexical scoping to the this context, and should not be used as methods on objects as the this will not be referring to the object. Thus the methods cannot be defined as an arrow function if the return value is an object.
Resources
.toggleClass() | jQuery API Documentation
.addClass() | jQuery API Documentation
.removeClass() | jQuery API Documentation