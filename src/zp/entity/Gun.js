"use strict";

var
	box2d  = require('box2d'),
	geo    = require('geometry'),
	flame  = require('flame'),
	ccp    = geo.ccp;

function Gun(opts) {
	this.charge = 0;
	this.chargeTime = Date.now();
	this.maxCharge = 200;
	this.type = 'gutling';
	this.impact = 30;
	this.recoil = 20;
	this.range = 30;
	this.autofire = true;
	this.damage = 35;
	
	this.hit = {type: 'gutling_hit'};
	
	for (var i in opts) {
		this[i] = opts[i];
	}
}

Gun.inherit(Object, {
	incCharge: function() {
		this.charge = Date.now() - this.chargeTime;
	},
	normalCharge: function() {
		return Math.min(this.charge, this.maxCharge);
	},
	resetCharge: function() {
		this.chargeTime = Date.now();
		this.charge = 0;
	}
});


module.exports = Gun;