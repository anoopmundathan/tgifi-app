'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.redirect('/login');
});

// GET /login
router.get('/login', function(req, res, next) {
	res.render('login');
});

// POST /login
router.post('/login', function(req, res, next) {
	res.json({
		username: req.body.username,
		password: req.body.password
	});
});

// GET /signup
router.get('/signup', function(req, res, next) {
	res.render('signup');
});

// POST /signup
router.post('/signup', function(req, res, next) {
	res.json({
		fullname: req.body.fullname,
		email: req.body.email,
		password: req.body.password
	});
})

module.exports = router;
