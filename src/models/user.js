'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Reference Schema
var Schema = mongoose.Schema;

// Create Schema
var userSchema = new Schema({
	userName: {
		type: String,
		required: [true, 'User Name is required']
	},
	email: {
		type: String,
		required: [true, 'Email is required']
	},
	password: {
		type: String,
		required: [true, 'Password is required']
	},
	photo: String,
	gif: [String]
});

// Hash password before saving
userSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

// Create Model
var User = mongoose.model('User', userSchema);

module.exports = User;
