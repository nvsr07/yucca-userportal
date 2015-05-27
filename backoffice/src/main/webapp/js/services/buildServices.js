appServices.factory('fabricBuildService',["$http","$q","info", 'BUILD_FABRIC_DIRECT_URL', function($http, $q,info, BUILD_FABRIC_DIRECT_URL) {

	var fabricBuild = {};
	
	function appendTransform(defaults, transform) {

		  // We can't guarantee that the default transformation is an array
		  defaults = angular.isArray(defaults) ? defaults : [defaults];

		  // Append the new transformation to the defaults
		  return defaults.concat(transform);
	}

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
		console.log("fabricBuild.getLogs", urlParams);
		return $http({
			method : 'GET',
			url : Constants.API_FABRIC_PROXY_URL + urlParams,
			transformResponse: function(value) {return value;}
		});
	};

	return fabricBuild;
}]);

