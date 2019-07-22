/**
 * @fileoverview Utility module for handling DOM events.
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

/**
 * @namespace domevent
 * @ignore
 */
var domevent = {

    /**
     * Make a delegated event handlers.
     * @param {HTMLElement} element  A target element
     * @param {String} selector A name of event and optional namespaces
     * @param {Function} handler A callback function to exectue
     * @returns {Function}
     */
    delegateHandler: function(element, selector, handler) {
        var getTarget = this.getTarget;

        return function(event) {
            var target = getTarget(event);
            var trigger = element.querySelector(selector);

            if (target !== trigger) {
                return;
            }

            handler(event);
        };
    },

    /**
     * Add an event to the element.
     * @param {HTMLElement} element A target element
     * @param {String} events A name of event and optional namespaces
     * @param {Function} handler A callback function to add
     */
    on: function(element, events, handler) {
        var type;

        type = events.split('.')[0];

        if (element.addEventListener) {
            element.addEventListener(type, handler);
        } else {
            element.attachEvent('on' + type, handler);
        }
    },

    /**
     * Remove an event from the element.
     * @param {HTMLElement} element A target element
     * @param {String} events A name of event and optional namespaces
     * @param {Function} handler A callback function to remove
     */
    off: function(element, events, handler) {
        var type = events.split('.')[0];

        if (element.removeEventListener) {
            element.removeEventListener(type, handler);
        } else {
            element.detachEvent('on' + type, handler);
        }
    },

    /**
     * Get a target element
     * @param {Event} event Event object
     * @returns {HTMLElement} An event target element
     */
    getTarget: function(event) {
        return event.target || event.srcElement;
    }
};

module.exports = domevent;
