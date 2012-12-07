var path = require('../../../bootstrap').projectPath,
	smog = require('smog'),
	flame = require('flame');

exports.testBasic = function(test) {
	var fe = new flame.engine.FieldEngine();
		
	fe.makeWorld();
	fe.step();
	
	test.done();
};

exports.testMakeDefaults = function(test) {
	var fe = new flame.engine.FieldEngine.make();
	fe.step();	
	test.done();
};

exports.testMakeWithoutProtagonist = function(test) {
	var 
		field = new flame.entity.Field,
		opts = {
			'field': field,
			'worldOptions': {
				'gravity': {x: 0, y: -10}
			}
		};
	var fe = new flame.engine.FieldEngine.make(opts);
	fe.step();	
	test.done();
};

exports.testMakeWithProtagonist = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		opts = {
			'protagonist': protagonist,
		},
	    fe = new flame.engine.FieldEngine.make(opts),
	    node = fe.nodeBuilder.viewport.nf.makeSprite({file: 'some.jpg'});
	
	fe.step();
	
	test.ok(node);
	test.done();
};