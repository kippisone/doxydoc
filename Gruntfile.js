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
        less: {
            lagoon: {
                options: {
                    relativeUrls: true,
                    rootpath: 'templates/lagoon/less/'
                },
                files: {
                    'templates/lagoon/main.css': 'templates/lagoon/less/main.less'
                }
            },
            'deep-space': {
                options: {
                    relativeUrls: true,
                    rootpath: 'templates/deep-space/less/'
                },
                files: {
                    'templates/deep-space/main.css': 'templates/deep-space/less/main.less'
                }
            }
        },
        uglify: {
            hljs: {
                files: {
                    'templates/lagoon/lib/highlightjs/highlight.js': [
                        'node_modules/highlight.js/lib/highlight.js',
                        'node_modules/highlight.js/lib/languages/1c.js',
                        'node_modules/highlight.js/lib/languages/actionscript.js',
                        'node_modules/highlight.js/lib/languages/apache.js',
                        'node_modules/highlight.js/lib/languages/applescript.js',
                        'node_modules/highlight.js/lib/languages/xml.js',
                        'node_modules/highlight.js/lib/languages/asciidoc.js',
                        'node_modules/highlight.js/lib/languages/aspectj.js',
                        'node_modules/highlight.js/lib/languages/autohotkey.js',
                        'node_modules/highlight.js/lib/languages/avrasm.js',
                        'node_modules/highlight.js/lib/languages/axapta.js',
                        'node_modules/highlight.js/lib/languages/bash.js',
                        'node_modules/highlight.js/lib/languages/brainfuck.js',
                        'node_modules/highlight.js/lib/languages/capnproto.js',
                        'node_modules/highlight.js/lib/languages/clojure.js',
                        'node_modules/highlight.js/lib/languages/clojure-repl.js',
                        'node_modules/highlight.js/lib/languages/cmake.js',
                        'node_modules/highlight.js/lib/languages/coffeescript.js',
                        'node_modules/highlight.js/lib/languages/cpp.js',
                        'node_modules/highlight.js/lib/languages/cs.js',
                        'node_modules/highlight.js/lib/languages/css.js',
                        'node_modules/highlight.js/lib/languages/d.js',
                        'node_modules/highlight.js/lib/languages/markdown.js',
                        'node_modules/highlight.js/lib/languages/dart.js',
                        'node_modules/highlight.js/lib/languages/delphi.js',
                        'node_modules/highlight.js/lib/languages/diff.js',
                        'node_modules/highlight.js/lib/languages/django.js',
                        'node_modules/highlight.js/lib/languages/dos.js',
                        'node_modules/highlight.js/lib/languages/dust.js',
                        'node_modules/highlight.js/lib/languages/elixir.js',
                        'node_modules/highlight.js/lib/languages/ruby.js',
                        'node_modules/highlight.js/lib/languages/erb.js',
                        'node_modules/highlight.js/lib/languages/erlang-repl.js',
                        'node_modules/highlight.js/lib/languages/erlang.js',
                        'node_modules/highlight.js/lib/languages/fix.js',
                        'node_modules/highlight.js/lib/languages/fsharp.js',
                        'node_modules/highlight.js/lib/languages/gcode.js',
                        'node_modules/highlight.js/lib/languages/gherkin.js',
                        'node_modules/highlight.js/lib/languages/glsl.js',
                        'node_modules/highlight.js/lib/languages/go.js',
                        'node_modules/highlight.js/lib/languages/gradle.js',
                        'node_modules/highlight.js/lib/languages/groovy.js',
                        'node_modules/highlight.js/lib/languages/haml.js',
                        'node_modules/highlight.js/lib/languages/handlebars.js',
                        'node_modules/highlight.js/lib/languages/haskell.js',
                        'node_modules/highlight.js/lib/languages/haxe.js',
                        'node_modules/highlight.js/lib/languages/http.js',
                        'node_modules/highlight.js/lib/languages/ini.js',
                        'node_modules/highlight.js/lib/languages/java.js',
                        'node_modules/highlight.js/lib/languages/javascript.js',
                        'node_modules/highlight.js/lib/languages/json.js',
                        'node_modules/highlight.js/lib/languages/lasso.js',
                        'node_modules/highlight.js/lib/languages/less.js',
                        'node_modules/highlight.js/lib/languages/lisp.js',
                        'node_modules/highlight.js/lib/languages/livecodeserver.js',
                        'node_modules/highlight.js/lib/languages/livescript.js',
                        'node_modules/highlight.js/lib/languages/lua.js',
                        'node_modules/highlight.js/lib/languages/makefile.js',
                        'node_modules/highlight.js/lib/languages/mathematica.js',
                        'node_modules/highlight.js/lib/languages/matlab.js',
                        'node_modules/highlight.js/lib/languages/mel.js',
                        'node_modules/highlight.js/lib/languages/mercury.js',
                        'node_modules/highlight.js/lib/languages/mizar.js',
                        'node_modules/highlight.js/lib/languages/monkey.js',
                        'node_modules/highlight.js/lib/languages/nginx.js',
                        'node_modules/highlight.js/lib/languages/nimrod.js',
                        'node_modules/highlight.js/lib/languages/nix.js',
                        'node_modules/highlight.js/lib/languages/nsis.js',
                        'node_modules/highlight.js/lib/languages/objectivec.js',
                        'node_modules/highlight.js/lib/languages/ocaml.js',
                        'node_modules/highlight.js/lib/languages/oxygene.js',
                        'node_modules/highlight.js/lib/languages/parser3.js',
                        'node_modules/highlight.js/lib/languages/perl.js',
                        'node_modules/highlight.js/lib/languages/php.js',
                        'node_modules/highlight.js/lib/languages/powershell.js',
                        'node_modules/highlight.js/lib/languages/processing.js',
                        'node_modules/highlight.js/lib/languages/profile.js',
                        'node_modules/highlight.js/lib/languages/protobuf.js',
                        'node_modules/highlight.js/lib/languages/puppet.js',
                        'node_modules/highlight.js/lib/languages/python.js',
                        'node_modules/highlight.js/lib/languages/q.js',
                        'node_modules/highlight.js/lib/languages/r.js',
                        'node_modules/highlight.js/lib/languages/rib.js',
                        'node_modules/highlight.js/lib/languages/roboconf.js',
                        'node_modules/highlight.js/lib/languages/rsl.js',
                        'node_modules/highlight.js/lib/languages/ruleslanguage.js',
                        'node_modules/highlight.js/lib/languages/rust.js',
                        'node_modules/highlight.js/lib/languages/scala.js',
                        'node_modules/highlight.js/lib/languages/scheme.js',
                        'node_modules/highlight.js/lib/languages/scilab.js',
                        'node_modules/highlight.js/lib/languages/scss.js',
                        'node_modules/highlight.js/lib/languages/smali.js',
                        'node_modules/highlight.js/lib/languages/smalltalk.js',
                        'node_modules/highlight.js/lib/languages/sml.js',
                        'node_modules/highlight.js/lib/languages/sql.js',
                        'node_modules/highlight.js/lib/languages/stata.js',
                        'node_modules/highlight.js/lib/languages/step21.js',
                        'node_modules/highlight.js/lib/languages/stylus.js',
                        'node_modules/highlight.js/lib/languages/swift.js',
                        'node_modules/highlight.js/lib/languages/tcl.js',
                        'node_modules/highlight.js/lib/languages/tex.js',
                        'node_modules/highlight.js/lib/languages/thrift.js',
                        'node_modules/highlight.js/lib/languages/twig.js',
                        'node_modules/highlight.js/lib/languages/typescript.js',
                        'node_modules/highlight.js/lib/languages/vala.js',
                        'node_modules/highlight.js/lib/languages/vbnet.js',
                        'node_modules/highlight.js/lib/languages/vbscript.js',
                        'node_modules/highlight.js/lib/languages/vbscript-html.js',
                        'node_modules/highlight.js/lib/languages/verilog.js',
                        'node_modules/highlight.js/lib/languages/vhdl.js',
                        'node_modules/highlight.js/lib/languages/vim.js',
                        'node_modules/highlight.js/lib/languages/x86asm.js',
                        'node_modules/highlight.js/lib/languages/xl.js'
                    ]
                }
            }
        },
        release: {
            options: {
                npm: true, //default: true
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
                tasks: ['less'],
                options: {
                    livereload: 35345
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('default', 'help');
    grunt.registerTask('build', [
        'jshint',
        'less',
        'bumpup:prerelease'
    ]);
};