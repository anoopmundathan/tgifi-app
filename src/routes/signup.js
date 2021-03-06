'use strict';

var express = require('express');
var request = require('request');

var router = express.Router();

var PORT = process.env.PORT || 3000;
var HOST = process.env.PROD_HOST || 'http://localhost:' + PORT;
var API_URL = HOST + '/api/register';

// GET /signup
router.get('/', function(req, res, next) {
	res.render('signup');
});

// POST /signup
router.post('/', function(req, res, next) {
	
	var userName = req.body.username;
	var email =  req.body.email;
	var password = req.body.password;
	var confirmPassword = req.body.confirmpassword;

	if (userName && email && password) {
		if (password === confirmPassword) {
			request.post({
				url: API_URL,
				form: req.body,
				json: true
			}, function(err, response, body) {
				if (err) return next(err);
				return res.redirect('/');
			});
		} else {
			return res.render('signup' , { error: 'Passwords do not match'} );
		}
	} else {
		return res.render('signup' , { error: 'Must enter all values'} );
	}
});

module.exports = router;

