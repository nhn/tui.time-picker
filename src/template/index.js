'use strict';

var template = require('tui-code-snippet/domUtil/template');

module.exports = function(context) {
  var source =
      '<div class="tui-timepicker">'
    + '  <div class="tui-timepicker-body">'
    + '    <div class="tui-timepicker-row">'
    + '      {{if isSpinbox inputType}}'
    + '        <div class="tui-timepicker-column tui-timepicker-spinbox tui-timepicker-hour"></div>'
    + '        <span class="tui-timepicker-column tui-timepicker-colon"><span class="tui-ico-colon">:</span></span>'
    + '        <div class="tui-timepicker-column tui-timepicker-spinbox tui-timepicker-minute"></div>'
    + '        {{if showMeridiem}}'
    + '          {{meridiemElement}}'
    + '        {{/if}}'
    + '      {{else}}'
    + '        <div class="tui-timepicker-column tui-timepicker-selectbox tui-timepicker-hour"></div>'
    + '        <span class="tui-timepicker-column tui-timepicker-colon"><span class="tui-ico-colon">:</span></span>'
    + '        <div class="tui-timepicker-column tui-timepicker-selectbox tui-timepicker-minute"></div>'
    + '        {{if showMeridiem}}'
    + '          {{meridiemElement}}'
    + '        {{/if}}'
    + '      {{/if}}'
    + '    </div>'
    + '  </div>'
    + '</div>';

  return template(source, context);
};

