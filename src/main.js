"use strict"  // Use strict JavaScript mode

// Import in the modules we're going to use
var cocos  = require('cocos2d')
  , nodes  = cocos.nodes
  , events = require('events')
  , geo    = require('geometry')

// Convenient access to some constructors
var Scene    = nodes.Scene
  , Director = cocos.Director

// Import our class
var Zp = require('./zp').Zp

/**
 * Entry point for the application
 */
this.main = function main () {
    // Get director singleton
    var director = Director.sharedDirector

    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
        // Create a scene and layer
        var scene = new Scene()
          , layer = new Zp()

        // Add our layer to the scene
        scene.addChild(layer)

        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene()
}
