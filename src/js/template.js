'use strict';

var snippet = require('tui-code-snippet');

var EXPRESSION_REGEXP = /{{\s?(\w+)\s?}}/g;

/**
 * Analyze string.
 * Split string by {{ }} and extract expressions.
 * @param {string} string - string to analyze
 * @return {object}
 * @private
 * @example
 * var string = '<div class="{{ className }}">{{content}}</div>';
 * var result = analyze(string);
 * console.log(result.splitString); // ['<div class="', 'className', '">', 'content', '</div>']
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
    splitString: string.split(EXPRESSION_REGEXP),
    expressions: expressions
  };
}

/**
 * Compile with the context.
 * @param {string} string - string with expressions
 * @param {object} context - context
 * @return {string} - string that bind with its context
 */
function compile(string, context) {
  var analyzedSource = analyze(string);
  var splitString = analyzedSource.splitString;
  var index = 0;

  snippet.forEachArray(analyzedSource.expressions, function replace(expression) {
    index = snippet.inArray(expression, splitString, index);
    if (index < 0) {
      return false;
    }

    splitString[index] = context[expression];

    return true;
  });

  return splitString.join('');
}

module.exports = compile;
