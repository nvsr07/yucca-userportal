appControllers.controller('DataExplorerDetailCtrl', [ '$scope', '$route', '$routeParams', 'odataAPIservice', 'dataDiscoveryService', 'metadataapiAPIservice', 'fabricAPImanagement', '$filter', 'info', '$location', '$modal', 
                                                      function($scope, $route, $routeParams, odataAPIservice, dataDiscoveryService, metadataapiAPIservice, fabricAPImanagement, $filter, info, $location, $modal) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = ($routeParams.entity_code) ? $routeParams.entity_code : '';
	$scope.streamCode = ($routeParams.stream_code) ? $routeParams.stream_code : '';
	$scope.virtualentityCode = ($routeParams.virtualentity_code) ? $routeParams.virtualentity_code : '';
	$scope.datasetType = $route.current.dataset_type;
	console.log("DataExplorerDetailCtrl::tenantCode", $scope.tenantCode);
	console.log("DataExplorerDetailCtrl::datasetCode", $scope.datasetCode);
	console.log("DataExplorerDetailCtrl::streamCode", $scope.streamCode);
	console.log("DataExplorerDetailCtrl::virtualentityCode", $scope.virtualentityCode);
	console.log("DataExplorerDetailCtrl::datasetType", $scope.datasetType);

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0, host.indexOf("userportal.smartdatanet.it"));
		return env;
	};
	
	$scope.currentSidebar = 'none';
	
	$scope.errors = [];
	
	
	var processData = function(){
		
		if (typeof $scope.metadata.dataset != 'undefined' && $scope.metadata.dataset !=null ){
			
			//$scope.metadata.icon = Constants.API_RESOURCES_URL + "dataset/icon/" + $scope.metadata.tenantCode + "/" + $scope.metadata.code;
			$scope.apiMetdataUrl = "api.smartdatanet.it:80/api/";
			$scope.apiMetdataSecureUrl = "api.smartdatanet.it:443/api/";
			$scope.topic = $scope.metadata.dataset.code;
			
			if(!$scope.metadata.opendata){
				$scope.metadata.opendata = {};
				$scope.metadata.opendata.isOpendata = 'false';
				$scope.metadata.opendata.language = 'it';
			} else if($scope.metadata.opendata.isOpendata){
				$scope.metadata.opendata.isOpendata = 'true';
				if($scope.metadata.opendata.dataUpdateDate && $scope.metadata.opendata.dataUpdateDate!=null){
					var dataUpdateDate = new Date($scope.metadata.opendata.dataUpdateDate);
					$scope.metadata.opendata.dataUpdateDate = Helpers.util.formatDateForInputHtml5(dataUpdateDate);
				}
			}
			
			if(typeof $scope.metadata.dataset.datasetId != 'undefined' && $scope.metadata.dataset.datasetId !=null)
				$scope.downloadCsvUrl = Constants.API_ODATA_URL + $scope.metadata.dataset.code + "/download/" + $scope.metadata.dataset.datasetId + "/current";  
			
			if(info.getActiveTenantType() == 'trial')   
				$scope.metadata.visibility = 'private';
			
			// api/proxy/odata/ds_Tweet6_357/donwload/357/all 
			if ($scope.metadata.stream == null) {
				$scope.downloadCsvUrl = Constants.API_ODATA_URL + $scope.metadata.dataset.code + "/download/" + $scope.metadata.dataset.datasetId + "/all";  
			} else {
				$scope.downloadCsvUrl = Constants.API_ODATA_URL + $scope.metadata.dataset.code + "/download/" + $scope.metadata.dataset.datasetId + "/current";  
			}
			
		} 
		if (typeof $scope.metadata.stream != 'undefined' && $scope.metadata.stream !=null ){

			$scope.wsUrl = "ws://stream.smartdatanet.it/ws";
			$scope.wsUrlSecured = "wss://stream.smartdatanet.it/wss";
			$scope.wsUrlTopic = "/topic/output." + $scope.metadata.tenantCode + "." + $scope.metadata.stream.smartobject.code + "_" + $scope.metadata.stream.code;
			
			$scope.mqttUrl = "tcp://stream.smartdatanet.it:1883 ";
			$scope.mqttUrlSecured = " tcp://stream.smartdatanet.it:8883";
			$scope.mqttUrlTopic = "output/" + $scope.metadata.tenantCode + "/"+ $scope.metadata.stream.smartobject.code + "_" + $scope.metadata.stream.code;
		}
			
	};
	

	
		
	$scope.loadDataset = function(){
		metadataapiAPIservice.detailDataset(null, $scope.datasetCode).success(function(response) {
			console.log("loadDataset", response);
			$scope.metadata = response;
			processData();
			
		}).error(function(response) {
			console.error("loadDataset", response);
		});
	};
	
	//http://localhost:8080/userportal/api/proxy/discovery/Streams?$expand=Dataset&$format=json&$filter=(tenantCode eq "sandbox"  and  smartOCode eq "9c25107f-fdd7-4010-83bb-9c0213153602"  and  streamCode eq "deviceStream")
	$scope.loadStream = function(){
		metadataapiAPIservice.detailStream(null, $scope.tenantCode, $scope.virtualentityCode, $scope.streamCode).success(function(response) {
			console.log("loadStream", response);
			$scope.metadata = response;
			processData();
		}).error(function(response) {
			console.error("loadDataset", response);
		});
//		fabricAPIservice.getStream($scope.tenantCode, $scope.virtualentityCode, $scope.streamCode).then(
//			function(response) {
//				$scope.errors = [];
//				try{
//					console.debug("loadStream- response",response);
//					$scope.stream = response.streams.stream;
//					if($scope.stream.opendata.isOpendata == 1){
//						var d = new Date($scope.stream.opendata.dataUpdateDate);
//						var mm = d.getMonth()+1;
//						var day = (d.getDate() < 10) ? "0" + d.getDate() : d.getDate();
//						$scope.stream.opendata.dataUpdateDate = day + "/" + mm + "/" + d.getFullYear();
//					}
//					$scope.dataset = null;
//					
//					$scope.processData();
//				} catch (e) {
//					var error = {"message" : "Cannot load stream" , "detail" : "Error while loading stream " + $scope.tenantCode + " - " + $scope.virtualentityCode + " - " + $scope.streamCode};
//					console.error("getDataset ERROR", error, e);
//				};
//			});
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

	$scope.canEdit = function() {
		var result = false;
		for (var k = 0; k < $scope.user.tenants.length; k++) {
			if( $scope.tenantCode == $scope.user.tenants[k].tenantCode){
				result = true;
				break;
			}
		}
		return result;
	};
	
	$scope.openModalViewSubscribe = function(size) {
		$scope.modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'partials/dataexplorer/subscribeModalContent.html',
			controller: 'DataExplorerSubscribeModalCtrl',
			size : size,
			scope: $scope,
			resolve : {
				dataset: function() {
					return $scope.dataset;
				}, 
				stream: function() {
					return $scope.stream;
				}
			}
		});
	};
	
} ]);