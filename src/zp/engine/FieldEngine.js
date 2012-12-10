"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
	flame    = require('flame'),
	Intpacker = require('Intpacker');

function FieldEngine(field) {
    FieldEngine.superclass.constructor.call(this, field);
    this.prevStep = null;
    this.intpacker = new Intpacker(),
    this.pointer = 0;
    
    // player zeppelin thrust
    this.thrust = 2.5;
    
    // level of the roof (topmost reachable point)
    this.roof = 19;
    
    // from which distance ahead of ego to load objects
    this.lookAhead = 30;

    // after which distance objects can be cleaned up
    this.lookBehind = 20;
    
    // ugly solution but it creates less possible conflicts
    this.lastCleanup = Date.now();
    this.cleanupPeriod = 1000;
}

FieldEngine.inherit(flame.engine.FieldEngine, {
	addFlyer: function(flyer) {
		this.addThing(flyer);
		this.nodeBuilder.envision(flyer);
	},
	
	// lazy loading of nodes and bodies
	checkMaterialize: function() {
		while (true) {
			var index = this.intpacker.pack(this.pointer),
				a = this.field.get(index);
			if (a && a.location.x - this.lookAhead < this.ego.location.x) {
				if (!a.bodyId) {
					this.addThing(a);
					//this.bodyBuilder.embody(a);
					this.nodeBuilder.envision(a);
				}
				this.pointer++;
			} else {
				return;
			}
		}
	},
	
	/**
	 * Physics for arbitrary zeppelin
	 * @param body
	 */
	preStepZep: function(body) {
		var speedY = body.GetLinearVelocity().y,
			targetAngle = speedY > 0? 0.15 : -0.15,
			rotation = geo.closestRotation(body.thing.angle, targetAngle);
		
		if (Math.abs(rotation) > 0.05) {
			body.ApplyTorque(geo.sign(rotation)/3 + rotation * 2);
		}

		// compensate gravity
		body.ApplyForce(geo.ccpMult(this.world.GetGravity(), ccp(0, -body.GetMass())), body.thing.location);
		
		// engine pushes at full speed for 0 angle. To make effect stronger we use cos^2
		var cos = Math.cos(body.thing.angle),
			speed = this.thrust * Math.max(0, cos * cos);
		body.ApplyForce(geo.ccpMult(ccp(speed, 0), body.thing.direction), body.thing.location);
		
		// "roof" presses on all zeppelins, seed>-2 limits feedback
		var y = body.thing.location.y;
		if (y > this.roof && speedY > -2) {
			body.ApplyForce(ccp(0, -this.roof * (y-this.roof) * (y-this.roof)), body.thing.location);
		};
	},
	
	/**
	 * additional physics for player-controlled zeppelin
	 * @param body
	 */
	preStepPlayerZep: function(body) {
		if (body.thing.state.up) {
			body.ApplyForce(ccp(0, 25), body.GetPosition());
		} else {
			body.ApplyForce(ccp(0, -15), body.GetPosition());
		}
	},
	
	preStepSnow: function(body) {
		body.ApplyForce(ccp(0, 0.2), body.thing.location);
	},
	
	preStep: function() {
		this.checkMaterialize();
		
		for (var key in this.items) {
			var body = this.items[key];
			
			switch (body.thing.type) {
			case 'pirate':
			case 'ZepSelf':
				this.preStepZep(body);
				break;
			case 'snowflake':
				this.preStepSnow(body);
				break;
				
			}
			
			// if someone with controller attached... hm? you?
			if (body.thing.state) {
				this.preStepPlayerZep(body);
			}
		}
	},
	
	postStep: function() {
		FieldEngine.superclass.postStep.call(this);
		if (Date.now() - this.lastCleanup > this.cleanupPeriod) {
			this.cleanupField();
			this.lastCleanup = Date.now();
		}	
	},
	cleanupField: function() {
		
		for (var k in this.field.items) {
			var thing = this.field.get(k);
			if (thing.locked) continue;
			if (this.ego.location.x - thing.location.x > this.lookBehind) {
				this.removeThing(thing);
			}
		}
	}
});

module.exports = FieldEngine;
