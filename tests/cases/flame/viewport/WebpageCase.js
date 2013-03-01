var path = require('../../../bootstrap.js').projectPath,
	flame = require('flame'),
	jsein = require(path + '/libs/jsein');

exports.testHost = function(test) {
	var window = {
			location: {
				href: 'http://some.site.com/der/path'
			}
		},
		page = new flame.viewport.Webpage({window: window});
	test.equal('some.site.com', page.host);
	test.done();
}