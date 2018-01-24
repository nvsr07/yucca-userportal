/* Controllers */
appControllers.controller('ManagementNavigationCtrl', [ '$scope', '$route','info','$modal', 'adminAPIservice', '$translate', function($scope, $route, info, $modal, adminAPIservice, $translate) {
	$scope.$route = $route;
	if(!info.canManageStream() && ($scope.managementTab == 'streams' || $scope.managementTab == 'editStream' || $scope.managementTab == 'viewStream' || $scope.managementTab == 'newStream'|| $scope.managementTab == 'newStreamInternal' ||
			$scope.managementTab == 'virtualentities' || $scope.managementTab == 'editVirtualentity' || $scope.managementTab == 'viewVirtualentity' || $scope.managementTab == 'newVirtualentity'))
		$scope.managementTab = 'datasets';
	else
		$scope.managementTab = $route.current.params.managementTab;
	
	$scope.tenant = $route.current.params.tenant_code;

	$scope.buildTimestamp = BuildInfo.timestamp;

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
	
	$scope.isMenuActive= function(menuItem){

		var result = false;
		switch (menuItem){
		case 'dashboard':
			result =  ($scope.managementTab == 'dashboard');
			break;
		case 'streams':
			result =  ($scope.managementTab == 'streams' || $scope.managementTab == 'editStream' || $scope.managementTab == 'viewStream' || $scope.managementTab == 'newStream'|| $scope.managementTab == 'newStreamInternal');
			break;
		case 'virtualentities':
			result =  ($scope.managementTab == 'virtualentities' || $scope.managementTab == 'editVirtualentity' || $scope.managementTab == 'viewVirtualentity' || $scope.managementTab == 'newVirtualentity');
			break;
		case 'datasets':
			result =  ($scope.managementTab == 'datasets' || $scope.managementTab == 'editDataset' || $scope.managementTab == 'viewDataset' || $scope.managementTab == 'newDataset' ||  $scope.managementTab == 'uploadDataset');
			break;
		default:
			break;
		}
		return result;
	};
	
	$scope.streamIconUrl= function(organizationCode, idstream){
		return Constants.API_ADMIN_STREAM_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode)+"/"+idstream+"/icon";
	};

	$scope.datasetIconUrl= function(organizationCode, iddataset){
		return Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode)+"/"+iddataset+"/icon";
	};


}]);

