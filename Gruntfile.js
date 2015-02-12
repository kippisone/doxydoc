module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bumpup: {
            file: 'package.json'
        },
        copy: {
            build: {
                files: [{
                    cwd: 'templates/lagoon/', expand: true, src: ['lib/**/*', 'js/**/*'], dest: 'build/'
                }]
            }
        },
        jshint: {
            files: [
                'webdocs/models/**/*.js',
                'webdocs/presenter/**/*.js',
                'webdocs/tests/**/*.js',
                'webdocs/views/**/*.js',
                'webdocs/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        doxydoc: {
            doc: {
                src: ['test/src/*.js', 'test/src/*.less'],
                dest: 'build/'
            },
            json: {
                src: ['test/src/*.js'],
                dest: 'build/doc.json'
            }
        },
        less: {
            build: {
                options: {
                    relativeUrls: true,
                    rootpath: 'templates/lagoon/less/'
                },
                files: {
                    'templates/lagoon/main.css': 'templates/lagoon/less/main.less'
                }
            },
            dev: {
                options: {
                    relativeUrls: true,
                    rootpath: 'less/'
                },
                files: {
                    'build/main.css': 'templates/lagoon/less/main.less'
                }
            }
        },
        watch: {
            less: {
                files: ['templates/**/*.less'],
                tasks: ['less:dev'],
                options: {
                    livereload: 35345
                }
            },
            tmpl: {
                files: ['templates/**/*.fire'],
                tasks: ['less:build', 'doxydoc'],
                options: {
                    livereload: 35345
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-doxydoc');

    grunt.registerTask('default', 'help');
    grunt.registerTask('build', [
        'jshint',
        'less:build',
        'copy:build',
        'doxydoc',
        'bumpup:prerelease'
    ]);
};