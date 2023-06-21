/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function d() {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  const data = JSON.parse(json);

  Object.keys(data).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      obj[key] = data[key];
    }
  });

  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CSSSelector {
  constructor() {
    this.selector = '';
    this.hasElement = false;
    this.hasId = false;
    this.hasPseudoElement = false;
  }

  element(value) {
    const newSelector = new CSSSelector();
    newSelector.selector = this.selector + value;
    newSelector.hasElement = true;
    newSelector.hasId = this.hasId;
    newSelector.hasPseudoElement = this.hasPseudoElement;
    return newSelector;
  }

  id(value) {
    const newSelector = new CSSSelector();
    newSelector.selector = `${this.selector}#${value}`;
    newSelector.hasElement = this.hasElement;
    newSelector.hasId = true;
    newSelector.hasPseudoElement = this.hasPseudoElement;
    return newSelector;
  }

  class(value) {
    const newSelector = new CSSSelector();
    newSelector.selector = `${this.selector}.${value}`;
    newSelector.hasElement = this.hasElement;
    newSelector.hasId = this.hasId;
    newSelector.hasPseudoElement = this.hasPseudoElement;
    return newSelector;
  }

  attr(value) {
    const newSelector = new CSSSelector();
    newSelector.selector = `${this.selector}[${value}]`;
    newSelector.hasElement = this.hasElement;
    newSelector.hasId = this.hasId;
    newSelector.hasPseudoElement = this.hasPseudoElement;
    return newSelector;
  }

  pseudoClass(value) {
    const newSelector = new CSSSelector();
    newSelector.selector = `${this.selector}:${value}`;
    newSelector.hasElement = this.hasElement;
    newSelector.hasId = this.hasId;
    newSelector.hasPseudoElement = this.hasPseudoElement;
    return newSelector;
  }

  pseudoElement(value) {
    const newSelector = new CSSSelector();
    newSelector.selector = `${this.selector}::${value}`;
    newSelector.hasElement = this.hasElement;
    newSelector.hasId = this.hasId;
    newSelector.hasPseudoElement = true;
    return newSelector;
  }

  combine(combinator, selector2) {
    const newSelector = new CSSSelector();
    newSelector.selector = `${this.selector} ${combinator} ${selector2.selector}`;
    newSelector.hasElement = this.hasElement || selector2.hasElement;
    newSelector.hasId = this.hasId || selector2.hasId;
    newSelector.hasPseudoElement = this.hasPseudoElement || selector2.hasPseudoElement;
    return newSelector;
  }

  stringify() {
    if ((this.hasElement && this.selector.match(/\w+/g).length > 1)
    || (this.hasId && this.selector.match(/#/g).length > 1)
    || (this.hasPseudoElement && this.selector.match(/::/g).length > 1)) {
      throw new Error('Element, id and pseudo-element should not occur more than once inside the selector');
    }
    return this.selector;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const selector = new CSSSelector();
    return selector.element(value);
  },

  id(value) {
    const selector = new CSSSelector();
    return selector.id(value);
  },

  class(value) {
    const selector = new CSSSelector();
    return selector.class(value);
  },

  attr(value) {
    const selector = new CSSSelector();
    return selector.attr(value);
  },

  pseudoClass(value) {
    const selector = new CSSSelector();
    return selector.pseudoClass(value);
  },

  pseudoElement(value) {
    const selector = new CSSSelector();
    return selector.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return selector1.combine(combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
