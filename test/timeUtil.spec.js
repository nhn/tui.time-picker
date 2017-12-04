/**
 * @fileoverview Util spec
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
'use strict';

var util = require('../src/js/timeUtil');

describe('getMeridiemHour()', function() {
    it('When "hour" is midnight(00:00), meridiem hour is 12.', function() {
        expect(util.getMeridiemHour(0)).toEqual(12);
    });

    it('When "hour" is over noon(12:00), meridiem hour is between 1~12.', function() {
        expect(util.getMeridiemHour(12)).toEqual(12);
        expect(util.getMeridiemHour(13)).toEqual(1);
        expect(util.getMeridiemHour(23)).toEqual(11);
    });
});

describe('getRangeArr()', function() {
    it('When the step value is not set, range items are created by one step.', function() {
        var items = util.getRangeArr(0, 5);
        expect(items).toEqual([0, 1, 2, 3, 4]);
    });

    it('When the step value is set, range items are created by each step.', function() {
        var items = util.getRangeArr(0, 60, 20);
        expect(items).toEqual([0, 20, 40, 60]);
    });
});
