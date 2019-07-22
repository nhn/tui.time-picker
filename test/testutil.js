/**
 * @fileoverview Utility module for test.
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

var testutil = {
    createEvent: function(type) {
        var event;

        if (snippet.isFunction(Event)) {
            event = new Event(type, {'bubbles': true});
        } else if (document.createEvent) {
            event = document.createEvent('Event');
            event.initEvent(type, true, false);
        } else {
            event = document.createEventObject();
            event.type = type;
        }

        return event;
    },

    /**
     * Execute handlers attached to the target element for the given event type.
     * @param {HTMLElement} target A target element
     * @param {Event} event An event-object
     */
    trigger: function(target, event) {
        if (target.dispatchEvent) {
            target.dispatchEvent(event);
        } else {
            target.fireEvent('on' + event.type, event);
        }
    }
};

module.exports = testutil;
