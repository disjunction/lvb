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
 * generates a Medium level
 * 
 * @param defRepo
 */
function MediumFactory(defRepo) {
	MediumFactory.superclass.constructor.call(this, defRepo);
	
	this.zepHp = 100;
}

MediumFactory.inherit(FieldFactory, {
	make: function(opts) {
		this.field.level = 'Hard';
		
		this.addGround(opts);

		this.field.badguy = new BadGuy();
		this.field.badguy.accelRate = 0.1; // mini-handicap
		this.field.badguy.location = ccp(-10, 5);
		
		
		this.candids.push(this.field.badguy);
		
		this.addBackgrounds(opts, -20, 20);
		
		var x = 10;
		
		this.candids.push(this.makeTable('Eching', x));
		this.addHouses(opts, x+=10, 10);
		this.addClouds(opts, x+=20, 30);
		x = this.addZeps(opts, x+=40, 10);

		this.candids.push(this.makeTable('Garching', x));
		
		var secEnd = this.addIndustrialSector(opts, x + 5, 10);
		this.addZeps(opts, x+=40, 20);
		
		x = secEnd;
		
		this.candids.push(this.makeTable('Misty Wood', x));
		
		this.addBackgrounds(opts, x + 5, 100);
		this.addClouds(opts, x+=20, 30);
		this.addIndustrialSector(opts, x + 45, 2);
		this.addZeps(opts, x + 60, 10);
		
		x = this.addIndustrialSector(opts, x + 130, 2);

		this.addZeps(opts, x, 40);
		
		this.candids.push(this.makeTable('Milbertshofen', x));
		this.addClouds(opts, x+30, 40);

		x = this.addHouses(opts, x+10, 10);
		x = this.addIndustrialSector(opts, x, 2);
		x = this.addHouses(opts, x, 10);
		
		this.field.goodguy = new flame.entity.Thing('goodguy');
		this.field.goodguy.location = ccp(x + 5, 7.5);
		this.candids.push(this.field.goodguy);
		
		return this.candidsToField(opts);
	}
});

module.exports = MediumFactory;