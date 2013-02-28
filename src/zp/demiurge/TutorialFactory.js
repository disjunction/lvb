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
		this.addGround(opts);

		this.field.badguy = new BadGuy();
		this.field.badguy.location = ccp(-10, 5);
		this.candids.push(this.field.badguy);
		
		this.addClouds(opts, -20, 2);
		
		this.candids.push(this.makeHanger("Jesus christ! It's Bender!", ccp(0, 17)));
		this.candids.push(this.makeHanger('Press and hold "UP" to fly', ccp(3, 15)));
		
		this.candids.push(this.makeHanger("Don't let him catch you", ccp(8, 10)));

		
		this.candids.push(this.makeHanger('Just release "UP" to go down', ccp(35, 13)));
		this.candids.push(this.makeHanger('Keep the balance', ccp(47, 10)));
		
		var x = 70;
		this.addBackgrounds(opts, x, 150);
		
		this.candids.push(this.makeHanger("Obstacles don't break your zeppelin...", ccp(x, 15)));
		this.candids.push(this.makeHanger("... but Bender will catch you", ccp(x+=13, 13)));
		this.candids.push(this.makeHanger("if you often run into them", ccp(x+=17, 13)));
		this.addHouses(opts, x+=10, 10);
		
		this.candids.push(this.makeHanger("Avoid clouds...", ccp(x+=20, 17)));
		this.candids.push(this.makeHanger("... they slow you down", ccp(x+=5, 15)));
		
		this.addClouds(opts, x+=30, 4);
		
		this.candids.push(this.makeHanger('Hold "SPACE" to shoot', ccp(x+=30, 7)));
		this.candids.push(this.makeHanger('Shoot bad zepellins', ccp(x+=20, 10)));
		
		this.addZeps(opts, x+=25, 7);
		
		this.candids.push(this.makeHanger('Collect crates for score', ccp(x+=5, 7)));
		
		this.candids.push(this.makeHanger('Gun recoil slows you down', ccp(x+=15, 20)));
		
		this.candids.push(this.makeTable('Small Town', ccp(x+=20, 4.5)));
		this.addHouses(opts, x+=7, 15);
		
		this.addZeps(opts, x+=10, 30);
		this.addClouds(opts, x+=35, 10);
		
		this.candids.push(this.makeHanger('Reach Lenin...', ccp(x+=100, 7)));
		this.candids.push(this.makeHanger('... only he can kill Bender!', ccp(x+=15, 9)));
		
		this.candids.push(this.makeHanger('Avoid smoke!', ccp(x+=20, 11)));
		this.addStacks(opts, x+=5, 7);
		this.addClouds(opts, x+=30, 15);
		this.addZeps(opts, x+=70, 10);
		
		
		this.addZeps(opts, x+=50, 10);
		
		this.candids.push(this.makeHanger('Maps are generated dynamically.', ccp(x+=20, 11)));
		
		this.field.goodguy = new flame.entity.Thing('goodguy');
		this.field.goodguy.location = ccp(x+=70, 7.5);
		this.candids.push(this.field.goodguy);
		
		return this.candidsToField(opts);
	}
});

module.exports = TutorialFactory;