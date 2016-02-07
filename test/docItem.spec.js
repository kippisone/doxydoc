var inspect = require('inspect.js');

describe('DocItem', function() {
    var DocItem = require('../modules/docItem');
    
    describe('instance', function() {
        it('Should build a nested docs structure', function() {

            var docs = new DocItem();
            var p = docs.addPackage({
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