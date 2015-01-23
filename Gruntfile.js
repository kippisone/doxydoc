module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: [
                'webdocs/models/**/*.js',
                'webdocs/presenter/**/*.js',
                'webdocs/tests/**/*.js',
                'webdocs/views/**/*.js',
                'webdocs/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },
        less: {
            dist: {
                options: {
                    relativeUrls: true,
                    rootpath: 'less/'
                },
                files: {
                    'templates/lagoon/main.css': 'templates/lagoon/less/main.less'
                }
            }
        },
        watch: {
            less: {
                options: {
                    livereload: true,
                    dumpLineNumbers: true,
                    sourceMap: true,
                    // sourceMapFilename: 'main.css.map'

                },
                files: 'templates/**/*.less',
                tasks: ['less']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bumpup');

    grunt.registerTask('default', 'help');
    grunt.registerTask('build', [
        'jshint',
        'less',
        'bumbup:prerelease'
    ]);
};