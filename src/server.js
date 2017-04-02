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
var secretJwt = require('../config').secret;


function generateOrFindUser(accessToken, refreshToken, profile, done) {
	console.log('generateOrFindUser');
    User.findOneAndUpdate({
      email: profile.repos_url,
    }, {
      userName: profile.displayName,
      email: profile.repos_url
    }, {
      upsert: true
    }, 
    done);
}

// Passport middleware - Config GitHub Strategy
passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/github/return"
}, function(accessToken, refreshToken, profile, done) {
	User.findOneAndUpdate({
		userName: profile.username
	}, {
		userName: profile.username
	}, {
		upsert: true
	}, done);
}));

// Configure Facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/return",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, generateOrFindUser));


// In order to use session for passport
passport.serializeUser(function(user, done) {
	console.log('serializeUser');
  done(null, user._id);
});

passport.deserializeUser(function(value, done) {
  console.log('deserializeUser');
  User.findById(value, function(err, user) {
    done(err, user);
  });
});

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tgifi');
var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Error connecting to the database', err);
});

db.once('open', function() {
	console.log('Succesfully connected to the database');
});

// Session config for Passport and MongoDB
var sessionOptions = {
	secret: 'my #secret $goes %here',
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

app.use('/api', expressJwt({ secret: secretJwt }).unless({ path: ['/api/authenticate', '/api/register'] }));
app.use('/auth', require('./routes/auth'));
app.use('/app', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/api', require('./routes/api/index.js'));

app.get('/', function(req, res, next) {
	return res.redirect('/app');
});

app.get('/logout', function(req, res, next) {

	// Logout route
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

app.set('PORT', process.env.PORT || 3000);
app.listen(app.get('PORT'), function() {
	console.log('Server running at port ', app.get('PORT'));
});