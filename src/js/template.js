'use strict';

var snippet = require('tui-code-snippet');

var EXPRESSION_REGEXP = /{{\s?(\/?[a-zA-Z0-9_.@[\] ]+)\s?}}/g;
var BRACKET_REGEXP = /^([a-zA-Z0-9_@]+)\[(\w+)\]$/;
var NUMBER_REGEXP = /^-?\d+\.?\d*$/;

var BLOCK_HELPERS = {
  if: handleIf,
  each: handleEach
};

/**
 * Find value in the context by an expression.
 * @param {string} exp - an expression
 * @param {object} context - context
 * @return {*}
 * @private
 */
function getValueFromContext(exp, context) {
  var bracketExps, value;

  if (exp in context) {
    value = context[exp];
  } else if (BRACKET_REGEXP.test(exp)) {
    bracketExps = exp.split(BRACKET_REGEXP);
    value = context[bracketExps[1]][bracketExps[2]];
  } else if (NUMBER_REGEXP.test(exp)) {
    value = parseFloat(exp);
  }

  return value;
}

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
  var result = getValueFromContext(exps[0], context);

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
    args.push(getValueFromContext(exp, context));
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
