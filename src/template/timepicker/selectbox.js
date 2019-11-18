'use strict';

var template = require('../template');

module.exports = function(context) {
  var source =
      '<select class="tui-timepicker-select" aria-label="Time">'
    + '  {{each items}}'
    + '    {{if isInitialValue @this}}'
    + '      <option value="{{@this}}" selected {{if disabledItems @index}}disabled{{/if}}>{{timeFormat @this format}}</option>'
    + '    {{else}}'
    + '      <option value="{{@this}}" {{if disabledItems @index}}disabled{{/if}}>{{timeFormat @this format}}</option>'
    + '    {{/if}}'
    + '  {{/each}}'
    + '</select>';

  return template(source, context);
};

