(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _yoast$analysis = yoast.analysis,
    Paper = _yoast$analysis.Paper,
    Researcher = _yoast$analysis.Researcher,
    AssessmentResult = _yoast$analysis.AssessmentResult,
    Assessment = _yoast$analysis.Assessment;

var LocalSchemaAssessment = function (_Assessment) {
	_inherits(LocalSchemaAssessment, _Assessment);

	function LocalSchemaAssessment(settings) {
		_classCallCheck(this, LocalSchemaAssessment);

		var _this = _possibleConstructorReturn(this, (LocalSchemaAssessment.__proto__ || Object.getPrototypeOf(LocalSchemaAssessment)).call(this));

		_this.settings = settings;
		return _this;
	}

	/**
  * Runs an assessment for scoring schema in the paper's text.
  *
  * @param {Paper} paper The paper to run this assessment on.
  * @param {Researcher} researcher The researcher used for the assessment.
  * @param {Object} i18n The i18n-object used for parsing translations.
  *
  * @returns {object} an assessment result with the score and formatted text.
  */


	_createClass(LocalSchemaAssessment, [{
		key: 'getResult',
		value: function getResult(paper, researcher, i18n) {
			var assessmentResult = new AssessmentResult();
			var schema = new RegExp('class=["\']wpseo-location["\'] itemscope', 'ig');
			var matches = paper.getText().match(schema) || 0;
			var result = this.score(matches);

			assessmentResult.setScore(result.score);
			assessmentResult.setText(result.text);

			return assessmentResult;
		}

		/**
   * Scores the content based on the matches of the location schema.
   *
   * @param {Array} matches The matches in the video title.
   *
   * @returns {{score: number, text: *}} An object containing the score and text
   */

	}, {
		key: 'score',
		value: function score(matches) {
			if (matches.length > 0) {
				return {
					score: 9,
					text: this.settings.address_schema
				};
			}
			return {
				score: 4,
				text: this.settings.no_address_schema
			};
		}
	}]);

	return LocalSchemaAssessment;
}(Assessment);

exports.default = LocalSchemaAssessment;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _yoast$analysis = yoast.analysis,
    Paper = _yoast$analysis.Paper,
    Researcher = _yoast$analysis.Researcher,
    AssessmentResult = _yoast$analysis.AssessmentResult,
    Assessment = _yoast$analysis.Assessment;

var LocalTitleAssessment = function (_Assessment) {
	_inherits(LocalTitleAssessment, _Assessment);

	function LocalTitleAssessment(settings) {
		_classCallCheck(this, LocalTitleAssessment);

		var _this = _possibleConstructorReturn(this, (LocalTitleAssessment.__proto__ || Object.getPrototypeOf(LocalTitleAssessment)).call(this));

		_this.settings = settings;
		return _this;
	}

	/**
  * Tests if the selected location is present in the title or headings.
  *
  * @param {Paper} paper The paper to run this assessment on.
  * @param {Researcher} researcher The researcher used for the assessment.
  * @param {Object} i18n The i18n-object used for parsing translations.
  *
  * @returns {object} an assessment result with the score and formatted text.
  */


	_createClass(LocalTitleAssessment, [{
		key: 'getResult',
		value: function getResult(paper, researcher, i18n) {
			var assessmentResult = new AssessmentResult();
			if (this.settings.location !== '') {
				var businessCity = new RegExp(this.settings.location, 'ig');
				var matches = paper.getTitle().match(businessCity) || 0;
				var result = this.scoreTitle(matches);

				// When no results, check for the location in h1 or h2 tags in the content.
				if (!matches) {
					var headings = new RegExp('<h(1|2)>.*?' + this.settings.location + '.*?<\/h(1|2)>', 'ig');
					matches = paper.getText().match(headings) || 0;
					result = this.scoreHeadings(matches);
				}

				assessmentResult.setScore(result.score);
				assessmentResult.setText(result.text);
			}
			return assessmentResult;
		}

		/**
   * Scores the url based on the matches of the location's city in the title.
   *
   * @param {Array} matches The matches in the video title.
   *
   * @returns {{score: number, text: *}} An object containing the score and text
   */

	}, {
		key: 'scoreTitle',
		value: function scoreTitle(matches) {
			if (matches.length > 0) {
				return {
					score: 9,
					text: this.settings.title_location
				};
			}
			return {
				score: 4,
				text: this.settings.title_no_location
			};
		}

		/**
   * Scores the url based on the matches of the location's city in headings.
   *
   * @param {Array} matches The matches in the video title.
   *
   * @returns {{score: number, text: *}} An object containing the score and text
   */

	}, {
		key: 'scoreHeadings',
		value: function scoreHeadings(matches) {
			if (matches.length > 0) {
				return {
					score: 9,
					text: this.settings.heading_location
				};
			}
			return {
				score: 4,
				text: this.settings.heading_no_location
			};
		}
	}]);

	return LocalTitleAssessment;
}(Assessment);

exports.default = LocalTitleAssessment;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _escapeRegExp = require("lodash/escapeRegExp");

var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _yoast$analysis = yoast.analysis,
    Paper = _yoast$analysis.Paper,
    Researcher = _yoast$analysis.Researcher,
    AssessmentResult = _yoast$analysis.AssessmentResult,
    Assessment = _yoast$analysis.Assessment;

var LocalUrlAssessment = function (_Assessment) {
	_inherits(LocalUrlAssessment, _Assessment);

	function LocalUrlAssessment(settings) {
		_classCallCheck(this, LocalUrlAssessment);

		var _this = _possibleConstructorReturn(this, (LocalUrlAssessment.__proto__ || Object.getPrototypeOf(LocalUrlAssessment)).call(this));

		_this.settings = settings;
		return _this;
	}

	/**
  * Runs an assessment for scoring the location in the URL.
  *
  * @param {Paper} paper The paper to run this assessment on.
  * @param {Researcher} researcher The researcher used for the assessment.
  * @param {Object} i18n The i18n-object used for parsing translations.
  *
  * @returns {object} an assessment result with the score and formatted text.
  */


	_createClass(LocalUrlAssessment, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			var assessmentResult = new AssessmentResult();
			if (this.settings.location !== '') {
				var location = this.settings.location;
				location = location.replace("'", "").replace(/\s/ig, "-");
				location = (0, _escapeRegExp2.default)(location);
				var business_city = new RegExp(location, 'ig');
				var matches = paper.getUrl().match(business_city) || 0;
				var result = this.score(matches);
				assessmentResult.setScore(result.score);
				assessmentResult.setText(result.text);
			}
			return assessmentResult;
		}

		/**
   * Scores the url based on the matches of the location.
   *
   * @param {Array} matches The matches in the video title.
   *
   * @returns {{score: number, text: *}} An object containing the score and text
   */

	}, {
		key: "score",
		value: function score(matches) {
			if (matches.length > 0) {
				return {
					score: 9,
					text: this.settings.url_location
				};
			}
			return {
				score: 4,
				text: this.settings.url_no_location
			};
		}
	}]);

	return LocalUrlAssessment;
}(Assessment);

