"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    jsein    = require('jsein'),
	flame    = require('flame'),
	box2d    = require('box2d'),
	Intpacker = require('Intpacker'),
	EffectFactory = require('../demiurge/EffectFactory');

function FieldEngine(field) {
    FieldEngine.superclass.constructor.call(this, field);
    this.prevStep = null;
    this.intpacker = new Intpacker(),
    this.pointer = 0;
    
    // player zeppelin thrust
    this.thrust = 5;
    
    // level of the roof (topmost reachable point)
    this.roof = 19;
    
    // from which distance ahead of ego to load objects
    this.lookAhead = 50;

    // after which distance objects can be cleaned up
    this.lookBehind = 20;
    
    // ugly solution but it creates less possible conflicts
    this.lastCleanup = Date.now();
    this.cleanupPeriod = 1000;
    this.cleanupEnabled = false;
    
    // reduces CPU load calculating collisions with the clouds
    this.lastCloudCheck = Date.now();
    this.cloudCheckPeriod = 200;
    
    // defines distance the box is pickable
    this.pickupVector = ccp(3, 3);
    
    // one more ugly thing, used to bypass messaging between protagonist and fe
    this.ef = new EffectFactory();
    
    // speed handicap for Puff friction
    this.puffFactor = 0;
    
    // stretcher showing badguy-zep or goodguy-badguy laser shot in the end of the game
    this.finalLaser = null;
}

