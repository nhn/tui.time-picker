/**
 * @fileoverview Utils for Datepicker component
 * @author NHN Ent. FE dev Lab. <dl_javascript@nhnent.com>
 * @dependency tui-code-snippet ^1.0.2
 */

'use strict';

/**
 * Utils of calendar
 * @namespace timeUtil
 * @ignore
 */
var utils = {
    /**
     * Get meridiem hour
     * @param {number} hour - Original hour
     * @returns {number} Converted meridiem hour
     */
    getMeridiemHour: function(hour) {
        hour %= 12;

        if (hour === 0) {
            hour = 12;
        }

        return hour;
    },

    /**
     * Returns range arr
     * @param {number} start - Start value
     * @param {number} end - End value
     * @returns {Array}
     */
    getRangeArr: function(start, end) {
        var arr = [];
        var i;

        if (start > end) {
            for (i = end; i >= start; i -= 1) {
                arr.push(i);
            }
        } else {
            for (i = start; i <= end; i += 1) {
                arr.push(i);
            }
        }

        return arr;
    }
};

module.exports = utils;
