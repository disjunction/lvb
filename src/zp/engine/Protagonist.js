"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    flame     = require('flame');

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
	}
});

module.exports = Protagonist;