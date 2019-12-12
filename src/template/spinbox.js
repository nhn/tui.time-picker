'use strict';

var template = require('tui-code-snippet/domUtil/template');

module.exports = function(context) {
  var source =
      '<div class="tui-timepicker-btn-area">'
    + '  <input type="text" class="tui-timepicker-spinbox-input"'
    + '        maxlength="{{maxLength}}"'
    + '        size="{{maxLength}}"'
    + '        value="{{formatTime initialValue format}}"'
    + '        aria-label="TimePicker spinbox value">'
    + '  <button type="button" class="tui-timepicker-btn tui-timepicker-btn-up">'
    + '    <span class="tui-ico-t-btn">Increase</span>'
    + '  </button>'
    + '  <button type="button" class="tui-timepicker-btn tui-timepicker-btn-down">'
    + '    <span class="tui-ico-t-btn">Decrease</span>'
    + '  </button>'
    + '</div>';

  return template(source, context);
};

