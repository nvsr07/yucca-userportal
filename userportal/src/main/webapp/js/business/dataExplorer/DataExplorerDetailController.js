appControllers.controller('DataExplorerDetailCtrl', [ '$scope', '$route', '$routeParams', 'odataAPIservice', 'metadataapiAPIservice', 'fabricAPImanagement', '$filter', 'info', '$location', '$modal', 
                                                      function($scope, $route, $routeParams, odataAPIservice, metadataapiAPIservice, fabricAPImanagement, $filter, info, $location, $modal) {
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
	
	$scope.error = null;
	
	
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
		$scope.error = null;
		metadataapiAPIservice.detailDataset(null, $scope.datasetCode).success(function(response) {
			console.log("loadDataset", response);
			if(typeof response.errorCode == 'undefined'){
				$scope.metadata = response;
				processData();
				$scope.openInManagementUrl = '#/management/viewDataset/'+$scope.metadata.tenantCode+'/'+$scope.metadata.dataset.code;
			}
			else{
				if(response.errorCode == "NOT FOUND"){
					$scope.error = {"message":"Cannot load stream", "detail" : response.message};
				}
				else{
					$scope.error = {"message":response.errorCode, "detail" : response.message};
				}
			}

		}).error(function(response) {
			$scope.error = {"message":"Cannot load dataset", "detail" : response};
			console.error("loadDataset", response);
		});
	};
	
	$scope.loadStream = function(){
		$scope.error = null;
		metadataapiAPIservice.detailStream(null, $scope.tenantCode, $scope.virtualentityCode, $scope.streamCode).success(function(response) {
			console.log("loadStream", response);
			if(typeof response.errorCode == 'undefined'){
				$scope.metadata = response;
				processData();
				$scope.openInManagementUrl = '#/management/viewStream/'+$scope.metadata.tenantCode+'/'+$scope.metadata.stream.smartobject.code+'/'+$scope.metadata.stream.code;
			}
			else{
				if(response.errorCode == "NOT FOUND"){
					$scope.error = {"message":"Cannot load stream", "detail" : response.message};
				}
				else{
					$scope.error = {"message":response.errorCode, "detail" : response.message};
				}
			}
		}).error(function(response) {
			$scope.error = {"message":"Cannot load stream", "detail" : response};
			console.error("loadStream", response);
		});
	};
	
	if ($scope.datasetType == "stream")
		$scope.loadStream();
	else 
		$scope.loadDataset();
	
	/*
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

	};*/

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
	
	$scope.openModalViewSubscribe = function(size, apiType) {
		$scope.modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'partials/dataexplorer/subscribeModalContent.html',
			controller: 'DataExplorerSubscribeModalCtrl',
			size : size,
			scope: $scope,
			resolve : {
				metadata: function() {
					return $scope.metadata;
				}, 
				apiType: function(){
					return apiType;
				}
			}
		});
	};
	
} ]);