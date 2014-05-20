module.exports = function() {
	'use strict';

	var path = require('path');

	var XQCore = require('xqcore');

	var listingModel = new XQCore.Model('listing', function(self) {
		
		/**
		 * Fetch data from server
		 *
		 * @method fetch
		 * @public
		 */
		self.fetch = function() {
			self.sendGET('/data', function(err, data) {
				if (err) {
					console.error(err);
					return;
				}

				var models = self.prepare(data);
				self.set(models);
			});
		};

		/**
		 * Prepare data
		 * 
		 * @param  {Object} data Raw data
		 * @return {Object}      Returns an array of the listing data
		 */
		self.prepare = function(data) {
			console.log('Prepare modules', data);

			var modules = [];

			for (var module in data.modules) {
				if (data.modules.hasOwnProperty(module)) {
					var m = data.modules[module];
					m.link = m.name.replace(/[^a-zA-Z0-9_-]/g, '');
					modules.push(m);
				}
			}

			var listing = {
				data: data,
				modules: modules
			};

			return listing;
		};

		self.getModule = function(data) {
			console.log('Get module', data.module);
			var module = this.search('modules', {
				link: data.module
			});

			console.log('... matched:', module);

			//Add classes
			var classes = [];
			for (var el in module.classes) {
				if (module.classes.hasOwnProperty(el)) {
					var allClasses = this.get('data.classes');
					classes.push(allClasses[el]);
				}
			}

			module.classes = classes;

			return module;
		};
	});
	
	listingModel.init();

	return listingModel;

}();