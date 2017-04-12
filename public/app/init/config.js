'use strict';


function config($routeProvider, $httpProvider, $locationProvider) {
	
	$httpProvider.interceptors.push('authInterceptor');

	$locationProvider.hashPrefix('');

	$routeProvider
		.when('/', {
			controller: 'RandomGifiController',
			controllerAs: 'vm',
			templateUrl: 'templates/random.html'
		})
		.when('/my', {
			controller: 'MyController',
			controllerAs: 'vm',
			templateUrl: 'templates/my-gifis.html'
		});
}

module.exports = config;