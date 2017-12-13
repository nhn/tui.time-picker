/**
 * @fileoverview TimePicker spec
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
'use strict';

var TimePicker = require('../../src/js/timepicker');

describe('TimePicker', function() {
    var container1 = document.createElement('div');
    var container2 = document.createElement('div');
    var timepickerNoMeridiem;
    var timepickerMeridiem;

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

    describe('constructor', function() {
        it('should set initial value', function() {
            expect(timepickerNoMeridiem.getHour()).toBe(0);
            expect(timepickerNoMeridiem.getMinute()).toBe(0);
            expect(timepickerMeridiem.getHour()).toBe(13);
            expect(timepickerMeridiem.getMinute()).toBe(45);
        });

        it('should set valid value to inputs', function() {
            expect(timepickerNoMeridiem._hourInput.getValue()).toBe(0);
            expect(timepickerNoMeridiem._minuteInput.getValue()).toBe(0);

            expect(timepickerMeridiem._hourInput.getValue()).toBe(1);
            expect(timepickerMeridiem._minuteInput.getValue()).toBe(45);
        });

        it('should set meridiem if "showMeridiem" is ture', function() {
            expect(timepickerNoMeridiem._$meridiemElement.length).toBe(0);
            expect(timepickerMeridiem._$meridiemElement.length).toBe(1);
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
            timepickerNoMeridiem._hourInput.setValue(17);
            expect(timepickerNoMeridiem.getHour()).toBe(17);

            timepickerMeridiem._hourInput.setValue(10);
            expect(timepickerMeridiem.getHour()).toBe(22);
        });

        it('minute input', function() {
            timepickerNoMeridiem._minuteInput.setValue(30);
            expect(timepickerNoMeridiem.getMinute()).toBe(30);
        });

        it('hour in meridiem', function() {
            timepickerMeridiem._hourInput.setValue(10);
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

            expect(timepickerMeridiem._$amEl.html()).toBe('오전');
            expect(timepickerMeridiem._$pmEl.html()).toBe('오후');
        });

        it('using "changeLanguage" method.', function() {
            TimePicker.localeTexts.customKey = {
                am: 'a.m.',
                pm: 'p.m.'
            };
            timepickerMeridiem.changeLanguage('customKey');

            expect(timepickerMeridiem._$amEl.html()).toBe('a.m.');
            expect(timepickerMeridiem._$pmEl.html()).toBe('p.m.');
        });
    });
});
