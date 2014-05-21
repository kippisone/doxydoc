Object.keys(require.modules).forEach(function(m) {
	'use strict';
	var match = m.match(/~([a-zA-Z0-9_.-]+)@/);
	if (match) {
		require.register(match[1], require.modules[m].definition);
	}
});

module.exports = function() {
	'use strict';
	
	console.log('init()');
	var mainPresenter = require('./presenter/main.presenter');
	mainPresenter.init();
};
