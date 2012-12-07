"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    flame     = require('flame'),
    box2d     = require('box2d');

function ThingNodeBuilder(world, defRepo) {
	ThingNodeBuilder.superclass.constructor.call(this, world, defRepo);
}

ThingNodeBuilder.inherit(flame.engine.ThingNodeBuilder, {

});

module.exports = ThingNodeBuilder;