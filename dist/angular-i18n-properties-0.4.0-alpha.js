/*jshint boss:true*/
/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-i18n-properties-0.4.0-alpha.js
 * @version 0.4.0-alpha - [Homepage]{@link http://jmdobry.github.io/angular-i18n-properties/}
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

		var config = {},
			defaults = {
				async: true,
				cacheMode: 'none',
				baseUrl: '',
				lang: navigator.language || navigator.userLanguage,
				encoding: 'UTF-8'
			};

		/**
		 * @method normalizeLang
		 * @desc Format the language code into the following format: aa_AA.
		 * @param {String} lang The language code to normalize.
		 * @returns {String} The normalized language code.
		 */
		function normalizeLang(lang) {
			lang = lang.toLowerCase();
			if (lang.length >= 5) {
				lang = lang.substr(0, 2) + '_' + lang.substr(3).toUpperCase();
			}
			return lang;
		}

		/**
		 * @method config
		 * @desc Set the global configuration for I18nService.
		 * @param {Object} options
		 */
		this.config = function (options) {
			angular.extend(config, options);
			config.lang = normalizeLang(config.lang);
		};

		// Initialize config with the defaults
		this.config(defaults);

		this.$get = ['$log', '$q', '$http', function ($log, $q, $http) {
			var langHash = {},
				unicodeSequenceRegex = /(\\u.{4})/ig,
				naturalLinesRegex = /[(\r\n)\n\r]+/,
				escapedKeyDelimRegex = /\\[\s=:]+?/,
				keyDelimRegex = /[=:]|\s+[=:]|\s+(?![=:])/;

			/**
			 * @method trim_left
			 * @desc Strip leading whitespace from the given string.
			 * @param {String} value The string to trim.
			 * @returns {String} The trimmed string.
			 */
			function trim_left(value) {
				return typeof value == 'string' ? value.replace(/^\s*/, '') : value;
			}

			/**
			 * @method trim_right
			 * @desc Strip trailing whitespace from the given string.
			 * @param {String} value The string to trim.
			 * @returns {String} The trimmed string.
			 */
			function trim_right(value) {
				return typeof value == 'string' ? value.replace(/\s*$/, '') : value;
			}

			/**
			 * @method unescapeUnicodeChar
			 * @desc Unescape a unicode characters.
			 * @param {String} str The string to unescape.
			 * @returns {string} The unescaped string.
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
			 * @param {String} value The string to unescape.
			 * @returns {String} The unescaped string.
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
						} else if (value[i + 1] == '{' || value[i + 1] == '}') {
							// Leave escaped curly braces where they are because they are NOT part of placeholders
							// We unescape them in I18nService.get()
						} else {
							value = value.substring(0, i) + value.substring(i + 1); // Invalid escape character
						}
						i++;
					}
				}
				return value;
			}

			/**
			 * @method resolveUrl
			 * @desc Turns the given filename and options into a usable url.
			 * @param {String} filename The name of the file to be in the url.
			 * @param {Object} opts Configuration options for this request.
			 * @returns {String} A usable url for the file with the given filename.
			 */
			function resolveUrl(filename, opts) {
				var url = opts.baseUrl;
				if (opts.lang) {
					if (url && url[url.length - 1] !== '/') {
						url += '/';
					}
					url = url + opts.lang + '/';
				}
				if (url && filename[0] !== '/' && url[url.length - 1] !== '/') {
					url += '/';
				}
				url += filename;
				if (filename.indexOf('.properties') === -1) {
					url += '.properties';
				}
				return url;
			}

			/**
			 * @method getValue
			 * @desc Get a value for the specified key and language.
			 * @param {String} key The key of the value to retrieve.
			 * @param {String} lang The locale where we're to look for the key-value pair.
			 * @returns {String} The value of the specified key and language.
			 */
			function getValue(key, lang) {
				lang = lang || 'default';
				if (!langHash[lang]) {
					langHash[lang] = {};
				}
				return langHash[lang][key];
			}

			/**
			 * @class I18nService
			 */
			return {

				/**
				 * @method get
				 * @desc Return the value of the given key.
				 * @param {String} key The key by which to retrieve the value.
				 * @param {Array} [params] Any parameters that will be inserted into the value.
				 * @param {Object} [options] Configuration options for this request.
				 * @return {String} The value of the given key.
				 */
				get: function (key, params, options) {
					var opts = angular.extend({}, config, options || {}),
						lang = normalizeLang(opts.lang) || 'default',
						parts = lang.split('_'),
						placeholderRegex, match, matchIndex, value, value_orig;

					value_orig = value = getValue(key, lang);

					// Value for specified key isn't in top-level locale
					if (!value && value !== '' && parts.length > 1) {
						lang = parts[0];
						value_orig = value = getValue(key, lang);
					}

					// Value for specified key isn't in mid-level locale
					if (!value && value !== '') {
						lang = 'default';
						value_orig = value = getValue(key, lang);
					}

					// Value for specified key isn't anywhere to be found...
					if (!value && value !== '') {
						return '';
					}

					if (params && params.length) {
						for (var i = 0; i < params.length; i++) {
							placeholderRegex = new RegExp('\\{' + i + '}');
							while (match = value.match(placeholderRegex)) {
								matchIndex = value.indexOf(match.toString());
								if (matchIndex > 0) {
									if (value[matchIndex - 1] === '\\') {
										var errorStr = value_orig.match(/\\\{[0-9]+}/).toString();
										throw new Error('Invalid unescaped "\\" at column ' + (value_orig.indexOf(errorStr) + errorStr.length - 1) + ' in property value: "' + value_orig + '"');
									}
									value = value.substr(0, matchIndex) + params[i] + value.substr(matchIndex + match.toString().length);
								}
							}
						}
						// Check for unescaped "{" and "}" characters
						match = value.match(/\\\{|\\}/);
						if (match) {
							if (value[value.indexOf(match.toString()) - 1] === '\\') {
								throw new Error('Invalid unescaped "\\" in property value: "' + value_orig + '"');
							}
						}
					}
					return value.replace('\\{', '{').replace('\\}', '}');
				},

				/**
				 * @method parse
				 * @desc Parse the given .properties file and return the hash of key-value pairs.
				 * @param {String} file The .properties file to parse.
				 * @returns {Object} The key-value pairs of the parsed .properties file.
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
									properties[sanitize(key).replace('\\{', '{').replace('\\}', '}')] = sanitize(value);
								}
							}
						}
					}
					return properties;
				},

				/**
				 * @method load
				 * @desc Very simple load method for now.
				 * @param {String} filename The name of the file to load, with or without the ".properties" extension.
				 * @param {Object} options Configuration options for this request.
				 */
				load: function (filename, options) {
					var deferred = $q.defer(),
						opts = angular.extend({}, config, options || {}),
						url = resolveUrl(filename, opts),
						self = this,
						cache = false,
						promises = [deferred.promise],
						lang = normalizeLang(opts.lang),
						parts = lang.split('_');

					switch (opts.cacheMode) {
						case 'none':
							url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
							break;
						case 'browser':
							break;
						case 'angular':
							cache = true;
							break;
						default:
					}
					$http.get(url, {
						cache: cache,
						headers: {
							'Content-Type': 'text/plain;charset=' + opts.encoding
						}
					}).success(function (data, status, config, headers) {
							if (!langHash[lang || 'default']) {
								langHash[lang || 'default'] = {};
							}
							angular.extend(langHash[lang || 'default'], self.parse(data));
							deferred.resolve({
								filename: filename,
								lang: lang || 'default',
								contents: data
							}, status, config, headers);
						}).error(function (data, status, config, headers) {
							$log.error('Failed to load "' + url + '"');
							deferred.reject({
								filename: filename,
								lang: lang,
								contents: '404 - Not Found'
							}, status, config, headers);
						});

					if (parts.length > 1) {
						opts.lang = parts[0];
						promises = promises.concat(this.load(filename, opts));
					} else if (lang) {
						opts.lang = '';
						promises = promises.concat(this.load(filename, opts));
					}
					return promises;
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
