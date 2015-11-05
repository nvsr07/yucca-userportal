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
  'angularFileUpload',
  'ngDraggable',
  'ui.codemirror',
  'LocalStorageModule'
  //'ngCookies'
  //'ngDragDrop'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'partials/common/home.html?'+BuildInfo.timestamp, isHomepage: true});
	$routeProvider.when('/home-family-identity', {templateUrl: 'partials/common/home-family-identity.html?'+BuildInfo.timestamp, isHomepage: true});
//	$routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard/main.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
//	$routeProvider.when('/dashboard/main/:dashboard', {templateUrl: 'partials/dashboard/main.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/streams', {templateUrl: 'partials/dashboard/streams.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/stream/:tenant_code/:virtualentity_code/:stream_code', {templateUrl: 'partials/dashboard/stream-data.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/streamstats/:tenant_code/:virtualentity_code/:stream_code', {templateUrl: 'partials/dashboard/stream-data.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/error_log', {templateUrl: 'partials/dashboard/error-log.html?'+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/management', {templateUrl: 'partials/management/choose_tenant.html?'+BuildInfo.timestamp, controller: 'ManagementCtrl', activetab: 'management'});
	$routeProvider.when('/management/:managementTab', {templateUrl: 'partials/management/choose_tenant.html?'+BuildInfo.timestamp, activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code', {templateUrl: 'partials/management/index.html?'+BuildInfo.timestamp, activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code/:entity_code', {templateUrl: 'partials/management/index.html?'+BuildInfo.timestamp,  activetab: 'management'});
	$routeProvider.when('/management/:managementTab/:tenant_code/:entity_code/:stream_code', {templateUrl: 'partials/management/index.html?'+BuildInfo.timestamp, activetab: 'management'});
	$routeProvider.when('/dataexplorer/:tenant_code/:entity_code', {templateUrl: 'partials/dataexplorer/dataExplorer.html?'+BuildInfo.timestamp,  activetab: 'dataexplorer',
		 resolve: {
			 info: function(initCtrl) {
			      return initCtrl.getInfo();
			 }
		}
	
	});
	
	$routeProvider.when('/dataexplorer/stream/:tenant_code/:entity_code', {templateUrl: 'partials/dataexplorer/detailStream.html?'+BuildInfo.timestamp,  activetab: 'dataexplorer',
		 resolve: {
			 info: function(initCtrl) {
			      return initCtrl.getInfo();
			 }
		}
	
	});
	
	$routeProvider.when('/dataexplorer/dataset/:tenant_code/:entity_code', {templateUrl: 'partials/dataexplorer/detailDataset.html?'+BuildInfo.timestamp,  activetab: 'dataexplorer',
		 resolve: {
			 info: function(initCtrl) {
			      return initCtrl.getInfo();
			 }
		}
	
	});
	
	$routeProvider.when('/dataexplorer/browsedata', {templateUrl: 'partials/dataexplorer/dataBrowser.html?'+BuildInfo.timestamp,  activetab: 'dataexplorer'});

	$routeProvider.when('/discovery', {templateUrl: 'partials/discovery/index.html?'+BuildInfo.timestamp, activetab: 'discovery'});
	//$routeProvider.when('/market', {templateUrl: 'partials/market/index.html?'+BuildInfo.timestamp, controller: 'MarketCtrl', activetab: 'market'});
	//$routeProvider.when('/store', {templateUrl: 'partials/store/index.html?'+BuildInfo.timestamp, controller: 'StoreCtrl', activetab: 'store'});
	$routeProvider.when('/info', {templateUrl: 'partials/info/info.html?'+BuildInfo.timestamp, activetab: 'info'});
	$routeProvider.otherwise({redirectTo: '/home'});
  
 // $locationProvider.html5Mode(true).hashPrefix('!');
}]);


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

var infoUser = {};
app.factory('info',  function() {
    var info = {};
    var infoService = {};
    
    infoService.getInfo = function() {
        return this.info;
    };

    infoService.setInfo = function(info) {
        this.info = info;
    //    this.infoService.setActiveTenantCode(this.info.user.tenants[0]);
    };
    
    infoService.setActiveTenantCode = function(activeTenantCode) {
    	this.info.activeTenantCode = activeTenantCode;
    };
    
    infoService.getActiveTenantCode = function(){
    	if(this.info && this.info.activeTenantCode)
    		return this.info.activeTenantCode;
    	else if(this.info && this.info.user && this.info.user.activeTenant)
    		return this.info.user.activeTenant;
    	else if(this.info && this.info.user && this.info.user.tenants && this.info.user.tenants !=null && this.info.user.tenants.length>0)
    		return this.info.user.tenants[0];
    	return null;
    };
    
    infoService.isOwner = function(tenantCode){
    	var result  = false;
    	if(tenantCode){
    		for (var int = 0; int < this.info.user.tenants.length; int++) {
				if(this.info.user.tenants[int] == tenantCode){
					result = true;
					break;
				}
			}
    		//return infoService.getTenantCode() == tenantCode;
    	}
    	return result;
    };
    
    infoService.isAuthorized = function(operation){
    	var authorized = false;
    	if(this.info && this.info!=null && this.info.user && this.info.user!=null && this.info.user.permissions && this.info.user.permissions!=null ){
    		var permissions = this.info.user.permissions;
    		var base_path  = Constants.RBAC_BASE_PERMISSION_PATH;     		

    		var operationSplitted = operation.split("/");
    		//console.log("operation",operation);
    		var operationComplete = base_path;
    		operationLoop:
    		for (var counterOperation = 0; counterOperation < operationSplitted.length; counterOperation++) {
    			operationComplete = operationComplete + "/" + operationSplitted[counterOperation];
    			//console.log("operationComplete", operationComplete);
    			for (var counterPermission = 0; counterPermission < permissions.length; counterPermission++) {
    				if(operationSplitted[counterOperation] == "*"){
    					if(permissions[counterPermission].lastIndexOf(operationComplete.substring(0, operationComplete.length-2), 0) === 0){
    						authorized = true;
    						break operationLoop;
    					};	
    				}			// start with
    				else{
    					if(permissions[counterPermission] == operationComplete){
    						authorized = true;
    						break operationLoop;
    					};
    				}
    			};
    		}
    		//console.log("operation " + operation + "authorized",authorized);
    		
    	}
    	return authorized;
    	
    };
    infoUser=infoService;
    return infoService;
});

/*

app.factory('info',  function() {
    var info = {};
    var infoService = {};
    
    infoService.getInfo = function() {
        return info;
    };

    infoService.setInfo = function(info) {
    	console.log("info.setInfo info ", info);
        this.info = info;
    };
    
    infoService.getTenantCode = function(){
    	console.log("info.getTenantCode info ", this.info);

    	return this.info.tenantCode;
    };
    
    infoService.isOwner = function(tenantCode){
    	console.log("info.isOwner tenantCode", tenantCode);
    	console.log("info.isOwner infoService", this.infoService);
    	console.log("info.isOwner infoService.getTenantCode()", this.infoService.getTenantCode());
    	if(tenantCode)
    		return this.infoService.getTenantCode() == tenantCode;
    	return false;
    };

    return infoService;
});
*/