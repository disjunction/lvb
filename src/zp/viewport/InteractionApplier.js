"use strict";

var
	flame  = require('flame'),
	EffectFactory = require('../demiurge/EffectFactory');
	
function InteractionApplier(opts) {
	InteractionApplier.superclass.constructor.call(this, opts);
	this.ef = new EffectFactory();
}

InteractionApplier.inherit(flame.viewport.Interactor.ProtagonistApplier, {
	applyEvent: function(origEvent, defEvent) {
		switch (defEvent) {
		case 'snow':
			this.ef.throwSnow(this.p, this.p.ego.location.x-2, this.p.ego.location.x+13, 20);
		}
	}
});

module.exports = InteractionApplier;