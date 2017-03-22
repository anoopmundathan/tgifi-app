'use strict';

module.exports.authenticate = function(req, res, next) {

	var user = {
		username: "anoop",
		password: "p"
	}	

	var username = req.body.username;
	var password = req.body.password;
	var error;

	if (!username || !password) {
		error = 'Must have username or password';
		res.render('login', {error: error});
	}
	else if (username !== user.username || password !== user.password) {
		error = 'User Name or Password is wrong';
		res.render('login', {error: error});
	} else {
		return next();
	}

}