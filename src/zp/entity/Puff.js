"use strict";

var
	box2d  = require('box2d'),
	geo    = require('pointExtension'),
	flame  = require('flame'),
	jsein  = require('jsein'),
	ccp    = geo.ccp;

function Puff(opts) {
	Puff.superclass.constructor.call(this, opts);
	
	this.nobody = true;
	this.group = 'puffs';
	
	this.age = 0;
	this.dissolveTime = opts.dissolveTime? opts.dissolveTime : false; // time until the puff will fade away
	this.hSpeed = opts.hSpeed? opts.hSpeed : 0; // horizontal speed (normally overridden by wind)
	this.vFactor = opts.vFactor? opts.vFactor : 0; // how fast the vTop is reached
	this.vTop = opts.vTop? opts.vTop : 0; // max additional height (asymptote for the puff law)
	this.sSpeed = opts.sSpeed? opts.sSpeed : 0; // scale speed
	this.aSpeed = opts.aSpeed? opts.aSpeed : 0; // angular speed
	
	this.radius = opts.radius? opts.radius : 1;
	this.size = ccp(this.diameter, this.diameter);
	
	
	
	this.angularVelocity = this.angularVelocity? this.angularVelocity : 0.5;
}

Puff.inherit(flame.entity.Movable, {
	
	growOlder: function(delta) {
		if (!this.initLocation) {
			this.initLocation = jsein.clone(this.location);
		}
		if (!this.initAngle) {
			this.initAngle = this.angle;
		}
		
		this.age += delta;
		
		var x = this.initLocation.x + this.age * this.hSpeed,
			y = this.initLocation.y + this.vTop * (1 - 1/(this.age * this.vFactor + 1));
		
		this.location = ccp(x, y);
		
		this.angle = this.initAngle + this.age * this.aSpeed;
	}
});

module.exports = Puff;