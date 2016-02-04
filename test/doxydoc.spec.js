'use strict';

var path = require('path');

var inspect = require('inspect.js');
inspect.useSinon(sinon);

var Doxydoc = require('../modules/doxydoc');
var fl = require('node-fl');

describe('Doxydoc', function() {
    describe('class', function() {
        it('should be an instance of Doxydoc', function() {
            inspect(Doxydoc).isClass();
        });
    });

    describe('constructor', function() {
        it('Should create an instance', function() {
            var doxydoc = new Doxydoc();
            inspect(doxydoc).isObject();
        });
    });

    describe('readDoxydocFile', function(done) {
        var sandbox = sinon.sandbox.create();
        var readStub;

        beforeEach(function() {
            readStub = sandbox.stub(fl, 'read');
        });

        afterEach(function() {
            sandbox.restore();    
        });

        it('Should read conf from a doxydoc file', function(done) {
            var doxydoc = new Doxydoc();

            readStub.returns(JSON.stringify({
                name: 'Doxydoc dev'
            }));
            inspect(doxydoc).isObject();

            doxydoc.readDoxydocFile().then(function(conf) {
                inspect(conf).hasProps({
                    name: 'Doxydoc dev',
                    docs: [],
                    pages: [],
                    navigation: [],
                    sidebar: [],
                    scripts: [],
                    styles: []
                });

                done();
            }).catch(done);
        });

        it('Should convert scripts and styles properties into arrays', function(done) {
            var doxydoc = new Doxydoc();

            readStub.returns(JSON.stringify({
                scripts: 'foo.js',
                styles: 'bar.css'
            }));

            doxydoc.readDoxydocFile().then(function(conf) {
                inspect.print(conf);
                inspect(conf).hasProps({
                    scripts: ['foo.js'],
                    styles: ['bla.css']
                });

                done();
            }).catch(done);
        });
    });

    describe('createDocs', function() {
        it('should always return a promise', function() {
            var doxydoc = new Doxydoc();
            inspect(doxydoc.createDocs()).isPromise();
        });

        it('should parse all files', function(done) {
            var doxydoc = new Doxydoc({
                workingDir: path.join(__dirname, 'fixtures')
            });

            doxydoc.docs = [{
                files: ['fruits/banana.js', 'fruits/pineapple.js']
            }];

            doxydoc.createDocs().then(function(docs) {
                inspect(docs)
                    .isArray()
                    .hasLength(2);

                inspect.print(docs);
                done();
            }).catch(done);
        });
    });
});
