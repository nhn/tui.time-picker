'use strict';

var template = require('tui-code-snippet/domUtil/template');

module.exports = function(context) {
  var source =
      '{{if isSpinbox}}'
    + '  <div class="tui-timepicker-column tui-timepicker-checkbox tui-timepicker-meridiem">'
    + '    <div class="tui-timepicker-check-area">'
    + '      <ul class="tui-timepicker-check-lst">'
    + '        <li class="tui-timepicker-check">'
    + '          <div class="tui-timepicker-radio">'
    + '            <input type="radio"'
    + '                  name="optionsRadios-{{radioId}}"'
    + '                  value="AM"'
    + '                  class="tui-timepicker-radio-am"'
    + '                  id="tui-timepicker-radio-am-{{radioId}}">'
    + '            <label for="tui-timepicker-radio-am-{{radioId}}" class="tui-timepicker-radio-label">'
    + '              <span class="tui-timepicker-input-radio"></span>{{am}}'
    + '            </label>'
    + '          </div>'
    + '        </li>'
    + '        <li class="tui-timepicker-check">'
    + '          <div class="tui-timepicker-radio">'
    + '            <input type="radio"'
    + '                  name="optionsRadios-{{radioId}}"'
    + '                  value="PM"'
    + '                  class="tui-timepicker-radio-pm"'
    + '                  id="tui-timepicker-radio-pm-{{radioId}}">'
    + '            <label for="tui-timepicker-radio-pm-{{radioId}}" class="tui-timepicker-radio-label">'
    + '              <span class="tui-timepicker-input-radio"></span>{{pm}}'
    + '            </label>'
    + '          </div>'
    + '        </li>'
    + '      </ul>'
    + '    </div>'
    + '  </div>'
    + '{{else}}'
    + '  <div class="tui-timepicker-column tui-timepicker-selectbox tui-is-add-picker tui-timepicker-meridiem">'
    + '    <select class="tui-timepicker-select" aria-label="AM/PM">'
    + '      <option value="AM">{{am}}</option>'
    + '      <option value="PM">{{pm}}</option>'
    + '    </select>'
    + '  </div>'
    + '{{/if}}';

  return template(source, context);
};

