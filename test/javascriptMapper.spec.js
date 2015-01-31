'use strict';
var path = require('path'),
    pkg = require('../package.json');

var DoxyDoc = require('../doxydoc');

describe('Javascript', function() {
    var doxydoc;
    
    describe('Mapper', function() {
        var mapDoxResultSpy,
            jsMapperSpy;

        before(function() {
            doxydoc = new DoxyDoc();
            mapDoxResultSpy = sinon.spy(doxydoc, 'mapDoxResult');
            jsMapperSpy = sinon.spy(doxydoc.__mapperFuncs, 'js');
            doxydoc.readFiles(path.join('./test/src/pineapple.js'));
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
            expect(mapDoxResultSpy.returnValues[0]).to.be.an('object');
            expect(mapDoxResultSpy.returnValues[0].name).to.eql('DoxyDoc Docparser');
            expect(mapDoxResultSpy.returnValues[0].description).to.eql(pkg.description);
            expect(mapDoxResultSpy.returnValues[0].version).to.eql(pkg.version);
            expect(mapDoxResultSpy.returnValues[0].listing).to.be.a('array');
            expect(mapDoxResultSpy.returnValues[0].listing).to.have.length(2);
        });
    });

    describe('Doc Block', function() {
        before(function() {
            doxydoc = new DoxyDoc();
        });

        it('Should parse a @constructor tag', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test module\n' +
                ' *\n' +
                ' * @constructor testModule\n' +
                ' */\n' +
                'var MyFunc = function() {};'
            );

            var block = res.listing[0].groups[0].items[0];

            expect(block).to.eql({
                source: {
                    code: 'var MyFunc = function() {};',
                    type: 'js'
                },
                codeStart: 6,
                line: 1,
                link: 'testjs/items/MyFunc',
                description: {
                    full: '<p>Test module</p>',
                    summary: '<p>Test module</p>',
                    body: ''
                },
                isConstructor: true,
                name: 'MyFunc',
                labels: ['Constructor'],
                title: 'MyFunc',
                type: 'function'
            });
        });

        it('Should parse a @method tag', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test method\n' +
                ' *\n' +
                ' * @method myMethod\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {};'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: 'Test.prototype.testMethod = function() {};',
                    type: 'js'
                },
                codeStart: 6,
                line: 1,
                link: 'testjs/method/myMethod',
                description: {
                    full: '<p>Test method</p>',
                    summary: '<p>Test method</p>',
                    body: ''
                },
                name: 'myMethod',
                labels: [],
                title: 'myMethod()',
                type: 'method'
            });
        });

        it('Should parse a @method tag with two params', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test method\n' +
                ' *\n' +
                ' * @method myMethod\n' +
                ' * @param {boolean} test Test description\n' +
                ' * @param {function} callback Callback function\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {};'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: 'Test.prototype.testMethod = function() {};',
                    type: 'js'
                },
                codeStart: 8,
                line: 1,
                link: 'testjs/method/myMethod',
                description: {
                    full: '<p>Test method</p>',
                    summary: '<p>Test method</p>',
                    body: ''
                },
                name: 'myMethod',
                labels: [],
                title: 'myMethod()',
                type: 'method',
                params: [{
                    name: 'test',
                    description: '<p>Test description</p>',
                    optional: false,
                    dataTypes: ['<span class="label labelBoolean">boolean</span>']   
                }, {
                    name: 'callback',
                    description: '<p>Callback function</p>',
                    optional: false,
                    dataTypes: ['<span class="label labelFunction">function</span>']   
                }]
            });
        });

        it('Should parse a @fires', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test method\n' +
                ' *\n' +
                ' * @method myMethod\n' +
                ' * @fires item.add Fires an item.add event\n' +
                ' * @fires item.changed Fires an item.changed event\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {};'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: 'Test.prototype.testMethod = function() {};',
                    type: 'js'
                },
                codeStart: 8,
                line: 1,
                link: 'testjs/method/myMethod',
                description: {
                    full: '<p>Test method</p>',
                    summary: '<p>Test method</p>',
                    body: ''
                },
                name: 'myMethod',
                labels: [],
                title: 'myMethod()',
                type: 'method',
                fires: [{
                    name: 'item.add',
                    description: 'Fires an item.add event'
                }, {
                    name: 'item.changed',
                    description: 'Fires an item.changed event'
                }]
            });
        });

        it('Should parse a @event tag', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test method\n' +
                ' *\n' +
                ' * @method myMethod\n' +
                ' * @event my.event Registers an event\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {};'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: 'Test.prototype.testMethod = function() {};',
                    type: 'js'
                },
                codeStart: 7,
                line: 1,
                link: 'testjs/method/myMethod',
                description: {
                    full: '<p>Test method</p>',
                    summary: '<p>Test method</p>',
                    body: ''
                },
                name: 'myMethod',
                labels: [],
                title: 'myMethod()',
                type: 'method',
                events: [{
                    name: 'my.event',
                    description: 'Registers an event'
                }]
            });

            block = res.listing[0].groups[3].items[0];

            expect(block).to.eql({
                description: {
                    full: 'Registers an event',
                    summary: 'Registers an event',
                    body: ''
                },
                name: 'my.event',
                title: 'my.event',
                link: 'testjs/events/myevent',
                registrar: {
                    name: 'myMethod',
                    type: 'method',
                    link: 'testjs/method/myMethod'
                }
            });
        });

        it('Should parse a @link tag', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test method\n' +
                ' *\n' +
                ' * @link My link http://www.bla.de/bla.html\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {};'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: 'Test.prototype.testMethod = function() {};',
                    type: 'js'
                },
                codeStart: 6,
                line: 1,
                link: 'testjs/method/testMethod',
                description: {
                    full: '<p>Test method</p>',
                    summary: '<p>Test method</p>',
                    body: ''
                },
                name: 'testMethod',
                labels: [],
                title: 'testMethod()',
                type: 'method',
                webLinks: [{
                    name: 'My link',
                    url: 'http://www.bla.de/bla.html',
                    target: '_blank'
                }]
            });
        });

        it('Should parse a @link tag without a link name', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test method\n' +
                ' *\n' +
                ' * @link http://www.bla.de/bla.html\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {};'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: 'Test.prototype.testMethod = function() {};',
                    type: 'js'
                },
                codeStart: 6,
                line: 1,
                link: 'testjs/method/testMethod',
                description: {
                    full: '<p>Test method</p>',
                    summary: '<p>Test method</p>',
                    body: ''
                },
                name: 'testMethod',
                labels: [],
                title: 'testMethod()',
                type: 'method',
                webLinks: [{
                    name: 'http://www.bla.de/bla.html',
                    url: 'http://www.bla.de/bla.html',
                    target: '_blank'
                }]
            });
        });

        it('Should parse a @link tag without a internal link', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test method\n' +
                ' *\n' +
                ' * @link Blablubb #module/bla/blub\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {};'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: 'Test.prototype.testMethod = function() {};',
                    type: 'js'
                },
                codeStart: 6,
                line: 1,
                link: 'testjs/method/testMethod',
                description: {
                    full: '<p>Test method</p>',
                    summary: '<p>Test method</p>',
                    body: ''
                },
                name: 'testMethod',
                labels: [],
                title: 'testMethod()',
                type: 'method',
                webLinks: [{
                    name: 'Blablubb',
                    url: '#module/bla/blub',
                    target: ''
                }]
            });
        });

        it('Should cut of a code after //--', function() {
            var res = doxydoc.parseString('raw', 'test.js',
                '/**\n' +
                ' */\n' +
                'Test.prototype.testMethod = function() {\n};\n //--\n var nex = true;'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block.source.code).to.eql('Test.prototype.testMethod = function() {\n};');
        });
    });
});