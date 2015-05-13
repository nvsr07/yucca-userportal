appServices.factory('fabricBuildService',["$http","$q","info", 'BUILD_FABRIC_DIRECT_URL', function($http, $q,info, BUILD_FABRIC_DIRECT_URL) {

	var fabricBuild = {};

	fabricBuild.execAction = function(operations) {
		console.log("execAction - operations", operations);
		console.log("execAction - BUILD_FABRIC_DIRECT_URL", BUILD_FABRIC_DIRECT_URL);
		
		return $http({
			method : 'POST',
			data:operations,
			url : Constants.API_DEPLOY_PROXY_URL
		});
	};

	fabricBuild.getLogs = function(urlParams) {
		return $http({
			method : 'GET',
			url : Constants.API_FABRIC_PROXY_URL + urlParams
		});
	};

	return fabricBuild;
}]);

