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
	$routeProvider.when('/home', {templateUrl: 'partials/common/home.html?'+BuildInfo.timestamp, isHomepage: true});
	$routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard/main.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/main/:dashboard', {templateUrl: 'partials/dashboard/main.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/streams', {templateUrl: 'partials/dashboard/streams.html?'+BuildInfo.timestamp, controller: 'DashboardCtrl', activetab: 'dashboard'});
	$routeProvider.when('/dashboard/stream/:tenant_code/:virtualentity_code/:stream_code', {templateUrl: 'partials/dashboard/stream.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/error_log', {templateUrl: 'partials/dashboard/error-log.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/management', {templateUrl: 'partials/management/choose_tenant.html?'+BuildInfo.timestamp, controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab', {templateUrl: 'partials/management/choose_tenant.html?'+BuildInfo.timestamp, controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code', {templateUrl: 'partials/management/index.html?'+BuildInfo.timestamp, controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code/:virtualentity_code', {templateUrl: 'partials/management/index.html?'+BuildInfo.timestamp, controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code/:virtualentity_code/:stream_code', {templateUrl: 'partials/management/index.html?'+BuildInfo.timestamp, controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/market', {templateUrl: 'partials/market/index.html?'+BuildInfo.timestamp, controller: 'MarketCtrl', activetab: 'market'});
	$routeProvider.when('/store', {templateUrl: 'partials/store/index.html?'+BuildInfo.timestamp, controller: 'StoreCtrl', activetab: 'store'});
	$routeProvider.otherwise({redirectTo: '/home'});
  
 // $locationProvider.html5Mode(true).hashPrefix('!');
}]);

/*
app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });
});*/

app.config(['$translateProvider', function ($translateProvider) {
	// add translation table
	$translateProvider
	.translations('en', translations_en)
	.translations('it', translations_it)
	.preferredLanguage('it');
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

// remove the partial template from cache
app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });
});

app.factory('info',  function() {
    var info = {};
    var infoService = {};
    
    infoService.getInfo = function(item) {
        return info;
    };

    infoService.setInfo = function(info) {
        this.info = info;
    };
    
    infoService.getTenantCode = function(){
    	if(this.info && this.info.tenant)
    		return this.info.tenant.tenantCode;
    	return null;
    };
    
    infoService.isOwner = function(tenantCode){
    	if(tenantCode)
    		return infoService.getTenantCode() == tenantCode;
    	return false;
    };

    return infoService;
});
