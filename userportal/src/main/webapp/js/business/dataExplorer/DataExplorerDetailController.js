appControllers.controller('DataExplorerDetailCtrl', [ '$scope', '$routeParams', 'odataAPIservice', 'dataDiscoveryService', '$filter', 'info', '$location', '$modal', 
                                                     function($scope, $routeParams, odataAPIservice, dataDiscoveryService, $filter, info,$location, $modal) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
		return env;
	};
	
	$scope.downloadCsvUrl =  Constants.API_MANAGEMENT_DATASET_DOWNLOAD_URL + $scope.tenantCode + '/' + $scope.datasetCode + '/csv';

	$scope.currentSidebar = 'none';
	
	$scope.dataset = null;
	$scope.stream = null;
	$scope.errors = [];
	
		
	// http://localhost:8080/userportal/api/proxy/discovery/Datasets?$format=json&$filter=datasetCode%20eq%20%27ds_Provatime_14%27&$top=12
	$scope.loadDataset = function(){

		dataDiscoveryService.loadDatasetDetailFromDatasetCode($scope.datasetCode).success(function(response) {
			$scope.errors = [];
			try{
				console.debug("loadDataset- response",response);
				$scope.dataset = response.d.results[0];
				
				$scope.dataset.datasetIcon = Constants.API_RESOURCES_URL + "dataset/icon/"+$scope.dataset.tenantCode+"/"+$scope.dataset.datasetCode;
				if(dataset.tags!=null )
					$scope.dataset.tagsArray = $scope.dataset.tags.split[","];


			} catch (e) {
				var error = {"message":"Cannot load dataset","detail":"Error while loading dataset "+ $scope.datasetCode};
				//$scope.errors.push(error);
				console.error("getDataset ERROR",error, e);
			};
		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

		});
	};
	

	$scope.loadDataset();
	
	
	
	var createQueryOdata = function(stream_code, filter, skip, top, orderby, collection){
		
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));

		var streamDataUrl = "http://"+env+"api.smartdatanet.it/api/"+stream_code+"/"+collection+"?$format=json";
		if(filter && filter!=null)
			streamDataUrl += '&$filter='+filter;
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		return streamDataUrl;

	};

} ]);






