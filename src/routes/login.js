'use strict';

var express = require('express');
var request = require('request');
var config = require('../../config');
var router = express.Router();

// GET /login
router.get('/', function(req, res, next) {
	res.render('login');
});

// POST /login
router.post('/', function(req, res, next) {

	request.post({
		url: config.apiUrl + 'authenticate',
		form: req.body,
		json: true
	}, function(err, response, body) {
		if (err) return next(err);
		res.cookie('token', 'anoopmundathan');
		return res.redirect('/');
	});

});

module.exports = router;

