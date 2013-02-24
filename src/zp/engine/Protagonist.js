"use strict";

var
    geo        = require('pointExtension'),
    ccp        = geo.ccp,
    flame      = require('flame'),
    Interactor = flame.viewport.Interactor,
    jsein      = require('jsein');

function Protagonist(viewport) {
	Protagonist.superclass.constructor.call(this, viewport);
}

Protagonist.inherit(flame.engine.Protagonist, {
	processObjectEventQueue: function() {
		for (var i in this.fe.objectEventQueue) {
			var item = this.fe.objectEventQueue[i];
			if (item.type == 'gather') {
				this.viewport.play('crate_pickup');
				var node = item.thing.nodes.obstacle,
					aniDef1 = {action: 'MoveBy', duration: 0.15, location: geo.ccpSub(this.ego.location, item.thing.location)},
					aniDef2 = {action: 'Remove', delay: 0.16};
				this.fe.nodeBuilder.animateNode(node, aniDef1, this.viewport.obstacle);
				this.fe.nodeBuilder.animateNode(node, aniDef2, this.viewport.obstacle);
				this.fe.removeThing(item.thing, true);
			}
		}
		this.fe.objectEventQueue = [];
	},
	
	setFieldEngine: function(fe) {
		Protagonist.superclass.setFieldEngine.call(this, fe);
		fe.preStepPlugins.push(this.processObjectEventQueue.bind(this));
		
		var zep = fe.spawnThing({type: 'ZepSelf', location: {x: 2, y: 2}});	
		this.setEgo(zep);
		fe.protagonist = this; // backlink from fe to protagonist is bad :(

		var hudBuilder = new flame.viewport.hud.HudBuilder(this.viewport, fe.defRepo),
			EgoHud = require('../viewport/hud/EgoHud'),
			egoHud = new EgoHud({hudBuilder: hudBuilder, viewport: this.viewport, ego: zep});
		this.egoHud = egoHud;
		
		this.setSoundRepo(new jsein.JsonRepo(require('../../resources/data/sounds')));
		
	    this.viewport.makeAnimator();
	    this.viewport.scaleCameraTo(0.5, 0.5);
	    
	    /*
	    var cameraTop = 10.5;
	    p.syncCamera = function() {};
	    p.viewport.moveCameraTo(p.location2position(ccp(p.fe.field.badguy.location.x * 0.5, cameraTop)));
	    p.viewport.moveCameraTo(p.location2position(ccp(p.ego.location.x * 8, cameraTop)), 5);
	    */
	    
	    setTimeout((function(){
		    this.syncCamera = function() {
				var body = this.fe.get(this.ego.bodyId);
				if (body) {
					var point = this.location2position(body.GetPosition());
					point = geo.ccp(Math.floor(-point.x * this.viewport.scale + this.viewport.size.width / 6), 10);
					this.viewport.scrolled.position = point;
				}
		    };
	    }).bind(this), 0);
	    		
	},
	
	setLayer: function(layer) {
		Protagonist.superclass.setLayer.call(this, layer);
		
		var Applier = require('../viewport/InteractionApplier'),
	    applier = new Applier({
	    	protagonist: this
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
	    	layer: layer,
	    	applier: applier,
	    	layout: layout
	    });
	    this.interactor.afterInteract();
	},
	
	// SOME CUT SCENES AND VIS EFFECTS
	
	gameOver: function() {
		this.ego.dead = true;
		this.fe.field.badguy.stop();
		console.log('here');
		var label = this.viewport.nf.makeLabel({
			string: 'Game Over, baby ;)',
			fontSize: 40,
			fontName: 'Serif',
			fontColor: '#770000'
		});
		label.anchorPoint = ccp(0.5, 0.5);
		label.position = ccp(this.viewport.size.width / 2, this.viewport.size.height / 3 * 2);
		this.viewport.hud.addChild(label);
	},

	startGameWon: function() {
		this.fe.field.badguy.stop();
		this.syncCamera = function(){};
		var cameraPos = ccp((this.fe.field.badguy.location.x + this.fe.field.goodguy.location.x) / 2, 10.5);
		this.viewport.moveCameraTo(this.location2position(cameraPos), 1.5);
		this.ego.state.enabled = false;
	},

	gameWon: function() {
		this.ego.dead = true; // you won, so you're dead ;)
		var label = this.viewport.nf.makeLabel({
			string: 'you win!',
			fontSize: 40,
			fontName: 'Serif',
			fontColor: '#004400'
		});
		
		setTimeout((function(){
			var label = this.viewport.nf.makeLabel({
				string: 'FATALITY',
				fontSize: 35,
				fontName: 'Serif',
				fontColor: '#004400'
			});
			label.anchorPoint = ccp(0.5, 0.5);
			label.position = ccp(this.viewport.size.width / 2, this.viewport.size.height / 3 * 2 - 60);
			this.viewport.hud.addChild(label);
		}).bind(this), 3000);
		
		label.anchorPoint = ccp(0.5, 0.5);
		label.position = ccp(this.viewport.size.width / 2, this.viewport.size.height / 3 * 2);
		this.viewport.hud.addChild(label);
	}
});

module.exports = Protagonist;