'use strict';

var express = require('express');
var request = require('request');

var router = express.Router();
var config = require('../../config');

// GET /signup
router.get('/', function(req, res, next) {
	res.render('signup');
});

// POST /signup
router.post('/', function(req, res, next) {
	
	var userName = req.body.username;
	var email =  req.body.email;
	var password = req.body.password;

	if (userName && email && password) {

		request.post({
			url: config.apiUrl + '/register',
			form: req.body,
			json: true
		}, function(err, response, body) {
			if (err) return next(err);
			return res.redirect('/');
		});
	} else {
		return res.render('signup' , { error: 'Must enter all values'} );
	}

});

module.exports = router;

