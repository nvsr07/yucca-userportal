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
	$routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard/main.html', activetab: 'dashboard'});
	$routeProvider.when('/dashboard/main/:dashboard', {templateUrl: 'partials/dashboard/main.html', activetab: 'dashboard'});
	$routeProvider.when('/dashboard/streams', {templateUrl: 'partials/dashboard/streams.html', controller: 'DashboardCtrl', activetab: 'dashboard'});
	$routeProvider.when("/dashboard/stream/:tenant_code/:virtualentity_code/:stream_code", {templateUrl: "partials/dashboard/stream.html", controller: "DashboardStreamCtrl"});
	$routeProvider.when("/dashboard/error_log", {templateUrl: "partials/dashboard/error-log.html", controller: "DashboardStreamCtrl"});
	$routeProvider.when('/management', {templateUrl: 'partials/management/choose_tenant.html', controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab', {templateUrl: 'partials/management/choose_tenant.html', controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code', {templateUrl: 'partials/management/index.html', controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code/:virtualentity_code', {templateUrl: 'partials/management/index.html', controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code/:virtualentity_code/:stream_code', {templateUrl: 'partials/management/index.html', controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/market', {templateUrl: 'partials/market/index.html', controller: 'MarketCtrl', activetab: 'market'});
	$routeProvider.when('/store', {templateUrl: 'partials/store/index.html', controller: 'StoreCtrl', activetab: 'store'});
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

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

