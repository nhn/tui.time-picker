/**
 * @fileoverview Util spec
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
'use strict';

var timeUtil = require('../src/js/timeUtil');

describe('getMeridiemHour()', function() {
    it('When "hour" is midnight(00:00), meridiem hour is 12.', function() {
        expect(timeUtil.getMeridiemHour(0)).toEqual(12);
    });

    it('When "hour" is over noon(12:00), meridiem hour is between 1~12.', function() {
        expect(timeUtil.getMeridiemHour(12)).toEqual(12);
        expect(timeUtil.getMeridiemHour(13)).toEqual(1);
        expect(timeUtil.getMeridiemHour(23)).toEqual(11);
    });
});
