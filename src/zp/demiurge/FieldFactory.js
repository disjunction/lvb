"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
	flame    = require('flame'),
	Flyer    = require('../entity/Flyer');

function FieldFactory(defRepo) {
	this.defRepo = defRepo;
	this.grounds = ['ground1', 'ground2'];
}

/**
 * this is just one big copy-paste,
 * the factory is just a testing prototype
 * @param opts
 */
FieldFactory.prototype.addGround = function(opts) {
	var x = 0,
	    y = 0.5;
	
	for (var i = 0; i < 500; i++) {
		var index = Math.floor(Math.random() * this.grounds.length),
			def = this.defRepo.get(this.grounds[index]),
			size = def.body.fixtures.main.box,
			element = new flame.entity.Thing();
		
		x += size.width / 2;
		
		element.location = ccp(x,y);
		element.type = this.grounds[index];
		
		this.candids.push(element);
		x += size.width / 2;
	}
};


FieldFactory.prototype.addBackgrounds = function(opts) {
	var element = new flame.entity.Thing('softsky');
	element.location = ccp(10, 10);
	element.nobody = true;
	element.locked = true;
	this.candids.push(element);
	
	var x = 0;
	
	for (var i = 0; i < 50; i++) {
		var element = new flame.entity.Thing('tree1');
		x += Math.random() * 7 + 3;
		element.location = ccp(x, 3);
		element.nobody = true;
		this.candids.push(element);
	}
	
	x = 0;
	
	for (var i = 0; i < 50; i++) {
		var element = new flame.entity.Thing('tree1front');
		x += Math.random() * 7 + 3;
		element.location = ccp(x, 3);
		element.nobody = true;
		this.candids.push(element);
	}
};

FieldFactory.prototype.addZeps = function(opts) {
	var def = this.defRepo.get('pirate'),
		x = 20;

	
	for (var i = 0; i < 50; i++) {
		var element = new flame.entity.Thing('pirate');
			x += Math.random() * 7 + 3;
		element.location = ccp(x, 12 + Math.random() * 7);
		if (def.direction) element.direction = def.direction;
		this.candids.push(element);
	}
};

FieldFactory.prototype.addHouses = function(opts) {
	var x = 10,
	    y = 0.9,
	    def = this.defRepo.get('house1_base'),
		def2 = this.defRepo.get('house1_windows'),
		size = def.body.fixtures.main.box,
		size2 = def2.body.fixtures.main.box;
	
	
	for (var i = 0; i < 50; i++) {
		var index = Math.floor(Math.random() * 3),
			element = new flame.entity.Thing();
		
		x += size.width / 2;
		
		element.location = ccp(x,y + size.height/2);
		element.type = 'house1_base';
		this.candids.push(element);
		
		var j;
		for (j = 0; j < index; j++) {
			var e2 = new flame.entity.Thing();
			e2.location = ccp(x,y + size.height + size2.height*(j+0.48));
			e2.type = 'house1_windows';
			this.candids.push(e2);
		}
		
		var roof  = new flame.entity.Thing();
		roof.location = ccp(x,y - 0.02 + size.height + size2.height*j + -0.5/3);
		roof.type = 'house1_roof';
		this.candids.push(roof);
		
		x += size.width / 2;
		
		x += Math.floor(Math.random() * 8);
		
	}
};


FieldFactory.prototype.make = function(opts) {
	this.candids = [];
	this.field = new flame.entity.Field;
	
	this.addGround(opts);
	this.addHouses(opts);
	this.addBackgrounds(opts);
	this.addZeps(opts);
	
	// sort prepared elements by X, so that they can be envisioned and embodied 
	// only at the moment when player reaches a certain point
	this.candids.sort(function(a,b){return a.location.x - b.location.x;});
	
	for (var i in this.candids) {
		this.field.add(this.candids[i]);
	}
	
	return this.field;
};

module.exports = FieldFactory;