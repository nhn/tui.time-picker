'use strict';

var snippet = require('tui-code-snippet');

var EXPRESSION_REGEXP = /{{\s?(\/?[a-zA-Z0-9_.@[\] ]+)\s?}}/g;
var BRACKET_REGEXP = /^([a-zA-Z0-9_@]+)\[([a-zA-Z0-9_@]+)\]$/;
var NUMBER_REGEXP = /^-?\d+\.?\d*$/;

var BLOCK_HELPERS = {
  'if': handleIf,
  'each': handleEach,
  'with': handleWith
};

/**
 * Find value in the context by an expression.
 * @param {string} exp - an expression
 * @param {object} context - context
 * @return {*}
 * @private
 */
function getValueFromContext(exp, context) {
  var bracketExps;
  var value = context[exp];

  if (exp === 'true') {
    value = true;
  } else if (exp === 'false') {
    value = false;
  } else if (BRACKET_REGEXP.test(exp)) {
    bracketExps = exp.split(BRACKET_REGEXP);
    value = getValueFromContext(bracketExps[1], context)[getValueFromContext(bracketExps[2], context)];
  } else if (NUMBER_REGEXP.test(exp)) {
    value = parseFloat(exp);
  }

  return value;
}

/**
 * Extract elseif and else expressions.
 * @param {Array.<string>} ifExps - args of if expression
 * @param {Array.<string>} sourcesInsideBlock - sources inside if block
 * @return {object} - exps: expressions of if, elseif, and else / sourcesInsideIf: sources inside if, elseif, and else block.
 * @private
 */
function extractElseif(ifExps, sourcesInsideBlock) {
  var exps = [ifExps];
  var sourcesInsideIf = [];

  var start = 0;
  var i, len, source;

  for (i = 0, len = sourcesInsideBlock.length; i < len; i += 1) {
    source = sourcesInsideBlock[i];

    if (source.indexOf('elseif') > -1 || source === 'else') {
      exps.push(source === 'else' ? ['true'] : source.split(' ').slice(1));
      sourcesInsideIf.push(sourcesInsideBlock.slice(start, i));
      start = i + 1;
    }
  }
  sourcesInsideIf.push(sourcesInsideBlock.slice(start));

  return {
    exps: exps,
    sourcesInsideIf: sourcesInsideIf
  };
}

/**
 * Helper function for "if". 
 * @param {Array.<string>} exps - array of expressions split by spaces
 * @param {object} context - context
 * @param {Array.<string>} sourcesInsideBlock - array of sources inside the if block
 * @return {string}
 * @private
 */
function handleIf(exps, context, sourcesInsideBlock) {
  var analyzed = extractElseif(exps, sourcesInsideBlock);
  var result = false;
  var compiledSource = '';

  snippet.forEach(analyzed.exps, function(exp, index) {
    result = handleFunction(exp, context);
    if (result) {
      compiledSource = compile(analyzed.sourcesInsideIf[index], context);
    }

    return !result;
  });

  return compiledSource;
}

/**
 * Helper function for "each".
 * @param {Array.<string>} exps - array of expressions split by spaces
 * @param {object} context - context
 * @param {Array.<string>} sourcesInsideBlock - array of sources inside the each block
 * @return {string}
 * @private
 */
function handleEach(exps, context, sourcesInsideBlock) {
  var collection = handleFunction(exps, context);
  var additionalKey = snippet.isArray(collection) ? '@index' : '@key';
  var additionalContext = {};
  var result = '';

  snippet.forEach(collection, function(item, key) {
    additionalContext[additionalKey] = key;
    additionalContext['@this'] = item;
    snippet.extend(additionalContext, context);

    result += compile(sourcesInsideBlock.slice(), additionalContext);
  });

  return result;
}

/**
 * Helper function for "with ... as"
 * @param {Array.<string>} exps - array of expressions split by spaces
 * @param {object} context - context
 * @param {Array.<string>} sourcesInsideBlock - array of sources inside the with block
 * @return {string}
 * @private
 */
function handleWith(exps, context, sourcesInsideBlock) {
  var asIndex = snippet.inArray('as', exps);
  var alias = exps[asIndex + 1];
  var result = handleFunction(exps.slice(0, asIndex), context);

  var additionalContext = {};
  additionalContext[alias] = result;

  return compile(sourcesInsideBlock, snippet.extend(additionalContext, context)) || '';
}

/**
 * Handle block helper function
 * @param {string} helperKeyword - helper keyword (ex. if, each, with)
 * @param {object} context - context
 * @param {Array.<string>} sourcesToEnd - array of sources after the starting block
 * @return {Array.<string>}
 * @private
 */
function handleBlockHelper(helperKeyword, context, sourcesToEnd) {
  var helperFunc = BLOCK_HELPERS[helperKeyword];
  var keywordLength = helperKeyword.length;
  var helperCount = 1;
  var startBlockIndices = [0];
  var index = 2;
  var expression = sourcesToEnd[index];
  var start, sourcesInsideBlock;
  while (helperCount !== 0 && snippet.isString(expression)) {
    if (expression.substring(0, keywordLength) === helperKeyword) {
      helperCount += 1;
      startBlockIndices.push(index);
    } else if (expression.substring(0, keywordLength + 1) === '/' + helperKeyword) {
      helperCount -= 1;

      start = startBlockIndices.pop();
      sourcesInsideBlock = sourcesToEnd.splice(start + 1, index - start);
      sourcesInsideBlock.pop();
      sourcesToEnd[start] = helperFunc(sourcesToEnd[start].split(' ').slice(1), context, sourcesInsideBlock);
      sourcesToEnd.splice(Math.max(start - 1, 0), 0, sourcesToEnd.splice(Math.max(start - 1, 0), 3).join(''));

      index = start - 2;
    }

    index += 2;
    expression = sourcesToEnd[index];
  }

  if (helperCount !== 0) {
    throw Error(helperKeyword + ' needs {{/' + helperKeyword + '}} expression.');
  }

  return sourcesToEnd;
}

/**
 * Helper function for "custom helper".
 * If helper is not a function, return helper itself.
 * @param {Array.<string>} exps - array of expressions split by spaces (first element: helper)
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
 * @param {Array.<string>} argExps - expressions of arguments
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
 * @param {Array.<string>} sources - array of sources split by regexp of expression. (even elements: expression)
 * @param {object} context - context
 * @return {Array.<string>} - array of sources that bind with its context
 * @private
 */
function compile(sources, context) {
  var index = 1;
  var expression = sources[index];
  var exps, firstExp, sourcesToEnd;

  while (snippet.isString(expression)) {
    exps = expression.split(' ');
    firstExp = exps[0];

    if (BLOCK_HELPERS[firstExp]) {
      sourcesToEnd = sources.splice(index, sources.length - index);
      sources.push(handleBlockHelper(firstExp, context, sourcesToEnd));
    } else {
      sources[index] = handleFunction(exps, context);
    }

    index += 2;
    expression = sources[index];
  }

  return sources.join('');
}

/**
 * Bind expressions with the context.
 * @param {string} rawSource - source with expressions
 * @param {object} context - context
 * @return {string} - source that bind with its context
 */
function template(rawSource, context) {
  rawSource = rawSource.replace(/\n\s*/g, '');

  return compile(rawSource.split(EXPRESSION_REGEXP), context);
}

module.exports = template;
