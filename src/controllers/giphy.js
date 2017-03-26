'use strict';

var request = require('request');

function Giphy() {
	this.apiUrl = 'http://api.giphy.com/v1';
	this.apiKey = 'dc6zaTOxFJmzC';
}

Giphy.prototype.searchGiphy = function(param, callback) {
	var path = '/gifs/search?q=' + param + '&api_key=' + this.apiKey;
	var url = this.apiUrl + path;
	this.doRequest(url, callback);
}

Giphy.prototype.doRequest = function(url, callback) {
	request(url, function(error, response, body) {

		if (response.statusCode === 200) {
			callback(body);	
		}  else {
			callback();
		}

	});
}

exports.Giphy = Giphy;