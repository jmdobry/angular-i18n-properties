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
		describe('parse()', function () {
			it('should correctly parse multiline.properties', function () {
				getProperties('multiline.properties', function (properties) {
					expect(properties).toEqual({
						'oneline': '1 line',
						'multiline': 'I have four lines.',
						'multiline with  key spaces': 'line 1line 2'
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
						'equal equal equal': 'value'
					});
				});
			});
		});
	});
});