appControllers.controller('DataExplorerDetailCtrl', [ '$scope', '$route', '$routeParams', 'odataAPIservice', 'dataDiscoveryService', 'fabricAPIservice', '$filter', 'info', '$location', '$modal', 
                                                      function($scope, $route, $routeParams, odataAPIservice, dataDiscoveryService, fabricAPIservice, $filter, info, $location, $modal) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = ($routeParams.entity_code) ? $routeParams.entity_code : '';
	$scope.streamCode = ($routeParams.stream_code) ? $routeParams.stream_code : '';
	$scope.virtualentityCode = ($routeParams.virtualentity_code) ? $routeParams.virtualentity_code : '';
	$scope.datasetType = $route.current.dataset_type;
	
	console.log("routeParams", $routeParams);
	console.log("route", $route);
	console.log("route.current", $route.current);
	console.log("scope", $scope);
	console.log("location", $location);
	console.log("scope.datasetType", $scope.datasetType);

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0, host.indexOf("userportal.smartdatanet.it"));
		return env;
	};
	
	$scope.downloadCsvUrl =  Constants.API_MANAGEMENT_DATASET_DOWNLOAD_URL + $scope.tenantCode + '/' + $scope.datasetCode + '/csv';

	$scope.currentSidebar = 'none';
	
	$scope.dataset = null;
	$scope.stream = null;
	$scope.errors = [];
	
	$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
	
	$scope.processData = function(){
		
		if ($scope.dataset){
			$scope.dataset.datasetIcon = Constants.API_RESOURCES_URL + "dataset/icon/" + $scope.dataset.tenantCode + "/" + $scope.dataset.datasetCode;
			$scope.apiMetdataUrl = $scope.dataset.API;
		}
			
		
		console.log("stream", $scope.stream);
		console.log("dataset", $scope.dataset);
	}
		
	// http://localhost:8080/userportal/api/proxy/discovery/Datasets?$format=json&$filter=datasetCode%20eq%20%27ds_Provatime_14%27&$top=12
	$scope.loadDataset = function(){

		dataDiscoveryService.loadDatasetDetailFromDatasetCode($scope.datasetCode).success(function(response) {
			$scope.errors = [];
			try{
				console.debug("loadDataset- response",response);
				$scope.dataset = response.d.results[0];
				$scope.stream = ($scope.dataset.Stream) ? $scope.dataset.Stream : null;
				
				$scope.processData();
			} catch (e) {
				var error = {"message" : "Cannot load dataset", "detail" : "Error while loading dataset " + $scope.datasetCode};
				console.error("getDataset ERROR", error, e);
			};
		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

		});
	};
	
	
	//http://localhost:8080/userportal/api/proxy/discovery/Streams?$expand=Dataset&$format=json&$filter=(tenantCode eq "sandbox"  and  smartOCode eq "9c25107f-fdd7-4010-83bb-9c0213153602"  and  streamCode eq "deviceStream")
	$scope.loadStream = function(){
		fabricAPIservice.getStream($scope.tenantCode, $scope.virtualentityCode, $scope.streamCode).then(
				function(response) {
					$scope.errors = [];
					try{
						console.debug("loadStream- response",response);
						$scope.stream = response.streams.stream;
						$scope.dataset = null;
						
						$scope.processData();
					} catch (e) {
						var error = {"message" : "Cannot load stream" , "detail" : "Error while loading stream " + $scope.tenantCode + " - " + $scope.virtualentityCode + " - " + $scope.streamCode};
						console.error("getDataset ERROR", error, e);
					};
				});
	};
	
	if ($scope.datasetType == "stream")
		$scope.loadStream();
	else 
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

	$scope.openModalViewSubscribe = function(size) {
		$scope.modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'partials/dataexplorer/subscribeModalContent.html',
			controller: 'DataExplorerSubscribeModalCtrl',
			size : size,
			scope: $scope,
			resolve : {
//				items : function() {
//					return $scope.items;
//				},
				dataset: function() {
					console.log(">>>>>> $scope.dataset in selectedDataset", $scope.dataset);
					return $scope.dataset;
				}
			}
		});
//		$scope.modalInstance.result.then(function(selectedItem) {
////			$scope.selected = selectedItem;
//			console.log("selected in modalInstance.result.then", selectedItem);
//		}, function() {
//			console.info('Modal dismissed at: ' + new Date());
//		});
	};
	
} ]);