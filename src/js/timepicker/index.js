/**
 * @fileoverview TimePicker component
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 * @dependency tui-code-snippet ^1.3.0
 */

'use strict';

var snippet = require('tui-code-snippet');
var domUtil = require('tui-dom');

var Spinbox = require('./spinbox');
var Selectbox = require('./selectbox');
var util = require('./../util/util');
var localeTexts = require('./../localeTexts');
var tmpl = require('./../../template/timepicker/index.hbs');
var meridiemTemplate = require('./../../template/timepicker/meridiem.hbs');

var SELECTOR_MERIDIEM_ELELEMENT = '.tui-timepicker-meridiem';
var SELECTOR_HOUR_ELELEMENT = '.tui-timepicker-hour';
var SELECTOR_MINUTE_ELELEMENT = '.tui-timepicker-minute';
var CLASS_NAME_LEFT_MERIDIEM = 'tui-has-left';

/**
 * Merge default options
 * @ignore
 * @param {object} options - options
 * @returns {object} Merged options
 */
var mergeDefaultOptions = function(options) {
    return snippet.extend({
        language: 'en',
        initialHour: 0,
        initialMinute: 0,
        showMeridiem: true,
        inputType: 'selectbox',
        hourStep: 1,
        minuteStep: 1,
        meridiemPosition: 'right',
        format: 'h:m',
        disabledHours: [],
        usageStatistics: true
    }, options);
};

/**
 * @class
 * @param {string|jQuery|HTMLElement} container - Container element
 * @param {Object} [options] - Options for initialization
 * @param {number} [options.initialHour = 0] - Initial setting value of hour
 * @param {number} [options.initialMinute = 0] - Initial setting value of minute
 * @param {number} [options.hourStep = 1] - Step value of hour
 * @param {number} [options.minuteStep = 1] - Step value of minute
 * @param {string} [options.inputType = 'selectbox'] - 'selectbox' or 'spinbox'
 * @param {string} [options.format = 'h:m'] - hour, minute format for display
 * @param {boolean} [options.showMeridiem = true] - Show meridiem expression?
 * @param {Array.<boolean>} [options.disabledHours = []] - Registered Hours is disabled.
 * @param {string} [options.meridiemPosition = 'right'] - Set location of the meridiem element.
 *                 If this option set 'left', the meridiem element is created in front of the hour element.
 * @param {string} [options.language = 'en'] Set locale texts
 * @param {Boolean} [options.usageStatistics=true|false] send hostname to google analytics [default value is true]
 * @example
 * var timepicker = new tui.TimePicker('#timepicker-container', {
 *     initialHour: 15,
 *     initialMinute: 13,
 *     inputType: 'selectbox',
 *     showMeridiem: false
 * });
 */
