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

	authenticate(userName, password)
		.then(function(user) {
			console.log(user)
			return res.json({
				user: user
			});
		})
		.catch(function(err) {
			console.log(err);
			return res.status(401).send(err);
		});
}

// Authenticate user and return Promise
function authenticate(userName, password) {

	return new Promise(function(resolve, reject) {
		
		User.findOne({ 
			userName: userName 
		})
		.exec(function(err, user) {

			if (err) reject(err);

			if (!user) {
				reject({error: 'User is not Found'});
			}

			bcrypt.compare(password, user.password, function(err, response) {
				if (err) reject(err);

				if (response) {
					resolve(user);
				} else {
					reject({error: 'User or Password is not correct'});
				}
			});	
		}); // end of User.findOne
	}); // end of authPromise
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