appControllers.controller('ManagementDetailCtrl', [ '$scope', '$route', '$location', '$routeParams','adminAPIservice', 'info', '$modal', '$translate', 'sharedAdminResponse', 
                                                           function($scope, $route, $location,$routeParams,adminAPIservice, info, $modal, $translate, sharedAdminResponse) {
  	$scope.tenantCode = $route.current.params.tenant_code;
  	console.log("ManagementDetailCtrl " , $route.current.params);
  	$scope.showLoading = true;
  	$scope.apiMetdataUrl = "api.smartdatanet.it:80/api/";
  	$scope.apiMetdataSecureUrl = "api.smartdatanet.it:443/api/";
  	
  	$scope.admin_response = sharedAdminResponse.getResponse();

  	$scope.datasourceReady = false;
  	adminAPIservice.loadDatasource($routeParams.entity_type,info.getActiveTenant(),$routeParams.id_datasource).success(function(response) {
  		console.log("loadDatasource", response);
  		$scope.showLoading = false;
  	  	$scope.datasourceReady = true;

  		try{
  			$scope.datasource = response;
  			$scope.dataset = response.dataset;
  			$scope.stream = response.stream;
  			if(typeof $scope.dataset != 'undefined')
  	  			$scope.topic = $scope.dataset.datasetcode;
  			if(typeof $scope.stream != 'undefined'){
  				$scope.datasource.stream.wsUrl = Helpers.stream.wsOutputUrl($scope.datasource);
  				if(typeof $scope.stream.twitterInfo != 'undefined')
  					$scope.stream.twitterInfo.pollingInterval = $scope.stream.smartobject.twtmaxstreams*5+1;

  			}
  			
  			$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
  			
  			if(typeof $scope.dataset!= 'undefined' && typeof $scope.dataset.iddataset != 'undefined' && $scope.dataset.iddataset !=null)
  				$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.datasetCode+"/download/"+$scope.dataset.iddataset+ "/current";  
  		} catch (e) {
  			console.error("loadDataset ERROR", e);
  		}
  	}).error(function(data,status){
  		$scope.showLoading = false;

  		console.error("loadDataset ERROR", data,status);
  		$scope.admin_response.type = 'danger';
  		if(status==404)
  			$scope.admin_response.message = 'MANAGEMENT_VIEW_DATASET_ERROR_NOT_FOUND';
  		else
  			$scope.admin_response.message = 'UNEXPECTED_ERROR';
  	});

  	
  	$scope.isStream = function(){
  		return typeof $scope.stream != 'undefined';
  	};
  	
  	$scope.editDatasourceUrl  = function(){
  		var editUrl  = "#/management";
  		
  		if($scope.stream){
  			editUrl += "/editStream/stream/"+$scope.tenantCode+"/"+$scope.stream.streamcode +"/" + $scope.stream.idstream;
  		}
  		else if($scope.dataset){
  			editUrl += "/editDataset/dataset/"+$scope.tenantCode+"/"+$scope.dataset.datasetcode +"/" + $scope.dataset.iddataset;
  		}
  		return editUrl;
  	};
  	
  	$scope.canEdit = function() {
  		if($scope.stream){
	  		return ($scope.datasource.status.statuscode == Constants.STREAM_STATUS_DRAFT);
  		}	
	  	else{
	  		return ($scope.dataset && 
	  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
	  				$scope.dataset.datasetSubtype && $scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset");
	  	}
  	};

  	$scope.canAddData = function() {
  		return ($scope.dataset && 
  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
  				$scope.dataset.datasetSubtype && $scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset");
  	};

  	$scope.isOwner = function(){
  		return info.isOwner( $scope.tenantCode);
  	};

  	$scope.canDelete = function() {
  		return ($scope.dataset && 
  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
  				$scope.dataset.datasetSubtype &&
  					($scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset" ||
  					 $scope.dataset.datasetSubtype.datasetSubtype == "streamDataset" ||
  					 $scope.dataset.datasetSubtype.datasetSubtype == "socialDataset"
  						)
  					
  				);
  	};
  	
  	$scope.canUnistall = function() {
  		if($scope.stream){
  			return $scope.datasource.status && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_INST;
  		}
  		else
	  		return ($scope.dataset && 
	  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
	  				$scope.dataset.datasetSubtype && $scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset" && 
	  				$scope.datasource.deleted!=1
	  			);
  	};
  	
  	
	$scope.canInstall = function() {
		if($scope.stream && $scope.datasource.status && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	
	$scope.canCreateNewVersion = function() {
		if($scope.stream && $scope.datasource.status && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};
	

  	
  	
	$scope.cloneDatasource = function(){
		if($scope.stream){
			sharedStream.setStream($scope.stream);
			$location.path('management/newStream/'+$scope.tenantCode);
		}
		else{
			sharedDataset.setDataset($scope.dataset);
			$location.path('management/newDataset/'+$scope.tenantCode);
		}
	};

	console.log("info", info);
	info.isAuthorized("management/streams/req_disinst");
	
	$scope.requestInstallation = function(){
		var action = Constants.LIFECYCLE_STREAM_REQ_INST;
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		updateLifecycle(action,$scope.stream);
	};
	
	$scope.requestUnistallation = function(){
		var action = Constants.LIFECYCLE_STREAM_REQ_UNINST;
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		updateLifecycle(action,$scope.stream);
	};
	
	$scope.createNewVersion = function(){
		var action = Constants.LIFECYCLE_STREAM_NEW_VERSION;
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		updateLifecycle(action,$scope.stream);
	};
	
	
	var updateLifecycle = function(action,stream){
		adminAPIservice.lifecycleStream(action,stream,info.getActiveTenant()).success(function(response) {
		console.log("result updateLifecycle ", response);
		$scope.loadDatasource();
		
	}).error(function(data,status){
		$scope.showLoading = false;
  		console.error("updateLifecycle ERROR", data,status);
  		$scope.admin_response.message = 'UNEXPECTED_ERROR';
  		
  	});
	}

//	var updateLifecycle = function(action) {
//		console.log("updateLifecycle stream", $scope.stream);
//		console.log("updateLifecycle action", action);
//		$scope.updateInfo = null;
//		$scope.updateError = null;
//		Helpers.util.scrollTo();
//		var promise   = fabricAPIservice.lifecycleStream(action, $scope.stream);
//		promise.then(function(result) {
//			console.log("result updateLifecycle ", result);
//			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
//			$scope.updateInfo = {status: result.status};
//			$scope.loadStream();
//		}, function(result) {
//			$scope.updateError = angular.fromJson(result.data);
//			console.log("result.data ", result.data);
//
//			$scope.loadStream();
//		}, function(result) {
//			console.log('Got notification: ' + result);
//		});
//	};
	
	
	
	
	}]);



appControllers.controller('ManagementEditCtrl', [ '$scope', '$modal', 'adminAPIservice', '$translate',  function($scope, $modal,adminAPIservice, $translate) {
	

	
	//FIXME licensecode???
	$scope.isLicenseVisible = function(datasource){
		var returnValue = true;
		if (datasource && datasource.license){
			if ((datasource.license.licensecode == Constants.STREAM_FIELD_METADATA_LICENSE_CCBY) || (datasource.license.licensecode == Constants.STREAM_FIELD_METADATA_LICENSE_CC0))
				returnValue = false;
		}
		
		return returnValue;
	};

	$scope.checkTag = function(datasource){
		var rslt = true;
		if (typeof datasource !='undefined' && datasource!=null && datasource.tags && datasource.tags.length > 0){
			rslt = false;
		};
		
		return rslt;
	};


}]);


appControllers.controller('ManagementChooseTagCtrl', [ '$scope', '$modalInstance', 'tagList',
                                                                        function($scope, $modalInstance, tagList) {
	
	$scope.tagMap = {};
	var firstLetter = null;
	for (var i = 0; i < tagList.length; i++) {
		if(firstLetter != tagList[i].tagLabel.substring(0,1)){
			firstLetter = tagList[i].tagLabel.substring(0,1);
			$scope.tagMap[firstLetter] = new Array();
		}
		$scope.tagMap[firstLetter].push(tagList[i]);
	}
	
	
	$scope.chooseTag = function(choosenTag){
		console.log("chooseTag",choosenTag);
		$modalInstance.close(choosenTag);
	};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementChooseTenantCtrl', [ '$scope', '$modalInstance', 'tenantsList',
                                                                           function($scope, $modalInstance, tenantsList) {
   	console.log("ManagementChooseTenantCtrl",tenantsList);
   	
   	$scope.tenantsList = tenantsList;

   	$scope.chooseTenant = function(choosenTenant){
   		console.log("choosenTenant",choosenTenant);
   		$modalInstance.close(choosenTenant);
   	};
   	
   	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
 }]);


appControllers.controller('DateFormatHintCtrl', [ '$scope', '$modalInstance', function($scope, $modalInstance) {
	$scope.dataFormatHintTable = Constants.HELP_HINT_DATE_FORMAT_TABLE;
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);
