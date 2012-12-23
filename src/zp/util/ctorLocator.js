var	container = {
		Flyer: require('../entity/Flyer')
	};

function ctorLocator(name) {
	if (container[name]) {
		return container[name];
	}
	return false;
}

module.exports = ctorLocator;