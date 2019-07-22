/**
 * @fileoverview Spinbox (in TimePicker)
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 * @dependency code-snippet-1.0.2
 */

'use strict';

var snippet = require('tui-code-snippet');

var domutil = require('./../../utils/domutil');
var domevent = require('./../../utils/domevent');
var tmpl = require('./../../template/timepicker/spinbox.hbs');
var timeFormat = require('./../../template/helpers/timeFormat');

var SELECTOR_UP_BUTTON = '.tui-timepicker-btn-up';
var SELECTOR_DOWN_BUTTON = '.tui-timepicker-btn-down';

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
        this._onChangeInput();
    },

    _makeDelegatedHandlers: function() {
        this._handlers = {};
        this._handlers.onClickUpbutton = domevent.delegateHandler(
            this._container,
            SELECTOR_UP_BUTTON,
            snippet.bind(this._setNextValue, this, false)
        );
        this._handlers.onClickDownbutton = domevent.delegateHandler(
            this._container,
            SELECTOR_DOWN_BUTTON,
            snippet.bind(this._setNextValue, this, true)
        );
        this._handlers.onKeydown = domevent.delegateHandler(
            this._container,
            'input',
            snippet.bind(this._onKeyDownInputElement, this)
        );
        this._handlers.onChange = domevent.delegateHandler(
            this._container,
            'input',
            snippet.bind(this._onChangeInput, this)
        );
    },

    /**
     * Assign default events to up/down button
     * @private
     */
    _setEvents: function() {
        this._makeDelegatedHandlers();
        domevent.on(this._container, 'click', this._handlers.onClickUpbutton);
        domevent.on(this._container, 'click', this._handlers.onClickDownbutton);
        domevent.on(this._container, 'keydown', this._handlers.onKeydown);
        domevent.on(this._container, 'change', this._handlers.onChange);

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

        domevent.off(this._container, 'click.spinbox.upbutton', this._handlers.onClickUpbutton);
        domevent.off(this._container, 'click.spinbox.downbutton', this._handlers.onClickDownbutton);
        domevent.off(this._container, 'keydown.spinbox', this._handlers.onKeydown);
        domevent.off(this._container, 'change.spinbox', this._handlers.onChange);
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
