"use strict";

var
	box2d  = require('box2d'),
	geo    = require('pointExtension'),
	flame  = require('flame'),
	Puff  = require('./Puff'),
	ccp    = geo.ccp;

function Stack(opts) {
	Stack.superclass.constructor.call(this, opts);
	this.type = 'stack01';
	this.group = 'stacks';
	this.puffOpts = {
		type: 'puff01',
		dissolveTime: 10 + Math.random() * 10,
		vFactor: 0.3,
		vTop: 8 + Math.random() * 5,
		sSpeed: 0.15,
		aSpeed: 0.3
	};
	
	this.height = 9;
	this.period = 2200;
	this.lastPuffTime = Date.now();
}

Stack.inherit(flame.entity.Thing, {
	checkPuff: function(fe) {
		var time = Date.now();
		if (time - this.lastPuffTime > this.period) {
			this.lastPuffTime = time;
			var puff = new Puff(this.puffOpts);
			puff.location = ccp(this.location.x, this.height);
			puff.hSpeed = fe.field.wind.x;
			puff.friction = 0.2;
			puff.scale = 0.4;
			puff.radius = 2.25;
			fe.addThing(puff);
			fe.envision(puff);
		}
	}
});

module.exports = Stack;