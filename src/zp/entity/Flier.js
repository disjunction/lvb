"use strict";

var
	box2d  = require('box2d'),
	geo    = require('pointExtension'),
	flame  = require('flame'),
	Gun  = require('./Gun'),
	ccp    = geo.ccp;

function Flier(opts) {
	Flier.superclass.constructor.call(this, opts);
	this.gun = new Gun();
	this.size = geo.sizeMake(1,1);
	this.direction = 1;
	this.hp = 100;
}

Flier.inherit(flame.entity.Movable, {
	_crates: 0,
	set crates(v) {	this.setter('crates', v);},
	get crates() { return this._crates; }
});

module.exports = Flier;