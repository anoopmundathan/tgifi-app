'use strict';

var angular = require('angular');

var app = angular.module('app');

app.controller('MyController', require('./my-gifis'));
app.controller('RandomGifiController', require('./random'));

