/**
 * @fileoverview TimePicker spec
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */
'use strict';

var util = require('../../src/js/util');

var TimePicker = require('../../src/js/timepicker');

var container1 = document.createElement('div');
var container2 = document.createElement('div');
var timepickerNoMeridiem;
var timepickerMeridiem;

var rangedHours = [
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false}
];
var rangedMins = [
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: true},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false}
];
var unrangedMins = [
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false},
  {disabled: false}
];

beforeEach(function() {
  timepickerNoMeridiem = new TimePicker(container1, {
    showMeridiem: false
  });
  timepickerMeridiem = new TimePicker(container2, {
    initialHour: 13,
    initialMinute: 45
  });
});

afterEach(function() {
  timepickerNoMeridiem.destroy();
  timepickerMeridiem.destroy();
});

describe('TimePicker', function() {
  describe('constructor', function() {
    it('should set initial value', function() {
      expect(timepickerNoMeridiem.getHour()).toBe(0);
      expect(timepickerNoMeridiem.getMinute()).toBe(0);
      expect(timepickerMeridiem.getHour()).toBe(13);
      expect(timepickerMeridiem.getMinute()).toBe(45);
    });

    it('should set valid value to inputs', function() {
      expect(timepickerNoMeridiem.hourInput.getValue()).toBe(0);
      expect(timepickerNoMeridiem.minuteInput.getValue()).toBe(0);

      expect(timepickerMeridiem.hourInput.getValue()).toBe(1);
      expect(timepickerMeridiem.minuteInput.getValue()).toBe(45);
    });

    it('should set meridiem if "showMeridiem" is true', function() {
      expect(timepickerNoMeridiem.meridiemElement).toBe(null);
      expect(timepickerMeridiem.meridiemElement).not.toBe(null);
    });
  });

  describe('setter/getter', function() {
    it('setHour, getHour', function() {
      timepickerNoMeridiem.setHour(13);
      expect(timepickerNoMeridiem.getHour()).toBe(13);
    });

    it('setMinute, getMinute', function() {
      timepickerNoMeridiem.setMinute(25);
      expect(timepickerNoMeridiem.getMinute()).toBe(25);
    });

    it('setHourStep, getHourStep', function() {
      timepickerNoMeridiem.setHourStep(3);
      expect(timepickerNoMeridiem.getHourStep()).toBe(3);
    });

    it('setMinuteStep, getMinuteStep', function() {
      timepickerNoMeridiem.setMinuteStep(30);
      expect(timepickerNoMeridiem.getMinuteStep()).toBe(30);
    });
  });

  describe('changed from', function() {
    it('hour input', function() {
      timepickerNoMeridiem.hourInput.setValue(17);
      expect(timepickerNoMeridiem.getHour()).toBe(17);

      timepickerMeridiem.hourInput.setValue(10);
      expect(timepickerMeridiem.getHour()).toBe(22);
    });

    it('minute input', function() {
      timepickerNoMeridiem.minuteInput.setValue(30);
      expect(timepickerNoMeridiem.getMinute()).toBe(30);
    });

    it('hour in meridiem', function() {
      timepickerMeridiem.hourInput.setValue(10);
      expect(timepickerMeridiem.getHour()).toBe(22);
    });
  });

  describe('should not change from invaild', function() {
    it('hour', function() {
      var prev = timepickerNoMeridiem.getHour();

      timepickerNoMeridiem.setHour('?????');
      expect(timepickerNoMeridiem.getHour()).toEqual(prev);
    });

    it('minute', function() {
      var prev = timepickerNoMeridiem.getMinute();

      timepickerNoMeridiem.setMinute('!!!!!!!!');
      expect(timepickerNoMeridiem.getMinute()).toEqual(prev);
    });
  });

  describe('should not change when step is invalid', function() {
    it('hour', function() {
      var prev = timepickerNoMeridiem.getHour();

      timepickerNoMeridiem.setHourStep(2);
      expect(timepickerNoMeridiem.getHour()).toBe(prev);
    });

    it('minute', function() {
      var prev = timepickerNoMeridiem.getMinute();

      timepickerNoMeridiem.setMinuteStep(30);
      expect(timepickerNoMeridiem.getMinute()).toBe(prev);
    });
  });

  describe('Set locale texts for meridiem', function() {
    it('using "language" option.', function() {
      TimePicker.localeTexts.ko = {
        am: '오전',
        pm: '오후'
      };

      timepickerMeridiem = new TimePicker(container2, {
        language: 'ko'
      });

      expect(timepickerMeridiem.amEl.textContent).toBe('오전');
      expect(timepickerMeridiem.pmEl.textContent).toBe('오후');
    });

    it('using "changeLanguage" method.', function() {
      TimePicker.localeTexts.customKey = {
        am: 'a.m.',
        pm: 'p.m.'
      };
      timepickerMeridiem.changeLanguage('customKey');

      expect(timepickerMeridiem.amEl.textContent).toBe('a.m.');
      expect(timepickerMeridiem.pmEl.textContent).toBe('p.m.');
    });
  });
  describe('usageStatistics', function() {
    var timePicker;
    beforeEach(function() {
      util.sendHostName = jest.fn();
    });

    it('should send hostname by default', function() {
      timePicker = new TimePicker(container1, {
        showMeridiem: false
      });

      expect(util.sendHostName).toHaveBeenCalled();
    });

    it('should not send hostname on usageStatistics option false', function() {
      timePicker = new TimePicker(container1, {
        showMeridiem: false,
        usageStatistics: false
      });

      expect(util.sendHostName).not.toHaveBeenCalled();
    });

    afterEach(function() {
      timePicker.destroy();
    });
  });
});

