'use strict';

function RandomGifiController(mainFactory, $rootScope) {
	var vm = this;

	vm.randomGifis = [];
	vm.saveThisGifi = saveThisGifi;

	if ($rootScope.randomGifis.length < 1) {
		mainFactory.loadRandomGifis()
		.then(function success(response) {
			vm.randomGifis = response.data;
			$rootScope.randomGifis = response.data;
		});
	} else {
		vm.randomGifis = $rootScope.randomGifis;
	}
	
	function saveThisGifi(url) {
		mainFactory.saveThisGifi(url)
			.then(function success(response) {
		});
	}
}

module.exports = RandomGifiController;