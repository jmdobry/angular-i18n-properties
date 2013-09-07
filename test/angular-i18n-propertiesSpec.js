describe('angular-i18n-properties', function () {

	var $timeout, I18nService;

	function getProperties(filename, cb) {
		var req = new XMLHttpRequest(),
			url = 'base/test/' + filename;
		req.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), false);

		req.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');

		req.onreadystatechange = function (event) {
			var status, err;
			if (req.readyState === 4) {
				status = req.status;
				if (status > 399 && status < 600) {
					err = new Error(url + ' HTTP status: ' + status);
					err.xhr = req;
					err.event = event;
					console.error(err);
				} else {
					cb(angular.extend({}, I18nService.parse(req.responseText)));
				}
			}
		};
		req.send(null);
	}

	beforeEach(module('jmdobry.angular-i18n-properties'));
	beforeEach(inject(function ($injector, _I18nService_) {
		$timeout = $injector.get('$timeout');
		I18nService = _I18nService_;
	}));

	describe('I18nService', function () {
		describe('I18nService.parse()', function () {
			it('should correctly parse multiline.properties', function () {
				getProperties('multiline.properties', function (properties) {
					expect(properties).toEqual({
						'oneline': '1 line',
						'multiline': 'I have four lines.',
						'multiline with  key spaces': 'line 1line 2',
						'multiline.properties.text': 'Here I would write some interesting stuff about how angular-i18n-properties.js properly parses multi-line values.'
					});
				});
			});

			it('should correctly parse key_delimiters.properties', function () {
				getProperties('key_delimiters.properties', function (properties) {
					expect(properties).toEqual({
						'equal.no.space': 'no.space',
						'equal.left.space': 'left.space',
						'equal.right.space': 'right.space',
						'equal.both.space': 'both.space',
						'equal.left.tab': 'left.tab',
						'equal.right.tab': 'right.tab',
						'equal.both.tab': 'both.tab',
						'equal.left.mixed': 'left.mixed',
						'equal.right.mixed': 'right.mixed',
						'equal.both.mixed': 'both.mixed',
						'colon.no.space': 'no.space',
						'colon.left.space': 'left.space',
						'colon.right.space': 'right.space',
						'colon.both.space': 'both.space',
						'colon.left.tab': 'left.tab',
						'colon.right.tab': 'right.tab',
						'colon.both.tab': 'both.tab',
						'colon.left.mixed': 'left.mixed',
						'colon.right.mixed': 'right.mixed',
						'colon.both.mixed': 'both.mixed',
						'space': 'space',
						'spaced key': 'spaced key',
						'space.equal': 'equal = space',
						'space.colon': 'colon : space',
						'equal equal equal': 'value',
						'equal=': 'value',
						'=:': ':=',
						':=': '=:',
						'space with equal and colon =:': 'value',
						'key_delimiters.properties.text': 'Here I would write some interesting stuff about how angular-i18n-properties.js properly parses key delimiters.'
					});
				});
			});

			it('should correctly unescape keys and values', function () {
				getProperties('unescaping.properties', function (properties) {
					expect(properties).toEqual({
						'curly{}braces': 'curly\\{0\\}braces\\{\\{\\}\\}',
						'unescaping.properties.text': 'Here I would write some interesting stuff about how angular-i18n-properties.js properly un-escapes encoded values.'
					});
				});
			});

			it('should correctly unescape keys and values', function () {
				getProperties('parameters.properties', function (properties) {
					expect(properties).toEqual({
						'no': 'parameters',
						'one': 'parameter {0}',
						'one fake': 'parameter \\{0\\}',
						'two same': 'parameters {0}{0}',
						'two different': 'parameters {0}{1}',
						'multiple of two different': 'parameters {0}{1}{0}{1}',
						'one real': 'one fake parameter \\{0\\}{0}',
						'parameters.properties.text': 'Here I would write some interesting stuff about how angular-i18n-properties.js properly parameterizes values.'
					});
				});
			});
		});
		// Need to get loading working before this test can work
//        describe('I18nService.get()', function () {
//            it('should correctly insert parameters', function () {
//                getProperties(I18nService, 'parameters.properties', function () {
//                    expect(I18nService.get('no')).toEqual('parameters');
//                    expect(I18nService.get('one', ['firstarg'])).toEqual('parameter firstarg');
//                    expect(I18nService.get('one fake')).toEqual('parameter {0}');
//                    expect(I18nService.get('two same', ['firstarg'])).toEqual('parameters firstargfirstarg');
//                    expect(I18nService.get('two different', ['firstarg', 'secondarg'])).toEqual('parameters firstargsecondarg');
//                    expect(I18nService.get('multiple of two different', ['firstarg', 'secondarg'])).toEqual('parameters firstargsecondargfirstargsecondarg');
//                    expect(I18nService.get('one real')).toEqual('one fake parameter {0}firstarg');
//                });
//            });
//        });
	});
});