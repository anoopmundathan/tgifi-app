'use express';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', require('./routes/index'));

app.use(function(req, res, next) {
	var err = new Error('Resource not found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		error: err.message
	});
});

app.set('PORT', process.env.PORT || 3000);
app.listen(app.get('PORT'), function() {
	console.log('Server running at port ', app.get('PORT'));
});