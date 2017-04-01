'use strict';

var angular = require('angular');

var app = angular.module('app', [require('angular-cookies'), require('angular-route')]);

app.constant('API_URL', 'http://localhost:3000');

app.config(function($routeProvider, $httpProvider, $locationProvider) {
	
	$httpProvider.interceptors.push('AuthInterceptor');
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

app.run(function($rootScope, MainFactory, StorageFactory) {
	$rootScope.randomGifis = [];

	MainFactory.getValueFromServer()
	.then(function(data) {
		StorageFactory.setValue('token', data.data.token);
		StorageFactory.setValue('user', data.data.user);
	});
});


app.controller('MainController', function($cookies, MainFactory, $rootScope, StorageFactory) {
	var vm = this;
	
	vm.user = $cookies.get('username');
	vm.logOut = logOut;
	vm.deleteGifi = deleteGifi;

	vm.user = StorageFactory.getValue('user');
	
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
		getValueFromServer: getValueFromServer
	}

	function getValueFromServer() {
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

app.factory('StorageFactory', function($window) {

	var store = $window.localStorage;

	return {
		getValue: getValue,
		setValue: setValue
	}

	function getValue(key) {
		return store.getItem(key);
	}

	function setValue(key, value) {
		store.setItem(key, value);
	}
});


app.factory('AuthInterceptor', function(StorageFactory) {
	return {
		request: addValue
	}

	function addValue(config) {
		var token = StorageFactory.getValue('token');

		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = 'Bearer ' + token;
		}
		return config;
	}
});
