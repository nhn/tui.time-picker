'use strict';

var snippet = require('tui-code-snippet');

var EXPRESSION_REGEXP = /{{\s?(\/?\w+[a-zA-Z0-9_ ]*\w+)\s?}}/g;
var BLOCK_HELPERS = {
  if: handleIf
};

/**
 * Helper function for "if". 
 * @param {array<string>} exps - array of expressions split by spaces
 * @param {object} context - context
 * @param {array<string>} stringsInsideBlock - block
 */
function handleIf(exps, context, stringsInsideBlock) {
  var firstExp = context[exps[0]];
  var result = firstExp;
  if (firstExp instanceof Function) {
    result = executeFunction(firstExp, exps.splice(1), context);
  }

  return result ? compile(stringsInsideBlock, context).join('') : '';
}

/**
 * Execute a helper function.
 * @param {Function} helper - helper function
 * @param {array<string>} argExps - expressions of arguments
 * @param {object} context - context
 * @return {string} - result of executing the function with arguments
 * @private
 */
function executeFunction(helper, argExps, context) {
  var args = [];
  snippet.forEachArray(argExps, function(exp) {
    args.push(context[exp]);
  });

  return helper.apply(null, args);
}

/**
 * Get a result of compiling an expression with the context.
 * @param {array<string>} strings - array of strings split by regexp of expression. (even: expression)
 * @param {object} context - context
 * @return {string} - result of compilation
 * @private
 */
function compile(strings, context) {
  var index = 1;
  var expression = strings[index];
  var exps, firstExp, firstContext, endBlockIndex, stringsInsideBlock;

  while (snippet.isString(expression)) {
    exps = expression.split(' ');
    firstExp = exps[0];
    firstContext = context[firstExp];

    if (firstContext instanceof Function) {
      strings[index] = executeFunction(firstContext, exps.splice(1), context);
    } else if (BLOCK_HELPERS[firstExp]) {
      endBlockIndex = snippet.inArray('/' + firstExp, strings, index);
      if (endBlockIndex < 0) {
        throw Error(firstExp + ' needs {{/' + firstExp + '}} expression.');
      }
      stringsInsideBlock = strings.splice(index + 1, endBlockIndex - index);
      stringsInsideBlock.pop();
      strings[index] = BLOCK_HELPERS[firstExp](exps.splice(1), context, stringsInsideBlock);
    } else {
      strings[index] = firstContext;
    }

    expression = strings[index += 2];
  }

  return strings;
}

/**
 * Bind expressions with the context.
 * @param {string} source - string with expressions
 * @param {object} context - context
 * @return {string} - string that bind with its context
 */
function template(source, context) {
  return compile(source.split(EXPRESSION_REGEXP), context).join('');
}

module.exports = template;
