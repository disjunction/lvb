var path = require('../../../bootstrap').projectPath,
	smog = require('smog'),
	flame = require('flame'),
	srcPath = flame.srcPath,
	Director = require(srcPath + '/mock/DirectorMock'),
	NodeFactory = require(srcPath + '/mock/NodeFactoryMock');


exports.testBasic = function(test) {
	var director = new Director(),
		nodeFactory = new NodeFactory(smog.app.config),
		layer = nodeFactory.makeNode(),
		viewport = flame.viewport.Viewport(nodeFactory, layer, director);
		
	test.done();
};
