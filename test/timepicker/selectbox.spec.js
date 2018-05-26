/**
 * @fileoverview Selectbox spec
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
'use strict';

var Selectbox = require('../../src/js/timepicker/selectbox');

describe('TimePicker - Selectbox', function() {
    var container, selectbox;

    beforeEach(function() {
        container = document.createElement('DIV');
    });

    afterEach(function() {
        selectbox.destroy();
    });

    describe('initialization', function() {
        it('should set index of initial value', function() {
            selectbox = new Selectbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'hh'
            });
            expect(selectbox._selectedIndex).toEqual(3);
        });

        it('should be output as zero padded double char when format is a "hh"', function() {
            selectbox = new Selectbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'hh'
            });
            expect(selectbox._element.options[0].innerText.trim()).toEqual('01');
        });

        it('should be output as single char when format is a "h"', function() {
            selectbox = new Selectbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'h'
            });

            expect(selectbox._element.options[0].innerText.trim()).toEqual('1');
        });
    });

    describe('disabledItems', function() {
        beforeEach(function() {
            selectbox = new Selectbox(container, {
                initialValue: 1,
                items: [1, 2],
                disabledItems: [true, false]
            });
        });

        it('Should be applied when disabledItem is marked disabled', function() {
            var disabledItem = selectbox._element.options[0];
            expect(disabledItem.hasAttribute('disabled')).toBe(true);
        });

        it('Should not be reflected when disabledItem is not marked as disabled.', function() {
            var disabledItem = selectbox._element.options[1];
            expect(disabledItem.hasAttribute('disabled')).toBe(false);
        });
    });

    describe('api', function() {
        beforeEach(function() {
            selectbox = new Selectbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'hh'
            });
        });

        it('"getValue" should return value', function() {
            expect(selectbox.getValue()).toBe(4);
        });

        it('"setValue" should set value to input', function() {
            selectbox.setValue(8);
            expect(selectbox._element.value).toBe('8');
            expect(selectbox.getValue()).toBe(8);
        });

        it('"setValue" should not change if the value is invalid', function() {
            selectbox.setValue(11111111);
            expect(selectbox._element.value).toBe('4');
            expect(selectbox.getValue()).toBe(4);
        });
    });

    describe('custom event', function() {
        beforeEach(function() {
            selectbox = new Selectbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'hh'
            });
        });

        it('should fire change event when the value is changed', function() {
            var spy = jasmine.createSpy();
            selectbox.on('change', spy);

            selectbox.setValue(10);
            expect(spy).toHaveBeenCalledWith({
                value: 10
            });
        });
    });

    describe('custom event - changeItems', function() {
        beforeEach(function() {
            selectbox = new Selectbox(container, {
                initialValue: 4,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                format: 'hh'
            });
        });

        it('should change value of each select items', function() {
            var items = [10, 20, 30];
            selectbox.fire('changeItems', items);

            selectbox.setValue(10);
            expect(selectbox.getValue()).toBe(10);

            selectbox.setValue(20);
            expect(selectbox.getValue()).toBe(20);

            selectbox.setValue(30);
            expect(selectbox.getValue()).toBe(30);
        });
    });
});
