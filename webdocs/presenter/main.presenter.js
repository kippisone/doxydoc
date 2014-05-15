module.exports = function() {
	'use strict';

	var XQCore = require('xqcore'),
		listingModel = require('../models/listing.model'),
		itemModel = require('../models/item.model');

	XQCore.debug = true;
	var presenter = new XQCore.Presenter('main', function(self) {
		var mainView = self.initView('main', 'body');
		var itemView = self.initView('item', '.content', {

		});

		self.couple({
			view: mainView,
			model: listingModel
		});

		self.couple({
			view: itemView,
			model: itemModel
		});

		self.route('module/:module', function(moduleName) {
			console.log('Load module', moduleName);
			var mod = listingModel.getModule(moduleName);
			itemModel.set(mod);
		});
	});

	return presenter;
}();