/**
 * @fileoverview Template util spec
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */
'use strict';

var template = require('../src/js/template');

describe('template', function() {
  it('should replace expressions depending on the properties in the context.', function() {
    var source = '<div class="{{className}}"><p>{{content}}</p></div>';
    var context = {
      className: 'container',
      content: 'Hello, world!'
    };

    expect(template(source, context)).toBe('<div class="container"><p>Hello, world!</p></div>');
  });
});
