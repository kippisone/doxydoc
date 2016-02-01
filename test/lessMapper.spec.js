'use strict';
var DoxyDoc = require('../doxydoc');

describe.skip('LESS', function() {
    var doxydoc;
    
    describe('Doc Block:', function() {
        beforeEach(function() {
            doxydoc = new DoxyDoc();
        });

        it('Should parse an empty file', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                ''
            );

            expect(res.listing[0].groups).to.have.length(4);
            expect(res.listing[0].groups[0].id).to.eql('items');
            expect(res.listing[0].groups[1].id).to.eql('selectors');
            expect(res.listing[0].groups[2].id).to.eql('vars');
            expect(res.listing[0].groups[3].id).to.eql('mixins');
        });

        it('Should parse a @mixin tag', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test mixin\n' +
                ' *\n' +
                ' * @mixin\n' +
                ' */\n' +
                '.testMixin() {\n' +
                '}'
            );

            var block = res.listing[0].groups[3].items[0];

            expect(block).to.eql({
                source: {
                    code: '.testMixin() {\n}',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/mixins/testMixin',
                description: {
                    full: '<p>Test mixin</p>',
                    summary: '<p>Test mixin</p>',
                    body: ''
                },
                name: 'testMixin',
                labels: [],
                title: 'testMixin',
                type: 'mixin'
            });
        });

        it('Should parse a @mixin tag first arg used', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test mixin\n' +
                ' *\n' +
                ' * @mixin myMixin\n' +
                ' */\n' +
                '.testMixin() {\n' +
                '}'
            );

            var block = res.listing[0].groups[3].items[0];

            expect(block).to.eql({
                source: {
                    code: '.testMixin() {\n}',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/mixins/myMixin',
                description: {
                    full: '<p>Test mixin</p>',
                    summary: '<p>Test mixin</p>',
                    body: ''
                },
                name: 'myMixin',
                labels: [],
                title: 'myMixin',
                type: 'mixin'
            });
        });

        it('Should parse a @var tag', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test var\n' +
                ' *\n' +
                ' * @var\n' +
                ' */\n' +
                '@testVar: #223344;'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: '@testVar: #223344;',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/vars/testVar',
                description: {
                    full: '<p>Test var</p>',
                    summary: '<p>Test var</p>',
                    body: ''
                },
                name: '@testVar',
                labels: [],
                title: '@testVar',
                type: 'var'
            });
        });

        it('Should parse a @var tag, type used', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test var\n' +
                ' *\n' +
                ' * @var {color}\n' +
                ' */\n' +
                '@testVar: #223344;'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: '@testVar: #223344;',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/vars/testVar',
                description: {
                    full: '<p>Test var</p>',
                    summary: '<p>Test var</p>',
                    body: ''
                },
                name: '@testVar',
                labels: [],
                title: '@testVar',
                type: 'var',
                preview: '<div class="cssColorPreview" style="background-color: #223344">' +
                    '<span class="cssColorName">#223344</span></div>',
                dataTypes: ['color']
            });
        });

        it('Should parse a @var tag, name used', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test var\n' +
                ' *\n' +
                ' * @var myColor\n' +
                ' */\n' +
                '@testVar: #223344;'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: '@testVar: #223344;',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/vars/myColor',
                description: {
                    full: '<p>Test var</p>',
                    summary: '<p>Test var</p>',
                    body: ''
                },
                name: 'myColor',
                labels: [],
                title: 'myColor',
                type: 'var'
                
            });
        });

        it('Should parse a @var tag, type and name used', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test var\n' +
                ' *\n' +
                ' * @var {color} myColor\n' +
                ' */\n' +
                '@testVar: #223344;'
            );

            var block = res.listing[0].groups[2].items[0];

            expect(block).to.eql({
                source: {
                    code: '@testVar: #223344;',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/vars/myColor',
                description: {
                    full: '<p>Test var</p>',
                    summary: '<p>Test var</p>',
                    body: ''
                },
                name: 'myColor',
                labels: [],
                title: 'myColor',
                type: 'var',
                preview: '<div class="cssColorPreview" style="background-color: #223344">' +
                    '<span class="cssColorName">#223344</span></div>',
                dataTypes: ['color']
            });
        });

        it('Should parse a @selector tag', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test selector\n' +
                ' *\n' +
                ' * @selector\n' +
                ' */\n' +
                '.testSelector {\n}'
            );

            var block = res.listing[0].groups[1].items[0];
            expect(block).to.eql({
                source: {
                    code: '.testSelector {\n}',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/selectors/testSelector',
                description: {
                    full: '<p>Test selector</p>',
                    summary: '<p>Test selector</p>',
                    body: ''
                },
                name: '.testSelector',
                labels: [],
                title: '.testSelector',
                type: 'selector'
            });
        });

        it('Should parse a @selector tag, name used', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test selector\n' +
                ' *\n' +
                ' * @selector mySelector\n' +
                ' */\n' +
                '.testSelector {\n}'
            );

            var block = res.listing[0].groups[1].items[0];
            expect(block).to.eql({
                source: {
                    code: '.testSelector {\n}',
                    type: 'less',
                },
                codeStart: 6,
                line: 1,
                link: 'testless/selectors/mySelector',
                description: {
                    full: '<p>Test selector</p>',
                    summary: '<p>Test selector</p>',
                    body: ''
                },
                name: 'mySelector',
                labels: [],
                title: 'mySelector',
                type: 'selector'
            });
        });

        it('Should parse a @selector tag with an example', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test selector\n' +
                ' *\n' +
                ' * @selector mySelector\n' +
                ' * @example\n' +
                ' * <div class="testSelector">\n' +
                ' * \n' +
                ' * </div>\n' +
                ' */\n' +
                '.testSelector {\n}'
            );

            var block = res.listing[0].groups[1].items[0];
            expect(block).to.eql({
                source: {
                    code: '.testSelector {\n}',
                    type: 'less',
                },
                codeStart: 10,
                line: 1,
                link: 'testless/selectors/mySelector',
                description: {
                    full: '<p>Test selector</p>',
                    summary: '<p>Test selector</p>',
                    body: ''
                },
                name: 'mySelector',
                labels: [],
                title: 'mySelector',
                type: 'selector',
                examples: [{
                    code: '&lt;div class=&quot;testSelector&quot;&gt;\n\n&lt;/div&gt;',
                    type: 'less'
                }]
            });
        });

        it('Should parse a @selector tag with a htmlexample', function() {
            var res = doxydoc.parseString('raw', 'test.less',
                '/**\n' +
                ' * Test selector\n' +
                ' *\n' +
                ' * @selector mySelector\n' +
                ' * @example {html}\n' +
                ' * <div class="testSelector">\n' +
                ' * \n' +
                ' * </div>\n' +
                ' */\n' +
                '.testSelector {\n}'
            );

            var block = res.listing[0].groups[1].items[0];
            expect(block).to.eql({
                source: {
                    code: '.testSelector {\n}',
                    type: 'less',
                },
                codeStart: 10,
                line: 1,
                link: 'testless/selectors/mySelector',
                description: {
                    full: '<p>Test selector</p>',
                    summary: '<p>Test selector</p>',
                    body: ''
                },
                name: 'mySelector',
                labels: [],
                title: 'mySelector',
                type: 'selector',
                examples: [{
                    code: '&lt;div class=&quot;testSelector&quot;&gt;\n\n&lt;/div&gt;',
                    type: 'html'
                }]
            });
        });
    });
});