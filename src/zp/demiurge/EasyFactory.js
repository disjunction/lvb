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
		this.field.badguy.accelRate = 0.1; // mini-handicap
		this.field.badguy.location = ccp(-10, 5);
		
		
		this.candids.push(this.field.badguy);
		
		var x = 10;
		this.addBackgrounds(opts, -20, 150);
		this.candids.push(this.makeTable('Goodville South', x));
		this.addHouses(opts, x+=10, 10);
		
		this.addClouds(opts, x+=30, 4);
		
		x = this.addZeps(opts, x+=25, 7);
		
		this.candids.push(this.makeTable('Goodville North', x + 3));
		this.addHouses(opts, x+=10, 15);
		
		this.addZeps(opts, x+=10, 30);
		x = this.addClouds(opts, x+=5, 10);
		
		this.candids.push(this.makeTable('Stackdorf', x + 3));
		
		var fin = this.addStacks(opts, x+=10, 7);
		this.addClouds(opts, x+=30, 15);	
		
		this.addZeps(opts, x+=50, 10);
		
		this.field.goodguy = new flame.entity.Thing('goodguy');
		this.field.goodguy.location = ccp(fin + 10, 7.5);
		this.candids.push(this.field.goodguy);
		
		return this.candidsToField(opts);
	}
});

module.exports = EasyFactory;