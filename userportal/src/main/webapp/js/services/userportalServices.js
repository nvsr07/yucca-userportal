appServices.factory('upService', [ "$http", "$q", "info", function($http, $q, info) {

	var userportalService = {};

	userportalService.getInfo = function(refreshTenant, activeTenant) {
		
		var infoUrl = Constants.API_INFO_URL + '?callback=JSON_CALLBACK';

		if(refreshTenant)
			infoUrl = infoUrl+"&refreshRequestedTenant=true";

		console.log("activeTenant",activeTenant);
		if(typeof activeTenant!='undefined')
			infoUrl = infoUrl+"&activeTenant="+activeTenant.tenantcode;
		
		return $http({
			method : 'JSONP',
			url : infoUrl
		});
	};
	
//	userportalService.getInfoChangActiveTenant = function(activeTenant) {
//
//		var changeTenantUrl = Constants.API_INFO_URL + '?callback=JSON_CALLBACK';
//
//		if(typeof activeTenant!=undefined)
//			changeTenantUrl = changeTenantUrl+"&activeTenant="+activeTenant.tenantCode;
//
//		return $http({
//			method : 'JSONP',
//			url : changeTenantUrl
//		});
//	};
	
	userportalService.acceptTermConditionForTenant = function(tenantCode) {

		var acceptUrl = Constants.API_AUTH_TERMCONDITION_URL + '?tenantcode=' + tenantCode +'&callback=JSON_CALLBACK';
		console.log("acceptTermConditionForTenant",acceptUrl);

		return $http({
			method : 'JSONP',
			url : acceptUrl
		});
	};
	
	return userportalService;
}]);
