'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = require('../../config/config').secret;

router.get('/', function(req, res) {
	res.send('auth page');
});


function saveToSession(req, res, next) {
	req.session.token = jwt.sign(req.user._id, secret);
	req.session.user  = req.user.userName
	return res.redirect('/');
}

// GET /auth/login/facebook
router.get('/login/facebook', passport.authenticate('facebook', { scope: ["email"]}));
router.get('/facebook/return', passport.authenticate('facebook', { failureRedirect: '/' }), 
	function(req, res, next) {
		saveToSession(req, res, next);
	});
	

// GET /auth/login/github
router.get('/login/github', passport.authenticate('github'));
router.get('/github/return', passport.authenticate('github', {failureRedirect: '/'}), 
	function(req, res, next) {
		saveToSession(req, res, next);
	});
	
module.exports = router;