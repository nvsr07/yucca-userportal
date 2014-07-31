'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('userportal', [
  'ngRoute',
  'ngSanitize',
  'userportal.config',
  'userportal.filters',
  'userportal.services',
  'userportal.directives',
  'userportal.controllers',
  'pascalprecht.translate',
  'ui.bootstrap',
  'ngPrettyJson',
  'nvd3ChartDirectives',
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard/index.html', controller: 'DashboardCtrl', activetab: 'dashboard'});
  $routeProvider.when("/dashboard/stream/:id_stream", {templateUrl: "partials/dashboard/stream.html", controller: "DashboardStreamCtrl"});
  $routeProvider.when("/dashboard/error_log", {templateUrl: "partials/dashboard/error-log.html", controller: "DashboardStreamCtrl"});
  $routeProvider.when('/management', {templateUrl: 'partials/management/index.html', controller: 'ManagementCtrl', activetab: 'management'});
  $routeProvider.when('/management/dashboard', {templateUrl: 'partials/management/dashboard.html', controller: 'ManagementCtrl', activetab: 'management', activeManagementTab: 'dashboard'});
  $routeProvider.when('/market', {templateUrl: 'partials/market/index.html', controller: 'MarketCtrl', activetab: 'market'});
  $routeProvider.otherwise({redirectTo: '/dashboard'});
  
 // $locationProvider.html5Mode(true).hashPrefix('!');
}]);

app.config(['$translateProvider', function ($translateProvider) {
	// add translation table
	$translateProvider
	.translations('en', translations_en)
	.translations('it', translations_it)
	.preferredLanguage('en');
}]);

