'use strict';

var inspect = require('inspect.js');
var Docs = require('../modules/docs');

describe('Docs object', function() {
    describe('class', function() {
        it('should be a Docs class', function() {
            inspect(Docs).isClass();
        });
    });

    describe('instance', function() {
        it('should be a Docs instance', function() {
            inspect(new Docs()).isObject();
        });
    });

    describe('parseDoc', function() {
        var docs = new Docs();
        docs.setFileInfo({
            name: '/home/test/doxydoc/banana.js'
        });

        it('should create a Docs object', function() {
            inspect(docs).isObject();
            inspect(docs.items).isArray();
        });

        it('should set a package', function() {
            docs.createPackage('Test pack');

            inspect(docs.items).hasLength(1);
            inspect(docs.items[0]).isEql({
                name: 'Test pack',
                file: '/home/test/doxydoc/banana.js',
                type: 'package',
                items: []
            });
        });

        it('all should point to package', function() {
            inspect(docs.bucket).isEqual(docs.items[0].items);
        });

        it('should set a subpackage', function() {
            docs.createSubpackage('Test subpack');

            inspect(docs.items).hasLength(1);
            inspect(docs.items[0].items).isArray();
            inspect(docs.items[0].items).hasLength(1);
            inspect(docs.items[0].items[0]).isEql({
                name: 'Test subpack',
                file: '/home/test/doxydoc/banana.js',
                type: 'subpackage',
                items: []
            });
        });

        it('all should point to subpackage', function() {
            inspect(docs.bucket).isEqual(docs.items[0].items[0].items);
        });

        it('should set a module', function() {
            docs.createModule('Test module');

            inspect(docs.items).hasLength(1);
            inspect(docs.items[0].items).isArray();
            inspect(docs.items[0].items).hasLength(1);
            inspect(docs.items[0].items[0].items).isArray();
            inspect(docs.items[0].items[0].items).hasLength(1);
            inspect(docs.items[0].items[0].items[0]).isEql({
                name: 'Test module',
                file: '/home/test/doxydoc/banana.js',
                type: 'module',
                items: []
            });
        });

        it('all should point to module', function() {
            inspect(docs.bucket).isEqual(docs.items[0].items[0].items[0].items);
        });

        it('should set a submodule', function() {
            docs.createSubmodule('Test submodule');

            inspect(docs.items).hasLength(1);
            inspect(docs.items[0].items).isArray();
            inspect(docs.items[0].items).hasLength(1);
            inspect(docs.items[0].items[0].items).isArray();
            inspect(docs.items[0].items[0].items).hasLength(1);
            inspect(docs.items[0].items[0].items[0].items).isArray();
            inspect(docs.items[0].items[0].items[0].items).hasLength(1);
            inspect(docs.items[0].items[0].items[0].items[0]).isEql({
                name: 'Test submodule',
                file: '/home/test/doxydoc/banana.js',
                type: 'submodule',
                items: []
            });
        });

        it('all should point to submodule', function() {
            inspect(docs.bucket).isEqual(docs.items[0].items[0].items[0].items[0].items);
        });

        it('should add a method', function() {
            docs.createGroupItem('method', {
                group: 'method',
                name: 'foo',
                tags: {
                    method: 'foo',
                    params: [{
                        type: 'function',
                        name: 'callback',
                        description: 'Callback function'
                    }]
                }
            });

            inspect(docs.curSubmodule.items).isArray();
            inspect(docs.curSubmodule.items).hasLength(1);
            inspect(docs.curSubmodule.items[0].items).isArray();
            inspect(docs.curSubmodule.items[0].items).hasLength(1);
            inspect(docs.curSubmodule.items[0].items[0]).isEql({
                group: 'method',
                name: 'foo',
                tags: {
                    method: 'foo',
                    params: [{
                        type: 'function',
                        name: 'callback',
                        description: 'Callback function'
                    }]
                }
            });
        });

        it('should add a second method', function() {
            docs.createGroupItem('method', {
                group: 'method',
                name: 'bar',
                tags: {
                    method: 'bar',
                    params: [{
                        type: 'function',
                        name: 'callback',
                        description: 'Callback function'
                    }]
                }
            });

            inspect(docs.curSubmodule.items).isArray();
            inspect(docs.curSubmodule.items).hasLength(1);
            inspect(docs.curSubmodule.items[0].items).isArray();
            inspect(docs.curSubmodule.items[0].items).hasLength(2);
            inspect(docs.curSubmodule.items[0].items[1]).isEql({
                group: 'method',
                name: 'bar',
                tags: {
                    method: 'bar',
                    params: [{
                        type: 'function',
                        name: 'callback',
                        description: 'Callback function'
                    }]
                }
            });
        });

        it('should add a property', function() {
            docs.createGroupItem('property', {
                group: 'property',
                name: 'isFoo',
                tags: {
                    property: 'isFoo',
                    params: [{
                        type: 'boolean',
                        name: 'isFoo',
                        description: 'Is foo?'
                    }]
                }
            });

            inspect(docs.curSubmodule.items).isArray();
            inspect(docs.curSubmodule.items).hasLength(2);
            inspect(docs.curSubmodule.items[1].items).isArray();
            inspect(docs.curSubmodule.items[1].items).hasLength(1);
            inspect(docs.curSubmodule.items[1].items[0]).isEql({
                group: 'property',
                name: 'isFoo',
                tags: {
                    property: 'isFoo',
                    params: [{
                        type: 'boolean',
                        name: 'isFoo',
                        description: 'Is foo?'
                    }]
                }
            });
        });
    });
});
