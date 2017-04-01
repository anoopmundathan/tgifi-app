'use express';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');

var secretJwt = require('../config').secret;

var dbUrl = 'mongodb://localhost/tigifi' || process.env.MONGODB_URL;

mongoose.connect(dbUrl);

var app = express();

app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', expressJwt({ secret: secretJwt }).unless({ path: ['/api/authenticate', '/api/register'] }));

app.use(session({ secret: 'kjh23432we@##@df', resave: true, saveUninitialized: false }));

app.use('/app', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/api', require('./routes/api/index.js'));

app.get('/', function(req, res, next) {
	return res.redirect('/app');
});

app.get('/logout', function(req, res, next) {
	return res.redirect('/login');
});

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