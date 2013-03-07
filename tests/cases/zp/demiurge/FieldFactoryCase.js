var path = require('../../../bootstrap').projectPath,
	jsein = require('jsein'),
	flame = require('flame'),
	FieldFactory = require(path + '/zp/demiurge/FieldFactory');

exports.testMake = function(test) {
	var defRepo = new jsein.JsonRepo();
	defRepo.loadFile(path + '/resources/data/ground');
	defRepo.loadFile(path + '/resources/data/obstacles');
	defRepo.loadFile(path + '/resources/data/flyers/zeps');
	defRepo.loadFile(path + '/resources/data/backgrounds');
	defRepo.loadFile(path + '/resources/data/effects');
	defRepo.loadFile(path + '/resources/data/stacks');
	
	var factory = new FieldFactory(defRepo),
	    field = factory.make();
	
	test.ok(field.get('J'));
	test.done();
};
