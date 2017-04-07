'use strict';

var request = require('request');
var giphy = require('../../config/config').giphy;

function Giphy() {
	this.apiUrl = process.env.GIPHY_API_URL || giphy.apiUrl;
	this.apiKey = process.env.GIPHY_API_KEY || giphy.apiKey;
}

Giphy.prototype.searchGiphy = function(param, callback) {
	var path = '/gifs/search?q=' + param + '&api_key=' + this.apiKey + '&limit=9';
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