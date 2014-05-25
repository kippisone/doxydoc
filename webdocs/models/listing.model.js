module.exports = function() {
	'use strict';

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
					m.key = m.name.replace(/[^a-zA-Z0-9_-]/g, '');
					modules.push(m);
				}
			}

			var listing = {
				data: data,
				modules: modules
			};

			return listing;
		};

		self.getModule = function(moduleName) {
			var modules = this.get('data.modules'),
				curModule = null;

			for (var m in modules) {
				if (modules.hasOwnProperty(m)) {
					var item = modules[m];
					if (item.key === moduleName) {
						console.log(item);
						curModule = item;
					}
				}
			}

			//Add classes
			var classes = [];
			var allClasses = this.get('data.classes');
			var allClasseItems = this.get('data.classitems');
			var itemFilter= function(curItem) {
				return (curItem.class === el);
			};
			
			for (var el in curModule.classes) {
				if (curModule.classes.hasOwnProperty(el)) {
					var curClass = allClasses[el];
					curClass.items = [];

					//Get class items
					curClass.items = allClasseItems.filter(itemFilter);

					classes.push(curClass);
				}
			}

			curModule.classes = classes;

			return curModule;
		};
	});
	
	listingModel.init();

	return listingModel;

}();