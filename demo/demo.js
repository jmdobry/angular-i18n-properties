var app = angular.module('app', ['jmdobry.angular-i18n-properties']);

app.config(['I18nServiceProvider', function (I18nServiceProvider) {
	I18nServiceProvider.config({
		baseUrl: '../test'
	});
}]);

app.controller('DemoCtrl', ['$scope', '$q', 'I18nService', function ($scope, $q, I18nService) {

	var promises = [];
	$scope.files = [];

	promises = promises.concat(I18nService.load('key_delimiters.properties'));
	promises = promises.concat(I18nService.load('multiline.properties'));
	promises = promises.concat(I18nService.load('parameters.properties'));
	promises = promises.concat(I18nService.load('unescaping.properties'));

	for (var i = 0; i < promises.length; i++) {
		promises[i].then(function (value) {
			$scope.files.push({
				lang: value.lang || 'default',
				contents: value.contents,
				properties: hljs.highlight('javascript', JSON.stringify(I18nService.parse(value.contents), null, 2)).value,
				filename: value.filename
			})
		}, function (value) {
			$scope.files.push({
				lang: value.lang || 'default',
				contents: value.contents,
				properties: hljs.highlight('javascript', JSON.stringify(I18nService.parse(value.contents), null, 2)).value,
				filename: value.filename
			})
		});
	}
}]);