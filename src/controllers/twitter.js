'use strict';

var TwitterJSClient = require('twitter-js-client').Twitter;
var twitterConfig = require('../../config').twitter;
var Giphy = require('./giphy').Giphy;

// Sub class of TwitterJSClient
function Twitter(twitterConfig) {
	TwitterJSClient.call(this, twitterConfig);
}

Twitter.prototype = Object.create(TwitterJSClient.prototype);

Twitter.prototype.getTrends = function(error, success) {
	var path = '/trends/place.json?id=23424977';
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}

var twitter = new Twitter(twitterConfig);

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
				
				var data = JSON.parse(data);
				data.query = query;
				if (data.data.length > 0 && data) gifiArray.push(data);
				if (itemProcessed === array.length) {
					callback(gifiArray);
				}
			});
		})
	};

	twitter.getTrends(error, success);

	var giphy = new Giphy();
	
}

module.exports.loadTrends = loadTrends;