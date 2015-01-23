'use strict';
var path = require('path'),
    pkg = require('../package.json');

var Doxit = require('../doxit');

describe('Javascript mapper', function() {
    var doxit;
    
    describe('Mapper', function() {
        var mapDoxResultSpy,
            jsMapperSpy;

        before(function() {
            doxit = new Doxit();
            mapDoxResultSpy = sinon.spy(doxit, 'mapDoxResult');
            jsMapperSpy = sinon.spy(doxit.__mapperFuncs, 'js');
            doxit.readFiles(path.join('./test/src/pineapple.js'));
        });

        after(function() {
            mapDoxResultSpy.restore();
            jsMapperSpy.restore();
        });

        it('Should have a setGroup method', function() {
            var thisValue = mapDoxResultSpy.thisValues[0];
            expect(thisValue.setGroup).to.be.a('function');
        });

        it('Should map a .js file', function() {
            expect(mapDoxResultSpy.returnValues[0]).to.eql({
                name: pkg.name,
                version: pkg.version,
                description: pkg.description,
                listing: [{
                    name: 'Pineapple',
                    groups: [{
                        id: 'property',
                        name: 'Properties',
                        items: []
                    }, {
                        id: 'method',
                        name: 'Methods',
                        items: []
                    }, {
                        id: 'events',
                        name: 'Events',
                        items: []
                    }],
                    unknown: [{
                        code: 'var eat = function() {\n\n};',
                        codeStart: 18,
                        description: {
                            summary: '<p>Eat method</p>',
                            body: '',
                            full: '<p>Eat method</p>'
                        },
                        line: 15,
                        tags: {
                        }
                    }]
                }, {
                    name: 'Pineapple2',
                    groups: [{
                        id: 'property',
                        name: 'Properties',
                        items: []
                    }, {
                        id: 'method',
                        name: 'Methods',
                        items: [{
                            code: 'var peal = function() {\n\n};\n\n};',
                            codeStart: 28,
                            description: {
                                summary: '<p>Peal method</p>',
                                body: '',
                                full: '<p>Peal method</p>'
                            },
                            line: 22,
                            tags: {
                                method: 'peal',
                                group: 'Pineapple2'
                            }
                        }]
                    }, {
                        id: 'events',
                        name: 'Events',
                        items: []
                    }],
                    unknown: [{
                        code: 'var taste = \'sweet\';',
                        codeStart: 13,
                        description: {
                          body: '',
                          full: '<p>Taste variable</p>',
                          summary: '<p>Taste variable</p>'
                        },
                        line: 8,
                        tags: {
                            group: 'Pineapple2',
                            
                        }
                    }]
                }]
            });
        });
    });
});