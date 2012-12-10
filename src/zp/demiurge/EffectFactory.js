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
			y = 20 + Math.random() * 10,
			element = new flame.entity.Thing('snowflake');
		
		element.location = ccp(x, y);

		p.fe.addThing(element);
		p.fe.envision(element);
		
		if (p.viewport.animator) {
			p.viewport.animator.fadeOutRemove(element.nodes.main, 5, 1, p.viewport.main);
		}	
		
		setTimeout(function() {
			p.fe.removeThing(this);
		}.bind(element), 7000);
	}
};

module.exports = EffectFactory;