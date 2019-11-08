/**
 * @fileoverview Template util spec
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */
'use strict';

var template = require('../src/js/template');

describe('template', function() {
  it('should bind expressions with the context.', function() {
    var source = '<div class="{{className}}"><p>{{content}}</p></div>';
    var context = {
      className: 'container',
      content: 'Hello, world!'
    };
    expect(template(source, context)).toBe('<div class="container"><p>Hello, world!</p></div>');

    source = '<span>{{ content }}</span>';
    expect(template(source, context)).toBe('<span>Hello, world!</span>');

    source = '<h3>{{title}}</h3>';
    expect(template(source, context)).toBe('<h3></h3>');
  });

  it('should execute a helper function with arguments when the expression consists of several words separated by spaces.', function() {
    var source = '<div class="{{getClassNamesByStatus disabled prefix}}"></div><div class="{{getClassNamesByStatus enabled}}"></div>';
    var context = {
      disabled: true,
      enabled: false,
      prefix: 'item-',
      getClassNamesByStatus: function(disabled, prefix) {
        return disabled ? prefix + 'disabled' : '';
      }
    };
    expect(template(source, context)).toBe('<div class="item-disabled"></div><div class=""></div>');

    source = '<p>{{getZero}}</p>';
    context = {
      getZero: function() {
        return '0';
      }
    };
    expect(template(source, context)).toBe('<p>0</p>');
  });

  it('should bind with the first expression if passed helper is not a function.', function() {
    var source = '<h1>{{notFunction notArg1 notArg2}}</h1>';
    var context = {
      notFunction: 'it is not a function',
      notArg1: 'it is not an argument1'
    };
    expect(template(source, context)).toBe('<h1>it is not a function</h1>');

    source = '<h2>{{notFunction notArg1 notArg2}}</h2>';
    context = {};
    expect(template(source, context)).toBe('<h2></h2>');
  });

  it('should use if expression as a helper function.', function() {
    var source = '<div>{{if content}}<p>{{content}}</p>{{/if}}</div>';
    expect(template(source, {content: 'Hello, world!'})).toBe('<div><p>Hello, world!</p></div>');
    expect(template(source, {content: ''})).toBe('<div></div>');
    expect(template(source, {})).toBe('<div></div>');

    source = '{{if content}}<p>Hello, world!</p>{{/if}}';
    expect(template(source, {content: 'Hello, world!'})).toBe('<p>Hello, world!</p>');
    expect(template(source, {})).toBe('');
  });
});
