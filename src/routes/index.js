'use strict';

var express = require('express');
var path = require('path');

var router = express.Router();

// Middleware function that checks all request if authenticated or not
router.use('/', function(req, res, next) {
	if (!req.session.token) {
		return res.redirect('/login');
	}
	next();
});

// serve app once authenticated
router.use('/', function(req, res, next) {
	res.cookie('token', req.session.token);
	res.cookie('user', req.session.user);
	next();
},
	express.static(path.join(__dirname, '..', '..', 'public')));

module.exports = router;
