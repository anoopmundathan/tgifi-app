'use strict';

var angular = require('angular');

var app = angular.module('app', [
	require('angular-cookies'), 
	require('angular-route')
]).run(function($rootScope) {
	$rootScope.randomGifis = [];
});

require('./init');
require('./controllers');
require('./services');








