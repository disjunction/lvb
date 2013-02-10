"use strict";

// Import in the modules we're going to use
var cocos  = require('cocos2d'),
    nodes  = cocos.nodes,
    geo    = require('pointExtension'),
    ccp    = geo.ccp,
    jsein    = require('jsein'),
	Director = cocos.Director,
    Layer    = nodes.Layer,
    Point    = geo.Point;

// ZP bootstraping
  
var smog = require('smog');
smog.app.config = require('/configs/production');
smog.app.config = require('/configs/development');

var flame = require('flame'),
	Interactor = flame.viewport.Interactor;

jsein.registerCtorLocator(require('./zp/util/ctorLocator'));

var defRepo = new jsein.JsonRepo();
defRepo.loadFile('/resources/data/flyers/zeps');
defRepo.loadFile('/resources/data/puffs');
defRepo.loadFile('/resources/data/ground');
defRepo.loadFile('/resources/data/obstacles');
defRepo.loadFile('/resources/data/effects');
defRepo.loadFile('/resources/data/objects');
defRepo.loadFile('/resources/data/backgrounds');
defRepo.loadFile('/resources/data/stacks');


/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Zp () {
    Zp.superclass.constructor.call(this);
    
    var fieldFactory = new(require('./zp/demiurge/FieldFactory'))(defRepo);

	this.protagonist = flame.engine.Protagonist.make({ProtagonistClass: require('./zp/engine/Protagonist')});
    
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
    
	var zep = this.fe.spawnThing({type: 'ZepSelf', location: {x: 2, y: 2}});
    
    this.setupProtagonist(this.protagonist, zep);
    this.setupInteractor();
        
    this.scheduleUpdate();
    window.parent.zp = this;
}

// Inherit from cocos.nodes.Layer
Zp.inherit(Layer, {
	setupProtagonist: function(p, zep) {
		p.ego = p.fe.ego = zep;

		var v = p.viewport;
		
		var hudBuilder = new flame.viewport.hud.HudBuilder(v, defRepo),
			EgoHud = require('./zp/viewport/hud/EgoHud'),
			egoHud = new EgoHud({hudBuilder: hudBuilder, viewport: v, ego: zep});
		p.egoHud = egoHud;
		
		var soundRepo = new jsein.JsonRepo(require('/resources/data/sounds'));
		v.soundPlayer = flame.viewport.SoundPlayer.make({defRepo: soundRepo});
		
	    v.addLayersTo(this);
	    v.makeAnimator();
	    v.scaleCameraTo(0.5, 0.5);
	    
	    v.moveCameraTo = function(point) {
			this.scrolled.position = geo.ccp(Math.floor(-point.x*this.scale + this.size.width / 4), 0);
		};
	},
	
	setupInteractor: function() {
		var Applier = require('./zp/viewport/InteractionApplier'),
		    applier = new Applier({
		    	protagonist: this.protagonist
		    });
	    
	    var layout = {keys: {}};
	    layout.keys[Interactor.ARROW_UP] = {type: 'state', state: 'up'};
	    layout.keys[Interactor.SPACE] = [
	                                     	{type: 'event', on: 'keyDown', event: 'fireGun'},
	                                     	{type: 'event', on: 'keyUp', event: 'releaseGun'},
	                                     	{type: 'state', state: 'chargeGun'}
	                                     ];
	    layout.keys[Interactor.LMB] = {type: 'state', state: 'up'};
	    layout.keys[Interactor.KEY_S] = {type: 'event', on: 'keyUp', event: 'snow'};
	    layout.keys[Interactor.KEY_D] = {type: 'event', on: 'keyUp', event: 'crates'};
	    
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
