var path = require('../../../bootstrap').projectPath,
	smog = require('smog'),
	flame = require('flame'),
	jsein = require('jsein'),
	ThingNodeBuilder = require(path + '/zp/engine/ThingNodeBuilder');

exports.testNodesForZep = function(test) {
	var defRepo = new jsein.JsonRepo();
    defRepo.loadFile(path + '/resources/data/zeps');

    var p = flame.mock.makeProtagonist(),
    	nodeBuilder = new ThingNodeBuilder(p.viewport, defRepo),
    	t = new flame.entity.Thing();
    
    t.type = 'ZepSelf';
    
    nodeBuilder.envision(t);
    test.equal(0.3, t.nodes.main.mockOpts.scale);
	test.done();
};
