if (typeof module !== 'undefined') {
	module.exports.register = function (Handlebars) {
		Handlebars.registerHelper('ifCond', function (v1, v2, options) {
			if (v1 === v2) {
				return options.fn(this);
			}
			return options.inverse(this);
		});
		Handlebars.registerHelper('slugify', function (str) {
			if (!str || typeof str === 'undefined' || str === '') {
				return '';
			}
			str = str.toLowerCase();
			str = str.replace(/[^a-zA-Z0-9]+/g, '-');
			return str;
		});
	}
}