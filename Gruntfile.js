/*
 * angular-i18n-properties
 * http://github.com/jmdobry/angular-i18n-properties
 *
 * Copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/angular-i18n-properties>
 * Licensed under the MIT license. <https://github.com/jmdobry/angular-i18n-properties/blob/master/LICENSE>
 */
module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['dist/', 'docs/'],
		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'test/angular-i18n-propertiesSpec.js'],
			jshintrc: '.jshintrc'
		},
		copy: {
			options: {
				processContent: function (contents) {
					contents = contents.replace(/<%= pkg.version %>/g, grunt.file.readJSON('package.json').version);
					return contents;
				}
			},
			dist: {
				src: ['src/angular-i18n-properties.js'],
				dest: 'dist/angular-i18n-properties-<%= pkg.version %>.js'
			}
		},
		uglify: {
			main: {
				files: {
					'dist/angular-i18n-properties-<%= pkg.version %>.min.js': ['dist/angular-i18n-properties-<%= pkg.version %>.js']
				}
			}
		},
		karma: {
			options: {
				configFile: 'test/karma.conf.js',
				singleRun: true,
				autoWatch: false
			},
			default: {
				browsers: ['Chrome'],
				singleRun: false,
				autoWatch: true
			},
			continuous: {
				browsers: ['Chrome']
			},
			drone: {
				browsers: ['Firefox', 'Chrome', 'PhantomJS']
			},
			travis: {
				browsers: ['Firefox', 'PhantomJS']
			}
		},
		jsdoc: {
			dist: {
				src: ['dist/angular-i18n-properties-<%= pkg.version %>.js'],
				options: {
					destination: 'docs',
					lenient: true,
					verbose: true,
					private: true
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('build', ['clean', 'jshint', 'copy', 'uglify', 'karma:continuous']);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('build:all', ['build', 'jsdoc']);
	grunt.registerTask('test', ['karma:continuous']);

	// Used by the CLI build servers
	grunt.registerTask('drone', ['clean', 'jshint', 'copy', 'uglify', 'karma:drone']);
	grunt.registerTask('travis', ['clean', 'jshint', 'copy', 'uglify', 'karma:travis']);
};