"use strict";

var
	geo      = require('pointExtension'),
    ccp      = geo.ccp,
	flame    = require('flame');

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

module.exports = EffectFactory;