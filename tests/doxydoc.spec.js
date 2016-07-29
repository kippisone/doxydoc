'use strict';

let path = require('path');

let inspect = require('inspect.js');
let sinon = require('sinon');
inspect.useSinon(sinon);

let Doxydoc = require('../modules/doxydoc');
let fl = require('node-fl');

describe('Doxydoc', function() {
  describe('class', function() {
    it('should be an instance of Doxydoc', function() {
      inspect(Doxydoc).isClass();
    });
  });

  describe('constructor', function() {
    it('Should create an instance', function() {
      let doxydoc = new Doxydoc();
      inspect(doxydoc).isObject();
    });
  });

  describe('readDoxydocFile', function(done) {
    let sandbox = sinon.sandbox.create();
    let readStub;

    beforeEach(function() {
      readStub = sandbox.stub(fl, 'read');
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('Should read conf from a doxydoc file', function(done) {
      let doxydoc = new Doxydoc();

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
      let doxydoc = new Doxydoc();

      readStub.returns(JSON.stringify({
        scripts: 'foo.js',
        styles: 'bar.css'
      }));

      doxydoc.readDoxydocFile().then(function(conf) {
        inspect(conf).hasProps({
          scripts: ['foo.js'],
          styles: ['bla.css']
        });

        done();
      }).catch(done);
    });

    it('Should convert all docs.files properties into arrays', function(done) {
      let doxydoc = new Doxydoc();

      readStub.returns(JSON.stringify({
        docs: [{
          files: 'foo.js'
        }]
      }));

      doxydoc.readDoxydocFile().then(function(conf) {
        inspect(conf).hasProps({
          docs: [{
            files: ['foo.js']
          }]
        });

        done();
      }).catch(done);
    });
  });

  describe('createDocs', function() {
    it('should always return a promise', function() {
      let doxydoc = new Doxydoc();
      inspect(doxydoc.createDocs()).isPromise();
    });

    it('should parse all files', function(done) {
      let doxydoc = new Doxydoc({
        workingDir: path.join(__dirname, 'fixtures')
      });

      doxydoc.docs = [{
        files: [path.join(__dirname, 'fixtures/fruits/banana.js'), path.join(__dirname, 'fixtures/fruits/pineapple.js')]
      }];

      doxydoc.createDocs().then(function(docs) {
        inspect(doxydoc.docs[0].files)
          .isArray()
          .hasLength(2);

        done();
      }).catch(done);
    });
  });
});
