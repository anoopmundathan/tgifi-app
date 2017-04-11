'use strict';

function MainFactory($http) {
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
}

module.exports = MainFactory;