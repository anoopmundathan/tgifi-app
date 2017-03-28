'use strict';

var angular = require('angular');

var app = angular.module('app', [require('angular-cookies'), require('angular-route')]);

app.constant('API_URL', 'http://localhost:3000');

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');

	$routeProvider
		.when('/', {
			controller: 'MainController',
			controllerAs: 'vm',
			templateUrl: 'templates/gifis.html'
		})
		.when('/random', {
			controller: 'RandomGifiController',
			controllerAs: 'vm',
			templateUrl: 'templates/random.html'
		});
});

app.controller('MainController', function($cookies, MainFactory) {
	var vm = this;
	
	vm.user = $cookies.get('username');
	vm.logOut = logOut;
	vm.showUrl = showUrl;
	vm.deleteGifi = deleteGifi;
	
	// Load Saved Gifis
	MainFactory.loadMySavedGifis()
	.then(function success(response) {
		vm.myGifis = response.data;
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

	
});

app.controller('RandomGifiController', function(MainFactory) {

	var vm = this;
	
	MainFactory.loadRandomGifis()
		.then(function success(response) {
			console.log(response);
			vm.randomGifis = response.data;
	});

});

app.factory('MainFactory', function($http, API_URL) {
	return {
		loadRandomGifis: loadRandomGifis,
		saveGifi: saveGifi,
		deleteGifi: deleteGifi,
		loadMySavedGifis: loadMySavedGifis
	}

	function loadRandomGifis() {
		return $http.get(API_URL + '/api/trends');
	}

	function saveGifi(url) {
		return $http.post(API_URL + '/api/gifis', {url: url});
	}

	function loadMySavedGifis() {
		return $http.get(API_URL + '/api/gifis');
	}

	function deleteGifi(url) {
		return $http.delete(API_URL + '/api/gifis?url=' + url );
	}
});

