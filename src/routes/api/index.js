'use strict';

var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var auth = require('basic-auth');

var router = express.Router();

var User = require('../../models/user');
var twitter = require('../../controllers/twitter');
var secretJwt = require('../../../config/config').secretJwt;
var secret = process.env.SECRET_JWT || secretJwt;

router.get('/trends', loadTrends);
router.get('/gifis', getGifis);
router.post('/gifis', saveGifi);
router.delete('/gifis', deleteGifi);
router.post('/authenticate', authenticateUser);
router.post('/register', registerNewUser);

function getGifis(req, res, next) {


	User.findOne({
		userName: req.user
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
		userName: req.user
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
		userName: req.user
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

/**
 * Authenticate user
 */
function authenticateUser(req, res, next) {

	var userName = req.body.username;
	var password = req.body.password;

	authenticate(userName, password)
		.then(function(token) {
			return res.json({ token: token });
		})
		.catch(function(err) {
			return res.status(401).send(err);
		});
}

/**
 * User authentication 
 * @param {Number} userName
 * @param {Number} password
 * @returns {Promise Object}
 */
function authenticate(userName, password) {

	return new Promise(function(resolve, reject) {
		
		User.findOne({ 
			userName: userName 
		})
		.exec(function(err, user) {

			if (err) return reject(err);

			if (!user) {
				return reject('User or Password is not correct');
			}

			bcrypt.compare(password, user.password, function(err, response) {
				if (err) return reject(err);

				if (response) {
					// Create token and send that token
					return resolve(jwt.sign(user._id, secret));
				} else {
					return reject('User Name or Password is not correct');
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
		if (err) {
			return res.json({ message: err });
		} else {
			return res.json({ message: "Registered" });	
		}
	});
}

module.exports = router;