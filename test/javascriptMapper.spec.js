'use strict';
var path = require('path'),
    pkg = require('../package.json');

var Doxit = require('../doxit'),
    dox = require('dox');

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
            expect(mapDoxResultSpy.returnValues[0]).to.be.an('object');
            expect(mapDoxResultSpy.returnValues[0].name).to.eql(pkg.name);
            expect(mapDoxResultSpy.returnValues[0].description).to.eql(pkg.description);
            expect(mapDoxResultSpy.returnValues[0].version).to.eql(pkg.version);
            expect(mapDoxResultSpy.returnValues[0].listing).to.be.a('array');
            expect(mapDoxResultSpy.returnValues[0].listing).to.have.length(2);
        });
    });

    describe('Block mapping', function() {
        before(function() {

            doxit = new Doxit();
        });

        it('Should parse a @constructor tag', function() {
            var res = doxit.parseString('raw', 'test.js',
                '/**\n' +
                ' * Test module\n' +
                ' *\n' +
                ' * @constructor testModule\n' +
                ' */\n' +
                'var MyFunc = function() {};'
            );

            var block = res.listing[0].groups[0].items[0];

            expect(block).to.eql({
                code: 'var MyFunc = function() {};',
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
    });
});