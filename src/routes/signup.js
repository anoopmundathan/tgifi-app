'use strict';

var express = require('express');
var router = express.Router();

// GET /login
router.get('/', function(req, res, next) {
	res.render('signup');
});

// POST /login
router.post('/', function(req, res, next) {
	res.send('signup posted');
});

module.exports = router;

