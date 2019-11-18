/**
 * @fileoverview Utils for Timepicker component
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

var uniqueId = 0;

/**
 * Utils
 * @namespace util
 * @ignore
 */
var utils = {
  /**
   * Returns unique id
   * @returns {number}
   */
  getUniqueId: function() {
    uniqueId += 1;

    return uniqueId;
  },

  /**
   * Convert a value to meet the format
   * @param {number|string} value 
   * @param {string} format 
   * @returns {string}
   */
  timeFormat: function(value, format) {
    var PADDING_ZERO_TYPES = ['hh', 'mm'];
    value = String(value);

    return snippet.inArray(format, PADDING_ZERO_TYPES) >= 0
      && value.length === 1
      ? '0' + value
      : value;
  },

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
   * send host name
   * @ignore
   */
  sendHostName: function() {
    snippet.sendHostname('time-picker', 'UA-129987462-1');
  }
};

module.exports = utils;
