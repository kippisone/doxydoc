module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// bumpup: {
		// 	file: 'package.json'
		// },

		// // Lists of files to be linted with JSHint.
		// jshint: {
		// 	files: [
		// 		'src/**/*.js'
		// 	],
		// 	options: {
		// 		jshintrc: '.jshintrc'
		// 	}
		// },
		// uglify: {
		// 	options: {
		// 		preserveComments: 'some'
		// 	},
		// 	build: {
		// 		files: {
		// 			'build/xqcore.min.js': ['build/xqcore.js']
		// 		}
		// 	},
		// 	minimal: {
		// 		files: {
		// 			'build/xqcore-minimal.min.js': ['build/xqcore-minimal.js']
		// 		}
		// 	}
		// },
		// copy: {
		// 	component: {
		// 		files: [
		// 			{
		// 				src: ['build/xqcore.js'],
		// 				dest: '../component-builds/nonamemedia-xqcore/xqcore.js'
		// 			}
		// 		]
		// 	},
		// 	firetpl: {
		// 		files: [
		// 			{
		// 				src: ['firetpl.js', 'firetpl-runtime.js'],
		// 				dest: 'lib/',
		// 				cwd: '../firetpl/',
		// 				expand: true
		// 			}
		// 		]
		// 	}
		// },
		// clean: {
		// 	build: [
		// 		'webdocs/build/xqcore.js',
		// 		'webdocs/build/xqcore.min.js',
		// 		'webdocs/build/xqcore-minimal.js',
		// 		'webdocs/build/xqcore-minimal.min.js'
		// 	]
		// },
		doxit: {
			dst: {
				options: {},
				files: {
					'docs/': ['src/**/*.js']
				}
			}
		},
		less: {
			dist: {

				options: {

				},
				files: {
					'webdocs/main.css': 'webdocs/less/main.less'
				}
			}
		},
		watch: {
			files: 'webdocs/js/**/*.js',
			tasks: ['build']
		}
	});

	// grunt.loadTasks('./modules/grunt-xqcoretest');
	// grunt.loadNpmTasks('grunt-contrib-clean');
	// grunt.loadNpmTasks('grunt-contrib-copy');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-doxit');

	grunt.registerTask('default', 'jshint');
	grunt.registerTask('doc', 'doxit');
	grunt.registerTask('build', ['less', 'browserify']);
};