exports.default = LocalUrlAssessment;

},{"lodash/escapeRegExp":13}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global analysisWorker */


var _localTitleAssessment = require('./assessments/local-title-assessment');

var _localTitleAssessment2 = _interopRequireDefault(_localTitleAssessment);

var _localUrlAssessment = require('./assessments/local-url-assessment');

var _localUrlAssessment2 = _interopRequireDefault(_localUrlAssessment);

var _localSchemaAssessment = require('./assessments/local-schema-assessment');

var _localSchemaAssessment2 = _interopRequireDefault(_localSchemaAssessment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalLocationsWorker = function () {
	function LocalLocationsWorker() {
		_classCallCheck(this, LocalLocationsWorker);
	}

	_createClass(LocalLocationsWorker, [{
		key: 'register',
		value: function register() {
			analysisWorker.registerMessageHandler('initializeLocations', this.initialize.bind(this), 'YoastLocalSEO');
		}
	}, {
		key: 'initialize',
		value: function initialize(settings) {
			this.titleAssessment = new _localTitleAssessment2.default(settings);
			this.urlAssessment = new _localUrlAssessment2.default(settings);
			this.schemaAssessment = new _localSchemaAssessment2.default(settings);

			analysisWorker.registerAssessment('localTitle', this.titleAssessment, 'YoastLocalSEO');
			analysisWorker.registerAssessment('localUrl', this.urlAssessment, 'YoastLocalSEO');
			analysisWorker.registerAssessment('localSchema', this.schemaAssessment, 'YoastLocalSEO');
		}
	}]);

	return LocalLocationsWorker;
}();

var localLocationsWorker = new LocalLocationsWorker();

localLocationsWorker.register();

},{"./assessments/local-schema-assessment":1,"./assessments/local-title-assessment":2,"./assessments/local-url-assessment":3}],5:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":12}],6:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],7:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":5,"./_getRawTag":10,"./_objectToString":11}],8:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":5,"./_arrayMap":6,"./isArray":14,"./isSymbol":16}],9:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":5}],11:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],12:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":9}],13:[function(require,module,exports){
var toString = require('./toString');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https://lodash\.com/\)'
 */
