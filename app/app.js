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
				var s = JSON.stringify(response.data);
				vm.g = JSON.parse(s[0]);
				
				// console.log(response.data.data[0].images.downsized.url);
				// vm.trends = response.data[0].trends;
				// vm.gifis = response.data.data;
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

