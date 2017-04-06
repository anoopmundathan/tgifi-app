'use strict';

var request = require('request');
var giphy = require('../../config').giphy;

function Giphy() {
	this.apiUrl = giphy.apiUrl;
	this.apiKey = giphy.apiKey;
}

Giphy.prototype.searchGiphy = function(param, callback) {
	var path = '/gifs/search?q=' + param + '&api_key=' + this.apiKey;
	var url = this.apiUrl + path;
	this.doRequest(url, callback);
}

Giphy.prototype.doRequest = function(url, callback) {
	request(url, function(error, response, body) {

		if (response) {
			if (response.statusCode === 200) {
				return callback(body);	
			}  else {
				return callback(null);
			}
		} else {
			return callback(null);
		}

	});
}

exports.Giphy = Giphy;