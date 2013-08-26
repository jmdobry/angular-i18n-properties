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

    angular.module('jmdobry.angular-i18n-properties').service('I18nService', ['$log', function ($log) {

        var langHash = {};

        /**
         * @method trim_left
         * @desc Strip leading whitespace from the given string.
         * @param {String} value The string to trim.
         * @returns {String}
         */
        function trim_left(value) {
            return typeof value == 'string' ? value.replace(/^\s*/, '') : value;
        }

        /**
         * @method trim_right
         * @desc Strip trailing whitespace from the given string.
         * @param {String} value The string to trim.
         * @returns {String}
         */
        function trim_right(value) {
            return typeof value == 'string' ? value.replace(/\s*$/, '') : value;
        }

        /**
         * @method unescape
         * @desc Unescape valid escape characters and drop the backslash for invalid escape characters.
         * @param {String} value The string to unescape.
         * @returns {String}
         */
        function unescape(value) {
            if (typeof(value) == 'string') {
                var i = 0;
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
         * @method parse
         * @desc Parse the given .properties file and return the hash of key-value pairs.
         * @param {String} file
         * @returns {Object}
         */
        function parse(file) {
            var properties = {},
                naturalLines = file.split(/[(\r\n)\n\r]+/),
                numNaturalLines = naturalLines.length,
                foundKey = false,
                i = 0,
                j = 0,
                naturalLine = '',
                numChars = 0;

            function addProp(splitIndex, logicalLine) {
                properties[unescape(trim_right(logicalLine.substr(0, splitIndex)))] = unescape(trim_left(logicalLine.substr(splitIndex + 1, logicalLine.length)));
            }

            for (; i < numNaturalLines; i++) {
                naturalLine = trim_left(naturalLines[i]);
                numChars = naturalLine.length;
                if (naturalLine[0] !== '#' && naturalLine[0] !== '!') {
                    // These next 20 lines of code would be much simpler if JavaScript regex supported negative lookbehind
                    // un-escaped '=' and ':' characters get precedence over un-escaped ' ' when parsing the key
                    for (; j < numChars; j++) {
                        if (naturalLine[j] === '=' || naturalLine[j] === ':') {
                            if ((j === 0) || (j > 0 && naturalLine[j - 1] !== '\\')) {
                                addProp(j, naturalLine);
                                foundKey = true;
                                break;
                            }
                        }
                    }
                    // We didn't find un-escaped '=' and ':' characters, so now look for the first un-escaped ' ' to parse the key
                    if (!foundKey) {
                        for (j = 0; j < numChars; j++) {
                            if (naturalLine[j] === ' ') {
                                if (j > 0 && naturalLine[j - 1] !== '\\') {
                                    addProp(j, naturalLine);
                                    break;
                                }
                            }
                        }
                    }
                }
                foundKey = false;
            }
            return properties;
        }

        /**
         * @class I18nService
         */
        return {
            get: function () {

            },

            /**
             * @method load
             * @desc Very simple load method for now.
             * @param {String} url
             * @param {Object} options
             */
            load: function (url, options) {
                var req = new XMLHttpRequest();
                req.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);

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
                            var lang = (options && options.lang) || navigator.language /* Mozilla */ || navigator.userLanguage /* IE */;
                            if (!langHash[lang]) {
                                langHash[lang] = angular.extend({}, parse(req.responseText));
                            } else {
                                langHash[lang] = angular.extend(langHash[lang], parse(req.responseText));
                            }
                            $log.info(langHash);
                        }
                    }
                };
                req.send(null);
            }
        };
    }]);

    angular.module('jmdobry.angular-i18n-properties').filter('i18n', ['$log', function ($log) {

    }]);
})(window, window.angular);
