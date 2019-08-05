/**
 * @fileoverview Utils for Timepicker component
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
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
     * Get a target element
     * @param {Event} ev Event object
     * @returns {HTMLElement} An event target element
     */
    getTarget: function(ev) {
        return ev.target || ev.srcElement;
    },

    /**
     * Make a HTML element by a html string
     * @param {string} htmlString A HTML string
     * @returns {HTMLElement}
     */
    convertToElement: function(htmlString) {
        var temp = document.createElement('div');
        temp.innerHTML = htmlString;

        return temp.firstChild;
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
