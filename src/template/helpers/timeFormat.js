/**
 * @fileoverview Handlebars helper - Equals
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

var PADDING_ZERO_TYPES = ['hh', 'mm'];

/**
 * @param {number} value time or minute
 * @param {string} format - timeFormat
 * @returns {boolean}
 */
module.exports = function(value, format) {
    value = String(value);

    return (snippet.inArray(format, PADDING_ZERO_TYPES) >= 0 && value.length === 1) ? '0' + value : value;
};
