var path = require('../../../bootstrap').projectPath,
	jsein = require('jsein'),
	flame = require('flame'),
	FieldFactory = require(path + '/zp/demiurge/FieldFactory');

exports.testMake = function(test) {
	var defRepo = new jsein.JsonRepo();
	defRepo.loadFile(path + '/resources/data/ground');
	
	var factory = new FieldFactory(defRepo),
	    field = factory.make();
	
	test.ok(field.get('J'));
	test.done();
};
