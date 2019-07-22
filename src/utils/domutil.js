/**
 * @fileoverview Utility module for manipulating DOM elements.
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

/**
 * @namespace domutil
 * @ignore
 */
var domutil = {
    /**
     * Remove element from parent node.
     * @param {HTMLElement} element An element to be removed 
     */
    removeElement: function(element) {
        if (element.parentElement) {
            element.parentElement.removeChild(element);
        }
    },

    /**
     * Add class to the element.
     * @param {HTMLElement} element An element to add the class to
     * @param {String} addedClass A class to add
     */
    addClass: function(element, addedClass) {
        var className = element.className;
        var classes = className.length ? className.split(' ') : [];

        if (snippet.inArray(addedClass, classes) === -1) {
            classes.push(addedClass);
            element.className = classes.join(' ');
        }
    },

    /**
     * Remove class to the element.
     * @param {HTMLElement} element An element to remove the class 
     * @param {*} removedClass A class to remove
     */
    removeClass: function(element, removedClass) {
        var className = element.className;
        var classes = className.length ? className.split(' ') : [];
        var index = snippet.inArray(removedClass, classes);

        if (index > -1) {
            classes.splice(index, 1);
            element.className = classes.join(' ');
        }
    }
};

module.exports = domutil;