describe('Set selectable range', function() {
  function makeRangeObj(hour, minute) {
    return {
      hour: hour,
      minute: minute
    };
  }

  [
    {
      start: {
        hour: 0,
        minute: 0
      },
      expect: true
    },
    {
      start: {
        hour: 23,
        minute: 59
      },
      expect: true
    },
    {
      start: {
        hour: -1,
        minute: 30
      },
      expect: false
    },
    {
      start: {
        hour: 12,
        minute: 60
      },
      expect: false
    },
    {
      start: {
        hour: 8,
        minute: 30
      },
      end: {
        hour: 8,
        minute: 31
      },
      expect: true
    },
    {
      start: {
        hour: 8,
        minute: 30
      },
      end: {
        hour: 8,
        minute: 30
      },
      expect: false
    },
    {
      start: {
        hour: 8,
        minute: 30
      },
      end: {
        hour: 8,
        minute: 29
      },
      expect: false
    }
  ].forEach(function(option) {
    it('should validate given range', function() {
      var start;
      var end;
      start = makeRangeObj(option.start.hour, option.start.minute);

      if (option.end) {
        end = makeRangeObj(option.end.hour, option.end.minute);

        expect(timepickerMeridiem.isValidRange(start, end)).toBe(option.expect);
      } else {
        expect(timepickerMeridiem.isValidRange(start)).toBe(option.expect);
      }
    });
  });

  [
    {
      value: 8,
      expect: true
    },
    {
      value: 9,
      expect: false
    },
    {
      value: 18,
      expect: false
    },
    {
      value: 19,
      expect: true
    }
  ].forEach(function(option) {
    it('should set selectable hour range', function() {
      var start = makeRangeObj(9, 30);
      var end = makeRangeObj(18, 30);
      var hourSelect;

      var selectOption;
      timepickerNoMeridiem.setRange(start, end);

      hourSelect = timepickerNoMeridiem.element.querySelector('select[aria-label="Time"]');

      selectOption = hourSelect.querySelector('option[value="' + option.value + '"]');
      expect(selectOption.disabled).toBe(option.expect);
    });
  });

  [
    {
      target: 9,
      value: 30,
      expect: true
    },
    {
      target: 9,
      value: 31,
      expect: false
    },
    {
      target: 18,
      value: 29,
      expect: true
    },
    {
      target: 18,
      value: 30,
      expect: true
    }
  ].forEach(function(option) {
    it('should set selectable minute range', function() {
      var start = makeRangeObj(9, 30);
      var end = makeRangeObj(18, 30);
      var minSelect;
      var selectOption;

      timepickerNoMeridiem.setRange(start, end);

      minSelect = timepickerNoMeridiem.element.querySelectorAll('select[aria-label="Time"]')[1];
      timepickerNoMeridiem.setTime(option.target, 0);

      selectOption = minSelect.querySelector('option[value="' + option.value + '"]');
      expect(selectOption.disabled).toBe(option.expect);
    });
  });

  it('should set selectable range on hour with only begin', function() {
    var start = makeRangeObj(9, 30);
    var hourSelect, selectOptions;

    timepickerNoMeridiem.setRange(start);

    hourSelect = timepickerNoMeridiem.element.querySelector('select[aria-label="Time"]');

    selectOptions = Array.from(hourSelect.querySelectorAll('option'));

    expect(selectOptions).toMatchObject(rangedHours);
  });

  it('should set selectable range on minute with only begin', function() {
    var start = makeRangeObj(9, 30);
    var minSelect, selectOptions;
    timepickerNoMeridiem.setRange(start);
    timepickerNoMeridiem.setTime(9, 0);

    minSelect = timepickerNoMeridiem.element.querySelectorAll('select[aria-label="Time"]')[1];
    selectOptions = Array.from(minSelect.querySelectorAll('option'));

    expect(selectOptions).toMatchObject(rangedMins);
  });

  it('should reset selectable range on minute', function() {
    var start = makeRangeObj(9, 30);
    var minSelect, selectOptions;

    timepickerNoMeridiem.setRange(start);
    timepickerNoMeridiem.setTime(9, 0);
    timepickerNoMeridiem.resetMinuteRange();

    minSelect = timepickerNoMeridiem.element.querySelectorAll('select[aria-label="Time"]')[1];
    selectOptions = Array.from(minSelect.querySelectorAll('option'));

    expect(selectOptions).toMatchObject(unrangedMins);
  });

  it('should disable a meridiem selector when range included in the other', function() {
    var start = makeRangeObj(6, 30);
    var end = makeRangeObj(11, 30);

    timepickerMeridiem.setRange(start, end);

    expect(timepickerMeridiem.pmEl.disabled).toBe(true);
  });
});
