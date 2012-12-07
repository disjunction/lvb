"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    flame     = require('flame'),
    box2d     = require('box2d');

function ThingBodyBuilder(world, defRepo) {
	ThingBodyBuilder.superclass.constructor.call(this, world, defRepo);
}

ThingBodyBuilder.inherit(flame.engine.ThingBodyBuilder, {
});

module.exports = ThingBodyBuilder;