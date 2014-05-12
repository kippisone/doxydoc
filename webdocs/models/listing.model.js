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

		self.prepare = function(data) {
			console.log('Prepare modules',data);
			var modules = {
				modules: []
			};

			data.forEach(function(module) {
				if (module.data.tags && module.data.tags.module) {
					module.module = module.data.tags.module;
				}
				else {
					module.module = path.basename(module.file, path.extname(module.file));
				}

				modules.modules.push(module);
			});

			return modules;
		};
	});
	
	listingModel.init();

	return listingModel;

}();