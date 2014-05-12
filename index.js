'use strict';

var ExpressServer = require('express-server');

var expressServer = new ExpressServer({
	name: 'DoxIt Server',
	baseDir: __dirname,
	port: 3015,
	logLevel: 'sys'
});

var app;

expressServer.start(function() {
	app = expressServer.app;
});

process.on('SIGINT', function() {
	expressServer.stop();
	process.exit();
});