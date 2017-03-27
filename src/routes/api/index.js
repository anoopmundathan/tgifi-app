'use strict';

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var User = require('../../models/user');
var twitter = require('../../controllers/twitter');

router.get('/trends', loadTrends);

router.get('/gifis', getGifis);
router.post('/gifis', saveGifi);
router.delete('/gifis', deleteGifi);

router.post('/authenticate', authenticateUser);
router.post('/register', registerNewUser);

function getGifis(req, res, next) {
	User.findOne({
		userName: req.cookies.username
	})
	.exec(function(err, user) {
		if (err) return next(err);

		if (user) {
			res.json(user.gif)
		} else {
			res.json(user);
		}

		
	});
}

function saveGifi(req, res, next) {
	User.findOne({ 
		userName: req.cookies.username
	})
	.exec(function(err, user) {
		if (err) return next(err);
		
		user.update({ $push: { gif: req.body.url} }, function(err, user) {
			if (err) return next(err);
			res.send(user);
		});
		
	});
}

function deleteGifi(req, res, next) {
	
	User.findOne({
		userName: req.cookies.username
	})
	.exec(function(err, user) {
		if (err) return next(err);
		
		user.update({
			$pull: {
				gif: req.query.url
			}
		}, function(err, user) {
			if (err) return next(err);
			res.send(user);
		})
	});
}

function loadTrends(req, res, next) {
	
	twitter.loadTrends(function(data) {
		res.json(data);
	});
}

function authenticateUser(req, res, next) {
	var userName = req.body.username;
	var password = req.body.password;

	User.findOne({ 
		userName: userName
	})
	.exec(function(err, user) {
		if (err) return next(err);

		if (!user) {
			return res.status(401).send('Username or password is incorrect');
		}

		bcrypt.compare(password, user.password, function(err, response) {
			if (err) return next(err);

			if (response === true) {
				res.json({
					user: user
				});	
			} else {
				return res.status(401).send('Password is not correct mate');
			}
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
		res.json({
			message: "Registered"
		});
	});
}

module.exports = router;