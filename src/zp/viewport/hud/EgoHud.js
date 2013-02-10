"use strict";

var
    geo         = require('pointExtension'),
    ccp         = geo.ccp,
    flame       = require('flame');

function EgoHud(opts) {
	EgoHud.superclass.constructor.call(this, opts);
	var panel = this.hudBuilder.makePanel({
		sprite: {
			"file": "/resources/sprites/hud/bg.png",
			"opacity": 50,
			rect: new geo.Rect(0,0,100,100)
		}
	});
		
	this.root.addElement('progress', panel, {point: ccp(3,3)});
	
	this.crates = this.viewport.nf.makeLabel({string: '0'});
	panel.addElement('hello', this.crates);
	console.log(this.crates.position);
}

EgoHud.inherit(flame.viewport.hud.EgoHud, {
	propertyListener: function(event) {
		switch (event.property) {
		case 'crates':	
			this.crates.string = '' + event.newValue;
			break;
		}
	}
});

module.exports = EgoHud;