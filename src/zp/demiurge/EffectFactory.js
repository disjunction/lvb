"use strict";

var
	geo      = require('pointExtension'),
    ccp      = geo.ccp,
	flame    = require('flame'),
	Puff     = require('../entity/Puff');

function EffectFactory() {

}

/**
 * 
 * @param Protagonist p
 * @param Number fromX
 * @param Number toX
 * @param Number count
 */
EffectFactory.prototype.throwSnow = function(p, fromX, toX, count) {
	for (var i = 0; i < count; i++) {
		var x = Math.random() * (toX - fromX) + fromX,
			y = 20 + Math.random() * 10;
		
		p.fe.spawnThing({type: 'snowflake', location: ccp(x,y)});
	}
};


// tmp method (c-p from throwSnow)
EffectFactory.prototype.throwCrates = function(p, fromX, toX, count) {
	for (var i = 0; i < count; i++) {
		var x = Math.random() * (toX - fromX) + fromX,
			y = 20 + Math.random() * 10;
		
		p.fe.spawnThing({type: 'crate1', location: ccp(x,y)});
	}
};


/**
 * 
 * @param Protagonist p
 * @param Number fromX
 * @param Number toX
 * @param Number count
 */
EffectFactory.prototype.gunHit = function(p, gun, impact) {
	var hitThing = new flame.entity.Thing(gun.hit.type);
	hitThing.location = impact.impactPoint;
	p.fe.envision(hitThing);
};

/**
 * 
 * @param Cloud cloud
 * @param FieldEngine fe
 */
EffectFactory.prototype.materializeCloud = function(cloud, fe) {
	var x = cloud.location.x,
		y = cloud.location.y,
		count = Math.floor(Math.random() * 4) + 5,
		median = (count+1)/2,
		tightness = 1.2 + Math.random();
	for (var j = 0; j < count; j++) {
		var fraction = (median  - Math.abs(j+1-median)) / median * 0.7 + 0.3,
			element = new Puff('puff01');
	
		element.location = ccp(x,y + (Math.random() * 4 - 2) * fraction);
		element.type = 'puff01';
		element.hSpeed = fe.field.wind.x;
		element.aSpeed = 0.05 + Math.random() * 0.2;
		element.angle = Math.random() * 6.28; // 2pi
		element.scale = fraction;
		element.radius = 2.25;
		element.friction = fraction;
		
		x += element.scale * tightness;
		y += (Math.random() * tightness - tightness / 2) * element.scale;
		
		fe.addThing(element);
		fe.envision(element);
	}
};

module.exports = EffectFactory;