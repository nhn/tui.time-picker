/**
 * @fileoverview Selectbox (in TimePicker)
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');
var domUtil = require('tui-dom');

var util = require('../util');
var tmpl = require('./../../template/timepicker/selectbox.hbs');

/**
 * @class
 * @ignore
 * @param {string|HTMLElement} container - Container element or selector
 * @param {object} options - Options
 * @param {Array.<number>} options.items - Items
 * @param {number} options.initialValue - Initial value
 */
var Selectbox = snippet.defineClass(/** @lends Selectbox.prototype */ {
    init: function(container, options) {
        options = snippet.extend({
            items: []
        }, options);

        /**
         * Container element
         * @type {HTMLElement}
         * @private
         */
        this._container = snippet.isHTMLNode(container) ? container : document.querySelector(container);

        /**
         * Selectbox items
         * @type {Array.<number>}
         * @private
         */
        this._items = options.items || [];

        /**
         * Selectbox disabled items info
         * @type {Array.<number>}
         * @private
         */
        this._disabledItems = options.disabledItems || [];

        /**
         * Selected index
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

        /**
         * Element
         * @type {HTMLElement}
         * @private
         */
        this._element = null;

        this._render();
        this._setEvents();
    },

    /**
     * Render selectbox
     * @private
     */
    _render: function() {
        var context;

        this._changeEnabledIndex();
        context = {
            items: this._items,
            initialValue: this.getValue(),
            format: this._format,
            disabledItems: snippet.map(this._disabledItems, function(item) {
                if (item) {
                    return 'disabled';
                }

                return '';
            })
        };

        if (this._element) {
            domUtil.removeElement(this._element);
        }
        this._container.innerHTML = tmpl(context);
        this._element = this._container.firstChild;
    },

    /**
     * Change the index of the enabled item
     * @private
     */
    _changeEnabledIndex: function() {
        var index = snippet.inArray(this.getValue(), this._items);
        if (this._disabledItems[index]) {
            this._selectedIndex = snippet.inArray(false, this._disabledItems);
        }
    },

    /**
     * Set disabledItems
     * @param {object} disabledItems - disabled status of items
     * @private
     */
    setDisabledItems: function(disabledItems) {
        this._disabledItems = disabledItems;
        this._render();
    },

    /**
     * Set events
     * @private
     */
    _setEvents: function() {
        var type = 'change';
        if (snippet.browser.msie && snippet.browser.version === 8) {
            type = 'click';
        }

        domUtil.on(this._container, type, this._onChangeHandler, this);

        this.on('changeItems', function(items) {
            this._items = items;
            this._render();
        }, this);
    },

    /**
     * Remove events
     * @private
     */
    _removeEvents: function() {
        this.off();

        domUtil.off(this._container, 'change click', this._onChangeHandler, this);
    },

    /**
     * Change event handler
     * @param {Event} ev Change event on a select element.
     * @private
     */
    _onChangeHandler: function(ev) {
        if (domUtil.closest(util.getTarget(ev), 'select')) {
            this._setNewValue();
        }
    },

    /**
     * Set new value
     * @private
     */
    _setNewValue: function() {
        var newValue = Number(this._element.value);
        this._selectedIndex = snippet.inArray(newValue, this._items);
        this.fire('change', {
            value: newValue
        });
    },

    /**
     * Returns current value
     * @returns {number}
     */
    getValue: function() {
        return this._items[this._selectedIndex];
    },

    /**
     * Set value
     * @param {number} value - New value
     */
    setValue: function(value) {
        var newIndex = snippet.inArray(value, this._items);

        if (newIndex > -1 && newIndex !== this._selectedIndex) {
            this._selectedIndex = newIndex;
            this._element.value = value;
            this._setNewValue();
        }
    },

    /**
     * Destory
     */
    destroy: function() {
        this._removeEvents();
        domUtil.removeElement(this._element);
        this._container
            = this._items
            = this._selectedIndex
            = this._element
            = null;
    }
});

snippet.CustomEvents.mixin(Selectbox);
module.exports = Selectbox;
