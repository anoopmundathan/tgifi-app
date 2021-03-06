'use strict';

var express = require('express');
var request = require('request');

var router = express.Router();

var PORT = process.env.PORT || 3000;
var HOST = process.env.PROD_HOST || 'http://localhost:' + PORT;
var API_URL = HOST + '/api/authenticate';

// GET /login
router.get('/', function(req, res, next) {
	
	// Set client side cookie to null	
	res.clearCookie('token');
	res.clearCookie('user');

	// Delete session 
	delete req.session.token;
	delete req.session.user;

	req.logout();
	
	res.render('login');
});

// POST /login
router.post('/', function(req, res, next) {

	// authenticate using api to maintain clean separation between layers
	if (req.body.username && req.body.password) {

		request.post({
			url: API_URL,
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

