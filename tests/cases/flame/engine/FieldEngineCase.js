var tests = require('../../../bootstrap'),
	path = tests.projectPath,
	smog = require('smog'),
	flame = require('flame'),
	geo = require('pointExtension'),
	jsein = require('jsein');

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

exports.testRayShot = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		defs = new jsein.JsonRepo(require(tests.testsPath + '/data/test_defs')),
		opts = {
			protagonist: protagonist,
			defRepo: defs
		},
	    fe = new flame.engine.FieldEngine.make(opts),
	    t0 = new flame.entity.Thing('ZepSelf'),
	    t1 = new flame.entity.Thing('ZepSelf'),
		t2 = new flame.entity.Thing('ZepSelf');
		
	// this one is shooting
	t0.location = geo.ccp(0,6.5);
	fe.addThing(t0);
	
	// this will get shot
	t1.location = geo.ccp(5,7);
	fe.addThing(t1);
	
	// this is protected by t1
	t2.location = geo.ccp(10,7);
	fe.addThing(t2);
	
	// before the shot the bodies have no forces applied
	test.ok(fe.get(t1.bodyId).m_torque == 0);
	test.ok(fe.get(t1.bodyId).m_force.x == 0);
	
	var shotOpts = {
			subject: t0,
			// shoot from back of the subject - shot should get through
			fromPoint: geo.ccp(-4, 7),
			distance: 10,
			angle: 0.01,
			impact: 200,
			recoil: 10
		},
		impact = fe.rayShot(shotOpts);
	
	test.equal(t1, impact.body.thing);
	
	// make sure the impact was caused
	test.ok(impact.body.m_torque != 0);
	test.ok(impact.body.m_force.x != 0);
	
	test.done();
};

exports.testSpawnThing = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		defs = new jsein.JsonRepo(require(tests.testsPath + '/data/test_defs')),
		opts = {
			protagonist: protagonist,
			defRepo: defs
		},
	    fe = new flame.engine.FieldEngine.make(opts);
		thing = fe.spawnThing({type: 'ZepSelf', location: {x: 5, y: 3}});
	
	test.equal(5, thing.location.x);
	test.ok(thing.nodes.main); // envisioned
	test.ok(thing.ii.length > 0); // thing added to field
	test.ok(thing.bodyId.length > 0); // embodied
	test.done();
};