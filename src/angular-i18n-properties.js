/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-i18n-properties-<%= pkg.version %>.js
 * @version <%= pkg.version %> - [Homepage]{@link http://jmdobry.github.io/angular-i18n-properties/}
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/angular-i18n-properties>
 * @license MIT <https://github.com/jmdobry/angular-i18n-properties/blob/master/LICENSE>
 *
 * @overview Internationalization (i18n) for Angular.js using the common Java .properties resource bundles.
 */
(function (window, angular, undefined) {
	'use strict';

	/**
	 * @module angular-i18n-properties
	 * @desc Internationalization (i18n) for Angular.js using the common Java .properties resource bundles.
	 */
	var i18n = angular.module('jmdobry.angular-i18n-properties', ['ng']);

	angular.module('jmdobry.angular-i18n-properties').provider('I18nService', function () {

		var config = {};

		config.lang = navigator.language || navigator.userLanguage;

		/**
		 * @method config
		 * @desc Set the global configuration for I18nService.
		 * @param {Object} options
		 */
		this.config = function (options) {
			config = angular.extend(config, options);
		};

		this.$get = ['$log', function ($log) {
			var langHash = {},
				unicodeSequenceRegex = /(\\u.{4})/ig,
				naturalLinesRegex = /[(\r\n)\n\r]+/,
				escapedKeyDelimRegex = /\\[\s=:]+?/,
				keyDelimRegex = /[=:]|\s+[=:]|\s+(?![=:])/;

			/**
			 * @method normalizeLang
			 * @desc Format the language code into the following format: aa_AA.
			 * @param {String} lang The language code to normalize.
			 * @returns {String}    The normalized language code.
			 */
			function normalizeLang(lang) {
				lang = lang.toLowerCase();
				if (lang.length >= 5) {
					lang = lang.substr(0, 2) + '_' + lang.substr(3).toUpperCase();
				}
				return lang;
			}

			/**
			 * @method trim_left
			 * @desc Strip leading whitespace from the given string.
			 * @param {String} value    The string to trim.
			 * @returns {String}        The trimmed string.
			 */
			function trim_left(value) {
				return typeof value == 'string' ? value.replace(/^\s*/, '') : value;
			}

			/**
			 * @method trim_right
			 * @desc Strip trailing whitespace from the given string.
			 * @param {String} value    The string to trim.
			 * @returns {String}        The trimmed string.
			 */
			function trim_right(value) {
				return typeof value == 'string' ? value.replace(/\s*$/, '') : value;
			}

			/**
			 * @method unescapeUnicodeChar
			 * @desc Unescape a unicode characters.
			 * @param {String} str  The string to unescape.
			 * @returns {string}    The unescaped string.
			 */
			function unescapeUnicodeChar(str) {
				// unescape unicode codes
				var codes = [],
					unescaped = '',
					code, i, numOfCodes;
				code = parseInt(str.substr(2), 16);
				if (code >= 0 && code < Math.pow(2, 16)) {
					codes.push(code);
				}
				numOfCodes = codes.length;
				for (i = 0; i < numOfCodes; ++i) {
					unescaped += String.fromCharCode(codes[i]);
				}
				return unescaped;
			}

			/**
			 * @method sanitize
			 * @desc Unescape valid escape characters and drop the backslash for invalid escape characters.
			 * @param {String} value    The string to unescape.
			 * @returns {String}        The unescaped string.
			 */
			function sanitize(value) {
				if (typeof value == 'string') {
					var unicodeChars = value.match(unicodeSequenceRegex),
						numUnicodeChars, i;
					if (unicodeChars) {
						numUnicodeChars = unicodeChars.length;
						for (i = 0; i < numUnicodeChars; i++) {
							value = value.replace(unicodeChars[i], unescapeUnicodeChar(unicodeChars[i]));
						}
					}
					i = 0;
					while ((i = value.indexOf('\\', i)) != -1) {
						if (value[i + 1] == 't') {
							value = value.substring(0, i) + '\t' + value.substring((i++) + 2); // tab
						} else if (value[i + 1] == 'r') {
							value = value.substring(0, i) + '\r' + value.substring((i++) + 2); // return
						} else if (value[i + 1] == 'n') {
							value = value.substring(0, i) + '\n' + value.substring((i++) + 2); // line feed
						} else if (value[i + 1] == 'f') {
							value = value.substring(0, i) + '\f' + value.substring((i++) + 2); // form feed
						} else if (value[i + 1] == '\\') {
							value = value.substring(0, i) + '\\' + value.substring((i++) + 2); // \
						} else {
							value = value.substring(0, i) + value.substring(i + 1); // Invalid escape character
						}
					}
				}
				return value;
			}

			/**
			 * @class I18nService
			 */
			return {

				/**
				 * @method get
				 * @desc Return the value of the given key.
				 * @param {String} key      The key by which to retrieve the value.
				 * @param {Array} params    Any parameters that will be inserted into the value.
				 * @param {String} lang     The language to retrieve the value from.
				 * @return {String}         The value of the given key.
				 */
				get: function (key, params, lang) {
					return langHash[lang || config.lang][key];
				},

				/**
				 * @method parse
				 * @desc Parse the given .properties file and return the hash of key-value pairs.
				 * @param {String} file     The .properties file to parse.
				 * @returns {Object} The    key-value pairs of the parsed .properties file.
				 */
				parse: function (file) {
					var properties = {},
						naturalLines = file.split(naturalLinesRegex),
						naturalLine, i, escapedKeyDelimMatch, keyDelimMatch, unescapedWhiteSpace, matchIndex, key, value;

					for (i = 0; i < naturalLines.length; i++) {
						naturalLine = trim_left(naturalLines[i]);
						var tempKey = '';
						if (naturalLine[0] !== '#' && naturalLine[0] !== '!') {
							// This would be much simpler if JavaScript regex supported negative lookbehind
							escapedKeyDelimMatch = naturalLine.match(escapedKeyDelimRegex);
							keyDelimMatch = naturalLine.match(keyDelimRegex);
							// handle escaped whitespace in the key
							if (escapedKeyDelimMatch && keyDelimMatch) {
								while (escapedKeyDelimMatch && keyDelimMatch && naturalLine.indexOf(escapedKeyDelimMatch.toString()) < naturalLine.indexOf(keyDelimMatch.toString())) {
									tempKey += naturalLine.substr(0, naturalLine.indexOf(escapedKeyDelimMatch.toString())) + escapedKeyDelimMatch.toString()[1];
									naturalLine = naturalLine.substr(naturalLine.indexOf(escapedKeyDelimMatch.toString()) + escapedKeyDelimMatch.toString().length);
									escapedKeyDelimMatch = naturalLine.match(escapedKeyDelimRegex);
									keyDelimMatch = naturalLine.match(keyDelimRegex);
								}
							}
							if (keyDelimMatch) {
								unescapedWhiteSpace = null;
								matchIndex = naturalLine.indexOf(keyDelimMatch.toString());
								key = tempKey + naturalLine.substr(0, matchIndex);

								// Check for unescaped whitespace
								unescapedWhiteSpace = key.match(/\s*$/);
								if (unescapedWhiteSpace && unescapedWhiteSpace.toString().length) {
									$log.error('Could not parse line number ' + i + ': Unescaped whitespace at column ' + key.indexOf(unescapedWhiteSpace) + '.');
								} else {
									value = trim_left(naturalLine.substr(matchIndex + keyDelimMatch.toString().length));

									while (value.match(/\\$/) && value.match(/\\$/).toString() === '\\') {
										value = value.substring(0, value.length - 1);
										value += trim_left(naturalLines[++i].replace(/\s\s*$/, '')); // right trim
									}
									properties[sanitize(key)] = sanitize(value);
								}
							}
						}
					}
					return properties;
				},

				/**
				 * @method load
				 * @desc Very simple load method for now.
				 * @param {String} url
				 * @param {Object} options
				 */
				load: function (url, options) {
					var req = new XMLHttpRequest(),
						self = this;
					req.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);

					req.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');

					req.onreadystatechange = function (event) {
						var status, err;
						if (req.readyState === 4) {
							status = req.status;
							if (status > 399 && status < 600) {
								err = new Error(url + ' HTTP status: ' + status);
								err.xhr = req;
								err.event = event;
								$log.error(err);
							} else {
								var lang = normalizeLang((options && options.lang) || config.lang);
								if (!langHash[lang]) {
									langHash[lang] = angular.extend({}, self.parse(req.responseText));
								} else {
									langHash[lang] = angular.extend(langHash[lang], self.parse(req.responseText));
								}
							}
						}
					};
					req.send(null);
				}
			};
		}];
	});

	angular.module('jmdobry.angular-i18n-properties').filter('i18n', ['$log', 'I18nService', function ($log, I18nService) {
		return function (key, args) {
			return I18nService.get(key, args);
		};
	}]);
})(window, window.angular);
