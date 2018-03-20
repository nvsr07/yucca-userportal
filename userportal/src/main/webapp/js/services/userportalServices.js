appServices.factory('upService', [ "$http", "$q", "info", function($http, $q, info) {

	var userportalService = {};

	userportalService.getInfo = function(refreshTenant, activeTenant) {
		
		var infoUrl = Constants.API_INFO_URL + '?callback=JSON_CALLBACK';

		if(refreshTenant)
			infoUrl = infoUrl+"&refreshRequestedTenant=true";

		console.log("activeTenant",activeTenant);
		if(typeof activeTenant!='undefined' && activeTenant!=null)
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
	
	userportalService.loadTwitterCredential = function() {
		return $http({
			method : 'GET',
			url : Constants.API_SERVICES_TWITTER_USER_URL// + '?callback=JSON_CALLBACK'
		});
	};
	
	userportalService.clearTwitterCredential = function() {
		return $http({
			method : 'GET',
			url : Constants.API_SERVICES_TWITTER_USER_URL+ '?action=clear'
		});
	};
		

	userportalService.verifyTwitterCredential = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_TWITTER_AUTH_URL + '?callback=JSON_CALLBACK'
		});
	};

	userportalService.checkTwitterQuery = function(tweetQuery) {
		return $http({
			method : 'POST',
			data:tweetQuery,
			url : Constants.API_SERVICES_TWITTER_QUERY_URL
		});
	};
	
	return userportalService;
}]);
