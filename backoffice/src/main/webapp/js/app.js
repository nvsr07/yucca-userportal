'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('backoffice', [
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap',
  'ngDraggable',
  'LocalStorageModule',
  'backoffice.config',
  'backoffice.filters',
  'backoffice.services',
  'backoffice.directives',
  'backoffice.controllers',
  'pascalprecht.translate'
]);

app.config(['$routeProvider', function($routeProvider) {
//	$routeProvider.when('/login', {templateUrl: 'partials/common/login.html?'+BuildInfo.timestamp});
	$routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard/index.html?'+BuildInfo.timestamp});
	$routeProvider.otherwise({redirectTo: '/dashboard'});
  
}]);


app.config(['$translateProvider', function ($translateProvider) {
	// add translation table
	$translateProvider
	.translations('en', translations_en)
	.translations('it', translations_it)
	.preferredLanguage('it');
}]);

var infoUser = {};
app.factory('info',  function() {
    var info = {};
    var infoService = {};
    
    infoService.getInfo = function() {
        return this.info;
    };

    infoService.setInfo = function(info) {
        this.info = info;
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

