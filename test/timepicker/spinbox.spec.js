/**
 * @fileoverview Spinbox spec
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
'use strict';

var Spinbox = require('../../src/js/timepicker/spinbox');
var eventUtil = require('../../src/js/util/eventUtil');

/**
 * Class names
 * @see Spinbox
 */

/* eslint-disable new-cap */
describe('TimePicker - Spinbox', function() {
    var container = document.createElement('DIV');
    var spinbox;

    beforeEach(function() {
        spinbox = new Spinbox(container, {
            initialValue: 4,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });
    });

    afterEach(function() {
        spinbox.destroy();
    });

    describe('initialization', function() {
        it('should set input attr - size, maxlength', function() {
            var inputElement = spinbox._inputElement;

            expect(inputElement.getAttribute('size')).toEqual('2');
            expect(inputElement.getAttribute('maxlength')).toEqual('2');
        });

        it('should be output as zero padded double char when format is a "hh"', function() {
            spinbox.destroy();
            spinbox = new Spinbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'hh'
            });

            expect(spinbox._inputElement.value).toEqual('04');
        });

        it('should be output as single char when format is a "h"', function() {
            spinbox.destroy();
            spinbox = new Spinbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'h'
            });

            expect(spinbox._inputElement.value).toEqual('4');
        });
    });

    describe('api', function() {
        it('"getValue" should return value', function() {
            expect(spinbox.getValue()).toBe(4);
        });

        it('"setValue" should set value to input', function() {
            spinbox.setValue(8);
            expect(spinbox._inputElement.value).toBe('8');
            expect(spinbox.getValue()).toBe(8);
        });

        it('"setValue" should not change if the value is invalid', function() {
            spinbox.setValue(11111111);
            expect(spinbox._inputElement.value).toBe('4');
            expect(spinbox.getValue()).toBe(4);
        });
    });

    describe('disabledItems', function() {
        beforeEach(function() {
            spinbox.destroy();
            spinbox = new Spinbox(container, {
                initialValue: 1,
                items: [1, 2, 3, 4],
                disabledItems: [false, true, false, false]
            });
        });

        it('Value of disabledItems should be reflected whenever the value changes.', function() {
            spinbox.setValue(2);
            expect(spinbox.getValue()).toBe(1);
        });

        it('Each time the up control occurs, the disabledItems value should be reflected.', function() {
            spinbox._setNextValue(false);
            expect(spinbox.getValue()).toBe(3);
        });

        it('Each time the down control occurs, the disabledItems value should be reflected.', function() {
            spinbox._setNextValue(true);
            expect(spinbox.getValue()).toBe(4);
        });
    });

    describe('user interaction', function() {
        it('should increase value when click the up-button', function() {
            eventUtil.dispatchEvent(spinbox._upButton, eventUtil.createEvent('click'));

            expect(spinbox.getValue()).toEqual(5);
        });

        it('should decrease value when click the down-button', function() {
            eventUtil.dispatchEvent(spinbox._downButton, eventUtil.createEvent('click'));

            expect(spinbox.getValue()).toEqual(3);
        });

        it('should set max if next value is lower than min', function() {
            spinbox.setValue(1);
            eventUtil.dispatchEvent(spinbox._downButton, eventUtil.createEvent('click'));

            expect(spinbox.getValue()).toEqual(10);
        });

        it('should set min if next value is upper than max', function() {
            spinbox.setValue(10);
            eventUtil.dispatchEvent(spinbox._upButton, eventUtil.createEvent('click'));

            expect(spinbox.getValue()).toEqual(1);
        });

        it('should increase value when the up-arrow key key-down', function() {
            var ev = eventUtil.createEvent('keydown');

            ev.which = 38; // up-arrow;
            eventUtil.dispatchEvent(spinbox._inputElement, ev);

            expect(spinbox.getValue()).toEqual(5);
        });

        it('should decrease value when the down-arrow key-down', function() {
            var ev = eventUtil.createEvent('keydown');

            ev.which = 40; // down-arrow;
            eventUtil.dispatchEvent(spinbox._inputElement, ev);

            expect(spinbox.getValue()).toEqual(3);
        });
    });

    describe('custom event', function() {
        it('should fire change event when the value is changed', function() {
            var spy = jasmine.createSpy();
            spinbox.on('change', spy);

            spinbox.setValue(10);
            expect(spy).toHaveBeenCalledWith({
                value: 10
            });
        });

        it('should fire change event from key-down', function() {
            var ev = eventUtil.createEvent('keydown');
            var spy = jasmine.createSpy();
            spinbox.on('change', spy);

            ev.which = 40; // down-arrow;
            eventUtil.dispatchEvent(spinbox._inputElement, ev);

            expect(spy).toHaveBeenCalledWith({
                value: 3
            });

            ev.which = 38; // up-arrow;
            eventUtil.dispatchEvent(spinbox._inputElement, ev);
            expect(spy).toHaveBeenCalledWith({
                value: 4
            });
        });
    });

    describe('custom event - changeItems', function() {
        it('should change value of each select items', function() {
            var items = [10, 20, 30];
            spinbox.fire('changeItems', items);

            spinbox.setValue(10);
            expect(spinbox.getValue()).toBe(10);

            spinbox.setValue(20);
            expect(spinbox.getValue()).toBe(20);

            spinbox.setValue(30);
            expect(spinbox.getValue()).toBe(30);
        });
    });
});
