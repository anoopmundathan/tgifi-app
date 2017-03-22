'use strict';

var express = require('express');
var router = express.Router();

router.post('/authenticate', authenticate);

function authenticate(req, res) {

	// Need to do database validation
	res.json({
		message: 'posted'
	});
}

module.exports = router;