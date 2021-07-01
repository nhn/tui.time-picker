/**
 * @fileoverview TimePicker component
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var inArray = require('tui-code-snippet/array/inArray');
var forEachArray = require('tui-code-snippet/collection/forEachArray');
var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
var defineClass = require('tui-code-snippet/defineClass/defineClass');
var extend = require('tui-code-snippet/object/extend');
var on = require('tui-code-snippet/domEvent/on');
var off = require('tui-code-snippet/domEvent/off');
var addClass = require('tui-code-snippet/domUtil/addClass');
var closest = require('tui-code-snippet/domUtil/closest');
var removeElement = require('tui-code-snippet/domUtil/removeElement');
var removeClass = require('tui-code-snippet/domUtil/removeClass');
var isHTMLNode = require('tui-code-snippet/type/isHTMLNode');
var isNumber = require('tui-code-snippet/type/isNumber');

var Spinbox = require('./spinbox');
var Selectbox = require('./selectbox');
var util = require('../util');
var localeTexts = require('./../localeTexts');
var tmpl = require('../../template/index');
var meridiemTmpl = require('../../template/meridiem');

var SELECTOR_HOUR_ELEMENT = '.tui-timepicker-hour';
var SELECTOR_MINUTE_ELEMENT = '.tui-timepicker-minute';
var SELECTOR_MERIDIEM_ELEMENT = '.tui-timepicker-meridiem';
var CLASS_NAME_LEFT_MERIDIEM = 'tui-has-left';
var CLASS_NAME_HIDDEN = 'tui-hidden';
var CLASS_NAME_CHECKED = 'tui-timepicker-meridiem-checked';
var INPUT_TYPE_SPINBOX = 'spinbox';
var INPUT_TYPE_SELECTBOX = 'selectbox';

var START_NUMBER_OF_TIME = 0;
var END_NUMBER_OF_MINUTE = 59;
var END_NUMBER_OF_HOUR = 23;
var END_NUMBER_OF_HOUR_WITH_MERIDIEM = 12;

/**
 * Merge default options
 * @ignore
 * @param {object} options - options
 * @returns {object} Merged options
 */
var mergeDefaultOptions = function(options) {
  return extend(
    {
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
      disabledMinutes: {},
      usageStatistics: true
    },
    options
  );
};

/**
 * @class
 * @param {string|HTMLElement} container - Container element or selector
 * @param {Object} [options] - Options for initialization
 * @param {number} [options.initialHour = 0] - Initial setting value of hour
 * @param {number} [options.initialMinute = 0] - Initial setting value of minute
 * @param {number} [options.hourStep = 1] - Step value of hour
 * @param {number} [options.minuteStep = 1] - Step value of minute
 * @param {string} [options.inputType = 'selectbox'] - 'selectbox' or 'spinbox'
 * @param {string} [options.format = 'h:m'] - hour, minute format for display
 * @param {boolean} [options.showMeridiem = true] - Show meridiem expression?
 * @param {Array} [options.disabledHours = []] - Registered Hours is disabled.
 * @param {Object} [options.disabledMinutes = {}] - Registered Minutes of selected hours is disabled.
 * @param {Object} [options.disabledMinutes.hour] - Key must be hour(number).
 *                 Value is array which contains only true or false and must be 60 of length
 * @param {string} [options.meridiemPosition = 'right'] - Set location of the meridiem element.
 *                 If this option set 'left', the meridiem element is created in front of the hour element.
 * @param {string} [options.language = 'en'] Set locale texts
 * @param {Boolean} [options.usageStatistics=true|false] send hostname to google analytics [default value is true]
 * @example
 * // ES6
 * import TimePicker from 'tui-time-picker'; 
 * 
 * // CommonJS
 * const TimePicker = require('tui-time-picker'); 
 * 
 * // Browser
 * const TimePicker = tui.TimePicker;
 * 
 * const timepicker = new TimePicker('#timepicker-container', {
 *     initialHour: 15,
 *     initialMinute: 13,
 *     inputType: 'selectbox',
 *     showMeridiem: false
 * });
 */
