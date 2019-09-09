/**
 * @fileoverview Spinbox (in TimePicker)
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');
var domUtil = require('tui-dom');

var util = require('../util');
var tmpl = require('./../../template/timepicker/spinbox.hbs');
var timeFormat = require('./../../template/helpers/timeFormat');

var SELECTOR_UP_BUTTON = '.tui-timepicker-btn-up';
var SELECTOR_DOWN_BUTTON = '.tui-timepicker-btn-down';

/**
 * @class
 * @ignore
 * @param {String|HTMLElement} container - Container of spinbox or selector
 * @param {Object} [options] - Options for initialization
 * @param {number} [options.initialValue] - initial setting value
 * @param {Array.<number>} items - Items
 */
var Spinbox = snippet.defineClass(
  /** @lends Spinbox.prototype */ {
    init: function(container, options) {
      options = snippet.extend(
        {
          items: []
        },
        options
      );

      /**
       * @type {HTMLElement}
       * @private
       */
      this._container = snippet.isHTMLNode(container)
        ? container
        : document.querySelector(container);

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
      this._changeToInputValue();
    },

    /**
     * Assign default events to up/down button
     * @private
     */
    _setEvents: function() {
      domUtil.on(this._container, 'click', this._onClickHandler, this);
      domUtil.on(this._inputElement, 'keydown', this._onKeydownInputElement, this);
      domUtil.on(this._inputElement, 'change', this._onChangeHandler, this);

      this.on(
        'changeItems',
        function(items) {
          this._items = items;
          this._render();
        },
        this
      );
    },

    /**
     * Remove events to up/down button
     * @private
     */
    _removeEvents: function() {
      this.off();

      domUtil.off(this._container, 'click', this._onClickHandler, this);
      domUtil.off(this._inputElement, 'keydown', this._onKeydownInputElement, this);
      domUtil.off(this._inputElement, 'change', this._onChangeHandler, this);
    },

    /**
     * Click event handler
     * @param {Event} ev - Change event on up/down buttons.
     */
    _onClickHandler: function(ev) {
      var target = util.getTarget(ev);

      if (domUtil.closest(target, SELECTOR_DOWN_BUTTON)) {
        this._setNextValue(true);
      } else if (domUtil.closest(target, SELECTOR_UP_BUTTON)) {
        this._setNextValue(false);
      }
    },

    /**
     * Set input value
     * @param {boolean} isDown - From down-action?
     * @private
     */
    _setNextValue: function(isDown) {
      var index = this._selectedIndex;

      if (isDown) {
        index = index ? index - 1 : this._items.length - 1;
      } else {
        index = index < this._items.length - 1 ? index + 1 : 0;
      }

      if (this._disabledItems[index]) {
        this._selectedIndex = index;
        this._setNextValue(isDown);
      } else {
        this.setValue(this._items[index]);
      }
    },

    /**
     * DOM(Input element) Keydown Event handler
     * @param {Event} ev event-object
     * @private
     */
    _onKeydownInputElement: function(ev) {
      var keyCode = ev.which || ev.keyCode;
      var isDown;

      if (domUtil.closest(util.getTarget(ev), 'input')) {
        switch (keyCode) {
          case 38:
            isDown = false;
            break;
          case 40:
            isDown = true;
            break;
          default:
            return;
        }

        this._setNextValue(isDown);
      }
    },

    /**
     * DOM(Input element) Change Event handler
     * @param {Event} ev Change event on an input element.
     * @private
     */
    _onChangeHandler: function(ev) {
      if (domUtil.closest(util.getTarget(ev), 'input')) {
        this._changeToInputValue();
      }
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
      this._changeToInputValue();
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
      domUtil.removeElement(this._element);
      this._container = this._element = this._inputElement = this._items = this._selectedIndex = null;
    }
  }
);

snippet.CustomEvents.mixin(Spinbox);
module.exports = Spinbox;
