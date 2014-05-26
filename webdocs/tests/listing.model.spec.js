describe.only('Listing Model', function() {
	'use strict';

	var listingModel = require('doxit/models/listing.model.js'),
		XQCore = require('nonamemedia~xqcore@0.8.0'),
		XQCore2 = require('nonamemedia~xqcore@0.8.0');


	var testData = {
		'modules': {
			'XQCore.GetSet': {
				'name': 'XQCore.GetSet',
				'submodules': {},
				'classes': {
					'EventEmitter Manages event registering and emitting.': 1
				},
				'fors': {},
				'namespaces': {},
				'tag': 'module',
				'file': 'src/event/xqcore-event.js',
				'line': 21,
				'description': 'XQCore.GetSet',
				'requires': [
					'XQCore.Logger',
					'XQCore.Event'
				],
				'key': 'XQCoreGetSet'
			},
			'XQCore.Logger': {
				'name': 'XQCore.Logger',
				'submodules': {},
				'classes': {
					'XQCore.Logger': 1
				},
				'fors': {},
				'namespaces': {},
				'tag': 'module',
				'file': 'src/logger/xqcore-logger.js',
				'line': 25,
				'description': 'XQCore Logger is a logging tool to log messages, warnings, errors to the ' + 
					'browser or onscreen console',
				'key': 'XQCoreLogger'
			}
		},
		"classes": {
			"XQCore.Logger": {
				"name": "XQCore.Logger",
				"shortname": "XQCore.Logger",
				"classitems": [],
				"plugins": [],
				"extensions": [],
				"plugin_for": [],
				"extension_for": [
					"XQCore.Presenter",
					"XQCore.View"
				],
				"module": "XQCore.Logger",
				"namespace": "",
				"file": "src/logger/xqcore-logger.js",
				"line": 25,
				"description": 'XQCore Logger is a logging tool to log messages, warnings, errors to the ' +
					'browser or onscreen console'
			},
			"XQCore.Presenter": {
				"name": "XQCore.Presenter",
				"shortname": "XQCore.Presenter",
				"classitems": [],
				"plugins": [],
				"extensions": [],
				"plugin_for": [],
				"extension_for": [],
				"module": "XQCore Presenter",
				"namespace": "",
				"file": "src/presenter/xqcore-presenter.js",
				"line": 11,
				"description": "XQCore.Presenter base class",
				"is_constructor": 1,
				"uses": [
					"XQCore.Logger",
					"XQCore.Event"
				],
				"params": [
					{
						"name": "conf",
						"description": "Presenter extend object",
						"type": "Object"
					}
				]
			}
		},
		"classitems": [
			{
				"file": "src/logger/xqcore-logger.js",
				"line": 1,
				"description": "XQCore Logger\n\nBased on EventEmitter.js",
				"class": "XQCore.Logger",
				"module": "XQCore.GetSet"
			},
			{
				"file": "src/logger/xqcore-logger.js",
				"line": 36,
				"description": "Loggs a message to the console",
				"itemtype": "method",
				"name": "log",
				"params": [
					{
						"name": "msg",
						"description": "logs all arguments to the console",
						"type": "Any"
					}
				],
				"class": "XQCore.Logger",
				"module": "XQCore.Logger"
			},
			{
				"file": "src/logger/xqcore-logger.js",
				"line": 53,
				"description": "Loggs a warning to the console",
				"itemtype": "method",
				"name": "warn",
				"params": [
					{
						"name": "msg",
						"description": "logs all arguments to the console",
						"type": "Any"
					}
				],
				"class": "XQCore.Logger",
				"module": "XQCore.Logger"
			},
			{
				"file": "src/logger/xqcore-logger.js",
				"line": 69,
				"description": "Loggs a error message to the console",
				"itemtype": "method",
				"name": "error",
				"params": [
					{
						"name": "msg",
						"description": "logs all arguments to the console",
						"type": "Any"
					}
				],
				"class": "XQCore.Logger",
				"module": "XQCore.Logger"
			},
			{
				"file": "src/logger/xqcore-logger.js",
				"line": 85,
				"description": "Start a timeTracer",
				"itemtype": "method",
				"name": "timer",
				"params": [
					{
						"name": "timerName",
						"description": "Set the name for your (Optional)",
						"type": "String"
					}
				],
				"return": {
					"description": "Returns a TimerObject",
					"type": "Object"
				},
				"class": "XQCore.Logger",
				"module": "XQCore.Logger"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 29,
				"description": "Stores registered views",
				"access": "private",
				"tagname": "",
				"type": "{Array}",
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 36,
				"description": "Enable debug mode",
				"access": "public",
				"tagname": "",
				"type": "{Boolean}",
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 43,
				"description": "Set presenter name",
				"access": "public",
				"tagname": "",
				"type": "{String}",
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 60,
				"description": "Points to the last shown view",
				"itemtype": "property",
				"name": "lastShownView Points to the last shown view",
				"type": "Object",
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 88,
				"deprecated": true,
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 111,
				"deprecated": true,
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 141,
				"description": "Listen View events",
				"itemtype": "property",
				"name": "events Observed view events",
				"type": "Array",
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 224,
				"description": "Calling on view init",
				"params": [
					{
						"name": "view",
						"description": "The initializing view",
						"type": "Object"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 233,
				"description": "Add a history item to the browser history",
				"params": [
					{
						"name": "data",
						"description": "Data object",
						"type": "Object"
					},
					{
						"name": "url",
						"description": "Page URL (Optional) defaults to the curent URL",
						"type": "String"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 250,
				"description": "Add a history item to the browser history",
				"params": [
					{
						"name": "data",
						"description": "Data object",
						"type": "Object"
					},
					{
						"name": "url",
						"description": "Page URL (Optional) defaults to the current URL",
						"type": "String"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 266,
				"description": "Navigates to a given route",
				"params": [
					{
						"name": "route",
						"description": "Route url",
						"type": "String"
					},
					{
						"name": "data",
						"description": "Data object",
						"type": "Object"
					},
					{
						"name": "replace",
						"description": "Replace current history entry with route",
						"type": "Boolean"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 291,
				"description": "Gets a view by it's name",
				"itemtype": "method",
				"name": "getView",
				"params": [
					{
						"name": "viewName",
						"description": "Required view name",
						"type": "String"
					}
				],
				"return": {
					"description": "Returns view object or null if no view was found",
					"type": "Object"
				},
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 312,
				"description": "Show a view if it's not visible and update the history state",
				"itemtype": "method",
				"name": "showView",
				"params": [
					{
						"name": "viewName",
						"description": "The name of the view",
						"type": "String"
					},
					{
						"name": "data",
						"description": "Data it's neede to showing the view",
						"type": "Object"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 342,
				"description": "Returns the current hash",
				"itemtype": "method",
				"name": "getHash",
				"return": {
					"description": "Returns the current value from location.hash",
					"type": "String"
				},
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 352,
				"description": "Returns the current pathname",
				"itemtype": "method",
				"name": "getPathname",
				"return": {
					"description": "Returns the current value from location.pathname",
					"type": "String"
				},
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 362,
				"description": "Couple a model with a view",
				"itemtype": "method",
				"name": "couple",
				"chainable": 1,
				"params": [
					{
						"name": "conf",
						"description": "Configuration object\n\nconf: {\n  model: String modelname\n  view: " +
							"String viewname\n  route String routename\n}",
						"type": "Object"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 455,
				"description": "Triggers a view event to the presenter",
				"itemtype": "method",
				"name": "triggerEvent",
				"params": [
					{
						"name": "eventName",
						"description": "Event of the triggered event",
						"type": "String"
					},
					{
						"name": "e",
						"description": "EventObject",
						"type": "Object"
					},
					{
						"name": "tag",
						"description": "Tag data",
						"type": "Object"
					},
					{
						"name": "data",
						"description": "Event data",
						"type": "Object"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 485,
				"description": "PopstateEvent",
				"itemtype": "method",
				"name": "__onPopstate",
				"params": [
					{
						"name": "data",
						"description": "Event data",
						"type": "Object"
					}
				],
				"access": "private",
				"tagname": "",
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 525,
				"description": "Initialize a new view into the presenter scope\n\noptions: {\n  " +
					"mode: String       Insert mode, (append, prepend or replace) replace is default\n  " +
					"inject: Boolean    Set to false to disable injecting view into the DOM\n}",
				"itemtype": "method",
				"name": "initView",
				"access": "public",
				"tagname": "",
				"params": [
					{
						"name": "viewName",
						"description": "Name of the view",
						"type": "String"
					},
					{
						"name": "container",
						"description": "Container selector, default is 'body'",
						"type": "String"
					},
					{
						"name": "options",
						"description": "View options",
						"type": "Object"
					}
				],
				"return": {
					"description": "Returns a view object",
					"type": "Object"
				},
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			},
			{
				"file": "src/presenter/xqcore-presenter.js",
				"line": 565,
				"description": "Register a route listen",
				"access": "public",
				"tagname": "",
				"itemtype": "method",
				"name": "route",
				"params": [
					{
						"name": "route",
						"description": "Route string",
						"type": "String | Array"
					},
					{
						"name": "callback",
						"description": "Callback function",
						"type": "Function"
					}
				],
				"class": "XQCore.Presenter",
				"module": "XQCore Presenter"
			}
		]
	};

	describe('Instance', function() {
		it('Should be an instance of XQCore.Model', function() {
			expect(XQCore).to.be.eql(XQCore2);
			expect(listingModel).to.be.an('object');
			expect(listingModel).to.be.a(XQCore.Model);
		});
	});

	describe('getModule', function() {
		beforeEach(function() {
			listingModel.set('data', testData);
		});

		afterEach(function() {

		});

		it('Should get a module', function() {
			var module = listingModel.getModule('XQCoreLogger');
			expect(module).to.be.an('object');
			expect(module.name).to.eql('XQCore.Logger');
			expect(module).to.eql({
				'name': 'XQCore.Logger',
				'submodules': {},
				'fors': {},
				'namespaces': {},
				'tag': 'module',
				'file': 'src/logger/xqcore-logger.js',
				'line': 25,
				'description': 'XQCore Logger is a logging tool to log messages, warnings, errors to the ' +
					'browser or onscreen console',
				'key': 'XQCoreLogger',
				'classes': [{
					"name": "XQCore.Logger",
					"shortname": "XQCore.Logger",
					"classitems": [],
					"plugins": [],
					"extensions": [],
					"plugin_for": [],
					"extension_for": [
						"XQCore.Presenter",
						"XQCore.View"
					],
					"module": "XQCore.Logger",
					"namespace": "",
					"file": "src/logger/xqcore-logger.js",
					"line": 25,
					"description": "XQCore Logger is a logging tool to log messages, warnings, errors to the " +
						"browser or onscreen console",
					"items": [
						{
							"file": "src/logger/xqcore-logger.js",
							"line": 1,
							"description": "XQCore Logger\n\nBased on EventEmitter.js",
							"class": "XQCore.Logger",
							"module": "XQCore.GetSet"
						},
						{
							"file": "src/logger/xqcore-logger.js",
							"line": 36,
							"description": "Loggs a message to the console",
							"itemtype": "method",
							"name": "log",
							"params": [
								{
									"name": "msg",
									"description": "logs all arguments to the console",
									"type": "Any"
								}
							],
							"class": "XQCore.Logger",
							"module": "XQCore.Logger"
						},
						{
							"file": "src/logger/xqcore-logger.js",
							"line": 53,
							"description": "Loggs a warning to the console",
							"itemtype": "method",
							"name": "warn",
							"params": [
								{
									"name": "msg",
									"description": "logs all arguments to the console",
									"type": "Any"
								}
							],
							"class": "XQCore.Logger",
							"module": "XQCore.Logger"
						},
						{
							"file": "src/logger/xqcore-logger.js",
							"line": 69,
							"description": "Loggs a error message to the console",
							"itemtype": "method",
							"name": "error",
							"params": [
								{
									"name": "msg",
									"description": "logs all arguments to the console",
									"type": "Any"
								}
							],
							"class": "XQCore.Logger",
							"module": "XQCore.Logger"
						},
						{
							"file": "src/logger/xqcore-logger.js",
							"line": 85,
							"description": "Start a timeTracer",
							"itemtype": "method",
							"name": "timer",
							"params": [
								{
									"name": "timerName",
									"description": "Set the name for your (Optional)",
									"type": "String"
								}
							],
							"return": {
								"description": "Returns a TimerObject",
								"type": "Object"
							},
							"class": "XQCore.Logger",
							"module": "XQCore.Logger"
						}
					]
				}]
			});
		});

		it('Should get module multiple times', function() {
			var module1 = listingModel.getModule('XQCoreLogger');
			var module2 = listingModel.getModule('XQCoreLogger');

			expect(module1).not.to.equal(module2);
			expect(module1).to.eql(module2);
		});
	});
});	