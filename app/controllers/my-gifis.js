'use strict';

function MyController(mainFactory, $cookies) {

	var vm = this;
	
	vm.logOut = logOut;
	vm.deleteGifi = deleteGifi;
	vm.user = $cookies.get('user');
	
	// Load Saved Gifis
	mainFactory.loadMySavedGifis()
	.then(function success(response) {
		vm.myGifis = response.data;
	});	

	function deleteGifi(url) {
		var index = vm.myGifis.indexOf(url);
		if (index > -1) vm.myGifis.splice(index, 1);
		mainFactory.deleteGifi(url)
			.then(function success(response) {
		});
	}

	function logOut() {
		alert('logout');
	}
}

module.exports = MyController;