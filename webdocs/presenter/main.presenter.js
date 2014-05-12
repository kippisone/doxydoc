module.exports = function() {
	'use strict';

	var XQCore = require('xqcore'),
		listingModel = require('../models/listing.model');

	XQCore.debug = true;
	var presenter = new XQCore.Presenter('main', function(self) {
		var mainView = self.initView('main', 'body');

		self.couple({
			view: mainView,
			model: listingModel
		});
	});

	return presenter;
}();