'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

var jwt = require('jsonwebtoken');
var secret = require('../../config').secret;

router.get('/', function(req, res) {
	res.send('auth page');
});

// GET /auth/login/facebook
router.get('/login/facebook', passport.authenticate('facebook', { scope: ["email"]}));

// GET /auth/facebook/return
router.get('/facebook/return', 
	passport.authenticate('facebook', { failureRedirect: '/' }),
	function(req, res, next) {

		// Save token
		req.session.token = jwt.sign(req.user, secret);
		req.session.user  = req.user

		return res.redirect('/');
});


// GET /auth/login/github
router.get('/login/github', passport.authenticate('github'));


// GET /auth/github/return
router.get('/github/return', passport.authenticate('github', {failureRedirect: '/'}),
	function(req, res) {

		// Save token
		req.session.token = jwt.sign(req.user, secret);
		req.session.user  = req.user

		return res.redirect('/');
	});

module.exports = router;