'use strict';

var angular = require('angular');

var app = angular.module('app', [require('angular-cookies')]);

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainController', function($cookies, MainFactory) {
	var vm = this;
	vm.user = $cookies.get('username');

	vm.logOut = logOut;
	vm.loadHashTags = loadHashTags;

	function logOut() {
		alert('logout');
	}

	function loadHashTags() {
		MainFactory.loadHashTags()
			.then(function success(response) {
				vm.hashtags = response.data;
			});
	}
});

app.factory('MainFactory', function($http, API_URL) {
	return {
		loadHashTags: loadHashTags
	}

	function loadHashTags() {
		return $http.get(API_URL + '/api/hashtags');
	}

});

