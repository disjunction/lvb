"use strict";

var	flame  = require('flame');

function BadGuy(opts) {
	BadGuy.superclass.constructor.call(this, opts);
	this.type = 'badguy';
	this.nobody = true;
	this.locked = true;
	
	this.acceleration = 0.1;
	this.maxSpeed = 3;
	this.speed = 0;
	
	// how distance will affect maxSpeed of badguy
	this.accelRate = 0.2;
}

BadGuy.inherit(flame.entity.Movable, {
	move: function(delta, distance) {
		var maxSpeed = Math.max(this.maxSpeed, distance * this.accelRate);
		this.speed < maxSpeed && (this.speed += this.acceleration * delta);
		if (this.speed > maxSpeed) this.speed = maxSpeed;
		if (this.speed < 0) this.speed = 0;
		this.location.x += this.speed * delta;
	},
	stop: function() {
		this.acceleration = -1;
		this.maxSpeed = 100;
	}
});

module.exports = BadGuy;