describe('angular-i18n-properties', function () {

	var $timeout;
	beforeEach(module('jmdobry.angular-i18n-properties'));
	beforeEach(inject(function ($injector) {
		$timeout = $injector.get('$timeout');
	}));
});