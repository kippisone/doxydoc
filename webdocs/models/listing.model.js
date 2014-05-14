module.exports = function() {
	'use strict';

	var path = require('path');

	var XQCore = require('xqcore');

	var listingModel = new XQCore.Model('listing', function(self) {
		self.sendGET('/data', function(err, data) {
			if (err) {
				console.error(err);
				return;
			}

			var models = this.prepare(data);
			this.set(models);
		}.bind(this));

		/**
		 * Parse a doxit file
		 *
		 * [{
		 *     file: FileName
		 *     module: ModuleName
		 *     package: PackageName
		 *     requires: [],
		 *     data: []
		 * }]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		self.prepare = function(data) {
			console.log('Prepare modules', data);

			var modules = [];

			for (var module in data.modules) {
				if (data.modules.hasOwnProperty(module)) {
					modules.push(data.modules[module]);
				}
			}

			var listing = {
				data: data,
				modules: modules
			};

			return listing;
		};
	});
	
	listingModel.init();

	return listingModel;

}();