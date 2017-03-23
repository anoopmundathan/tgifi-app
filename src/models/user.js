'use strict';

var mongoose = require('mongoose');

// Reference Schema
var Schema = mongoose.Schema;

// Create Schema
var userSchema = new Schema({
	userName: String,
	email: String,
	password: String
});

// Create Model
var User = mongoose.model('User', userSchema);

module.exports = User;
