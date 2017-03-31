'use strict';

var angular = require('angular');

var app = angular.module('app', [require('angular-cookies'), require('angular-route')]);

app.run(function($rootScope, MainFactory, TokenFactory) {
	$rootScope.randomGifis = [];

	MainFactory.getTokenFromServer()
	.then(function(token) {
		TokenFactory.setToken(token.data);
	});

});

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

app.controller('MainController', function($cookies, MainFactory, $rootScope) {
	var vm = this;
	
	vm.user = $cookies.get('username');
	vm.logOut = logOut;
	vm.deleteGifi = deleteGifi;
	
	// Load Saved Gifis
	MainFactory.loadMySavedGifis()
	.then(function success(response) {
		vm.myGifis = response.data;
	});	

	// Load random Gifis
	MainFactory.loadRandomGifis()
		.then(function success(response) {
			$rootScope.randomGifis = response.data;
	});

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

app.controller('RandomGifiController', function(MainFactory, $rootScope) {
	var vm = this;

	vm.randomGifis = $rootScope.randomGifis;
	vm.saveThisGifi = saveThisGifi;

	if ($rootScope.randomGifis.length < 1) {
		MainFactory.loadRandomGifis()
			.then(function success(response) {
				vm.randomGifis = response.data;
				$rootScope.randomGifis = vm.randomGifis;
		});
	}

	function saveThisGifi(url) {
		MainFactory.saveThisGifi(url)
			.then(function success(response) {
		});
	}
});

app.factory('MainFactory', function($http, API_URL) {
	return {
		loadRandomGifis: loadRandomGifis,
		saveThisGifi: saveThisGifi,
		deleteGifi: deleteGifi,
		loadMySavedGifis: loadMySavedGifis,
		getTokenFromServer: getTokenFromServer
	}

	function getTokenFromServer() {
		return $http.get(API_URL + '/app/token');
	}

	function loadRandomGifis() {
		return $http.get(API_URL + '/api/trends');
	}

	function saveThisGifi(url) {
		return $http.post(API_URL + '/api/gifis', {url: url});
	}

	function loadMySavedGifis() {
		return $http.get(API_URL + '/api/gifis');
	}

	function deleteGifi(url) {
		return $http.delete(API_URL + '/api/gifis?url=' + url );
	}
});

app.factory('TokenFactory', function($window) {

	var store = $window.localStorage;
	var key = 'auth-token';

	return {
		getToken: getToken,
		setToken: setToken
	}

	function getToken() {
		return store.getItem(key);
	}

	function setToken(token) {
		if (token) {
			store.setItem(key, token);
		} else {
			store.removeItem();
		}
	}
});
