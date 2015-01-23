'use strict';

var path = require('path');

var Doxit = require('../doxit');

describe('Doxit parser', function() {
    var doxit;

    beforeEach(function() {
        doxit = new Doxit();
    
    });

    describe('grepDataTypes', function() {
        it('Should grep data types from a string', function() {
            var str = '{number}';
            expect(doxit.grepDataTypes(str)).to.eql(['number']);
        });

        it('Should grep multiple data types from a string', function() {
            var str = '{number|string|anyother}';
            expect(doxit.grepDataTypes(str)).to.eql(['number', 'string', 'anyother']);
        });

        it('Should return an empty array when input str is undefined or empty', function() {
            var str = '';
            expect(doxit.grepDataTypes(str)).to.eql([]);
            str = undefined;
            expect(doxit.grepDataTypes(str)).to.eql([]);
        });

        it('Should return an empty array when input str is a boolean', function() {
            expect(doxit.grepDataTypes(true)).to.eql([]);
            expect(doxit.grepDataTypes(false)).to.eql([]);
            expect(doxit.grepDataTypes(null)).to.eql([]);
        });
    });

    describe.skip('javascript', function() {
        it('Should parse @module tags', function() {
            var result = doxit.readFiles(path.join('./test/src/banana.js'));
            expect(result.listing).to.be.an('array');
            expect(result.listing[0].name).to.eql('banana');
            expect(result.listing[0].groups).to.be.an('array');
        });

        it('Should add modules filname and filepath', function() {
            var result = doxit.readFiles(path.join('./test/src/banana.js'));
            expect(result.listing[0].filename).to.eql('banana.js');
            expect(result.listing[0].file).to.eql(path.join(__dirname, './src/banana.js'));
        });

        it('Should add modules filetype', function() {
            var result = doxit.readFiles(path.join('./test/src/banana.js'));
            expect(result.listing[0].type).to.eql('javascript');
        });
    });

    describe('less', function() {
        it('Should parse @module tags', function() {
            var result = doxit.readFiles(path.join('./test/src/lemon.less'));
            expect(result.listing).to.be.an('array');
            expect(result.listing[0].name).to.eql('Lemon');
            expect(result.listing[0].groups).to.be.an('array');
        });

        it('Should parse @var tags', function() {
            var result = doxit.readFiles(path.join('./test/src/lemon.less'));
            expect(result.listing).to.be.an('array');
            expect(result.listing[0].groups).to.be.an('array');
            
        });

        it('Should parse @var type tags of type color and should create a color preview', function() {
            var result = doxit.readFiles(path.join('./test/src/lemon.less'));
            expect(result.listing).to.be.an('array');
            expect(result.listing[0].groups).to.be.an('array');
            expect(result.listing[0].groups[0].name).to.eql('Variables');
            expect(result.listing[0].groups[0].items).to.be.an('array');
            expect(result.listing[0].groups[0].items[0].dataTypes).to.eql(['color']);
            expect(result.listing[0].groups[0].items[0].name).to.eql('@lemon');
            expect(result.listing[0].groups[0].items[0].preview).to.eql(
                '<div class="cssColorPreview" style="background-color: #B1FF00">#B1FF00</div>'
            );

        });
    });
});
