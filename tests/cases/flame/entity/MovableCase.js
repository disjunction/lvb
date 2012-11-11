var path = require('../../../bootstrap').projectPath,
	geo = require('pointExtension'),
	flame = require('flame');


exports.testBasic = function(test) {
	var m = new flame.entity.Movable;
	
	m.size = new geo.sizeMake(2, 5);
	test.equal(10, m.getSquare());
	
	test.done();
};
