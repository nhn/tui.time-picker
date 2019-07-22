/**
 * @fileoverview Spinbox (in TimePicker)
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 * @dependency code-snippet-1.0.2
 */

'use strict';

var snippet = require('tui-code-snippet');
var domutil = require('tui-dom');

var domevent = require('./../domevent');
var tmpl = require('./../../template/timepicker/spinbox.hbs');
var timeFormat = require('./../../template/helpers/timeFormat');

var CLASS_NAME_UP_BUTTON = 'tui-timepicker-btn-up';
var CLASS_NAME_DOWN_BUTTON = 'tui-timepicker-btn-down';

/**
 * @class
 * @ignore
 * @param {String|HTMLElement} container - Container of spinbox
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
         * @type {HTMLElement}
         * @private
         */
        this._container = snippet.isHTMLNode(container) ? container : document.querySelector(container);

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
        var index = snippet.inArray(this.getValue(), this._items);
        var context;

        if (this._disabledItems[index]) {
            this._selectedIndex = this._findEnabledIndex();
        }
        context = {
            maxLength: this._getMaxLength(),
            initialValue: this.getValue(),
            format: this._format
        };

        this._container.innerHTML = tmpl(context);
        this._element = this._container.firstChild;
        this._inputElement = this._element.querySelector('input');
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
        this._onChangeInput(null, true);
    },

    /**
     * Assign default events to up/down button
     * @private
     */
    _setEvents: function() {
        domutil.on(this._container, 'click', this._setNextValue, this);
        domutil.on(this._container, 'keydown', this._onKeyDownInputElement, this);
        domutil.on(this._container, 'change', this._onChangeInput, this);

        this.on('changeItems', function(items) {
            this._items = items;
            this._render();
        }, this);
    },

    /**
     * Remove events to up/down button
     * @private
     */
    _removeEvents: function() {
        this.off();

        domutil.off(this._container, 'click', this._setNextValue, this);
        domutil.off(this._container, 'keydown', this._onKeyDownInputElement, this);
        domutil.off(this._container, 'change', this._onChangeInput, this);
    },

    /**
     * Check which button is clicked.
     * @param {Event} event Change event on up/down buttons.
     * @returns {boolean}
     */
    _isDownButton: function(event) {
        var target = domevent.getTarget(event);
        var result;

        if (domutil.hasClass(target, CLASS_NAME_DOWN_BUTTON)) {
            result = true;
        } else if (domutil.hasClass(target, CLASS_NAME_UP_BUTTON)) {
            result = false;
        }

        return result;
    },

    /**
     * Calculate the next index.
     * @param {boolean} isDown From down-action?
     * @returns {number}
     */
    _getNextIndex: function(isDown) {
        var index = this._selectedIndex;

        if (isDown) {
            index = index ? index - 1 : this._items.length - 1;
        } else {
            index = (index < (this._items.length - 1)) ? index + 1 : 0;
        }

        return index;
    },

    /**
     * Set input value when user click a button.
     * @param {Event} event - Change event on up/down buttons.
     * @param {boolean} isDown - From down-action?
     * @private
     */
    _setNextValue: function(event, isDown) {
        var index;

        if (event) {
            isDown = this._isDownButton(event);
            if (snippet.isUndefined(isDown)) {
                return;
            }
        }

        index = this._getNextIndex(isDown);

        if (this._disabledItems[index]) {
            this._selectedIndex = index;
            this._setNextValue(null, isDown);

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
        var target = domevent.getTarget(event);
        var keyCode = event.which || event.keyCode;
        var isDown;

        if (target.tagName !== 'INPUT') {
            return;
        }

        switch (keyCode) {
            case 38:
                isDown = false;
                break;
            case 40:
                isDown = true;
                break;
            default: return;
        }

        this._setNextValue(null, isDown);
    },

    /**
     * DOM(Input element) Change Event handler
     * @param {Event} event Change event on an input element.
     * @param {boolean} isChanged Invoke after setting new value?
     * @private
     */
    _onChangeInput: function(event, isChanged) {
        if ((event && domevent.getTarget(event).tagName !== 'INPUT') || !isChanged) {
            return;
        }
        this._changeToInputValue();
    },

    /**
     * Change value to input-box if it is valid.
     * @private
     */
    _changeToInputValue: function() {
        var newValue = Number(this._inputElement.value);
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
        this._onChangeInput(null, true);
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
        this._removeEvents();
        domutil.removeElement(this._element);
        this._container
            = this._element
            = this._inputElement
            = this._items
            = this._selectedIndex
            = null;
    }
});

snippet.CustomEvents.mixin(Spinbox);
module.exports = Spinbox;
