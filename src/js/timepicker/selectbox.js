/**
 * @fileoverview Selectbox (in TimePicker)
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var $ = require('jquery');
var snippet = require('tui-code-snippet');

var tmpl = require('./../../template/timepicker/selectbox.hbs');

/**
 * @class
 * @ignore
 * @param {jQuery|string|Element} container - Container element
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
         * @type {jQuery}
         * @private
         */
        this._$container = $(container);

        /**
         * Selectbox items
         * @type {Array.<number>}
         * @private
         */
        this._items = options.items || [];

        /**
         * Selected index
         * @type {number}
         * @private
         */
        this._selectedIndex = Math.max(0, snippet.inArray(options.initialValue, this._items));

        /**
         * Element
         * @type {jQuery}
         * @private
         */
        this._$element = $();

        this._render();
        this._setEvents();
    },

    /**
     * Render selectbox
     * @private
     */
    _render: function() {
        var context = {
            items: this._items,
            initialValue: this.getValue()
        };

        this._$element.remove();
        this._$element = $(tmpl(context));
        this._$element.appendTo(this._$container);
    },

    /**
     * Set events
     * @private
     */
    _setEvents: function() {
        this._$container.on('change.selectbox', 'select', $.proxy(this._onChange, this));
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
        var newValue = Number(ev.target.value);

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
            this._$element.val(value).change();
        }
    },

    /**
     * Destory
     */
    destroy: function() {
        this.off();
        this._$container.off('.selectbox');
        this._$element.remove();

        this._$container
            = this._items
            = this._selectedIndex
            = this._$element
            = this._$element
            = null;
    }
});

snippet.CustomEvents.mixin(Selectbox);
module.exports = Selectbox;
