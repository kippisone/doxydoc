module.exports = function(app, callback) {
	'use strict';
	
	app.addRoute('get', '/data', 'Get latest modules', function(req, res) {
		res.sendfile('docs/latest/data.json');
	});

	callback();
};