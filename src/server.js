'use express';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var User = require('./models/user');
var expressJwt = require('express-jwt');

var dbUrl = require('../config/config').dbUrl;
var secretSession = require('../config/config').secretSession;
var secretJwt = require('../config/config').secretJwt;
var fbConfig = require('../config/config').facebook;
var ghConfig = require('../config/config').github;

var app = express();

function generateOrFindUser(accessToken, refreshToken, profile, done) {
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

// sets port, host, and callback_url either with heroku constants or locally
var PORT = process.env.PORT || 3000;
var HOST = process.env.PROD_HOST || 'http://localhost:' + PORT;

// Passport middleware - Config GitHub Strategy
passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID || ghConfig.clientID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET || ghConfig.clientSecret,
	callbackURL: HOST + '/auth/github/return'
}, generateOrFindUser));

// Configure Facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || fbConfig.clientID,
    clientSecret: process.env.FACEBOOK_APP_SECRET || fbConfig.clientSecret,
    callbackURL: HOST + '/auth/facebook/return',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, generateOrFindUser));

// In order to use session for passport
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(value, done) {
  User.findById(value, function(err, user) {
    done(err, user);
  });
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database
mongoose.connect(process.env.MONGODB_URI || dbUrl);
var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Error connecting to the database', err);
});

db.once('open', function() {
	console.log('Succesfully connected to the database');
});

// Session config for Passport and MongoDB
var sessionOptions = {
	secret: process.env.SECRET_SESSION || secretSession,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: db
	})
}

app.use(session(sessionOptions));

// Initialise passport
app.use(passport.initialize());

//Restore session
app.use(passport.session());

app.use('/api', expressJwt({ secret: process.env.SECRET_JWT || secretJwt }).
	unless({ path: ['/api/authenticate', '/api/register'] }));
app.use('/auth', require('./routes/auth'));
app.use('/app', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/api', require('./routes/api/index.js'));

app.get('/', function(req, res, next) {
	return res.redirect('/app');
});

app.get('/logout', function(req, res, next) {

	// Set client side cookie to null	
	res.clearCookie('token');
	res.clearCookie('user');

	// Delete session 
	delete req.session.token;
	delete req.session.user;

	req.logout();

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

app.listen(PORT, function() {
	console.log('Server running at port ', PORT);
});
