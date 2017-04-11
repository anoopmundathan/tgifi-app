'use strict';

function AuthInterceptor($cookies) {
	return {
		request: addValue
	}

	function addValue(config) {
		var token = $cookies.get('token');

		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = 'Bearer ' + token;
		}
		return config;
	}
}

module.exports = AuthInterceptor;