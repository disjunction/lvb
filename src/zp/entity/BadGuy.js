"use strict";

var	flame  = require('flame');

function BadGuy(opts) {
	BadGuy.superclass.constructor.call(this, opts);
	this.type = 'badguy';
	this.nobody = true;
	this.locked = true;
	
	this.acceleration = 0.1;
	this.maxSpeed = 3.5;
	this.speed = 0;
}

BadGuy.inherit(flame.entity.Movable, {
	move: function(delta) {
		this.speed < this.maxSpeed && (this.speed += this.acceleration * delta);
		if (this.speed < 0) this.speed = 0;
		this.location.x += this.speed * delta;
	},
	stop: function() {
		this.acceleration = -1;
		this.maxSpeed = 100;
	}
});

module.exports = BadGuy;