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
     * Get a target element
     * @param {Event} event Event object
     * @returns {HTMLElement} An event target element
     */
    getTarget: function(event) {
        return event.target || event.srcElement;
    }
};

module.exports = domevent;