var TimePicker = snippet.defineClass(/** @lends TimePicker.prototype */ {
    static: {
        /**
         * Locale text data
         * @type {object}
         * @memberof TimePicker
         * @static
         * @example
         * var TimePicker = tui.TimePicker; // or require('tui-time-picker');
         *
         * TimePicker.localeTexts['customKey'] = {
         *     am: 'a.m.',
         *     pm: 'p.m.'
         * };
         *
         * var instance = new tui.TimePicker('#timepicker-container', {
         *     language: 'customKey',
         * });
         */
        localeTexts: localeTexts
    },
    init: function(container, options) {
        options = mergeDefaultOptions(options);

        /**
         * @type {HTMLElement}
         * @private
         */
        this._container = this._getContainer(container);

        /**
         * @type {HTMLElement}
         * @private
         */
        this._element = null;

        /**
         * @type {HTMLElement}
         * @private
         */
        this._meridiemElement = null;

        /**
         * @type {HTMLElement}
         * @private
         */
        this._amEl = null;

        /**
         * @type {HTMLElement}
         * @private
         */
        this._pmEl = null;

        /**
         * @type {boolean}
         * @private
         */
        this._showMeridiem = options.showMeridiem;

        /**
         * Meridiem postion
         * @type {'left'|'right'}
         * @private
         */
        this._meridiemPosition = options.meridiemPosition;

        /**
         * @type {Spinbox|Selectbox}
         * @private
         */
        this._hourInput = null;

        /**
         * @type {Spinbox|Selectbox}
         * @private
         */
        this._minuteInput = null;

        /**
         * @type {number}
         * @private
         */
        this._hour = options.initialHour;

        /**
         * @type {number}
         * @private
         */
        this._minute = options.initialMinute;

        /**
         * @type {number}
         * @private
         */
        this._hourStep = options.hourStep;

        /**
         * @type {number}
         * @private
         */
        this._minuteStep = options.minuteStep;

        /**
         * @type {Array.<boolean>}
         * @private
         */
        this._disabledHours = options.disabledHours;

        /**
         * TimePicker inputType
         * @type {'spinbox'|'selectbox'}
         * @private
         */
        this._inputType = options.inputType;

        /**
         * Locale text for meridiem
         * @type {string}
         * @private
         */
        this._localeText = localeTexts[options.language];

        /**
         * Time format for output
         * @type {string}
         * @private
         */
        this._format = this._getValidTimeFormat(options.format);

        this._render();
        this._setEvents();

        if (options.usageStatistics) {
            util.sendHostName();
        }
    },

    /**
     * Get HTMLElement from indicator
     * @param {string|jQuery|HTMLElement} container - selector, jQuery Element, HTMLElement for indicating target element
     * @returns {HTMLElement|null} - element needed to append timepicker
     */
    _getContainer: function(container) {
        var htmlElement = typeof HTMLElement !== 'undefined' ? HTMLElement : Element;
        var target = null;

        if (!container) {
            return null;
        }

        if (typeof container === 'string') {
            target = domUtil.find(container);
        } else if (container.get) {/* jQuery */
            target = container.get(0);
        } else if (container instanceof htmlElement) {
            target = container;
        }

        return target;
    },

    /**
     * Set event handlers to selectors, container
     * @private
     */
    _setEvents: function() {
        this._hourInput.on('change', this._onChangeTimeInput, this);
        this._minuteInput.on('change', this._onChangeTimeInput, this);

        if (this._showMeridiem) {
            domUtil.on(this._meridiemElement, 'change', this._onChangeMeridiem, this);
        }
    },

    /**
     * Render element
     * @private
     */
    _render: function() {
        var context = {
            showMeridiem: this._showMeridiem,
            inputType: this._inputType
        };

        if (this._showMeridiem) {
            snippet.extend(context, {
                meridiemElement: this._makeMeridiemHTML()
            });
        }

        this._container.innerHTML = tmpl(context);
        this._element = this._container.childNodes[0];

        this._renderTimeInputs();

        if (this._showMeridiem) {
            this._setMeridiemElement();
        }
    },

    /**
     * Set meridiem element on timepicker
     * @private
     */
    _setMeridiemElement: function() {
        var values;

        if (this._meridiemPosition === 'left') {
            domUtil.addClass(this._element, CLASS_NAME_LEFT_MERIDIEM);
        }
        this._meridiemElement = domUtil.find(this._element, SELECTOR_MERIDIEM_ELELEMENT);
        values = this._meridiemElement.getElementsByTagName(this._inputType === 'selectbox' ? 'option' : 'input');

        this._amEl = values[0];
        this._pmEl = values[1];
        this._syncToMeridiemElements();
    },

    /**
     * Make html for meridiem element
     * @returns {HTMLElement} Meridiem element
     * @private
     */
    _makeMeridiemHTML: function() {
        var localeText = this._localeText;

        return meridiemTemplate({
            inputType: this._inputType,
            am: localeText.am,
            pm: localeText.pm
        });
    },

    /**
     * Render time selectors
     * @private
     */
    _renderTimeInputs: function() {
        var hour = this._hour;
        var showMeridiem = this._showMeridiem;
        var hourElement = domUtil.find(this._element, SELECTOR_HOUR_ELELEMENT);
        var minuteElement = domUtil.find(this._element, SELECTOR_MINUTE_ELELEMENT);
        var BoxComponent = this._inputType.toLowerCase() === 'selectbox' ? Selectbox : Spinbox;
        var formatExplode = this._format.split(':');
        var hourItems = this._getHourItems();

        if (showMeridiem) {
            hour = util.getMeridiemHour(hour);
        }

        this._hourInput = new BoxComponent(hourElement, {
            initialValue: hour,
            items: hourItems,
            format: formatExplode[0],
            disabledItems: this._makeDisabledStatItems(hourItems)
        });

        this._minuteInput = new BoxComponent(minuteElement, {
            initialValue: this._minute,
            items: this._getMinuteItems(),
            format: formatExplode[1]
        });
    },

    _makeDisabledStatItems: function(hourItems) {
        var disabledHours = this._disabledHours.concat();

        if (this._showMeridiem) {
            disabledHours = this._meridiemableTime(disabledHours);
        }

        return snippet.map(hourItems, function(hour) {
            if (snippet.inArray(hour, disabledHours) >= 0) {
                return true;
            }

            return false;
        });
    },

    _meridiemableTime: function(disabledHours) {
        var diffHour = 0;
        var startHour = 0;
        var endHour = 11;

        if (this._hour >= 12) {
            diffHour = 12;
            startHour = 12;
            endHour = 23;
        }

        disabledHours = snippet.map(disabledHours, function(hour) {
            if (hour >= startHour && hour <= endHour) {
                return (hour - diffHour === 0) ? 12 : hour - diffHour;
            }

            return false;
        });
        disabledHours = snippet.filter(disabledHours, function(hour) {
            return hour;
        });

        return disabledHours;
    },

    /**
     * Return formatted format.
     * @param {string} format - format option
     * @returns {string}
     * @private
     */
    _getValidTimeFormat: function(format) {
        if (!format.match(/^[h]{1,2}:[m]{1,2}$/i)) {
            return 'h:m';
        }

        return format.toLowerCase();
    },

    /**
     * Initialize meridiem elements
     * @private
     */
    _syncToMeridiemElements: function() {
        var isPM = this._hour >= 12;

        if (this._amEl) {
            this._amEl.setAttribute('selected', !isPM);
            this._amEl.setAttribute('checked', !isPM);
        }

        if (this._pmEl) {
            this._pmEl.setAttribute('selected', isPM);
            this._pmEl.setAttribute('checked', isPM);
        }
    },

    /**
     * Set values in spinboxes from time
     * @private
     */
    _syncToInputs: function() {
        var hour = this._hour;
        var minute = this._minute;

        if (this._showMeridiem) {
            hour = util.getMeridiemHour(hour);
        }

        this._hourInput.setValue(hour);
        this._minuteInput.setValue(minute);
    },

    /**
     * DOM event handler
     * @param {Event} event - Change event on meridiem element
     * @private
     */
    _onChangeMeridiem: function(event) {
        var hour = this._hour;
        var isPM = (event.target.value === 'PM');

        hour = this._to24Hour(isPM, hour);
        this.setTime(hour, this._minute);
        this._setDisabledHours();
    },

    /**
     * Time change event handler
     * @private
     */
    _onChangeTimeInput: function() {
        var hour = this._hourInput.getValue();
        var minute = this._minuteInput.getValue();
        var isPM = this._hour >= 12;

        if (this._showMeridiem) {
            hour = this._to24Hour(isPM, hour);
        }
        this.setTime(hour, minute);
    },

    /**
     * 12Hour-expression to 24Hour-expression
     * @param {boolean} isPM - Is pm?
     * @param {number} hour - Hour
     * @returns {number}
     * @private
     */
    _to24Hour: function(isPM, hour) {
        hour %= 12;
        if (isPM) {
            hour += 12;
        }

        return hour;
    },

    _setDisabledHours: function() {
        var hourItems = this._getHourItems();
        var disabledItems = this._makeDisabledStatItems(hourItems);

        this._hourInput.setDisabledItems(disabledItems);
    },

    /**
     * Get items of hour
     * @returns {array} Hour item list
     * @private
     */
    _getHourItems: function() {
        var step = this._hourStep;

        return this._showMeridiem ? util.getRangeArr(1, 12, step) : util.getRangeArr(0, 23, step);
    },

    /**
     * Get items of minute
     * @returns {array} Minute item list
     * @private
     */
    _getMinuteItems: function() {
        return util.getRangeArr(0, 59, this._minuteStep);
    },

    /**
     * Whether the hour and minute are in valid items or not
     * @param {number} hour - Hour value
     * @param {number} minute - Minute value
     * @returns {boolean} State
     * @private
     */
    _validItems: function(hour, minute) {
        if (this._showMeridiem) {
            hour = util.getMeridiemHour(hour);
        }

        return snippet.inArray(hour, this._getHourItems()) > -1 &&
            snippet.inArray(minute, this._getMinuteItems()) > -1;
    },

    /**
     * Set step of hour
     * @param {array} step - Step to create items of hour
     */
    setHourStep: function(step) {
        this._hourStep = step;
        this._hourInput.fire('changeItems', this._getHourItems());
    },

    /**
     * Get step of hour
     * @returns {number} Step of hour
     */
    getHourStep: function() {
        return this._hourStep;
    },

    /**
     * Set step of minute
     * @param {array} step - Step to create items of minute
     */
    setMinuteStep: function(step) {
        this._minuteStep = step;
        this._minuteInput.fire('changeItems', this._getMinuteItems());
    },

    /**
     * Get step of minute
     * @returns {number} Step of minute
     */
    getMinuteStep: function() {
        return this._minuteStep;
    },

    /**
     * Show time picker element
     */
    show: function() {
        domUtil.removeClass(this._element, 'hide');
    },

    /**
     * Hide time picker element
     */
    hide: function() {
        domUtil.addClass(this._element, 'hide');
    },

    /**
     * Set hour
     * @param {number} hour for time picker - (0~23)
     * @returns {boolean} result of set time
     */
    setHour: function(hour) {
        return this.setTime(hour, this._minute);
    },

    /**
     * Set minute
     * @param {number} minute for time picker
     * @returns {boolean} result of set time
     */
    setMinute: function(minute) {
        return this.setTime(this._hour, minute);
    },

    /**
     * Set time
     * @param {number} hour for time picker - (0~23)
     * @param {number} minute for time picker
     */
    setTime: function(hour, minute) {
        var isNumber = snippet.isNumber(hour) && snippet.isNumber(minute);

        if (!isNumber || (hour > 23) || (minute > 59)) {
            return;
        }

        if (!this._validItems(hour, minute)) {
            return;
        }

        this._hour = hour;
        this._minute = minute;

        this._syncToInputs();
        this._syncToMeridiemElements();

        /**
         * Change event - TimePicker
         * @event TimePicker#change
         */
        this.fire('change', {
            hour: this._hour,
            minute: this._minute
        });
    },

    /**
     * Get hour
     * @returns {number} hour - (0~23)
     */
    getHour: function() {
        return this._hour;
    },

    /**
     * Get minute
     * @returns {number} minute
     */
    getMinute: function() {
        return this._minute;
    },

    /**
     * Change locale text of meridiem by language code
     * @param {string} language - Language code
     */
    changeLanguage: function(language) {
        this._localeText = localeTexts[language];
        this._render();
    },

    /**
     * Destroy
     */
    destroy: function() {
        this.off();
        this._hourInput.destroy();
        this._minuteInput.destroy();

        if (this._showMeridiem) {
            domUtil.off(this._meridiemElement, 'change', this._onChangeMeridiem);
        }

        this._container.removeChild(this._element);

        this._container
            = this._showMeridiem
            = this._hourInput
            = this._minuteInput
            = this._hour
            = this._minute
            = this._inputType
            = this._element
            = this._meridiemElement
            = this._amEl
            = this._pmEl
            = null;
    }
});

snippet.CustomEvents.mixin(TimePicker);
module.exports = TimePicker;
