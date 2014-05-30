/*global hljs:fals */
module.exports = function() {
    'use strict';

    var XQCore = require('xqcore'),
        listingModel = require('../models/listing.model'),
        itemModel = require('../models/item.model'),
        $ = require('jquery');

    XQCore.debug = true;
    
    var presenter = new XQCore.Presenter('main', function(self) {
        listingModel.fetch();
        var mainView = self.initView('main', '.doxit-main');
        var itemView = self.initView('item', '.page-content');
        var indexView = self.initView('index', '.page-content');

        self.couple({
            view: mainView,
            model: listingModel
        });

        self.couple({
            view: itemView,
            model: itemModel
        });

        self.couple({
            view: indexView,
            model: listingModel
        });

        self.route('index', function() {
            indexView.render();
        });

        self.route('module/:module', function(data) {
            var mod = listingModel.getModule(data.module);
            itemModel.set(mod);
        });

        itemView.on('content.change', function() {
            itemView.$el.find('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });

            itemView.$el.nanoScroller();
        });

        self.on('toggle-source', function(data, tag, e) {
            $(e.currentTarget).nextAll('.code').slideToggle();
        });
    });

    return presenter;
}();