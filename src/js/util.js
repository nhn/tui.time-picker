/**
 * @fileoverview Utils for Timepicker component
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var inArray = require('tui-code-snippet/array/inArray');
var forEachArray = require('tui-code-snippet/collection/forEachArray');
var sendHostname = require('tui-code-snippet/request/sendHostname');

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
   * @param {string} format - ex) hh, h, mm, m
   * @returns {string}
   */
  formatTime: function(value, format) {
    var PADDING_ZERO_TYPES = ['hh', 'mm'];
    value = String(value);

    return inArray(format, PADDING_ZERO_TYPES) >= 0
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
   * Returns array filled with selected value
   * @param {number} start - Start index of array to fill
   * @param {number} end - End index of array to fill
   * @param {number} value - Value to be filled
   * @param {Array} [target] - Array to fill
   * @returns {Array}
   */
  fill: function(start, end, value, target) {
    var arr = target || [];
    var replaceEnd = Math.min(arr.length - 1, end);
    var i;

    for (i = start; i <= replaceEnd; i += 1) {
      arr[i] = value;
    }

    for (i = replaceEnd; i <= end; i += 1) {
      arr.push(value);
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
    sendHostname('time-picker', 'UA-129987462-1');
  },

  /**
   * Get disabled minute array
   * @param {Array} enableRanges array of object which contains range
   */
  getDisabledMinuteArr: function(enableRanges) {
    var arr = this.fill(0, 60, false);

    function setDisabled(enableRange) {
      arr = this.fill(enableRange.begin, enableRange.end, true, arr);
    }

    forEachArray(enableRanges, setDisabled.bind(this));

    return arr;
  },

  /**
   * Set disabled on target element
   * @param {HTMLInputElement} el target element
   * @param {boolean} isDisabled target element
   */
  setDisabled: function(el, isDisabled) {
    el.disabled = isDisabled;
  }
};

module.exports = utils;