FieldEngine.inherit(flame.engine.FieldEngine, {
	addFlier: function(flyer) {
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
					if (a.type == 'cloud') {
						this.ef.materializeCloud(a, this);
					} else {
						this.addThing(a);
						this.envision(a);
					}					
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
	
	objectEventQueue: [],
	
	checkCratePickup: function(body) {
		var p1 = body.GetPosition(),
			p2 = this.ego.location;

		if (Math.abs(p1.x - p2.x) < this.pickupVector.x &&
			Math.abs(p1.y - p2.y) < this.pickupVector.y) {
				this.objectEventQueue.push({type: 'gather', thing: body.thing});
				this.ego.score+=10; // this should call the EgoHud (via Observer)
		}
	},
	
	/**
	 * additional physics for player-controlled zeppelin
	 * @param body
	 */
	preStepPlayerZep: function(body) {
		if (body.thing.state.up && body.thing.go) {
			body.ApplyForce(ccp(0, 25), body.GetPosition());
		} else {
			body.ApplyForce(ccp(0, -15), body.GetPosition());
		}
		
		if (body.thing.state.nitro) {
			body.ApplyForce(ccp(30, 0), body.GetPosition());
		}
		
		var time = Date.now(),
			v = body.GetLinearVelocity();
		
		if (this.groups.puffs && time - this.lastCloudCheck > this.cloudCheckPeriod) {
			this.lastCloudCheck = time;
			
			var impact = 1000;
			
			for (var ii in this.groups.puffs) {
				var puff = this.groups.puffs[ii],
					sqD = geo.ccpLengthSQ(geo.ccpSub(body.thing.location, puff.location));
				
				// distance between centers is less than 4
				if (sqD < 25) {
					var shape1 = new box2d.b2CircleShape(puff.radius * puff.scale),
						t1 = new box2d.b2Transform,
						t2 = new box2d.b2Transform;
					
					t1.position.Set(puff.location.x, puff.location.y);
					t2.position.Set(body.thing.location.x, body.thing.location.y);
					
					if (box2d.b2Shape.TestOverlap(shape1, t1, body.GetFixtureList().GetShape(), t2)) {
						if (puff.dissolveTime) {
							puff.friction = 1 - puff.age / puff.dissolveTime + 0.01; 
						}
						var candidImpact = 0.05 / puff.friction / puff.friction * sqD;
						if (candidImpact < impact) impact = candidImpact;
					}
				}
			}
			
			if (impact < 1000) {
				if (Math.abs(v.x) > impact + this.puffFactor) v.x = impact * geo.sign(v.x);
				if (Math.abs(v.y) > impact + this.puffFactor) v.y = impact * geo.sign(v.y);
			}
		}

		body.thing.velocity = Math.floor(v.x * 10) / 10;
	},
	
	preStepSnow: function(body) {
		body.ApplyForce(ccp(0, 0.2), body.thing.location);
	},
	
	preStepPuffs: function(delta) {
		for (var k in this.groups.puffs) {
			this.groups.puffs[k].growOlder(delta);
		}
	},

	/**
	 * move bad guy and caclulate gae over situation
	 * @param float delta
	 */
	preStepBadGuy: function(delta) {
		this.ego.distance = Math.floor((this.ego.location.x - this.field.badguy.location.x) * 10) / 10;
		
		this.field.badguy.move(delta, this.ego.distance);
	    this.updateThingNodes(this.field.badguy);
	    
	    if (this.ego.distance <= 2 && !this.ego.dead && !this.finalLaser) {
	    	this.nodeBuilder.viewport.play('laser_shot');
	    	var laser = new flame.entity.Stretcher('red_laser');
	        laser.locked = true;
	    	laser.stretch.start.thing = this.field.badguy;
	    	laser.stretch.start.anchor = {point: ccp(-0.7, 2.9)};
	    	laser.stretch.end.thing = this.ego;
	    	this.addThing(laser);
	    	this.envision(laser);
	    	
	    	this.finalLaser = laser;
	    	
	    	setTimeout((function(){
		    	this.explodeThing(this.ego, this.protagonist);
		    	this.protagonist.gameOver();
		    	this.removeThing(laser);
	    	}).bind(this), 1500);
	    }
	    
	    // this allows to move camera back and show the poor bad guy
	    if (this.field.goodguy.location.x - this.ego.location.x < 50) {
	    	this.cleanupEnabled = false;
	    } else if (this.ego.location.x > 20) {
	    	// enable cleanup if the cut-scene was already shown and we're not in the end-game
	    	this.cleanupEnabled = true;
	    }
	    
	    if ((this.field.goodguy.location.x - this.field.badguy.location.x < 18) && !this.finalLaser) {
	    	// i'm evil copy-pase ]:-]
	    	this.nodeBuilder.viewport.play('laser_shot');
	    	var laser = new flame.entity.Stretcher('red_laser');
	        laser.locked = true;
	    	laser.stretch.end.thing = this.field.badguy;
	    	laser.stretch.end.anchor = {point: ccp(-0.7, 0)};
	    	laser.stretch.start.thing = this.field.goodguy;
	    	laser.stretch.start.anchor = {point: ccp(-0.3, 6.3)};
	    	this.addThing(laser);
	    	this.envision(laser);
	    	
	    	this.finalLaser = laser;
	    	
	    	this.protagonist.startGameWon();
	    	
	    	setTimeout((function(){
		    	this.explodeThing(this.field.badguy, this.protagonist);
		    	this.protagonist.gameWon();
		    	this.removeThing(laser);
	    	}).bind(this), 1500);
	    }
	    
	    if (!this.finalLaser && this.field.goodguy.location.x - this.ego.location.x < 2) {
	    	this.field.badguy.location.x = this.field.goodguy.location.x - 17.5;
	    }
	},
	
	preStep: function(delta) {
		FieldEngine.superclass.preStep.call(this, delta);
		
		this.checkMaterialize();
		this.preStepBadGuy(delta);
		
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
			case 'crate1':
				this.checkCratePickup(body);
				break;
			case 'stack01':
				body.thing.checkPuff(this);
				break;
			}
			
			// if someone with controller attached... hm? you?
			if (body.thing.state) {
				this.preStepPlayerZep(body);
			}
		}
		
		if (this.groups.puffs) {
			this.preStepPuffs(delta);
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
		if (!this.cleanupEnabled) return;
		for (var k in this.field.items) {
			var thing = this.field.get(k);
			if (thing.locked) continue;
			if (this.ego.location.x - thing.location.x > this.lookBehind) {
				this.removeThing(thing);
			}
		}
	},
	
	explodeThing: function(thing, protagonist) {
		var def = this.getDefByThing(thing);
		if (!def.explosion) {
			throw new Error('explosion not defined in thing def ' + thing.type);
		}
		if (!Array.isArray(def.explosion.splinters)) {
			throw new Error('explosion.splinters must be array in thing def ' + thing.type);
		}
		this.removeThing(thing);
		this.nodeBuilder.viewport.play('explosion1');
		for (var i in def.explosion.splinters) {
			var spawnDef = jsein.clone(def.explosion.splinters[i]);
			spawnDef.location = geo.ccpAdd(thing.location, spawnDef.location);
			this.spawnThing(spawnDef);
		}
	},
	
	// this code is bad because fe shouldn't depend on protagonist and ef
	tryShot: function(thing, protagonist) {
		var gun = thing.gun,
			body = this.get(thing.bodyId);
		
		if (!body) return;
		
		if (gun.autofire && gun.charge < gun.maxCharge) return;
		
		var opts = {
			subject: thing,
			fromPoint: thing.location,
			angle: thing.angle,
			distance: gun.range,
			recoil: gun.recoil,
			impact: gun.impact
		};
		if (body.GetLinearVelocity().x <= 2) {
			opts.recoil = 0;
		}
		
		var r = this.rayShot(opts);
		
		if (r) {
			var target = r.body.thing;
			if (typeof target.hp != 'undefined') {
				target.hp -= gun.damage;
				if (target.hp <= 0) {
					this.explodeThing(target, protagonist);
					this.ego.score++;
				} else {
					this.ef.gunHit(protagonist, gun, r);
				}
			} else {
				this.ef.gunHit(protagonist, gun, r);
			}
		} else {
			// there was no hit, but we need to show something :\
			var fakeHit = new flame.entity.Thing();
			fakeHit.location = ccp(thing.location.x + gun.range * Math.cos(thing.angle),
								   thing.location.y + gun.range * Math.sin(thing.angle));
			this.ef.gunShot(protagonist, thing, fakeHit);
		}
		
		gun.resetCharge();
	}
});

module.exports = FieldEngine;
