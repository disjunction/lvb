"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
	flame    = require('flame');

function FieldFactory(defRepo) {
	this.defRepo = defRepo;
	this.grounds = ['ground1', 'ground2'];
}

FieldFactory.prototype.addGround = function(opts) {
	var x = 0,
	    y = 1;
	
	for (var i = 0; i < 50; i++) {
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

FieldFactory.prototype.addHouses = function(opts) {
	var x = 0,
	    y = 3;
	
	for (var i = 0; i < 10; i++) {
		var index = Math.floor(Math.random() * 2),
			def = this.defRepo.get('house1_base'),
			def2 = this.defRepo.get('house1_windows'),
			size = def.body.fixtures.main.box,
			size2 = def2.body.fixtures.main.box,
			element = new flame.entity.Thing();
		
		x += size.width / 2;
		
		element.location = ccp(x,y);
		element.type = 'house1_base';
		this.candids.push(element);
		
		for (var j = 0; j < index; j++) {
			var e2 = new flame.entity.Thing();
				e2.location = ccp(x,y + size.height + size2.height*(j-0.5));
				e2.type = 'house1_windows';
			this.candids.push(e2);
		}
		
		x += size.width / 2;
		
		x += Math.floor(Math.random() * 8);
		
	}
};


FieldFactory.prototype.make = function(opts) {
	this.candids = [];
	this.field = new flame.entity.Field;
	
	this.addGround(opts);
	this.addHouses(opts);
	
	// sort prepared elements by X, so that they can be envisioned and embodied 
	// only at the moment when player reaches a certain point
	this.candids.sort(function(a,b){return a.location.x - b.location.x;});
	
	for (var i in this.candids) {
		this.field.add(this.candids[i]);
	}
	
	return this.field;
};

module.exports = FieldFactory;