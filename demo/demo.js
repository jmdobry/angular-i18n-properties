var app = angular.module('app', ['jmdobry.angular-i18n-properties']);

app.run(function(I18nService) {
    I18nService.load('demo/messages.properties', null);
});