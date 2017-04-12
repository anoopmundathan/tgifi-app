'use strict';

var User = require('../models/user');

module.exports = function generateOrFindUser(accessToken, refreshToken, profile, done) {
	if (profile.emails) {
		User.findOneAndUpdate({
			email: profile.emails[0].value
		}, {
			userName: profile.username || profile.displayName,
			email: profile.emails[0].value,
			photo: profile.photos[0].value
		}, {
			upsert: true
		}, done);
	} else {
		var noEmailError = new Error('Your email privacy settings prevent you from login to tgifi');
		done(noEmailError, null);
	}
}