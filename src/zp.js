"use strict"  // Use strict JavaScript mode

// Import in the modules we're going to use
var cocos  = require('cocos2d'),
    nodes  = cocos.nodes,
    geo    = require('pointExtension'),
    ccp    = geo.ccp;

// Convenient access to some constructors
var Director = cocos.Director
  , Label    = nodes.Label
  , Layer    = nodes.Layer
  , Point    = geo.Point;

// ZP bootstraping
  
var smog = require('smog');
smog.app.config = require('/configs/development');

var flame = require('flame'),
	NodeFactory = require(flame.srcPath + '/NodeFactory'),
	nf = new NodeFactory(smog.app.config);

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Zp () {
    Zp.superclass.constructor.call(this)
    
    this.viewport = new flame.viewport.Viewport(nf, Director.sharedDirector);
    this.viewport.addLayersTo(this);
    
    var fpsLabel = new nodes.Label({ string: 'hello world', fontName: 'Arial', fontSize: 10});
	fpsLabel.anchorPoint = ccp(0,0);
	fpsLabel.position = ccp(10, 80);
	
	this.viewport.main.addChild(fpsLabel);
}

// Inherit from cocos.nodes.Layer
Zp.inherit(Layer)

// Export the class so it can be accessed from outside this file
this.Zp = Zp
