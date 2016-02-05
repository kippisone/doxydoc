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
        docs.setFileInfo('/home/test/doxydoc/banana.js');
        
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

describe.only('Sandbox', function() {
    it('Should build a nested docs structure', function() {
        class DocsItem {
            constructor(bucket, type) {
                let newBucket = {
                    type: type || 'root',
                    items: []
                };

                if (bucket) {
                    this.parent = bucket;
                    bucket.items.push(newBucket);
                }

                this.bucket = newBucket;
            }

            set(data) {
                Object.assign(this.bucket, data);
            }

            pack(data) {
                var p = new PackageItem(this.bucket);
                p.set(data);
                return p;
            }

            mod(data) {
                var m = new ModuleItem(this.bucket);
                m.set(data);
                return m;
            }

            group(data) {
                var m = new GroupItem(this.bucket);
                m.set(data);
                return m;
            }

            getParentBucket(name) {
                var parent = this.parent;
                while (true) {
                    if (!parent) {
                        return this;
                    }

                    if (parent.type === name) {
                        return parent;
                    }

                    parent = parent.parent;
                }
            }
        }

        class PackageItem extends DocsItem {
            constructor(bucket) {
                super(bucket, 'package');
            }
        }

        class ModuleItem extends DocsItem {
            constructor(bucket) {
                super(bucket, 'module');
            }

            pack(data) {
                var parent = this.getParentBucket('package');
                console.log('PARENT', parent);
                var p = new PackageItem(parent);
                p.set(data);
                return p;
            }
        }

        class GroupItem extends DocsItem {
            constructor(bucket, group) {
                super(bucket, 'group');
            }
        }

        var docs = new DocsItem();
        var p = docs.pack({
            value: 'foo'
        });

        var m = p.mod({
            value: 'bla'
        });

        m.group({
            group: 'method',
            value: 'G1'
        });

        m.group({
            group: 'method',
            value: 'G2'
        });

        m.pack({
            value: 'pack 2'
        });

        inspect(docs.bucket).isEql({
            type: 'root',
            items: [{
                type: 'package',
                value: 'foo',
                items: [{
                    type: 'module',
                    value: 'bla',
                    items: [{
                        type: 'group',
                        group: 'method',
                        items: [],
                        value: 'G1'
                    }, {
                        type: 'group',
                        group: 'method',
                        items: [],
                        value: 'G2'
                    }]
                }]
            }, {
                type: 'package',
                items: [],
                value: 'Pack 2'
            }]
        });
    });
});
});
