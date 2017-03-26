'use strict';

var angular = require('angular');

var app = angular.module('app', [require('angular-cookies')]);

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainController', function($cookies, MainFactory) {
	var vm = this;
	vm.user = $cookies.get('username');

	vm.logOut = logOut;
	vm.loadTrends = loadTrends;
	vm.showUrl = showUrl;

	MainFactory.getGifi()
		.then(function success(response) {
			vm.gifi = response.data;
		});

	function showUrl(url) {
		MainFactory.saveGifi(url)
			.then(function success(response) {
				console.log(response);
			});
	}

	function logOut() {
		alert('logout');
	}

	function loadTrends() {
		MainFactory.loadTrends()
			.then(function success(response) {
				console.log(response);
				vm.gifis = response.data;
			});
	}
});

app.factory('MainFactory', function($http, API_URL) {
	return {
		loadTrends: loadTrends,
		saveGifi: saveGifi,
		getGifi: getGifi
	}

	function loadTrends() {
		return $http.get(API_URL + '/api/trends');
	}

	function saveGifi(url) {
		return $http.post(API_URL + '/api/save', {url: url});
	}

	function getGifi() {
		return $http.get(API_URL + '/api/gifs');
	}
});