function escapeRegExp(string) {
  string = toString(string);
  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
}

module.exports = escapeRegExp;

},{"./toString":17}],14:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],15:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],16:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":7,"./isObjectLike":15}],17:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":8}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvYXNzZXNzbWVudHMvbG9jYWwtc2NoZW1hLWFzc2Vzc21lbnQuanMiLCJqcy9zcmMvYXNzZXNzbWVudHMvbG9jYWwtdGl0bGUtYXNzZXNzbWVudC5qcyIsImpzL3NyYy9hc3Nlc3NtZW50cy9sb2NhbC11cmwtYXNzZXNzbWVudC5qcyIsImpzL3NyYy93cC1zZW8tbG9jYWwtd29ya2VyLWxvY2F0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2VzY2FwZVJlZ0V4cC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9TdHJpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztzQkNBNEQsTUFBTSxRO0lBQTFELEssbUJBQUEsSztJQUFPLFUsbUJBQUEsVTtJQUFZLGdCLG1CQUFBLGdCO0lBQWtCLFUsbUJBQUEsVTs7SUFFeEIscUI7OztBQUNwQixnQ0FBYSxRQUFiLEVBQXdCO0FBQUE7O0FBQUE7O0FBRXZCLFFBQUssUUFBTCxHQUFn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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCB7IFBhcGVyLCBSZXNlYXJjaGVyLCBBc3Nlc3NtZW50UmVzdWx0LCBBc3Nlc3NtZW50IH0gPSB5b2FzdC5hbmFseXNpcztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxTY2hlbWFBc3Nlc3NtZW50IGV4dGVuZHMgQXNzZXNzbWVudCB7XG5cdGNvbnN0cnVjdG9yKCBzZXR0aW5ncyApIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW5zIGFuIGFzc2Vzc21lbnQgZm9yIHNjb3Jpbmcgc2NoZW1hIGluIHRoZSBwYXBlcidzIHRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7UGFwZXJ9IHBhcGVyIFRoZSBwYXBlciB0byBydW4gdGhpcyBhc3Nlc3NtZW50IG9uLlxuXHQgKiBAcGFyYW0ge1Jlc2VhcmNoZXJ9IHJlc2VhcmNoZXIgVGhlIHJlc2VhcmNoZXIgdXNlZCBmb3IgdGhlIGFzc2Vzc21lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBpMThuIFRoZSBpMThuLW9iamVjdCB1c2VkIGZvciBwYXJzaW5nIHRyYW5zbGF0aW9ucy5cblx0ICpcblx0ICogQHJldHVybnMge29iamVjdH0gYW4gYXNzZXNzbWVudCByZXN1bHQgd2l0aCB0aGUgc2NvcmUgYW5kIGZvcm1hdHRlZCB0ZXh0LlxuXHQgKi9cblx0Z2V0UmVzdWx0KCBwYXBlciwgcmVzZWFyY2hlciwgaTE4biApIHtcblx0XHRjb25zdCBhc3Nlc3NtZW50UmVzdWx0ID0gbmV3IEFzc2Vzc21lbnRSZXN1bHQoKTtcblx0XHRjb25zdCBzY2hlbWEgPSBuZXcgUmVnRXhwKCAnY2xhc3M9W1wiXFwnXXdwc2VvLWxvY2F0aW9uW1wiXFwnXSBpdGVtc2NvcGUnLCAnaWcnICk7XG5cdFx0Y29uc3QgbWF0Y2hlcyA9IHBhcGVyLmdldFRleHQoKS5tYXRjaCggc2NoZW1hICkgfHwgMDtcblx0XHRjb25zdCByZXN1bHQgPSB0aGlzLnNjb3JlKCBtYXRjaGVzICk7XG5cblx0XHRhc3Nlc3NtZW50UmVzdWx0LnNldFNjb3JlKCByZXN1bHQuc2NvcmUgKTtcblx0XHRhc3Nlc3NtZW50UmVzdWx0LnNldFRleHQoIHJlc3VsdC50ZXh0ICk7XG5cblx0XHRyZXR1cm4gYXNzZXNzbWVudFJlc3VsdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTY29yZXMgdGhlIGNvbnRlbnQgYmFzZWQgb24gdGhlIG1hdGNoZXMgb2YgdGhlIGxvY2F0aW9uIHNjaGVtYS5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheX0gbWF0Y2hlcyBUaGUgbWF0Y2hlcyBpbiB0aGUgdmlkZW8gdGl0bGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt7c2NvcmU6IG51bWJlciwgdGV4dDogKn19IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBzY29yZSBhbmQgdGV4dFxuXHQgKi9cblx0c2NvcmUoIG1hdGNoZXMgKSB7XG5cdFx0aWYgKCBtYXRjaGVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm57XG5cdFx0XHRcdHNjb3JlOiA5LFxuXHRcdFx0XHR0ZXh0OiB0aGlzLnNldHRpbmdzLmFkZHJlc3Nfc2NoZW1hXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybntcblx0XHRcdHNjb3JlOiA0LFxuXHRcdFx0dGV4dDogdGhpcy5zZXR0aW5ncy5ub19hZGRyZXNzX3NjaGVtYVxuXHRcdH1cblx0fVxufVxuIiwiY29uc3QgeyBQYXBlciwgUmVzZWFyY2hlciwgQXNzZXNzbWVudFJlc3VsdCwgQXNzZXNzbWVudCB9ID0geW9hc3QuYW5hbHlzaXM7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2FsVGl0bGVBc3Nlc3NtZW50IGV4dGVuZHMgQXNzZXNzbWVudCB7XG5cdGNvbnN0cnVjdG9yKCBzZXR0aW5ncyApIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyBpZiB0aGUgc2VsZWN0ZWQgbG9jYXRpb24gaXMgcHJlc2VudCBpbiB0aGUgdGl0bGUgb3IgaGVhZGluZ3MuXG5cdCAqXG5cdCAqIEBwYXJhbSB7UGFwZXJ9IHBhcGVyIFRoZSBwYXBlciB0byBydW4gdGhpcyBhc3Nlc3NtZW50IG9uLlxuXHQgKiBAcGFyYW0ge1Jlc2VhcmNoZXJ9IHJlc2VhcmNoZXIgVGhlIHJlc2VhcmNoZXIgdXNlZCBmb3IgdGhlIGFzc2Vzc21lbnQuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBpMThuIFRoZSBpMThuLW9iamVjdCB1c2VkIGZvciBwYXJzaW5nIHRyYW5zbGF0aW9ucy5cblx0ICpcblx0ICogQHJldHVybnMge29iamVjdH0gYW4gYXNzZXNzbWVudCByZXN1bHQgd2l0aCB0aGUgc2NvcmUgYW5kIGZvcm1hdHRlZCB0ZXh0LlxuXHQgKi9cblx0Z2V0UmVzdWx0KCBwYXBlciwgcmVzZWFyY2hlciwgaTE4biApIHtcblx0XHRjb25zdCBhc3Nlc3NtZW50UmVzdWx0ID0gbmV3IEFzc2Vzc21lbnRSZXN1bHQoKTtcblx0XHRpZiggdGhpcy5zZXR0aW5ncy5sb2NhdGlvbiAhPT0gJycgKSB7XG5cdFx0XHRjb25zdCBidXNpbmVzc0NpdHkgPSBuZXcgUmVnRXhwKCB0aGlzLnNldHRpbmdzLmxvY2F0aW9uLCAnaWcnKTtcblx0XHRcdGxldCBtYXRjaGVzID0gcGFwZXIuZ2V0VGl0bGUoKS5tYXRjaCggYnVzaW5lc3NDaXR5ICkgfHwgMDtcblx0XHRcdGxldCByZXN1bHQgPSB0aGlzLnNjb3JlVGl0bGUoIG1hdGNoZXMgKTtcblxuXHRcdFx0Ly8gV2hlbiBubyByZXN1bHRzLCBjaGVjayBmb3IgdGhlIGxvY2F0aW9uIGluIGgxIG9yIGgyIHRhZ3MgaW4gdGhlIGNvbnRlbnQuXG5cdFx0XHRpZiggISBtYXRjaGVzICkge1xuXHRcdFx0XHRjb25zdCBoZWFkaW5ncyA9IG5ldyBSZWdFeHAoICc8aCgxfDIpPi4qPycgKyB0aGlzLnNldHRpbmdzLmxvY2F0aW9uICsgJy4qPzxcXC9oKDF8Mik+JywgJ2lnJyApO1xuXHRcdFx0XHRtYXRjaGVzID0gcGFwZXIuZ2V0VGV4dCgpLm1hdGNoKCBoZWFkaW5ncyApIHx8IDA7XG5cdFx0XHRcdHJlc3VsdCA9IHRoaXMuc2NvcmVIZWFkaW5ncyggbWF0Y2hlcyApO1xuXHRcdFx0fVxuXG5cdFx0XHRhc3Nlc3NtZW50UmVzdWx0LnNldFNjb3JlKCByZXN1bHQuc2NvcmUgKTtcblx0XHRcdGFzc2Vzc21lbnRSZXN1bHQuc2V0VGV4dCggcmVzdWx0LnRleHQgKTtcblx0XHR9XG5cdFx0cmV0dXJuIGFzc2Vzc21lbnRSZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogU2NvcmVzIHRoZSB1cmwgYmFzZWQgb24gdGhlIG1hdGNoZXMgb2YgdGhlIGxvY2F0aW9uJ3MgY2l0eSBpbiB0aGUgdGl0bGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl9IG1hdGNoZXMgVGhlIG1hdGNoZXMgaW4gdGhlIHZpZGVvIHRpdGxlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7e3Njb3JlOiBudW1iZXIsIHRleHQ6ICp9fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgc2NvcmUgYW5kIHRleHRcblx0ICovXG5cdHNjb3JlVGl0bGUoIG1hdGNoZXMgKSB7XG5cdFx0aWYgKCBtYXRjaGVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzY29yZTogOSxcblx0XHRcdFx0dGV4dDogdGhpcy5zZXR0aW5ncy50aXRsZV9sb2NhdGlvblxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2NvcmU6IDQsXG5cdFx0XHR0ZXh0OiB0aGlzLnNldHRpbmdzLnRpdGxlX25vX2xvY2F0aW9uXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNjb3JlcyB0aGUgdXJsIGJhc2VkIG9uIHRoZSBtYXRjaGVzIG9mIHRoZSBsb2NhdGlvbidzIGNpdHkgaW4gaGVhZGluZ3MuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl9IG1hdGNoZXMgVGhlIG1hdGNoZXMgaW4gdGhlIHZpZGVvIHRpdGxlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7e3Njb3JlOiBudW1iZXIsIHRleHQ6ICp9fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgc2NvcmUgYW5kIHRleHRcblx0ICovXG5cdHNjb3JlSGVhZGluZ3MoIG1hdGNoZXMgKSB7XG5cdFx0aWYgKCBtYXRjaGVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm57XG5cdFx0XHRcdHNjb3JlOiA5LFxuXHRcdFx0XHR0ZXh0OiB0aGlzLnNldHRpbmdzLmhlYWRpbmdfbG9jYXRpb25cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJue1xuXHRcdFx0c2NvcmU6IDQsXG5cdFx0XHR0ZXh0OiB0aGlzLnNldHRpbmdzLmhlYWRpbmdfbm9fbG9jYXRpb25cblx0XHR9XG5cdH1cbn1cbiIsImltcG9ydCBlc2NhcGVSZWdFeHAgZnJvbSBcImxvZGFzaC9lc2NhcGVSZWdFeHBcIjtcblxuY29uc3QgeyBQYXBlciwgUmVzZWFyY2hlciwgQXNzZXNzbWVudFJlc3VsdCwgQXNzZXNzbWVudCB9ID0geW9hc3QuYW5hbHlzaXM7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2FsVXJsQXNzZXNzbWVudCBleHRlbmRzIEFzc2Vzc21lbnQge1xuXHRjb25zdHJ1Y3Rvciggc2V0dGluZ3MgKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cdH1cblxuXHQvKipcblx0ICogUnVucyBhbiBhc3Nlc3NtZW50IGZvciBzY29yaW5nIHRoZSBsb2NhdGlvbiBpbiB0aGUgVVJMLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1BhcGVyfSBwYXBlciBUaGUgcGFwZXIgdG8gcnVuIHRoaXMgYXNzZXNzbWVudCBvbi5cblx0ICogQHBhcmFtIHtSZXNlYXJjaGVyfSByZXNlYXJjaGVyIFRoZSByZXNlYXJjaGVyIHVzZWQgZm9yIHRoZSBhc3Nlc3NtZW50LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaTE4biBUaGUgaTE4bi1vYmplY3QgdXNlZCBmb3IgcGFyc2luZyB0cmFuc2xhdGlvbnMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IGFuIGFzc2Vzc21lbnQgcmVzdWx0IHdpdGggdGhlIHNjb3JlIGFuZCBmb3JtYXR0ZWQgdGV4dC5cblx0ICovXG5cdGdldFJlc3VsdCggcGFwZXIsIHJlc2VhcmNoZXIsIGkxOG4gKSB7XG5cdFx0Y29uc3QgYXNzZXNzbWVudFJlc3VsdCA9IG5ldyBBc3Nlc3NtZW50UmVzdWx0KCk7XG5cdFx0aWYoIHRoaXMuc2V0dGluZ3MubG9jYXRpb24gIT09ICcnICkge1xuXHRcdFx0bGV0IGxvY2F0aW9uID0gdGhpcy5zZXR0aW5ncy5sb2NhdGlvbjtcblx0XHRcdGxvY2F0aW9uID0gbG9jYXRpb24ucmVwbGFjZSggXCInXCIsIFwiXCIgKS5yZXBsYWNlKCAvXFxzL2lnLCBcIi1cIiApO1xuXHRcdFx0bG9jYXRpb24gPSBlc2NhcGVSZWdFeHAoIGxvY2F0aW9uICk7XG5cdFx0XHRjb25zdCBidXNpbmVzc19jaXR5ID0gbmV3IFJlZ0V4cCggbG9jYXRpb24sICdpZycgKTtcblx0XHRcdGNvbnN0IG1hdGNoZXMgPSBwYXBlci5nZXRVcmwoKS5tYXRjaCggYnVzaW5lc3NfY2l0eSApIHx8IDA7XG5cdFx0XHRjb25zdCByZXN1bHQgPSB0aGlzLnNjb3JlKCBtYXRjaGVzICk7XG5cdFx0XHRhc3Nlc3NtZW50UmVzdWx0LnNldFNjb3JlKCByZXN1bHQuc2NvcmUgKTtcblx0XHRcdGFzc2Vzc21lbnRSZXN1bHQuc2V0VGV4dCggcmVzdWx0LnRleHQgKTtcblx0XHR9XG5cdFx0cmV0dXJuIGFzc2Vzc21lbnRSZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogU2NvcmVzIHRoZSB1cmwgYmFzZWQgb24gdGhlIG1hdGNoZXMgb2YgdGhlIGxvY2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSBtYXRjaGVzIFRoZSBtYXRjaGVzIGluIHRoZSB2aWRlbyB0aXRsZS5cblx0ICpcblx0ICogQHJldHVybnMge3tzY29yZTogbnVtYmVyLCB0ZXh0OiAqfX0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHNjb3JlIGFuZCB0ZXh0XG5cdCAqL1xuXHRzY29yZSggbWF0Y2hlcyApIHtcblx0XHRpZiAoIG1hdGNoZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybntcblx0XHRcdFx0c2NvcmU6IDksXG5cdFx0XHRcdHRleHQ6IHRoaXMuc2V0dGluZ3MudXJsX2xvY2F0aW9uXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybntcblx0XHRcdHNjb3JlOiA0LFxuXHRcdFx0dGV4dDogdGhpcy5zZXR0aW5ncy51cmxfbm9fbG9jYXRpb25cblx0XHR9XG5cdH1cbn1cbiIsIi8qIGdsb2JhbCBhbmFseXNpc1dvcmtlciAqL1xuaW1wb3J0IExvY2FsVGl0bGVBc3Nlc3NtZW50IGZyb20gJy4vYXNzZXNzbWVudHMvbG9jYWwtdGl0bGUtYXNzZXNzbWVudCc7XG5pbXBvcnQgTG9jYWxVcmxBc3Nlc3NtZW50IGZyb20gJy4vYXNzZXNzbWVudHMvbG9jYWwtdXJsLWFzc2Vzc21lbnQnO1xuaW1wb3J0IExvY2FsU2NoZW1hQXNzZXNzbWVudCBmcm9tICcuL2Fzc2Vzc21lbnRzL2xvY2FsLXNjaGVtYS1hc3Nlc3NtZW50JztcblxuY2xhc3MgTG9jYWxMb2NhdGlvbnNXb3JrZXIge1xuXHRyZWdpc3RlcigpIHtcblx0XHRhbmFseXNpc1dvcmtlci5yZWdpc3Rlck1lc3NhZ2VIYW5kbGVyKCAnaW5pdGlhbGl6ZUxvY2F0aW9ucycsIHRoaXMuaW5pdGlhbGl6ZS5iaW5kKCB0aGlzICksICdZb2FzdExvY2FsU0VPJyApO1xuXHR9XG5cblx0aW5pdGlhbGl6ZSggc2V0dGluZ3MgKSB7XG5cdFx0dGhpcy50aXRsZUFzc2Vzc21lbnQgPSBuZXcgTG9jYWxUaXRsZUFzc2Vzc21lbnQoIHNldHRpbmdzICk7XG5cdFx0dGhpcy51cmxBc3Nlc3NtZW50ID0gbmV3IExvY2FsVXJsQXNzZXNzbWVudCggc2V0dGluZ3MgKTtcblx0XHR0aGlzLnNjaGVtYUFzc2Vzc21lbnQgPSBuZXcgTG9jYWxTY2hlbWFBc3Nlc3NtZW50KCBzZXR0aW5ncyApO1xuXG5cdFx0YW5hbHlzaXNXb3JrZXIucmVnaXN0ZXJBc3Nlc3NtZW50KCAnbG9jYWxUaXRsZScsIHRoaXMudGl0bGVBc3Nlc3NtZW50LCAnWW9hc3RMb2NhbFNFTycgKTtcblx0XHRhbmFseXNpc1dvcmtlci5yZWdpc3RlckFzc2Vzc21lbnQoICdsb2NhbFVybCcsIHRoaXMudXJsQXNzZXNzbWVudCwgJ1lvYXN0TG9jYWxTRU8nICk7XG5cdFx0YW5hbHlzaXNXb3JrZXIucmVnaXN0ZXJBc3Nlc3NtZW50KCAnbG9jYWxTY2hlbWEnLCB0aGlzLnNjaGVtYUFzc2Vzc21lbnQsICdZb2FzdExvY2FsU0VPJyApO1xuXHR9XG59XG5cbmNvbnN0IGxvY2FsTG9jYXRpb25zV29ya2VyID0gbmV3IExvY2FsTG9jYXRpb25zV29ya2VyKCk7XG5cbmxvY2FsTG9jYXRpb25zV29ya2VyLnJlZ2lzdGVyKCk7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1hcDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBSZWN1cnNpdmVseSBjb252ZXJ0IHZhbHVlcyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVG9TdHJpbmc7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsInZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXIgPSBSZWdFeHAocmVSZWdFeHBDaGFyLnNvdXJjZSk7XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXlwiLCBcIiRcIiwgXCJcXFwiLCBcIi5cIiwgXCIqXCIsIFwiK1wiLFxuICogXCI/XCIsIFwiKFwiLCBcIilcIiwgXCJbXCIsIFwiXVwiLCBcIntcIiwgXCJ9XCIsIGFuZCBcInxcIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6Ly9sb2Rhc2hcXC5jb20vXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzUmVnRXhwQ2hhci50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZVJlZ0V4cDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1N0cmluZztcbiJdfQ==
