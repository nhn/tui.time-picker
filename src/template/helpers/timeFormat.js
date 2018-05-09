/**
 * @fileoverview Handlebars helper - Equals
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var PADDING_ZERO_TYPES = ['hh', 'mm'];

/**
 * @param {number} value time or minute
 * @param {string} format - timeFormat
 * @returns {boolean}
 */
module.exports = function(value, format) {
    value = String(value);

    return (PADDING_ZERO_TYPES.indexOf(format) >= 0 && value.length === 1) ? '0' + value : value;
};
