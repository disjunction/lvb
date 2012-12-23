"use strict";

var
	box2d  = require('box2d'),
	geo    = require('geometry'),
	flame  = require('flame'),
	Gun  = require('./Gun'),
	ccp    = geo.ccp;

function Flyer(opts) {
	Flyer.superclass.constructor.call(this, opts);
	this.gun = new Gun();
	this.size = geo.sizeMake(1,1);
	this.direction = 1;
	this.hp = 100;
}

Flyer.inherit(flame.entity.Movable, {

});

module.exports = Flyer;