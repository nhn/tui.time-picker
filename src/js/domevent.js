/**
 * @fileoverview Utility module for handling DOM events.
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var domUtil = require('tui-dom');

/**
 * @namespace domEvent
 * @ignore
 */
var domEvent = {

    /**
     * Propagate the event to the event target element.
     * @param {Event} ev An event object
     * @param {string} selector A selector of event target element
     * @param {HTMLElement} parent A top element to use for searching
     * @returns {boolean} Result of propagation
     */
    propagate: function(ev, selector, parent) {
        var target = this.getTarget(ev);
        var result = false;

        parent = (ev.currentTarget && ev.currentTarget.parentNode) || parent.parentNode;

        while (target !== parent) {
            if (domUtil.matches(target, selector)) {
                result = true;
                break;
            }
            target = target.parentNode;
        }

        return result;
    },

    /**
     * Get a target element
     * @param {Event} ev Event object
     * @returns {HTMLElement} An event target element
     */
    getTarget: function(ev) {
        return ev.target || ev.srcElement;
    }
};

module.exports = domEvent;
