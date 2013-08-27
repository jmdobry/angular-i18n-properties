// an example karma.conf.js
module.exports = function (config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '../',
		frameworks: ['jasmine'],
		plugins: [
			// these plugins will be require() by Karma
			'karma-jasmine',
			'karma-chrome-launcher',
			'karma-phantomjs-launcher',
			'karma-coverage'
		],
		autoWatch: true,
		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['Chrome'],

		// list of files / patterns to load in the browser
		files: [
			'test/vendor/angular-1.1.5.min.js',
			'test/vendor/angular-mocks-1.1.5.js',
			'src/angular-i18n-properties.js',
			{ pattern: 'test/*.properties', included: false },
			'test/angular-i18n-propertiesSpec.js'
		],

		exclude: [
			'dist/'
		],

		// test results reporter to use
		// possible values: dots || progress || growl
		reporters: ['progress', 'coverage'],

		preprocessors: {
			'src/angular-i18n-properties.js': ['coverage']
		},

		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		},

		// web server port
		port: 8000,

		// cli runner port
		runnerPort: 9100,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		logLevel: config.LOG_INFO,

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 30000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};