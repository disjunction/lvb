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
			if (a && a.location.x - 100 < this.ego.location.x) {
				if (!a.bodyId) {
					this.bodyBuilder.embody(a);
					this.nodeBuilder.envision(a);
				}
				this.pointer++;
			} else {
				return;
			}
		}
	},
	preStep: function() {
		this.checkMaterialize();
		
		for (var key in this.items) {
			var body = this.items[key];
			body.ApplyForce(ccp(0, 24), body.thing.location);
		}
	}
});

module.exports = FieldEngine;