'use strict';

var express = require('express');
var request = require('request');
var config = require('../../config');
var router = express.Router();

// GET /login
router.get('/', function(req, res, next) {
	
	// Logout route
	delete req.session.token;
	delete req.session.user;

	res.render('login');
});

// POST /login
router.post('/', function(req, res, next) {

	// authenticate using api to maintain clean separation between layers
	if (req.body.username && req.body.password) {

		request.post({
			url: config.apiUrl + '/authenticate',
			form: req.body,
			json: true
		}, function(err, response, body) {

			if (err) {
            	return res.render('login', { error: 'An error occurred' });
        	}
			
			if (response.statusCode !== 200) {
				return res.render('login', { error: body });
			}

			// save token in session
			req.session.token = body.token;
			req.session.user  = req.body.username;

			return res.redirect('/');
		});
	} else {
		var error = 'Must have username and password';
		res.render('login', { error: error });
	}

});

module.exports = router;

