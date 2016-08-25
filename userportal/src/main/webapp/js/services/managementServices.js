appServices.factory('fabricAPImanagement', function($http, $q) {

	var fabricAPI = {};

	fabricAPI.getDatasets = function(tenant_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getDataset = function(tenant_code, dataset_id) {
		console.log("getDataset", Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '/' + dataset_id + '/?callback=JSON_CALLBACK');
		return $http({
			method : 'JSONP',
			url : Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '/' + dataset_id + '/?callback=JSON_CALLBACK'
		});
	};
	
	fabricAPI.requestUnistallDataset = function(tenant, idDataset){
		var deferred = $q.defer();
		var resultData = null;
		
		var requestUnistallURL = Constants.API_MANAGEMENT_DATASET_REQUEST_UNISTALL_URL + tenant + '/' + idDataset + '/?callback=JSON_CALLBACK';
		
		$http.delete(requestUnistallURL, {}).success(function(responseData) {
			console.log("deleteDataset - response OK", responseData);
			resultData = {status: "OK - ", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			console.log("deleteDataset - response KO", responseData);
			resultData = {status: "KO - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});

		console.log("deleteDataset - deferred", deferred);
		return deferred.promise;
	};

	fabricAPI.deleteDataset = function(tenant_code, dataset_id, dataset_version) {
		var deferred = $q.defer();
		var resultData = null;
		
		//var deleteURL = Constants.API_MANAGEMENT_DATASET_DELETE_URL + tenant_code + '/' + dataset_id + '/' + dataset_version + '/?callback=JSON_CALLBACK';
		var deleteURL = Constants.API_MANAGEMENT_DATASET_DELETE_URL + tenant_code + '/' + dataset_id + '/?callback=JSON_CALLBACK';

		console.log("deleteDataset", deleteURL);
		$http.delete(deleteURL, {}).success(function(responseData) {
			console.log("deleteDataset - response OK", responseData);
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			console.log("deleteDataset - response KO", responseData);
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});

		console.log("deleteDataset - deferred", deferred);
		return deferred.promise;
	};

	fabricAPI.createDataset = function(tenant_code, dataset) {
		var deferred = $q.defer();
		var resultData = null;
		console.debug("Dataset", dataset);
		$http.post(Constants.API_MANAGEMENT_DATASET_URL + tenant_code + '/', dataset).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};

	fabricAPI.updateDataset = function(tenant_code, dataset_id, dataset) {
		var deferred = $q.defer();
		var resultData = null;

		$http.put(Constants.API_MANAGEMENT_DATASET_URL+ tenant_code + '/' + dataset_id, dataset).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};
	
	fabricAPI.loadDataStatistics = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_PROXY_DATA_STATISTICS_URL +'getLatest/?callback=JSON_CALLBACK'
		});
	};
	
	
	return fabricAPI;
});


