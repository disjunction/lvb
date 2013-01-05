"use strict";

var
	flame  = require('flame'),
	EffectFactory = require('../demiurge/EffectFactory');
	
function InteractionApplier(opts) {
	InteractionApplier.superclass.constructor.call(this, opts);
	this.ef = new EffectFactory();
	this.p.fe.preStepPlugins.push(this.checkEgoState.bind(this));
}

InteractionApplier.inherit(flame.viewport.Interactor.ProtagonistApplier, {
	
	applyEvent: function(origEvent, defEvent) {
		switch (defEvent) {
		case 'snow':
			this.ef.throwSnow(this.p, this.p.ego.location.x-2, this.p.ego.location.x+13, 20);
			break;
		case 'crates':
			this.ef.throwCrates(this.p, this.p.ego.location.x-2, this.p.ego.location.x+13, 5);
			break;
		case 'fireGun':
			this.p.fe.tryShot(this.p.ego, this.p);
			this.p.viewport.play('gutling_shot');
			break;
		}		
	},

	checkEgoState: function() {
		if (this.p.ego.state.chargeGun && this.p.ego.gun.autofire) {
			if (this.p.ego.gun.charge > this.p.ego.gun.maxCharge) {
				this.applyEvent(null, 'fireGun');
			} else {
				this.p.ego.gun.incCharge();
			}
		}
	}
});

module.exports = InteractionApplier;