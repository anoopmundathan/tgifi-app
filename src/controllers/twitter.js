'use strict';

var TwitterJSClient = require('twitter-js-client').Twitter;
var config = require('../../twitter.json');

// Sub class of TwitterJSClient
function Twitter(config) {
	TwitterJSClient.call(this, config);
}

Twitter.prototype = Object.create(TwitterJSClient.prototype);

Twitter.prototype.getTrends = function(error, success) {
	// var path = '/trends/available.json';
	var path = '/trends/place.json?id=12903';
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}

var twitter = new Twitter(config);

function loadTrends(callback) {

	var error = function (err, response, body) {
    	console.log('ERROR [%s]', JSON.stringify(err));
	};
	
	var success = function (data) {
    	callback(data);
	};

	twitter.getTrends(error, success);
}

module.exports.loadTrends = loadTrends;