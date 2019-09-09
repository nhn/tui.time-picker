/**
 * @fileoverview Selectbox spec
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */
'use strict';

var Selectbox = require('../../src/js/timepicker/selectbox');

describe('TimePicker - Selectbox', function() {
  var container = document.createElement('div');
  var selectbox;

  beforeEach(function() {
    selectbox = new Selectbox(container, {
      initialValue: 4,
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      format: 'hh'
    });
  });

  afterEach(function() {
    selectbox.destroy();
  });

  describe('initialization', function() {
    it('should set index of initial value', function() {
      var selectedIndex = selectbox._selectedIndex;

      expect(selectedIndex).toBe(3);
    });

    it('should be output as zero padded double char when format is a "hh"', function() {
      var expected;

      selectbox.destroy();
      selectbox = new Selectbox(container, {
        initialValue: 4,
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        format: 'hh'
      });

      expected = selectbox._element.querySelector('option:first-child').innerText;
      expect(expected).toEqual('01');
    });

    it('should be output as single char when format is a "h"', function() {
      var expected;

      selectbox.destroy();
      selectbox = new Selectbox(container, {
        initialValue: 4,
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        format: 'h'
      });

      expected = selectbox._element.querySelector('option:first-child').innerText;
      expect(expected).toEqual('1');
    });
  });

  describe('disabledItems', function() {
    beforeEach(function() {
      selectbox.destroy();
      selectbox = new Selectbox(container, {
        initialValue: 1,
        items: [1, 2],
        disabledItems: ['disabled', '']
      });
    });

    it('Should be applied when disabledItem is marked disabled', function() {
      var expected = selectbox._element.querySelector('option[value="1"]').hasAttribute('disabled');
      expect(expected).toBe(true);
    });

    it('Should not be reflected when disabledItem is not marked as disabled.', function() {
      var expected = selectbox._element.querySelector('option[value="2"]').hasAttribute('disabled');
      expect(expected).toBe(false);
    });
  });

  describe('api', function() {
    it('"getValue" should return value', function() {
      expect(selectbox.getValue()).toBe(4);
    });

    it('"setValue" should set value to input', function() {
      selectbox.setValue(8);
      expect(selectbox._element.value).toBe('8');
      expect(selectbox.getValue()).toBe(8);
    });

    it('"setValue" should not change if the value is invalid', function() {
      selectbox.setValue(11111111);
      expect(selectbox._element.value).toBe('4');
      expect(selectbox.getValue()).toBe(4);
    });
  });

  describe('custom event', function() {
    it('should fire change event when the value is changed', function() {
      var spy = jasmine.createSpy();
      selectbox.on('change', spy);

      selectbox.setValue(10);
      expect(spy).toHaveBeenCalledWith({
        value: 10
      });
    });
  });

  describe('custom event - changeItems', function() {
    it('should change value of each select items', function() {
      var items = [10, 20, 30];
      selectbox.fire('changeItems', items);

      selectbox.setValue(10);
      expect(selectbox.getValue()).toBe(10);

      selectbox.setValue(20);
      expect(selectbox.getValue()).toBe(20);

      selectbox.setValue(30);
      expect(selectbox.getValue()).toBe(30);
    });
  });
});
