'use strict';

var angular = require('angular');

var app = angular.module('app');

app.service('mainFactory', require('./factory'));
app.service('authInterceptor', require('./http-interceptor'));

