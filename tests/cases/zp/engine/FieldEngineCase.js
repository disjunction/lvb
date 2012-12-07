var path = require('../../../bootstrap').projectPath,
	smog = require('smog'),
	flame = require('flame'),
	FieldEngine = require(path + '/zp/engine/FieldEngine');

exports.testConstruction = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		fe = flame.engine.FieldEngine.make({
			'protagonist': protagonist,
		});
	
	test.done();
};
