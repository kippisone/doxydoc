module.exports = function() {
	'use strict';

	var XQCore = require('xqcore'),
		listingModel = require('../models/listing.model'),
		itemModel = require('../models/item.model');

	XQCore.debug = true;
	
	var presenter = new XQCore.Presenter('main', function(self) {
		listingModel.fetch();
		var mainView = self.initView('main', 'body');
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

		self.route('index', function() {
			indexView.render();
		});

		self.route('module/:module', function(data) {
			var mod = listingModel.getModule(data.module);
			itemModel.set(mod);
		});
	});

	return presenter;
}();