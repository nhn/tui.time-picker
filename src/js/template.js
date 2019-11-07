'use strict';

var snippet = require('tui-code-snippet');

var EXPRESSION_REGEXP = /{{\s?(\w+[a-zA-Z0-9_ ]+\w+)\s?}}/g;

/**
 * Analyze string.
 * Split string by {{ }} and extract expressions.
 * @param {string} string - string to analyze
 * @return {object}
 * @private
 * @example
 * var string = '<div class="{{ className }}">{{content}}</div>';
 * var result = analyze(string);
 * console.log(result.strings); // ['<div class="', 'className', '">', 'content', '</div>']
 * console.log(result.expressions); // ['expression', 'content']
 */
function analyze(string) {
  var expressions = [];
  var match = EXPRESSION_REGEXP.exec(string);
  while (match) {
    expressions.push(match[1]);
    match = EXPRESSION_REGEXP.exec(string);
  }

  return {
    strings: string.split(EXPRESSION_REGEXP),
    expressions: expressions
  };
}

/**
 * Execute a helper function.
 * @param {array<string>} expressions - first: function, others: arguments
 * @param {object} context - context
 * @return {string} - result of executing the function with arguments
 * @private
 */
function executeFunction(expressions, context) {
  var args = [];
  snippet.forEachArray(expressions.splice(1), function(exp) {
    args.push(context[exp]);
  });

  return context[expressions[0]].apply(null, args);
}

/**
 * Bind expressions with the context.
 * @param {string} string - string with expressions
 * @param {object} context - context
 * @return {string} - string that bind with its context
 */
function compile(string, context) {
  var analyzedString = analyze(string);
  var strings = analyzedString.strings;
  var index = 0;

  snippet.forEachArray(analyzedString.expressions, function replace(expression) {
    var expArray, firstExp;

    index = snippet.inArray(expression, strings, index);
    if (index < 0) {
      return false;
    }

    expArray = expression.split(' ');
    firstExp = context[expArray[0]];
    if (firstExp instanceof Function) {
      strings[index] = executeFunction(expArray, context);
    } else {
      strings[index] = firstExp;
    }

    return true;
  });

  return strings.join('');
}

module.exports = compile;
