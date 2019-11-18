'use strict';

var snippet = require('tui-code-snippet');

var EXPRESSION_REGEXP = /{{\s?(\/?[a-zA-Z0-9_.@[\] ]+)\s?}}/g;
var BRACKET_REGEXP = /^([a-zA-Z0-9_@]+)\[(\w+)\]$/;
var NUMBER_REGEXP = /^-?\d+\.?\d*$/;

var BLOCK_HELPERS = {
  if: handleIf,
  each: handleEach,
  with: handleWith
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
  } else if (exp === 'true') {
    value = true;
  } else if (exp === 'false') {
    value = false;
  } else if (BRACKET_REGEXP.test(exp)) {
    bracketExps = exp.split(BRACKET_REGEXP);
    value = context[bracketExps[1]][bracketExps[2]];
  } else if (NUMBER_REGEXP.test(exp)) {
    value = parseFloat(exp);
  }

  return value;
}

/**
 * Extract elseif and else expressions.
 * @param {array<string>} ifExps - args of if expression
 * @param {array<string>} strings - strings inside if block
 * @return {object} - exps: expressions of if, elseif, and else / stringsInsideBlock: strings inside if, elseif, and else block.
 * @private
 */
function extractElseif(ifExps, strings) {
  var exps = [ifExps];
  var stringsInsideBlock = [];

  var start = 0;
  var i, len, string;

  for (i = 0, len = strings.length; i < len; i += 1) {
    string = strings[i];

    if (string.indexOf('elseif') > -1 || string === 'else') {
      exps.push(string === 'else' ? ['true'] : string.split(' ').slice(1));
      stringsInsideBlock.push(strings.slice(start, i));
      start = i + 1;
    }
  }
  stringsInsideBlock.push(strings.slice(start));

  return {
    exps: exps,
    stringsInsideBlock: stringsInsideBlock
  };
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
  var analyzed = extractElseif(exps, stringsInsideBlock);
  var result = false;
  var compiledString = '';

  snippet.forEach(analyzed.exps, function(exp, index) {
    result = handleFunction(exp, context);
    if (result) {
      compiledString = compile(analyzed.stringsInsideBlock[index], context).join('');
    }

    return !result;
  });

  return compiledString;
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
 * Helper function for "with ... as"
 * @param {array<string>} exps - array of expressions split by spaces
 * @param {object} context - context
 * @param {array<string>} stringsInsideBlock - array of strings inside the with block
 * @return {string}
 * @private
 */
function handleWith(exps, context, stringsInsideBlock) {
  var asIndex = snippet.inArray('as', exps);
  var alias = exps[asIndex + 1];
  var result = handleFunction(exps.slice(0, asIndex), context);

  var additionalContext = {};
  additionalContext[alias] = result;

  return compile(stringsInsideBlock, snippet.extend(additionalContext, context)).join('') || '';
}

/**
 * Handle block helper function
 * @param {string} helperKeyword - helper keyword (ex. if, each, with)
 * @param {object} context - context
 * @param {array<string>} strings - array of strings after the starting block
 * @return {array<string>}
 * @private
 */
function handleBlockHelper(helperKeyword, context, strings) {
  var helperFunc = BLOCK_HELPERS[helperKeyword];
  var keywordLength = helperKeyword.length;
  var helperCount = 1;

  var startBlockIndices = [0];

  var index = 2;
  var expression = strings[index];

  var start, stringsInsideBlock;
  while (helperCount !== 0 && snippet.isString(expression)) {
    if (expression.substring(0, keywordLength) === helperKeyword) {
      helperCount += 1;
      startBlockIndices.push(index);
    } else if (expression.substring(0, keywordLength + 1) === '/' + helperKeyword) {
      helperCount -= 1;

      start = startBlockIndices.pop();
      stringsInsideBlock = strings.splice(start + 1, index - start);
      stringsInsideBlock.pop();
      strings[start] = helperFunc(strings[start].split(' ').slice(1), context, stringsInsideBlock);
      strings.splice(Math.max(start - 1, 0), 0, strings.splice(Math.max(start - 1, 0), 3).join(''));

      index = start - 2;
    }

    expression = strings[index += 2];
  }

  if (helperCount !== 0) {
    throw Error(helperKeyword + ' needs {{/' + helperKeyword + '}} expression.');
  }

  return strings;
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
    result = executeFunction(result, exps.slice(1), context);
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
 * @return {array<string>} - array of strings that bind with its context
 * @private
 */
function compile(strings, context) {
  var index = 1;
  var expression = strings[index];
  var exps, firstExp;

  while (snippet.isString(expression)) {
    exps = expression.split(' ');
    firstExp = exps[0];

    if (BLOCK_HELPERS[firstExp]) {
      Array.prototype.push.apply(strings, handleBlockHelper(firstExp, context, strings.splice(index)));
    } else {
      strings[index] = handleFunction(exps, context);
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
  source = source.replace(/\n\s*/g, '');

  return compile(source.split(EXPRESSION_REGEXP), context).join('');
}

module.exports = template;
