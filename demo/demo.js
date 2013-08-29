var app = angular.module('app', ['jmdobry.angular-i18n-properties']);

app.config(['I18nServiceProvider', function (I18nServiceProvider) {
		I18nServiceProvider.config({});
	}]).run(['I18nService', function (I18nService) {
		I18nService.load('demo/messages.properties');
		I18nService.load('../test/multiline.properties');
		I18nService.load('../test/key_delimiters.properties');
	}]);