var TimePicker = defineClass(
  /** @lends TimePicker.prototype */ {
    static: {
      /**
       * Locale text data
       * @type {object}
       * @memberof TimePicker
       * @static
       * @example
       * TimePicker.localeTexts['customKey'] = {
       *     am: 'a.m.',
       *     pm: 'p.m.'
       * };
       *
       * const instance = new TimePicker('#timepicker-container', {
       *     language: 'customKey',
       * });
       */
      localeTexts: localeTexts
    },
    init: function(container, options) {
      options = mergeDefaultOptions(options);

      /**
       * @type {number}
       * @private
       */
      this.id = util.getUniqueId();

      /**
       * @type {HTMLElement}
       * @private
       */
      this.container = isHTMLNode(container)
        ? container
        : document.querySelector(container);

      /**
       * @type {HTMLElement}
       * @private
       */
      this.element = null;

      /**
       * @type {HTMLElement}
       * @private
       */
      this.meridiemElement = null;

      /**
       * @type {HTMLElement}
       * @private
       */
      this.amEl = null;

      /**
       * @type {HTMLElement}
       * @private
       */
      this.pmEl = null;

      /**
       * @type {boolean}
       * @private
       */
      this.showMeridiem = options.showMeridiem;

      /**
       * Meridiem postion
       * @type {'left'|'right'}
       * @private
       */
      this.meridiemPosition = options.meridiemPosition;

      /**
       * @type {Spinbox|Selectbox}
       * @private
       */
      this.hourInput = null;

      /**
       * @type {Spinbox|Selectbox}
       * @private
       */
      this.minuteInput = null;

      /**
       * @type {number}
       * @private
       */
      this.hour = options.initialHour;

      /**
       * @type {number}
       * @private
       */
      this.minute = options.initialMinute;

      /**
       * @type {number}
       * @private
       */
      this.hourStep = options.hourStep;

      /**
       * @type {number}
       * @private
       */
      this.minuteStep = options.minuteStep;

      /**
       * @type {Array}
       * @private
       */
      this.disabledHours = options.disabledHours;

      /**
       * @type {Object}
       * @private
       */
      this.disabledMinutes = options.disabledMinutes;

      /**
       * TimePicker inputType
       * @type {'spinbox'|'selectbox'}
       * @private
       */
      this.inputType = options.inputType;

      /**
       * Locale text for meridiem
       * @type {string}
       * @private
       */
      this.localeText = localeTexts[options.language];

      /**
       * Time format for output
       * @type {string}
       * @private
       */
      this.format = this.getValidTimeFormat(options.format);

      this.render();
      this.setEvents();

      if (options.usageStatistics) {
        util.sendHostName();
      }
    },

    /**
     * Set event handlers to selectors, container
     * @private
     */
    setEvents: function() {
      this.hourInput.on('change', this.onChangeTimeInput, this);
      this.minuteInput.on('change', this.onChangeTimeInput, this);

      if (this.showMeridiem) {
        if (this.inputType === INPUT_TYPE_SELECTBOX) {
          on(
            this.meridiemElement.querySelector('select'),
            'change',
            this.onChangeMeridiem,
            this
          );
        } else if (this.inputType === INPUT_TYPE_SPINBOX) {
          on(this.meridiemElement, 'click', this.onChangeMeridiem, this);
        }
      }
    },

    /**
     * Remove events
     * @private
     */
    removeEvents: function() {
      this.off();

      this.hourInput.destroy();
      this.minuteInput.destroy();

      if (this.showMeridiem) {
        if (this.inputType === INPUT_TYPE_SELECTBOX) {
          off(
            this.meridiemElement.querySelector('select'),
            'change',
            this.onChangeMeridiem,
            this
          );
        } else if (this.inputType === INPUT_TYPE_SPINBOX) {
          off(this.meridiemElement, 'click', this.onChangeMeridiem, this);
        }
      }
    },

    /**
     * Render element
     * @private
     */
    render: function() {
      var context = {
        showMeridiem: this.showMeridiem,
        isSpinbox: this.inputType === 'spinbox'
      };

      if (this.showMeridiem) {
        extend(context, {
          meridiemElement: this.makeMeridiemHTML()
        });
      }

      if (this.element) {
        removeElement(this.element);
      }
      this.container.innerHTML = tmpl(context);
      this.element = this.container.firstChild;

      this.renderTimeInputs();

      if (this.showMeridiem) {
        this.setMeridiemElement();
      }
    },

    /**
     * Set meridiem element on timepicker
     * @private
     */
    setMeridiemElement: function() {
      if (this.meridiemPosition === 'left') {
        addClass(this.element, CLASS_NAME_LEFT_MERIDIEM);
      }
      this.meridiemElement = this.element.querySelector(SELECTOR_MERIDIEM_ELEMENT);
      this.amEl = this.meridiemElement.querySelector('[value="AM"]');
      this.pmEl = this.meridiemElement.querySelector('[value="PM"]');
      this.syncToMeridiemElements();
    },

    /**
     * Make html for meridiem element
     * @returns {HTMLElement} Meridiem element
     * @private
     */
    makeMeridiemHTML: function() {
      var localeText = this.localeText;

      return meridiemTmpl({
        am: localeText.am,
        pm: localeText.pm,
        radioId: this.id,
        isSpinbox: this.inputType === 'spinbox'
      });
    },

    /**
     * Render time selectors
     * @private
     */
    renderTimeInputs: function() {
      var hour = this.hour;
      var showMeridiem = this.showMeridiem;
      var hourElement = this.element.querySelector(SELECTOR_HOUR_ELEMENT);
      var minuteElement = this.element.querySelector(SELECTOR_MINUTE_ELEMENT);
      var BoxComponent = this.inputType.toLowerCase() === 'selectbox' ? Selectbox : Spinbox;
      var formatExplode = this.format.split(':');
      var hourItems = this.getHourItems();

      if (showMeridiem) {
        hour = util.getMeridiemHour(hour);
      }

      this.hourInput = new BoxComponent(hourElement, {
        initialValue: hour,
        items: hourItems,
        format: formatExplode[0],
        disabledItems: this.makeDisabledStatItems(hourItems)
      });

      this.minuteInput = new BoxComponent(minuteElement, {
        initialValue: this.minute,
        items: this.getMinuteItems(),
        format: formatExplode[1]
      });
    },

    makeDisabledStatItems: function(hourItems) {
      var result = [];
      var disabledHours = this.disabledHours.slice();

      if (this.showMeridiem) {
        disabledHours = this.meridiemableTime(disabledHours);
      }

      forEachArray(hourItems, function(hour) {
        result.push(inArray(hour, disabledHours) >= 0);
      });

      return result;
    },

    meridiemableTime: function(disabledHours) {
      var diffHour = 0;
      var startHour = 0;
      var endHour = 11;
      var result = [];

      if (this.hour >= 12) {
        diffHour = 12;
        startHour = 12;
        endHour = 23;
      }

      forEachArray(disabledHours, function(hour) {
        if (hour >= startHour && hour <= endHour) {
          result.push(hour - diffHour === 0 ? 12 : hour - diffHour);
        }
      });

      return result;
    },

    /**
     * Return formatted format.
     * @param {string} format - format option
     * @returns {string}
     * @private
     */
    getValidTimeFormat: function(format) {
      if (!format.match(/^[h]{1,2}:[m]{1,2}$/i)) {
        return 'h:m';
      }

      return format.toLowerCase();
    },

    /**
     * Initialize meridiem elements
     * @private
     */
    syncToMeridiemElements: function() {
      var selectedEl = this.hour >= 12 ? this.pmEl : this.amEl;
      var notSelectedEl = selectedEl === this.pmEl ? this.amEl : this.pmEl;

      selectedEl.setAttribute('selected', true);
      selectedEl.setAttribute('checked', true);
      addClass(selectedEl, CLASS_NAME_CHECKED);
      notSelectedEl.removeAttribute('selected');
      notSelectedEl.removeAttribute('checked');
      removeClass(notSelectedEl, CLASS_NAME_CHECKED);
    },

    /**
     * Set values in spinboxes from time
     * @private
     */
    syncToInputs: function() {
      var hour = this.hour;
      var minute = this.minute;

      if (this.showMeridiem) {
        hour = util.getMeridiemHour(hour);
      }

      this.hourInput.setValue(hour);
      this.minuteInput.setValue(minute);
    },

    /**
     * DOM event handler
     * @param {Event} ev - Change event on meridiem element
     * @private
     */
    onChangeMeridiem: function(ev) {
      var hour = this.hour;
      var target = util.getTarget(ev);

      if (target.value && closest(target, SELECTOR_MERIDIEM_ELEMENT)) {
        hour = this.to24Hour(target.value === 'PM', hour);
        this.setTime(hour, this.minute);
        this.setDisabledHours();
        this.setDisabledMinutes(hour);
      }
    },

    /**
     * Time change event handler
     * @private
     */
    onChangeTimeInput: function() {
      var hour = this.hourInput.getValue();
      var minute = this.minuteInput.getValue();
      var isPM = this.hour >= 12;

      if (this.showMeridiem) {
        hour = this.to24Hour(isPM, hour);
      }
      this.setTime(hour, minute);
      this.setDisabledMinutes(hour);
    },

    /**
     * 12Hour-expression to 24Hour-expression
     * @param {boolean} isPM - Is pm?
     * @param {number} hour - Hour
     * @returns {number}
     * @private
     */
    to24Hour: function(isPM, hour) {
      hour %= 12;
      if (isPM) {
        hour += 12;
      }

      return hour;
    },

    setDisabledHours: function() {
      var hourItems = this.getHourItems();
      var disabledItems = this.makeDisabledStatItems(hourItems);

      this.hourInput.setDisabledItems(disabledItems);
    },

    setDisabledMinutes: function(hour) {
      var disabledItems;
      disabledItems = this.disabledMinutes[hour] || [];

      this.minuteInput.setDisabledItems(disabledItems);
    },

    /**
     * Get items of hour
     * @returns {array} Hour item list
     * @private
     */
    getHourItems: function() {
      var step = this.hourStep;

      return this.showMeridiem ? util.getRangeArr(1, 12, step) : util.getRangeArr(0, 23, step);
    },

    /**
     * Get items of minute
     * @returns {array} Minute item list
     * @private
     */
    getMinuteItems: function() {
      return util.getRangeArr(0, 59, this.minuteStep);
    },

    /**
     * Whether the hour and minute are in valid items or not
     * @param {number} hour - Hour value
     * @param {number} minute - Minute value
     * @returns {boolean} State
     * @private
     */
    validItems: function(hour, minute) {
      if (!isNumber(hour) || !isNumber(minute)) {
        return false;
      }

      if (this.showMeridiem) {
        hour = util.getMeridiemHour(hour);
      }

      return (
        inArray(hour, this.getHourItems()) > -1 &&
        inArray(minute, this.getMinuteItems()) > -1
      );
    },

    /**
     * Set step of hour
     * @param {array} step - Step to create items of hour
     */
    setHourStep: function(step) {
      this.hourStep = step;
      this.hourInput.fire('changeItems', this.getHourItems());
    },

    /**
     * Get step of hour
     * @returns {number} Step of hour
     */
    getHourStep: function() {
      return this.hourStep;
    },

    /**
     * Set step of minute
     * @param {array} step - Step to create items of minute
     */
    setMinuteStep: function(step) {
      this.minuteStep = step;
      this.minuteInput.fire('changeItems', this.getMinuteItems());
    },

    /**
     * Get step of minute
     * @returns {number} Step of minute
     */
    getMinuteStep: function() {
      return this.minuteStep;
    },

    /**
     * Show time picker element
     */
    show: function() {
      removeClass(this.element, CLASS_NAME_HIDDEN);
    },

    /**
     * Hide time picker element
     */
    hide: function() {
      addClass(this.element, CLASS_NAME_HIDDEN);
    },

    /**
     * Set hour
     * @param {number} hour for time picker - (0~23)
     * @returns {boolean} result of set time
     */
    setHour: function(hour) {
      return this.setTime(hour, this.minute);
    },

    /**
     * Set minute
     * @param {number} minute for time picker
     * @returns {boolean} result of set time
     */
    setMinute: function(minute) {
      return this.setTime(this.hour, minute);
    },

    /**
     * Set time
     * @param {number} hour for time picker - (0~23)
     * @param {number} minute for time picker
     */
    setTime: function(hour, minute) {
      if (!this.validItems(hour, minute)) {
        return;
      }

      this.hour = hour;
      this.minute = minute;

      this.syncToInputs();
      if (this.showMeridiem) {
        this.syncToMeridiemElements();
      }

      /**
       * Change event - TimePicker
       * @event TimePicker#change
       * @type {object} event - Event object
       * @property {number} hour - changed hour
       * @property {number} minute - changed minute
       * @example
       * timepicker.on('change', (e) => {
       *   console.log(e.hour, e.minute);
       * });
       */
      this.fire('change', {
        hour: this.hour,
        minute: this.minute
      });
    },

    /**
     * Set selectable range 
     * @param {Object} begin - Contain begin hour and minute of range
     * @param {number} begin.hour - begin hour of range
     * @param {number} begin.minute - begin minute of range
     * @param {Object} [end] - Contain end hour and minute of range
     * @param {number} end.hour - end hour of range
     * @param {number} end.minute - end minute of range
     */
    setRange: function(begin, end) {
      var beginHour = begin.hour;
      var beginMin = begin.minute;
      var endHour, endMin;

      if (!this.isValidRange(begin, end)) {
        return;
      }

      if (end) {
        endHour = end.hour;
        endMin = end.minute;
      }

      this.setRangeHour(beginHour, endHour);
      this.setRangeMinute(beginHour, beginMin, endHour, endMin);

      this.applyRange(beginHour, beginMin, endHour);
    },

    /**
     * Set selectable range on hour
     * @param {number} begin.hour - begin hour of range
     * @param {number} [end.hour] - end hour of range
     * @private
     */
    setRangeHour: function(beginHour, endHour) {
      var disabledHours = util.getRangeArr(START_NUMBER_OF_TIME, beginHour - 1);

      if (endHour) {
        disabledHours = disabledHours.concat(util.getRangeArr(endHour + 1, END_NUMBER_OF_HOUR));
      }

      this.disabledHours = disabledHours.slice();
    },

    /**
     * Set selectable range on minute
     * @param {number} begin.hour - begin hour of range
     * @param {number} begin.minute - begin minute of range
     * @param {number} [end.hour] - end hour of range
     * @param {number} [end.minute] - end minute of range
     * @private
     */
    setRangeMinute: function(beginHour, beginMin, endHour, endMin) {
      var disabledMinRanges = [];

      if (!beginHour && !beginMin) {
        return;
      }

      disabledMinRanges.push({
        begin: START_NUMBER_OF_TIME,
        end: beginMin
      });

      if (endHour && endMin) {
        disabledMinRanges.push({
          begin: endMin,
          end: END_NUMBER_OF_MINUTE
        });

        if (beginHour === endHour) {
          this.disabledMinutes[beginHour] = util.getDisabledMinuteArr(disabledMinRanges).slice();

          return;
        }

        this.disabledMinutes[endHour] = util.getDisabledMinuteArr([disabledMinRanges[1]]).slice();
      }

      this.disabledMinutes[beginHour] = util.getDisabledMinuteArr([disabledMinRanges[0]]).slice();
    },

    /**
     * Apply range
     * @param {number} begin.hour - begin hour of range
     * @param {number} begin.minute - begin minute of range
     * @param {number} [end.hour] - end hour of range
     * @private
     */
    applyRange: function(beginHour, beginMin, endHour) {
      this.setTime(beginHour, beginMin);
      this.setDisabledHours();

      if (this.showMeridiem) {
        this.syncToMeridiemElements();

        util.setDisabled(this.amEl, beginHour >= END_NUMBER_OF_HOUR_WITH_MERIDIEM);
        util.setDisabled(this.pmEl, endHour < END_NUMBER_OF_HOUR_WITH_MERIDIEM);
      }
    },

    /**
     * Reset minute selectable range
     */
    resetMinuteRange: function() {
      var i;

      this.disabledMinutes = {};

      for (i = 0; i <= END_NUMBER_OF_HOUR; i += 1) {
        this.setDisabledMinutes(this.hour);
      }
    },

    /**
     * Whether the given range a valid range 
     * @param {Object} begin - Contain begin hour and minute of range
     * @param {number} begin.hour - begin hour of range
     * @param {number} begin.minute - begin minute of range
     * @param {Object} [end] - Contain end hour and minute of range
     * @param {number} end.hour - end hour of range
     * @param {number} end.minute - end minute of range
     * @returns {boolean} result of range validation
     * @private
     */
    isValidRange: function(begin, end) {
      var beginHour = begin.hour;
      var beginMin = begin.minute;
      var endHour, endMin;

      if (!this.isValidTime(beginHour, beginMin)) {
        return false;
      }

      if (!end) {
        return true;
      }

      endHour = end.hour;
      endMin = end.minute;

      return this.isValidTime(endHour, endMin) && this.compareTimes(begin, end) > 0;
    },

    /**
     * Whether the given time a valid time 
     * @param {number} hour - hour for validation
     * @param {number} minute - minute for validation
     * @returns {boolean} result of time validation
     * @private
     */
    isValidTime: function(hour, minute) {
      return hour >= START_NUMBER_OF_TIME &&
      hour <= END_NUMBER_OF_HOUR &&
      minute >= START_NUMBER_OF_TIME &&
      minute <= END_NUMBER_OF_MINUTE;
    },

    /**
     * Compare two times
     * it returns
     *  0: when begin equals end
     *  positive: when end later than begin
     *  negative: when begin later than end
     * @param {Object} begin - Contain begin hour and minute of range
     * @param {number} begin.hour - begin hour of range
     * @param {number} begin.minute - begin minute of range
     * @param {Object} end - Contain end hour and minute of range
     * @param {number} end.hour - end hour of range
     * @param {number} end.minute - end minute of range
     * @returns {boolean} result of range validation
     * @private
     */
    compareTimes: function(begin, end) {
      var first = new Date(0);
      var second = new Date(0);

      first.setHours(begin.hour, begin.minute);
      second.setHours(end.hour, end.minute);

      return second.getTime() - first.getTime();
    },

    /**
     * Get hour
     * @returns {number} hour - (0~23)
     */
    getHour: function() {
      return this.hour;
    },

    /**
     * Get minute
     * @returns {number} minute
     */
    getMinute: function() {
      return this.minute;
    },

    /**
     * Change locale text of meridiem by language code
     * @param {string} language - Language code
     */
    changeLanguage: function(language) {
      this.localeText = localeTexts[language];
      this.render();
    },

    /**
     * Destroy
     */
    destroy: function() {
      this.removeEvents();
      removeElement(this.element);

      this.container
        = this.showMeridiem
        = this.hourInput
        = this.minuteInput
        = this.hour
        = this.minute
        = this.inputType
        = this.element
        = this.meridiemElement
        = this.amEl
        = this.pmEl
        = null;
    }
  }
);

CustomEvents.mixin(TimePicker);
module.exports = TimePicker;
