/**
 * @fileoverview Spinbox (in TimePicker)
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 * @dependency tui-code-snippet ^1.3.0
 */

'use strict';

var snippet = require('tui-code-snippet');
var domUtil = require('tui-dom');

var tmpl = require('./../../template/timepicker/spinbox.hbs');
var timeFormat = require('./../../template/helpers/timeFormat');

var SELECTOR_UP_BUTTON = '.tui-timepicker-btn-up';
var SELECTOR_DOWN_BUTTON = '.tui-timepicker-btn-down';

/**
 * @class
 * @ignore
 * @param {HTMLElement} container - Container of spinbox
 * @param {Object} [options] - Options for initialization
 * @param {number} [options.initialValue] - initial setting value
 * @param {Array.<number>} [options.items] - numbers that spinbox can display, if a number is disabled the number will not displayed
 * @param {Array.<boolean>} [options.disabledItems] - true if it is disabled, false if it is enabled
 * @param {string} [options.format] - format to display numbers of spinbox
 */
var Spinbox = snippet.defineClass(/** @lends Spinbox.prototype */ {
    init: function(container, options) {
        options = snippet.extend({
            items: [],
            disabledItems: []
        }, options);

        /**
         * @type {HTMLElement}
         * @private
         */
        this._container = container;

        /**
         * Spinbox element
         * @type {HTMLElement}
         * @private
         */
        this._element = null;

        /**
         * @type {HTMLElement}
         * @private
         */
        this._inputElement = null;

        /**
         * @type {HTMLElement}
         * @private
         */
        this._upButton = null;

        /**
         * @type {HTMLElement}
         * @private
         */
        this._downButton = null;

        /**
         * Spinbox value items
         * @type {Array.<number>}
         * @private
         */
        this._items = options.items;

        /**
         * Selectbox disabled items info
         * @type {Array.<boolean>}
         * @private
         */
        this._disabledItems = options.disabledItems;

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
        var context, element;

        if (this._disabledItems[snippet.inArray(this.getValue(), this._items)]) {
            this._selectedIndex = this._findEnabledIndex();
        }
        context = {
            maxLength: this._getMaxLength(),
            initialValue: this.getValue(),
            format: this._format
        };

        this._element = element = document.createElement('DIV');
        element.innerHTML = tmpl(context);
        this._container.appendChild(element);

        this._inputElement = element.getElementsByTagName('input')[0];
        this._upButton = domUtil.find(element, SELECTOR_UP_BUTTON);
        this._downButton = domUtil.find(element, SELECTOR_DOWN_BUTTON);
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
     * Returns max string length of value
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
     * @param {Array.<boolean>} disabledItems - disabled status of items
     */
    setDisabledItems: function(disabledItems) {
        this._disabledItems = disabledItems;
        this._onChangeInput();
    },

    /**
     * Assign default events to up/down button
     * @private
     */
    _setEvents: function() {
        this._onClickUpButton = snippet.bind(this._setNextValue, this, false);
        this._onClickDownButton = snippet.bind(this._setNextValue, this, true);

        domUtil.on(this._upButton, 'click', this._onClickUpButton);
        domUtil.on(this._downButton, 'click', this._onClickDownButton);
        domUtil.on(this._inputElement, 'keydown', this._onKeyDownInput, this);
        domUtil.on(this._inputElement, 'change', this._onChangeInput, this);

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
    _onKeyDownInput: function(event) {
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
        var newValue = parseInt(this._inputElement.value, 10);
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
        this._inputElement.value = timeFormat(value, this._format);
        this._onChangeInput();
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
        domUtil.off(this._upButton, 'click', this._onClickUpButton);
        domUtil.off(this._downButton, 'click', this._onClickDownButton);
        domUtil.off(this._inputElement, 'keydown', this._onKeyDownInput);
        domUtil.off(this._inputElement, 'change', this._onChangeInput);

        this._container.removeChild(this._element);

        this._container
            = this._element
            = this._inputElement
            = this._upButton
            = this._downButton
            = this._items
            = this._selectedIndex
            = null;
    }
});

snippet.CustomEvents.mixin(Spinbox);
module.exports = Spinbox;
