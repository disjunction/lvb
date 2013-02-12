"use strict";

var
    geo         = require('pointExtension'),
    ccp         = geo.ccp,
    flame       = require('flame');

function EgoHud(opts) {
	EgoHud.superclass.constructor.call(this, opts);
	
	var x = 0,
		viewport = this.viewport, // make them visible in helper function
		hudBuilder = this.hudBuilder,
		panel = this.hudBuilder.makePanel({
			sprite: {
				"file": "/resources/sprites/hud/bot_panel.png"
			}
		});

	this.root.addElement('progress', panel, {point: ccp(0, 372)});
	
	function addLabel(name, string, shift) {
		var label = viewport.nf.makeLabel({string: string});
		panel.addElement('name', label, {point: ccp(x += shift, 10)});
		x += hudBuilder.getSize(label).width;
		return label;
	}
	
	addLabel('l1', 'Distance From Bender:', 10);
	this.distance = addLabel('distance', '0', 10);
	
	addLabel('l2', 'Linear Velocity:', 30);
	this.velocity = addLabel('distance', '0', 10);
	
	addLabel('l3', 'Score:', 30);
	this.crates = addLabel('crates', '0', 10);
}

EgoHud.inherit(flame.viewport.hud.EgoHud, {
	propertyListener: function(event) {
		switch (event.property) {
		case 'crates':	
			this.crates.string = '' + event.newValue;
			break;
		case 'velocity':	
			this.velocity.string = '' + event.newValue;
			break;
		case 'distance':	
			this.distance.string = '' + event.newValue;
			break;
		}
	}
});

module.exports = EgoHud;