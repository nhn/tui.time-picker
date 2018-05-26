/**
 * @fileoverview eventUtil spec
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
'use strict';

var domUtil = require('tui-dom');
var eventUtil = require('../../src/js/util/eventUtil');

describe('eventUtil', function() {
    var event, element, handler;
    beforeEach(function() {
        event = eventUtil.createEvent('click'); // eslint-disable-line new-cap
        element = document.createElement('DIV');
        document.body.appendChild(element);
        handler = jasmine.createSpy('handler');
    });

    afterEach(function() {
        event = null;
        element.parentNode.removeChild(element);
        handler.calls.reset();
        handler = null;
    });

    describe('dispatchEvent()', function() {
        it('should trigger event', function() {
            domUtil.on(element, 'click', handler);
            eventUtil.dispatchEvent(element, event);

            expect(handler).toHaveBeenCalled();
        });
    });

    describe('createEvent()', function() {
        it('should create event object', function() {
            event = eventUtil.createEvent();

            expect(event instanceof Event).toBe(true);
        });
    });
});
