module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: [
                'webdocs/build/'
            ]
        },
        copy: {
            build: {
                files: [{
                    src: ['webdocs/index.html'],
                    dest: 'build/'
                }]
            }
        },
        componentbuild: {
            dist: {
                options: {
                    name: 'doxit',
                    development: false,
                    umd: 'doxit'
                },
                src: './webdocs/',
                dest: './webdocs/build/'
            },
            styles: {
                options: {
                    name: 'doxit',
                    development: false,
                    scripts: false
                },
                src: './webdocs/',
                dest: './webdocs/build/'
            }
        },
        imageEmbed: {
            dist: {
                options: {
                    xbaseDir: 'webdocs/'
                },
                src: ['webdocs/main.css'],
                dest: 'webdocs/main.css'
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
                    'webdocs/main.css': 'webdocs/less/main.less'
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
                files: 'webdocs/less/**/*.less',
                tasks: ['less:dist', 'componentbuild:styles']
            },
            component: {
                options: {
                    livereload: true
                },
                files: 'webdocs/!(build)**/*.js',
                tasks: ['componentbuild:dist']
            },
            firetpl: {
                options: {
                    livereload: true
                },
                files: 'webdocs/!(build)**/*.fire',
                tasks: ['componentbuild:dist']
            }
        }
    });

    // grunt.loadTasks('./modules/grunt-xqcoretest');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-bumpup');
    // grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-component-build');

    grunt.registerTask('default', 'jshint');
    grunt.registerTask('build', [
        'jshint',
        'clean:build',
        'less:dist',
        'imageEmbed:dist',
        'componentbuild:dist',
        'copy:build'
    ]);
};