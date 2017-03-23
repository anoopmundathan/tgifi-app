'use strict';

var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.post('/authenticate', authenticateUser);
router.post('/register', registerNewUser);

function authenticateUser(req, res, next) {
	var userName = req.body.username;
	var password = req.body.password;


	User.findOne({ 
		userName: userName,
		password: password
	})
	.exec(function(err, user) {
		if (err) return next(err);

		if (!user) {
			return res.status(401).send('Username or password is incorrect');
		}
		res.json({
			user: user
		});
	});
}

function registerNewUser(req, res, next) {
	var userName = req.body.username;
	var email = req.body.email;
	var password = req.body.password;

	var user = new User({
		userName: userName,
		email: email,
		password: password
	});

	user.save(function(err) {
		if (err) return next(err);
		return res.json({
			message: 'Registered'
		});	
	});

	
}

module.exports = router;