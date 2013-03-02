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
 * generates a Easy level
 * 
 * @param defRepo
 */
function EasyFactory(defRepo) {
	EasyFactory.superclass.constructor.call(this, defRepo);
}

EasyFactory.inherit(FieldFactory, {
	make: function(opts) {
		this.field.level = 'easy';
		
		this.addGround(opts);

		this.field.badguy = new BadGuy();
		this.field.badguy.location = ccp(-10, 5);
		this.candids.push(this.field.badguy);
		
		var x = 10;
		this.addBackgrounds(opts, x, 150);
		
		this.addHouses(opts, x+=10, 10);
		
		this.addClouds(opts, x+=30, 4);
		
		this.addZeps(opts, x+=25, 7);
		
		this.addHouses(opts, x+=7, 15);
		
		this.addZeps(opts, x+=10, 30);
		this.addClouds(opts, x+=35, 10);
		
		this.addStacks(opts, x+=5, 7);
		this.addClouds(opts, x+=30, 15);
		this.addZeps(opts, x+=70, 10);		
		
		this.addZeps(opts, x+=50, 10);
		
		this.field.goodguy = new flame.entity.Thing('goodguy');
		this.field.goodguy.location = ccp(x+=70, 7.5);
		this.candids.push(this.field.goodguy);
		
		return this.candidsToField(opts);
	}
});

module.exports = EasyFactory;