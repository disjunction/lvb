"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
	flame    = require('flame'),
	jsein    = require('jsein'),
	Flier    = require('../entity/Flier'),
	Puff     = require('../entity/Puff'),
	Cloud    = require('../entity/Cloud'),
	Stack    = require('../entity/Stack'),
	BadGuy   = require('../entity/BadGuy');

function FieldFactory(defRepo) {
	this.defRepo = defRepo;
	this.grounds = ['ground1', 'ground2'];
	
	this.candids = [];
	this.field = new flame.entity.Field;
	
	// meters / second for puffs
	this.field.wind = ccp(-1, 0);
	
	this.uniDef = 0;
}

/**
 * this is just one big copy-paste,
 * the factory is just a testing prototype
 * @param opts
 */
FieldFactory.prototype.addGround = function(opts) {
	var x = -30,
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

FieldFactory.prototype.makeTable = function(string, location) {
	var def = jsein.clone(this.defRepo.get('table'));
	def.nodes.text = {
		type: 'label',
		layer: 'bg',
		opts: {
			string: string,
			fontSize: 40,
			fontName: 'Serif',
			fontColor: '#000000',
			anchorPoint: ccp(0.5, -1.8)
		}
	};
	var key = 'def' + this.uniDef++;
	this.defRepo.defs[key] = def;
	var r = new flame.entity.Thing(key);
	location && (r.location = location);
	return r;
};

// just a string hanging in the sky :)
FieldFactory.prototype.makeHanger = function(string, location) {
	var def = {
		nobody: true,
		nodes: {
			bg: {
				type: 'label',
				layer: 'bg',
				opts: {
					string: string,
					fontSize: 50,
					fontName: 'Serif',
					fontColor: '#222266'
				}
			}
		}
	};
	var key = 'def' + this.uniDef++;
	this.defRepo.defs[key] = def;
	var r = new flame.entity.Thing(key);
	location && (r.location = location);
	return r;
};

FieldFactory.prototype.addBackgrounds = function(opts, x, qty) {
	var element = new flame.entity.Thing('softsky');
	element.location = ccp(10, 10);
	element.nobody = true;
	element.locked = true;
	this.candids.push(element);
	
	for (var i = 0; i < qty; i++) {
		var element = new flame.entity.Thing('tree1');
		x += Math.random() * 7 + 3;
		element.location = ccp(x, 3);
		element.nobody = true;
		this.candids.push(element);
	}
	return x;
};

FieldFactory.prototype.addZeps = function(opts, x, qty) {
	var def = this.defRepo.get('pirate');
	
	for (var i = 0; i < qty; i++) {
		var element = new Flier('pirate');
			x += Math.random() * 7 + 3;
		element.location = ccp(x, 12 + Math.random() * 7);
		if (def.direction) element.direction = def.direction;
		this.candids.push(element);
	}
	return x;
};

FieldFactory.prototype.addClouds = function(opts, x, qty) {
	for (var i = 0; i < qty; i++) {
		var y = 14 + Math.random() * 8,
			cloud = new Cloud;
		cloud.location = ccp(x, y);
		this.candids.push(cloud);	
		x += Math.random() * 20 + 5;
	}
	return x;
};

FieldFactory.prototype.addStacks = function(opts, x, qty) {
	for (var i = 0; i < qty; i++) {
		var y = 4.6,
			element = new Stack;
		element.location = ccp(x, y);
		this.candids.push(element);	
		x += Math.random() * 20 + 15;
	}
	return x;
};

FieldFactory.prototype.addIndustrialSector = function(opts, x, qty) {
	for (var i = 0; i < qty; i++) {
		var y = 4.6,
			element = new Stack;
		element.location = ccp(x, y);
		this.candids.push(element);	
		x += Math.random() * 20 + 15;
	}
	return x;
};


FieldFactory.prototype.addByDefName = function(name, x) {
	var def = this.defRepo.get(name), 
		element = new flame.entity.Thing(),
		box = def.body.fixtures.main.box,
		postfix = Math.random() * 3;
	
	element.type = name;
	element.location = ccp(x, 0.9 + box.height / 2);
	this.candids.push(element);
	return x + box.width + postfix;
};

FieldFactory.prototype.addHouses = function(opts, x, qty) {
	var y = 0.9,
	    def = this.defRepo.get('house1_base'),
		def2 = this.defRepo.get('house1_windows'),
		size = def.body.fixtures.main.box,
		size2 = def2.body.fixtures.main.box;
	
	
	for (var i = 0; i < qty; i++) {
		x += size.width / 2;
		
		if (Math.random() > 0.7) {
			x = this.addByDefName("brickhouse", x);
			continue;
		}
		
		var index = Math.floor(Math.random() * 3),
			element = new flame.entity.Thing();
		
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
	return x;
};


FieldFactory.prototype.candidsToField = function(opts) {
	// sort prepared elements by X, so that they can be envisioned and embodied 
	// only at the moment when player reaches a certain point
	this.candids.sort(function(a,b){return a.location.x - b.location.x;});
	
	for (var i in this.candids) {
		this.field.add(this.candids[i]);
	}
	
	return this.field;	
};

FieldFactory.prototype.make = function(opts) {	
	this.addGround(opts);
	this.addHouses(opts, 5, 50);
	this.addBackgrounds(opts, 0, 50);
	this.addZeps(opts, 10, 30);
	this.addClouds(opts, 20, 40);
	this.addStacks(opts, 50, 30);
	
	this.field.badguy = new BadGuy();
	this.field.badguy.location = ccp(-10, 5);
	this.candids.push(this.field.badguy);
	
	this.field.goodguy = new flame.entity.Thing('goodguy');
	this.field.goodguy.location = ccp(10, 7.5);
	this.candids.push(this.field.goodguy);
		
	return this.candidsToField(opts);
};

module.exports = FieldFactory;