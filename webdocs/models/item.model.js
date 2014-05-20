module.exports = function() {
	'use strict';

	var XQCore = require('xqcore');

	/**
	 * Item model
	 *
	 * model: {
	 *   "name": "XQCore.Socket",
	 *   "submodules": {},
	 *   "classes": {},
	 *   "fors": {},
	 *   "namespaces": {},
	 *   "tag": "module",
	 *   "file": "src/socket/xqcore-socket.js",
	 *   "line": 3,
	 *   "description": "XQCore.Socket module",
	 *   "requires": [
	 *     "XQCore.Logger",
	 *     "sockJS-client"
	 *   ],
	 *   "link": "XQCoreSocket"
	 * }
	 * @param  {[type]} self [description]
	 * @return {[type]}      [description]
	 */		
	var itemModel = new XQCore.Model('item', function(self) {

	});
	
	itemModel.init();

	return itemModel;
}();