/**
 * @fileoverview Selectbox (in TimePicker)
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var snippet = require('tui-code-snippet');
var domUtil = require('tui-dom');

var eventUtil = require('../../js/util/eventUtil');

var tmpl = require('./../../template/timepicker/selectbox.hbs');
/**
 * @class
 * @ignore
 * @param {HTMLElement} container - Container element
 * @param {Object} [options] - Options for initialization
 * @param {number} [options.initialValue] - initial setting value
 * @param {Array.<number>} [options.items] - numbers that spinbox can display, if a number is disabled the number will not displayed
 * @param {Array.<boolean>} [options.disabledItems] - true if it is disabled, false if it is enabled
 * @param {string} [options.format] - format to display numbers of spinbox
 */
var Selectbox = snippet.defineClass(/** @lends Selectbox.prototype */ {
    init: function(container, options) {
        options = snippet.extend({
            items: [],
            disabledItems: []
        }, options);

        /**
         * Container element
         * @type {HTMLElement}
         * @private
         */
        this._container = container;

        /**
         * Selectbox items
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
            disabledItems: this._disabledItems
        };

        this._container.innerHTML = tmpl(context);
        this._element = this._container.getElementsByTagName('SELECT')[0];
    },

    /**
     * Change the index of the enabled item
     * @private
     */
    _changeEnabledIndex: function() {
        if (this._disabledItems[snippet.inArray(this.getValue(), this._items)]) {
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
        this._setEvents();
    },

    /**
     * Set events
     * @private
     */
    _setEvents: function() {
        domUtil.on(this._element, 'change', this._onChange, this);
        this.on('changeItems', function(items) {
            this._items = items;
            this._render();
        }, this);
    },

    /**
     * Change event handler
     * @param {jQuery.Event} ev - Event object
     * @private
     */
    _onChange: function(ev) {
        var target = ev.target || ev.srcElement;
        var newValue = parseInt(target.value, 10);

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
            eventUtil.dispatchEvent(this._element, eventUtil.createEvent('change'));
        }
    },

    /**
     * Destory
     */
    destroy: function() {
        this.off();
        domUtil.off(this._element, 'change', this._onChange);
        this._container.removeChild(this._element);

        this._container
            = this._items
            = this._selectedIndex
            = this._element
            = null;
    }
});

snippet.CustomEvents.mixin(Selectbox);
module.exports = Selectbox;
