module.exports = function() {
	'use strict';

	var XQCore = require('xqcore');

	var itemModel = new XQCore.Model('item', function(self) {

	});
	
	itemModel.init();

	return itemModel;
}();