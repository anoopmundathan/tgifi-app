'use strict';

module.exports.getHost = function() {

	var PORT = process.env.PORT || 3000;
	var HOST = process.env.PROD_HOST || 'http://localhost:' + PORT;

	return HOST;
}