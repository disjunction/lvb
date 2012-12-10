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
	Flyer = require('./zp/entity/Flyer'),
	Interactor = flame.viewport.Interactor;

var defRepo = new jsein.JsonRepo();
defRepo.loadFile('/resources/data/zeps');
defRepo.loadFile('/resources/data/ground');
defRepo.loadFile('/resources/data/obstacles');
defRepo.loadFile('/resources/data/effects');
defRepo.loadFile('/resources/data/backgrounds');

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
    this.protagonist.viewport.makeAnimator();
    this.protagonist.viewport.scaleCameraTo(0.5, 5);
    
    this.protagonist.viewport.moveCameraTo = function(point) {
		this.scrolled.position = geo.ccp(Math.floor(-point.x*this.scale + this.size.width / 4), 0);
	};
    
    var zep = new Flyer('ZepSelf');
    zep.location = ccp(2, 2);
    
    this.fe.ego = this.protagonist.ego = zep;
    this.fe.addFlyer(zep);
    
    this.initInteractor();
        
    this.scheduleUpdate();
}

// Inherit from cocos.nodes.Layer
Zp.inherit(Layer, {
	initInteractor: function() {
		var Applier = require('./zp/viewport/InteractionApplier'),
		    applier = new Applier({
		    	protagonist: this.protagonist
		    });
	    
	    var layout = {keys: {}};
	    layout.keys[Interactor.ARROW_UP] = {type: 'state', state: 'up'};
	    layout.keys[Interactor.LMB] = {type: 'state', state: 'up'};
	    layout.keys[Interactor.KEY_S] = {type: 'event', on: 'keyUp', event: 'snow'};
	    
	    this.interactor = new Interactor({
	    	layer: this,
	    	applier: applier,
	    	layout: layout
	    });
	    this.interactor.afterInteract();
	},
	update: function(dt) {
		this.fe.step();
		this.protagonist.syncCamera();
	}
});

// Export the class so it can be accessed from outside this file
this.Zp = Zp;
