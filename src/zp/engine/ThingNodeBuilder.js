"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    flame     = require('flame'),
    box2d     = require('box2d');

function ThingNodeBuilder(world, defRepo) {
	ThingNodeBuilder.superclass.constructor.call(this, world, defRepo);
}

ThingNodeBuilder.inherit(flame.engine.ThingNodeBuilder, {
	envision: function(thing) {
		if (thing.group == 'puffs' && thing.dissolveTime) {
			thing.removeThing = {delay: thing.dissolveTime};
		}
		
		ThingNodeBuilder.superclass.envision.call(this, thing);
		if (thing.group == 'puffs') {
			if (thing.dissolveTime) {
				this.animateNode(thing.nodes.stuff, {action: 'Remove', delay: thing.dissolveTime});
				this.animateNode(thing.nodes.stuff, {action: 'FadeTo', duration: thing.dissolveTime, toOpacity: 0});
				this.animateNode(thing.nodes.stuff, {action: 'ScaleBy', duration: thing.dissolveTime, 
													 scale: 1 + thing.sSpeed * thing.dissolveTime});
			} else {
				if (thing.friction) {
					thing.nodes.stuff.opacity = thing.nodes.stuff.opacity * thing.friction;
				}
			}
		}
	}
});

module.exports = ThingNodeBuilder;