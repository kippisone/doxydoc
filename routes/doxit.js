module.exports = function(app, callback) {
	'use strict';
	
	app.addRoute('get', '/data', 'Get latest modules', function(req, res) {
		res.sendfile('docs/doxit-latest.json');
	});

	callback();
};