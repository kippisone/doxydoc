'use strict';

var fl = require ('node-fl');

var Page = require ('../modules/page');
var inspect = require('inspect.js');
var sinon = require('sinon');
inspect.useSinon(sinon);

describe.only('Page', function() {
    describe('Class', function() {
        it('Should be a Page class', function() {
            inspect(Page).isClass();
        });
    });

    describe('render', function() {
        it('Should render a page', function() {
            var page = new Page();
            page.setTemplate('page.fire');

            var renderFTLStub = sinon.stub(page, 'parseFireTPL');
            var readStub = sinon.stub(fl, 'read');
            readStub.returns('TMPL');

            page.render();

            inspect(readStub).wasCalledOnce();
            inspect(readStub).wasCalledWith('page.fire');
            inspect(renderFTLStub).wasCalledOnce();
            inspect(renderFTLStub).wasCalledWith('TMPL');
            
            renderFTLStub.restore();
            readStub.restore();
        });

        it('Should render a markdown page', function() {
            var page = new Page();
            page.setTemplate('page.md');

            var renderFTLStub = sinon.stub(page, 'parseMarkdown');
            var readStub = sinon.stub(fl, 'read');
            readStub.returns('TMPL');

            page.render();

            inspect(readStub).wasCalledOnce();
            inspect(readStub).wasCalledWith('page.md');
            inspect(renderFTLStub).wasCalledOnce();
            inspect(renderFTLStub).wasCalledWith('TMPL');
            
            renderFTLStub.restore();
            readStub.restore();
        });

        it('Should render a html page', function() {
            var page = new Page();
            page.setTemplate('page.html');

            var parseHTMLStub = sinon.stub(page, 'parseHTML');
            var readStub = sinon.stub(fl, 'read');
            readStub.returns('TMPL');

            page.render();

            inspect(readStub).wasCalledOnce();
            inspect(readStub).wasCalledWith('page.html');
            inspect(parseHTMLStub).wasCalledOnce();
            inspect(parseHTMLStub).wasCalledWith('TMPL');
            
            parseHTMLStub.restore();
            readStub.restore();
        });
    });
});

describe.skip('PageCreator', function() {
    describe('scanHeadLines', function() {
        var pageCreator;
        
        beforeEach(function() {
            pageCreator = new PageCreator();
        });

        it('Should get a nested array of all head lines', function() {
            var html = '<div><h1>Nothing</h1><br><h3 id="tag1">Tag 1</h3></div>' +
                '<h3 id="tag2">Tag 2</h3><h4 id="tag2-1">Tag 2.1</h4><br><h4 id="tag2-2">Tag 2.2</h4>' +
                '<h3 id="tag3">Tag 3</h3><h4 id="tag3-1">Tag 3.1</h4><br><h4 id="tag3-2">Tag 3.2</h4>' +
                '<h6 id="tag4">Tag 4</h6>';

            var htags = pageCreator.scanHeadlines(html);
            expect(htags).to.eql([
                {
                    link: 'tag1',
                    text: 'Tag 1'
                }, {
                    link: 'tag2',
                    text: 'Tag 2',
                    items: [
                        {
                            link: 'tag2-1',
                            text: 'Tag 2.1'
                        }, {
                            link: 'tag2-2',
                            text: 'Tag 2.2'
                        }
                    ]
                }, {
                    link: 'tag3',
                    text: 'Tag 3',
                    items: [
                        {
                            link: 'tag3-1',
                            text: 'Tag 3.1'
                        }, {
                            link: 'tag3-2',
                            text: 'Tag 3.2',
                            items: [
                                {
                                    link: 'tag4',
                                    text: 'Tag 4'
                                }
                            ]
                        }
                    ]
                }
            ]);
        });

        it('Should get a nested array of all head lines (more test items)', function() {
            var html = '<div><h1>Nothing</h1><br><h3 id="tag1">Tag 1</h3></div>' +
                '<h3 id="tag2">Tag 2</h3><h4 id="tag2-1">Tag 2.1</h4><br><h4 id="tag2-2">Tag 2.2</h4>' +
                '<h3 id="tag3">Tag 3</h3><h4 id="tag3-1">Tag 3.1</h4><br><h4 id="tag3-2">Tag 3.2</h4>' +
                '<h6 id="tag4">Tag 4</h6><h1 id="tag5">Tag 5</h1><h3 id="tag5-1">Tag 5.1</h3><h4 id="tag5-1-1">Tag 5.1.1</h4>';

            var htags = pageCreator.scanHeadlines(html);
            expect(htags).to.eql([
                {
                    link: 'tag1',
                    text: 'Tag 1'
                }, {
                    link: 'tag2',
                    text: 'Tag 2',
                    items: [
                        {
                            link: 'tag2-1',
                            text: 'Tag 2.1'
                        }, {
                            link: 'tag2-2',
                            text: 'Tag 2.2'
                        }
                    ]
                }, {
                    link: 'tag3',
                    text: 'Tag 3',
                    items: [
                        {
                            link: 'tag3-1',
                            text: 'Tag 3.1'
                        }, {
                            link: 'tag3-2',
                            text: 'Tag 3.2',
                            items: [
                                {
                                    link: 'tag4',
                                    text: 'Tag 4'
                                }
                            ]
                        }
                    ]
                }, {
                    link: 'tag5',
                    text: 'Tag 5',
                    items: [
                        {
                            link: 'tag5-1',
                            text: 'Tag 5.1',
                            items: [
                                {
                                    link: 'tag5-1-1',
                                    text: 'Tag 5.1.1'
                                }
                            ]
                        }
                    ]
                }
            ]);
        });
    });
});