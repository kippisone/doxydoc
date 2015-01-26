'use strict';
var path = require('path');

var Doxit = require('../doxit');

describe('Mapper', function() {
    var doxit;

    describe('callMapper', function() {
        var jsMapperStub;

        before(function() {
            doxit = new Doxit();
            jsMapperStub = sinon.stub(doxit.__mapperFuncs, 'js');
            doxit.readFiles(path.join('./test/src/banana.js'));
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
                    code: '    var banana = require(\'banana\');\n    banana.peelIt();'
                }],
                description: {
                    full: '<p>Banana test module</p><p>Very awesome banana module.</p>',
                    summary: '<p>Banana test module</p>',
                    body: '<p>Very awesome banana module.</p>'
                },
                code: 'module.exports = function() {\n    \'use strict\';',
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
                code: 'var NAME = \'banana\';',
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
                code: 'var Banana = function() {\n\n};',
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
                code: 'Banana.prototype.tastes = function() {\n    return \'awesome\';\n};',
                codeStart: 33,
                line: 28,
                name: 'tastes',
                type: 'method'
            });

            jsMapperStub.restore();
        });
    });
});