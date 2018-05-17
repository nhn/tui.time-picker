/**
 * @fileoverview Spinbox (in TimePicker)
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 * @dependency jquery-1.8.3, code-snippet-1.0.2
 */

'use strict';

var $ = require('jquery');
var snippet = require('tui-code-snippet');

var tmpl = require('./../../template/timepicker/spinbox.hbs');
var timeFormat = require('./../../template/helpers/timeFormat');

var SELECTOR_UP_BUTTON = '.tui-timepicker-btn-up';
var SELECTOR_DOWN_BUTTON = '.tui-timepicker-btn-down';

/**
 * @class
 * @ignore
 * @param {jQuery|String|HTMLElement} container - Container of spinbox
 * @param {Object} [options] - Options for initialization
 * @param {number} [options.initialValue] - initial setting value
 * @param {Array.<number>} items - Items
 */
var Spinbox = snippet.defineClass(/** @lends Spinbox.prototype */ {
    init: function(container, options) {
        options = snippet.extend({
            items: []
        }, options);

        /**
         * @type {jQuery}
         * @private
         */
        this._$container = $(container);

        /**
         * Spinbox element
         * @type {jQuery}
         * @private
         */
        this._$element = null;

        /**
         * @type {jQuery}
         * @private
         */
        this._$inputElement = null;

        /**
         * Spinbox value items
         * @type {Array.<number>}
         * @private
         */
        this._items = options.items;

        /**
         * Selectbox disabled items info
         * @type {Array.<number>}
         * @private
         */
        this._disabledItems = options.disabledItems || [];

        /**
         * @type {number}
         * @private
         */
        this._selectedIndex = Math.max(0, snippet.inArray(options.initialValue, this._items));

        /**
         * Time format for output
         * @type {string}
         * @private
         */
        this._format = options.format;

        this._render();
        this._setEvents();
    },

    /**
     * Render spinbox
     * @private
     */
    _render: function() {
        var context;

        if (this._disabledItems[this._items.indexOf(this.getValue())]) {
            this._selectedIndex = this._findEnabledIndex();
        }
        context = {
            maxLength: this._getMaxLength(),
            initialValue: this.getValue(),
            format: this._format
        };

        this._$element = $(tmpl(context));
        this._$element.appendTo(this._$container);
        this._$inputElement = this._$element.find('input');
    },

    /**
     * Find the index of the enabled item
     * @returns {number} - find selected index
     * @private
     */
    _findEnabledIndex: function() {
        return snippet.inArray(false, this._disabledItems);
    },

    /**
     * Returns maxlength of value
     * @returns {number}
     * @private
     */
    _getMaxLength: function() {
        var lengths = snippet.map(this._items, function(item) {
            return String(item).length;
        });

        return Math.max.apply(null, lengths);
    },

    /**
     * Set disabledItems
     * @param {object} disabledItems - disabled status of items
     */
    setDisabledItems: function(disabledItems) {
        this._disabledItems = disabledItems;
        this._$inputElement.change();
    },

    /**
     * Assign default events to up/down button
     * @private
     */
    _setEvents: function() {
        this._$container.on('click.spinbox', SELECTOR_UP_BUTTON, $.proxy(this._setNextValue, this, false))
            .on('click.spinbox', SELECTOR_DOWN_BUTTON, $.proxy(this._setNextValue, this, true))
            .on('keydown.spinbox', 'input', $.proxy(this._onKeyDownInputElement, this))
            .on('change.spinbox', 'input', $.proxy(this._onChangeInput, this));

        this.on('changeItems', function(items) {
            this._items = items;
            this._render();
        }, this);
    },

    /**
     * Set input value when user click a button.
     * @param {boolean} isDown - From down-action?
     * @private
     */
    _setNextValue: function(isDown) {
        var index = this._selectedIndex;

        if (isDown) {
            index = index ? index - 1 : this._items.length - 1;
        } else {
            index = (index < (this._items.length - 1)) ? index + 1 : 0;
        }

        if (this._disabledItems[index]) {
            this._selectedIndex = index;
            this._setNextValue(isDown);

            return;
        }
        this.setValue(this._items[index]);
    },

    /**
     * DOM(Input element) Keydown Event handler
     * @param {Event} event event-object
     * @private
     */
    _onKeyDownInputElement: function(event) {
        var keyCode = event.which || event.keyCode;
        var isDown;

        switch (keyCode) {
            case 38:
                isDown = false;
                break;
            case 40:
                isDown = true;
                break;
            default: return;
        }

        this._setNextValue(isDown);
    },

    /**
     * DOM(Input element) Change Event handler
     * @private
     */
    _onChangeInput: function() {
        var newValue = Number(this._$inputElement.val());
        var newIndex = snippet.inArray(newValue, this._items);
        if (this._disabledItems[newIndex]) {
            newIndex = this._findEnabledIndex();
            newValue = this._items[newIndex];
        } else if (newIndex === this._selectedIndex) {
            return;
        }

        if (newIndex === -1) {
            this.setValue(this._items[this._selectedIndex]);
        } else {
            this._selectedIndex = newIndex;
            this.fire('change', {
                value: newValue
            });
        }
    },

    /**
     * Set value to input-box.
     * @param {number} value - Value
     */
    setValue: function(value) {
        this._$inputElement.val(timeFormat(value, this._format)).change();
    },

    /**
     * Returns current value
     * @returns {number}
     */
    getValue: function() {
        return this._items[this._selectedIndex];
    },

    /**
     * Destory
     */
    destroy: function() {
        this.off();
        this._$container.off('.spinbox');
        this._$element.remove();
        this._$container
            = this._$element
            = this._$inputElement
            = this._items
            = this._selectedIndex
            = null;
    }
});

snippet.CustomEvents.mixin(Spinbox);
module.exports = Spinbox;
