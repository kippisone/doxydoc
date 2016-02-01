'use strict';
var path = require('path');

var DoxyDoc = require('../doxydoc');

describe.skip('Mapper', function() {
    var doxydoc;

    describe('callMapper', function() {
        var jsMapperStub;

        before(function() {
            doxydoc = new DoxyDoc();
            jsMapperStub = sinon.stub(doxydoc.__mapperFuncs, 'js');
            doxydoc.readFiles(path.join('./test/src/banana.js'));
        });

        after(function() {
            jsMapperStub.restore();
        });

        it('Should call a mapper function with a @module block', function() {
            expect(jsMapperStub).was.called();
            expect(jsMapperStub).was.calledWith(sinon.match.array);

            var mapperData = jsMapperStub.firstCall.args[0][0];
            expect(mapperData).to.be.eql({
                examples: [{
                    code: '    var banana = require(\'banana\');\n    banana.peelIt();',
                    type: 'js'
                }],
                description: {
                    full: '<p>Banana test module</p><p>Very awesome banana module.</p>',
                    summary: '<p>Banana test module</p>',
                    body: '<p>Very awesome banana module.</p>'
                },
                source: {
                    code: 'module.exports = function() {\n    \'use strict\';',
                    type: 'js'
                },
                codeStart: 11,
                line: 1,
                name: 'banana',
                type: 'module'
            });

            jsMapperStub.restore();
        });

        it('Should call a mapper function with a @const block', function() {
            var mapperData = jsMapperStub.firstCall.args[0][1];
            expect(mapperData).to.be.eql({
                description: {
                    full: '<p>Test constant</p>',
                    summary: '<p>Test constant</p>',
                    body: ''
                },
                source: {
                    code: 'var NAME = \'banana\';',
                    type: 'js'
                },
                codeStart: 18,
                line: 14
            });

            jsMapperStub.restore();
        });

        it('Should call a mapper function with a @constructor block', function() {
            var mapperData = jsMapperStub.firstCall.args[0][2];

            expect(mapperData).to.be.eql({
                description: {
                    full: '<p>Banana constructor</p>',
                    summary: '<p>Banana constructor</p>',
                    body: ''
                },
                source: {
                    code: 'var Banana = function() {\n\n};',
                    type: 'js'
                },
                codeStart: 24,
                line: 20,
                isConstructor: true,
                name: 'Banana',
                type: 'function'
            });

            jsMapperStub.restore();
        });

        it('Should call a mapper function with a @method block', function() {
            var mapperData = jsMapperStub.firstCall.args[0][3];

            expect(mapperData).to.be.eql({
                description: {
                    full: '<p>Tastes method of Banana</p>',
                    summary: '<p>Tastes method of Banana</p>',
                    body: ''
                },
                source: {
                    code: 'Banana.prototype.tastes = function() {\n    return \'awesome\';\n};',
                    type: 'js'
                },
                codeStart: 33,
                line: 28,
                name: 'tastes',
                type: 'method',
                returns: {
                    dataTypes: ['string'],
                    description: '<p>Returns how bananas tastes</p>'
                }
            });

            jsMapperStub.restore();
        });
    });
});