/**
 * @fileoverview EventUtil for attach and detach event handler
 * source: Nicholas C. Zakas, PROFESSIONAL JAVASCRIPT FOR WEB DEVELOPERS, 3rd edition(978118026693/1118026691), John Wiley & Sons International Rights, Inc., Hoboken, 2012
 */

'use strict';

/**
 * Fire event to target element
 * @param {HTMLElement} element - event target element
 * @param {Event} event - event object
 * @private
 */
function _dispatchEvent(element, event) {
    if (element.dispatchEvent) {
        element.dispatchEvent(event);
    } else if (element.fireEvent) {
        element.fireEvent('on' + event.type, event);
    }
}

/**
 * Create Event object having specific type;
 * @param {string} type - type of event
 * @returns {Event} - event object
 */
function _createEvent(type) {
    var event;

    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(type, false, true);
    } else {
        event = document.createEventObject();
        event.type = type;
    }

    return event;
}

module.exports = {
    dispatchEvent: _dispatchEvent,
    createEvent: _createEvent
};
