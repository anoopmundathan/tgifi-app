'use strict';

var angular = require('angular');

var app = angular.module('app', [require('angular-cookies'), require('angular-route')]);

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

app.run(function($rootScope) {
	$rootScope.randomGifis = [];
});


app.controller('MainController', function(MainFactory, $rootScope, $cookies) {
	var vm = this;
	
	vm.logOut = logOut;
	vm.deleteGifi = deleteGifi;
	vm.user = $cookies.get('user');
	
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
		var index = vm.myGifis.indexOf(url);
		if (index > -1) vm.myGifis.splice(index, 1);
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

app.factory('MainFactory', function($http) {
	return {
		loadRandomGifis: loadRandomGifis,
		saveThisGifi: saveThisGifi,
		deleteGifi: deleteGifi,
		loadMySavedGifis: loadMySavedGifis
	}


	function loadRandomGifis() {
		return $http.get('/api/trends');
	}

	function saveThisGifi(url) {
		return $http.post('/api/gifis', {url: url});
	}

	function loadMySavedGifis() {
		return $http.get('/api/gifis');
	}

	function deleteGifi(url) {
		return $http.delete('/api/gifis?url=' + url );
	}
});

app.factory('AuthInterceptor', function($cookies) {
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
});
