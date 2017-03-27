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
	vm.deleteGifi = deleteGifi;

	MainFactory.getGifis()
		.then(function success(response) {
			vm.gifi = response.data;
		});

	function showUrl(url) {
		MainFactory.saveGifi(url)
			.then(function success(response) {
				console.log(response);
			});
	}

	function deleteGifi(url) {
		MainFactory.deleteGifi(url)
			.then(function success(response) {
				console.log('deleted');
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
		deleteGifi: deleteGifi,
		getGifis: getGifis
	}

	function loadTrends() {
		return $http.get(API_URL + '/api/trends');
	}

	function saveGifi(url) {
		return $http.post(API_URL + '/api/gifis', {url: url});
	}

	function getGifis() {
		return $http.get(API_URL + '/api/gifis');
	}

	function deleteGifi(url) {
		return $http.delete(API_URL + '/api/gifis?url=' + url );
		// return $http.delete(API_URL + '/api/gifis' );
	}
});

