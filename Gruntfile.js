module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bumpup: {
            file: 'package.json'
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
            docs: {
                src: ['test/src/*.js', 'test/src/*.less'],
                dest: 'build/'
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
        release: {
            options: {
                npm: true, //default: true
                npmtag: true, //default: no tag
                indentation: '    ', //default: '  ' (two spaces)
                tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'Release v<%= version %>', //default: 'release <%= version %>'
                tagMessage: 'Tagging release v<%= version %>', //default: 'Version <%= version %>',
                beforeRelease: ['build'],
                // github: {
                //     repo: 'AndiOxidant/doxydoc.git', //put your user/repo here
                //     usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
                //     passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains Github password
                // }
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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-doxydoc');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('default', 'help');
    grunt.registerTask('build', [
        'jshint',
        'less:build',
        'doxydoc',
        'bumpup:prerelease'
    ]);
};