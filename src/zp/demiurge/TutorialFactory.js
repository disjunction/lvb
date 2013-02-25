"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
	flame    = require('flame'),
	Flier    = require('../entity/Flier'),
	Puff     = require('../entity/Puff'),
	Cloud    = require('../entity/Cloud'),
	Stack    = require('../entity/Stack'),
	BadGuy   = require('../entity/BadGuy'),
	FieldFactory = require('./FieldFactory');
	

/**
 * generates a tutorial level
 * 
 * @param defRepo
 */
function TutorialFactory(defRepo) {
	TutorialFactory.superclass.constructor.call(this, defRepo);
}

TutorialFactory.inherit(FieldFactory, {
	make: function(opts) {
		this.addBackgrounds(opts);
		this.addGround(opts);
		//this.addHouses(opts);
		this.addZeps(opts);
		this.addClouds(opts);
		//this.addStacks(opts);
		
		this.field.badguy = new BadGuy();
		this.field.badguy.location = ccp(-10, 5);
		this.candids.push(this.field.badguy);
		
		var t = this.makeTable('hello');
		t.location = ccp(5,4.5);
		this.candids.push(t);
		
		t = this.makeHanger('hello world!');
		t.location = ccp(5,10);
		this.candids.push(t);
		
		this.field.goodguy = new flame.entity.Thing('goodguy');
		this.field.goodguy.location = ccp(180, 7.5);
		this.candids.push(this.field.goodguy);
		
		return this.candidsToField(opts);
	}
});

module.exports = TutorialFactory;