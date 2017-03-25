'use strict';

var angular = require('angular');

var app = angular.module('app', [require('angular-cookies')]);

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainController', function($cookies, MainFactory) {
	var vm = this;
	vm.user = $cookies.get('username');

	vm.logOut = logOut;
	vm.loadTrends = loadTrends;

	function logOut() {
		alert('logout');
	}

	function loadTrends() {
		MainFactory.loadTrends()
			.then(function success(response) {
				vm.trends = response.data[0].trends;
			});
	}
});

app.factory('MainFactory', function($http, API_URL) {
	return {
		loadTrends: loadTrends
	}

	function loadTrends() {
		return $http.get(API_URL + '/api/trends');
	}

});

