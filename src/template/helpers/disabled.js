/**
 * @fileoverview Handlebars helper - if lookup
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

/**
 * @param {Array} array - array
 * @param {number} index - index of array
 * @returns {string} - 'disabled' if array[index] is truethy, '' if array[index] is falsy
 */
module.exports = function(array, index) {
    var value = array.length > index ? array[index] : null;

    if (value) {
        return ' disabled';
    }

    return '';
};
