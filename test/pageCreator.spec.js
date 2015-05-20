'use strict';

var PageCreator = require ('../modules/pageCreator');

describe.only('PageCreator', function() {
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
    });
});