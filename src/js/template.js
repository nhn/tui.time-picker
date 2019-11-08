'use strict';

var snippet = require('tui-code-snippet');

var EXPRESSION_REGEXP = /{{\s?(\/?@?\w+[a-zA-Z0-9_ ]*\w+)\s?}}/g;
var BLOCK_HELPERS = {
  if: handleIf,
  each: handleEach
};

/**
 * Helper function for "if". 
 * @param {array<string>} exps - array of expressions split by spaces
 * @param {object} context - context
 * @param {array<string>} stringsInsideBlock - array of strings inside the if block
 * @return {string}
 * @private
 */
function handleIf(exps, context, stringsInsideBlock) {
  var result = handleFunction(exps, context);

  return result ? compile(stringsInsideBlock, context).join('') : '';
}

/**
 * Helper function for "each".
 * @param {array<string>} exps - array of expressions split by spaces
 * @param {object} context - context
 * @param {array<string>} stringsInsideBlock - array of strings inside the each block
 * @return {string}
 * @private
 */
function handleEach(exps, context, stringsInsideBlock) {
  var collection = handleFunction(exps, context);
  var additionalKey = snippet.isArray(collection) ? '@index' : '@key';
  var additionalContext = {};
  var result = '';

  snippet.forEach(collection, function(item, key) {
    additionalContext[additionalKey] = key;
    additionalContext['@this'] = item;
    snippet.extend(additionalContext, context);

    result += compile(stringsInsideBlock.slice(), additionalContext).join('');
  });

  return result;
}

/**
 * Helper function for "custom helper".
 * If helper is not a function, return helper itself.
 * @param {array<string>} exps - array of expressions split by spaces (first element: helper)
 * @param {object} context - context
 * @return {string}
 * @private
 */
function handleFunction(exps, context) {
  var result = context[exps[0]];

  if (result instanceof Function) {
    result = executeFunction(result, exps.splice(1), context);
  }

  return result;
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
 * @param {array<string>} strings - array of strings split by regexp of expression. (even elements: expression)
 * @param {object} context - context
 * @return {string} - result of compilation
 * @private
 */
function compile(strings, context) {
  var index = 1;
  var expression = strings[index];
  var result = '';
  var exps, firstExp, endBlockIndex, stringsInsideBlock;

  while (snippet.isString(expression)) {
    exps = expression.split(' ');
    firstExp = exps[0];

    if (BLOCK_HELPERS[firstExp]) {
      endBlockIndex = snippet.inArray('/' + firstExp, strings, index);
      if (endBlockIndex < 0) {
        throw Error(firstExp + ' needs {{/' + firstExp + '}} expression.');
      }

      stringsInsideBlock = strings.splice(index + 1, endBlockIndex - index);
      stringsInsideBlock.pop();

      result = BLOCK_HELPERS[firstExp](exps.splice(1), context, stringsInsideBlock);
    } else {
      result = handleFunction(exps, context);
    }
    strings[index] = result;

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
