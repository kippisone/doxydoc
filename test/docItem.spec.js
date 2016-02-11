var inspect = require('inspect.js');

describe('DocItem', function() {
    var DocItem = require('../modules/docItem');

    describe('RootItem', function() {
        var ctx, rootItem;

        beforeEach(function() {
            ctx = { items: [] };
            rootItem = new DocItem(ctx);    
        });

        it('Should create a root item', function() {
            inspect(rootItem).isObject();
        });
    });

    describe('PackageItem', function() {
        var ctx, rootItem;

        beforeEach(function() {
            ctx = { items: [] };
            rootItem = new DocItem(ctx);    
        });

        it('Should create a package item', function() {
            var obj = rootItem.getInstance('package', 'test1');
            inspect(obj).isObject();
            inspect(rootItem.items).hasLength(1);
            inspect(rootItem.items[0]).isEqual(obj);
            inspect(obj.parent).isEqual(rootItem);
        });

        it('Should be unique', function() {
            var obj = rootItem.getInstance('package', 'test1');
            inspect(rootItem.items).hasLength(1);
            inspect(rootItem.items[0]).isEqual(obj);
            inspect(obj.parent).isEqual(rootItem);
        });
    });

    describe('SubPackageItem', function() {
        var ctx, rootItem;

        beforeEach(function() {
            ctx = { items: [] };
            rootItem = new DocItem(ctx);    
        });

        it('Should create a subpackage item', function() {
            var obj = rootItem.getInstance('subpackage');
            inspect(obj).isObject();
            inspect(rootItem.items).hasLength(1);
            inspect(rootItem.items[0]).isEqual(obj);
            inspect(obj.parent).isEqual(rootItem);
        });
    });

    describe('ModelItem', function() {
        var ctx, rootItem;

        beforeEach(function() {
            ctx = { items: [] };
            rootItem = new DocItem(ctx);    
        });

        it('Should create a module item', function() {
            var obj = rootItem.getInstance('module');
            inspect(obj).isObject();
            inspect(rootItem.items).hasLength(1);
            inspect(rootItem.items[0]).isEqual(obj);
            inspect(obj.parent).isEqual(rootItem);
        });
    });

    describe('SubModelItem', function() {
        var ctx, rootItem;

        beforeEach(function() {
            ctx = { items: [] };
            rootItem = new DocItem(ctx);    
        });

        it('Should create a submodule item', function() {
            var obj = rootItem.getInstance('submodule');
            inspect(obj).isObject();
            inspect(rootItem.items).hasLength(1);
            inspect(rootItem.items[0]).isEqual(obj);
            inspect(obj.parent).isEqual(rootItem);
        });
    });

    describe('GroupItem', function() {
        var ctx, rootItem;

        beforeEach(function() {
            ctx = { items: [] };
            rootItem = new DocItem(ctx);    
        });

        it('Should create a group item', function() {
            var obj = rootItem.getInstance('group');
            inspect(obj).isObject();
            inspect(rootItem.items).hasLength(1);
            inspect(rootItem.items[0]).isEqual(obj);
            inspect(obj.parent).isEqual(rootItem);
        });
    });
    
    describe('instance', function() {
        it('Should build a nested docs structure', function() {

            var docs = new DocItem();
            var p = docs.addPackage({
                package: 'p1',
                value: 'foo'
            });

            var m = p.addModule({
                value: 'bla'
            });

            m.addGroup({
                group: 'method',
                value: 'G1'
            });

            var g = m.addGroup({
                group: 'method',
                value: 'G2'
            });

            g.addContent({
                value: 'C1'
            });

            g.addContent({
                value: 'C2'
            });

            m.addPackage({
                value: 'P2'
            });

            inspect.print(docs.toObject());
            inspect(docs.toObject()).isEql({
                atype: 'root',
                items: [{
                    atype: 'package',
                    value: 'foo',
                    items: [{
                        atype: 'module',
                        value: 'bla',
                        items: [{
                            atype: 'group',
                            group: 'method',
                            items: [{
                                atype: 'content',
                                value: 'C1'
                            }, {
                                atype: 'content',
                                value: 'C2'
                            }],
                            value: 'G2'
                        }]
                    }]
                }, {
                    atype: 'package',
                    items: [],
                    value: 'P2'
                }]
            });
        });
    
        it('Should add a module as first item', function() {

            var docs = new DocItem();
            var p = docs.addModule({
                value: 'foo'
            });

            p.addContent({
                value: 'bla'
            });

            inspect(docs.toObject()).isEql({
                atype: 'root',
                items: [{
                    atype: 'module',
                    value: 'foo',
                    items: [{
                        atype: 'content',
                        value: 'bla'
                    }]
                }]
            });
        });
    
        it('Should add a group as first item', function() {

            var docs = new DocItem();
            var p = docs.addGroup({
                value: 'foo'
            });

            p.addContent({
                value: 'bla'
            });

            inspect(docs.toObject()).isEql({
                atype: 'root',
                items: [{
                    atype: 'group',
                    value: 'foo',
                    items: [{
                        atype: 'content',
                        value: 'bla'
                    }]
                }]
            });
        });
    
        it('Should add a content as first item', function() {

            var docs = new DocItem();
            var p = docs.addPackage({
                value: 'foo'
            });

            p.addModule({
                value: 'bla'
            });

            inspect(docs.toObject()).isEql({
                atype: 'root',
                items: [{
                    atype: 'package',
                    value: 'foo',
                    items: [{
                        atype: 'module',
                        value: 'bla',
                        items: []
                    }]
                }]
            });
        });
    });

});