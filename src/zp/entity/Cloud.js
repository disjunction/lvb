"use strict";

var
	box2d  = require('box2d'),
	geo    = require('pointExtension'),
	flame  = require('flame'),
	ccp    = geo.ccp;

function Cloud(opts) {
	Cloud.superclass.constructor.call(this, opts);
	this.type = 'cloud';
}

Cloud.inherit(flame.entity.Movable, {

});

module.exports = Cloud;