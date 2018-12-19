/**
 * @fileoverview Utils for Datepicker component
 * @author NHN Ent. FE dev Lab. <dl_javascript@nhnent.com>
 * @dependency tui-code-snippet ^1.3.0
 */

'use strict';

var snippet = require('tui-code-snippet');

/**
 * Utils
 * @namespace util
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
     * @param {number} [step] - Step value
     * @returns {Array}
     */
    getRangeArr: function(start, end, step) {
        var arr = [];
        var i;

        step = step || 1;

        if (start > end) {
            for (i = end; i >= start; i -= step) {
                arr.push(i);
            }
        } else {
            for (i = start; i <= end; i += step) {
                arr.push(i);
            }
        }

        return arr;
    },

    /**
     * send host name
     * @ignore
     */
    sendHostName: function() {
        snippet.sendHostname('time-picker', 'UA-129987462-1');
    }
};

module.exports = utils;
