"use strict";

// Import in the modules we're going to use
var cocos  = require('cocos2d'),
    nodes  = cocos.nodes,
    Layer    = nodes.Layer,
    geo    = require('pointExtension'),
    ccp    = geo.ccp,
    jsein    = require('jsein');

// ZP bootstrapping
var smog = require('smog'),
	flame = require('flame'),
	webpage = new flame.viewport.Webpage();

smog.app.mergeConfig(require('/configs/development'));

// extend config depending on host
if (webpage.host == 'zp.pluseq.com') {
	smog.app.mergeConfig(require('/configs/production'));
}

jsein.registerCtorLocator(require('/zp/util/ctorLocator'));

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Zp () {
    Zp.superclass.constructor.call(this);
    
    var defRepo = new jsein.JsonRepo();
    defRepo.loadFile('/resources/data/flyers/zeps');
    defRepo.loadFile('/resources/data/guys');
    defRepo.loadFile('/resources/data/puffs');
    defRepo.loadFile('/resources/data/ground');
    defRepo.loadFile('/resources/data/obstacles');
    defRepo.loadFile('/resources/data/effects');
    defRepo.loadFile('/resources/data/objects');
    defRepo.loadFile('/resources/data/backgrounds');
    defRepo.loadFile('/resources/data/stacks');
    
    var className;
    switch (webpage.params.level) {
	    case 'tutorial': className = 'TutorialFactory';break;
	    case 'medium': className = 'MediumFactory';break;
	    default: className = 'EasyFactory';
    }
    var fieldFactory = new(require('./zp/demiurge/' + className))(defRepo);
    
	var feOpts = {
		field: fieldFactory.make(),
		worldOpts: {gravity: ccp(0, -10)},
		BodyBuilderClass: require('/zp/engine/ThingBodyBuilder'),
		NodeBuilderClass: require('/zp/engine/ThingNodeBuilder'),
		FieldEngineClass: require('/zp/engine/FieldEngine'),
		defRepo: defRepo
	};
    this.fe = flame.engine.FieldEngine.make(feOpts);
    
    var pOpts = {
		ProtagonistClass: require('/zp/engine/Protagonist'),
		fieldEngine: this.fe,
		layer: this,
		webpage: webpage
	};
    this.protagonist = flame.engine.Protagonist.make(pOpts);
    
    this.scheduleUpdate();
    window.parent.zp = this;
}

// Inherit from cocos.nodes.Layer
Zp.inherit(Layer, {	
	update: function(dt) {
		this.fe.step();
		this.protagonist.syncCamera();
	},
	
	// callback for "back to main menu"
	home: function() {
		webpage.window.location = smog.app.config.extras.baseUrl;
	}
});

// Export the class so it can be accessed from outside this file
this.Zp = Zp;
