"use strict";

// Import in the modules we're going to use
var cocos  = require('cocos2d'),
    nodes  = cocos.nodes,
    geo    = require('pointExtension'),
    ccp    = geo.ccp,
    jsein  = require('jsein'),
	Director = cocos.Director,
    Layer    = nodes.Layer,
    Point    = geo.Point;

// ZP bootstraping
  
var smog = require('smog');
smog.app.config = require('/configs/development');

var flame = require('flame'),
	Flyer = require('./zp/entity/Flyer');

var defRepo = new jsein.JsonRepo();
defRepo.loadFile('/resources/data/zeps');
defRepo.loadFile('/resources/data/ground');
defRepo.loadFile('/resources/data/obstacles');

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Zp () {
    Zp.superclass.constructor.call(this);
    
    var fieldFactory = new(require('./zp/demiurge/FieldFactory'))(defRepo);

	this.protagonist = flame.engine.Protagonist.make();
    
	var feOpts = {
			'field': fieldFactory.make(),
			'protagonist': this.protagonist,
			'worldOpts': {gravity: ccp(0, -10)},
			'BodyBuilderClass': require('./zp/engine/ThingBodyBuilder'),
			'NodeBuilderClass': require('./zp/engine/ThingNodeBuilder'),
			'FieldEngineClass': require('./zp/engine/FieldEngine'),
			'defRepo': defRepo
		};
    this.fe = flame.engine.FieldEngine.make(feOpts);
    
    this.protagonist.viewport.addLayersTo(this);
    this.protagonist.viewport.moveCameraTo = function(point) {
		this.scrolled.position = geo.ccp(-point.x + this.size.width / 4, 0);
	};
    
    var zep = new Flyer();
    zep.location = ccp(0, 7);
    zep.type = 'ZepSelf';
    
    this.fe.ego = this.protagonist.ego = zep;
    
    this.fe.addFlyer(zep);
    this.fe.get(zep.bodyId).SetLinearVelocity(ccp(10,0));
    
    this.scheduleUpdate();
}

// Inherit from cocos.nodes.Layer
Zp.inherit(Layer, {
	update: function(dt) {
		this.fe.step();
		this.protagonist.syncCamera();
	}
});

// Export the class so it can be accessed from outside this file
this.Zp = Zp;
