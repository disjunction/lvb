var	container = {
		Flier: require('../entity/Flier')
	};

function ctorLocator(name) {
	if (container[name]) {
		return container[name];
	}
	return false;
}

module.exports = ctorLocator;