'use strict';

var TwitterJSClient = require('twitter-js-client').Twitter;
var Giphy = require('./giphy').Giphy;


var config = require('../../twitter.json');

// Sub class of TwitterJSClient
function Twitter(config) {
	TwitterJSClient.call(this, config);
}

Twitter.prototype = Object.create(TwitterJSClient.prototype);

Twitter.prototype.getTrendLocations = function(error, success) {
	var path = '/trends/available.json';
	var url = this.baseUrl + path;
	this.doRequest(url, error, success)
}

Twitter.prototype.getTrends = function(error, success) {
	var path = '/trends/place.json?id=23424977';
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}

var twitter = new Twitter(config);

function loadTrends(callback) {

	var error = function (err, response, body) {
    	console.log('ERROR [%s]', JSON.stringify(err));
	};
	
	var success = function (data) {
		var data = JSON.parse(data);

		var gifiArray = [];
		var itemProcessed = 0;

		data[0].trends.forEach(function(item, index, array) {
			var query = item.name.split('#').join('');

			giphy.searchGiphy(query, function(data) {
				itemProcessed++;
				
				if (data) gifiArray.push(JSON.parse(data));
				if (itemProcessed === array.length) {
					callback(gifiArray);
				}
			});
		})
	};

	
	// twitter.getTrendLocations(error, success);
	twitter.getTrends(error, success);

	var giphy = new Giphy();
	
}

module.exports.loadTrends = loadTrends;