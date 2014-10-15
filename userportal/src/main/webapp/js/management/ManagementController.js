/* Controllers */

appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route", function($scope, $route) {
	$scope.$route = $route;
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
	    	case 'dataset':
	        	result =  ($scope.managementTab == 'dataset');
	        	break;
	        default:
	        	break;
		}
		return result;
	};
}]);


appControllers.controller('ManagementCtrl', [ '$scope', '$route', 'fabricAPIservice', function($scope, $route, fabricAPIservice, filterFilter) {
} ]);

appControllers.controller('ManagementDashboardCtrl',[ '$scope', '$route', 'fabricAPIservice', function($scope, $route, fabricAPIservice, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.tenant = null;
	
	// FIXME change with single tenant api
	fabricAPIservice.getTenants().success(function(response) {
		for (var i = 0; i < response.tenants.tenant.length; i++) {
			if(response.tenants.tenant[i].tenantCode == $scope.tenantCode){
				$scope.tenant = response.tenants.tenant[i];
				break;
			}
		}

	});


} ]);




appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	
	console.log("isOwner", info.isOwner( $scope.tenantCode));

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	fabricAPIservice.getStreams(/*$scope.tenantCode*/).success(function(response) {
		// FIXME remove when the new api with tenant parameterwill be ready
	
		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].codiceTenant == $scope.tenantCode){
				if(!responseList[i].deploymentStatusCode || responseList[i].deploymentStatusCode == null)
					responseList[i].deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
				responseList[i].statusIcon = Helpers.stream.statusIcon(responseList[i]);
				$scope.streamsList.push(responseList[i]);
			}
		}
		//$scope.streamsList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		$scope.totalItems = $scope.streamsList.length;
	//	$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});
	

	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream);
	};

	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(stream.deploymentStatusDesc);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newCode", newCode);
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newStatus", newStatus);
	});

	$scope.selectedStreams = [];
	
	$scope.isSelected = function(stream) {
		 return $scope.selectedStreams.indexOf(stream) >= 0;
	};
		
	$scope.updateSelection = function($event, stream) {
		var checkbox = $event.target;
		 var action = (checkbox.checked ? 'add' : 'remove');
		  updateSelected(action, stream);
	};	
	var updateSelected = function(action, stream) {
		if (action === 'add' && $scope.selectedStreams.indexOf(stream) === -1) {
			$scope.selectedStreams.push(stream);
		}
		if (action === 'remove' && $scope.selectedStreams.indexOf(stream) !== -1) {
			$scope.selectedStreams.splice($scope.selectedStreams.indexOf(stream), 1);
		}
	};
	
	$scope.canEdit = function() {
		if($scope.selectedStreams.length==1 && $scope.selectedStreams[0].deploymentStatusCode == Constants.STREAM_STATUS_DRAFT){
			return true;
		}
		return false;
	};

	
	
	
	$scope.editStream = function(){
		if($scope.selectedStreams.length===1){
			
			$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteStream = function(){
		//alert("Funzionalita non ancora abilitata!");
		if($scope.selectedStreams.length>0){
			
			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);


appControllers.controller('ManagementNewStreamCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};



	$scope.virtualEntitiesList = [];


	//internal stream
	$scope.virtualentity=null;
//	$scope.internalStreams = [];
	$scope.inputTypeStream = 1;
//	$scope.streamSelectedItem=null;	
//	$scope.streamSiddhiQuery=null;
//	$scope.virtualentityInternal=null;

	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
		console.log(response.virtualEntities.virtualEntity);
		for (var int = 0; int < response.virtualEntities.virtualEntity.length; int++) {
			var virtualentity = response.virtualEntities.virtualEntity[int];
			if(virtualentity.idTipoVe != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
				$scope.virtualEntitiesList.push(virtualentity);
			}else{
				$scope.virtualentityInternal=virtualentity;
			}

		}
	});



	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});



	$scope.creationError = null;

	$scope.accettazionePrivacy=0;
	$scope.accettazioneResponsability=0;

	$scope.createStream = function(virtualentity, stream) {
		stream.fps = 0;
		stream.saveData = 0;
		stream.publish = 0;
		stream.accettazionePrivacy=0;
		stream.accettazionePrivacy=$scope.accettazionePrivacy & $scope.accettazioneResponsability;


		var newStream = new Object();
		newStream.stream = stream;
		var promise   = fabricAPIservice.createStream($scope.tenantCode, virtualentity.codeVirtualEntity,  newStream);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/editStream/'+$scope.tenantCode +'/'+virtualentity.codeVirtualEntity+'/'+newStream.stream.codiceStream);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	

	$scope.cancel = function(){
		$location.path('management/streams'+'/'+$scope.tenantCode);
	};
} ]);



appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'info', function($scope, $routeParams, fabricAPIservice, info) {
	$scope.tenantCode = $routeParams.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.updateInfo = null;
	$scope.updateError = null;
	$scope.insertComponentError = null;


	$scope.internalStreams = [];
	$scope.inputTypeStream = 1;
	$scope.streamSelectedItem=null;	
	$scope.streamSiddhiQuery=null;
	$scope.streamsList = [];

	$scope.addStreamToArray = function(){
		$scope.streamSelectedItem.componenti = new Object();
		$scope.internalStreams.push($scope.streamSelectedItem);
		$scope.loadStreamComponents($scope.streamSelectedItem);		
		$scope.streamSelectedItem=null;
	};

	$scope.cancelStreamToArray = function(index){
		$scope.internalStreams.splice(index,1);
	};


	fabricAPIservice.getStreams().success(function(response) {

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].deploymentStatusCode && 	responseList[i].deploymentStatusCode == Constants.STREAM_STATUS_INST && responseList[i].visibility && responseList[i].visibility=="public"){
				$scope.streamsList.push(responseList[i]);					
			}
		}
	});


	$scope.tagList = [];
	$scope.domainList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			$scope.tagList.push(response.streamTags.element[int].tagCode);
		}
	});


	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.unitOfMesaurementList = [];
	fabricAPIservice.getStreamUnitOfMesaurement().success(function(response) {
		$scope.unitOfMesaurementList = response.measureUnit.element;
	});


	$scope.phenomenomList = [];
	fabricAPIservice.getStreamPhenomenom().success(function(response) {
		$scope.phenomenomList = response.Phenomenon.element;
	});

	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
	});




	$scope.componentJsonExample = "{\"stream\": \"....\",\n \"sensor\": \"....\",\n \"values\":\n  [{\"time\": \"....\",\n    \"components\":\n     {\"wind\":\"1.4\"}\n  }]\n}";

	$scope.stream = null;
	$scope.loadStream = function(){
		fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).success(function(response) {
			$scope.stream = response.streams.stream;
			console.debug("$scope.stream internal before clean",$scope.stream);
			if(!$scope.stream.streamInternalChildren || !$scope.stream.streamInternalChildren.streamChildren){
				$scope.stream.streamInternalChildren={};
				$scope.stream.streamInternalChildren.streamChildren={};
			}
			
			
			
			if($scope.stream.streamInternalChildren.streamChildren.length>0 && $scope.stream.streamInternalChildren.streamChildren[0].idStrem){
				$scope.stream.streamInternalChildren.streamChildren=Helpers.util.initArrayZeroOneElements($scope.stream.streamInternalChildren.streamChildren);
			}else{
				$scope.stream.streamInternalChildren.streamChildren=[];
			}
			

			for(var i =0 ; i<$scope.stream.streamInternalChildren.streamChildren.length;i++){
				var existingStream =  $scope.stream.streamInternalChildren.streamChildren[i];
				console.debug("existingStream",existingStream);
				$scope.loadStreamComponents(existingStream);
			}


			
			if( $scope.stream.internalQuery && $scope.stream.internalQuery['@nill']){
				$scope.stream.internalQuery=null;
			}
			$scope.internalStreams=$scope.stream.streamInternalChildren.streamChildren;
			
			$scope.streamSiddhiQuery= $scope.stream.internalQuery;

			console.debug("$scope.stream internal",$scope.stream);
			if(!$scope.stream.streamTags)
				$scope.stream.streamTags = new Object();
			$scope.stream.streamTags.tag = Helpers.util.initArrayZeroOneElements($scope.stream.streamTags.tag);

			if($scope.stream.componenti == null)
				$scope.stream.componenti = new Object();
			$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);

			$scope.stream.saveData = '0';
			$scope.stream.visibility = 'public';
			$scope.stream.publish = 'false';	
			if(!$scope.stream.deploymentStatusCode || $scope.stream.deploymentStatusCode == null)
				$scope.stream.deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;

			$scope.stream.domain = $scope.stream.domainStream;
		});

	};


	$scope.loadStreamComponents = function(existingStream){
		fabricAPIservice.getStream(existingStream.codiceTenant,existingStream.codiceVirtualEntity,existingStream.codiceStream).success(function(response) {
			var stream = response.streams.stream;
			for (var i = 0; i < $scope.internalStreams.length; i++) {
				if($scope.internalStreams[i].idStream==stream.idStream){								
					$scope.internalStreams[i].componenti = Helpers.util.initArrayZeroOneElements(stream.componenti);	
				}
			}
		});

	};



	$scope.loadStream();
	

	$scope.newComponent = null;
	$scope.newComponentUnitOfMeasurement = null;
	$scope.newComponentPhenomenon = null;
	$scope.newComponentDataType = null;

	$scope.addComponent = function(){
		$scope.insertComponentError = null;
		if($scope.newComponent && $scope.newComponent.nome){
			var found = false;

			for (var int = 0; int < $scope.stream.componenti.element.length; int++) {
				if($scope.stream.componenti.element[int].nome == $scope.newComponent.nome){
					found = true;
					break;
				}
			}

			if(!found){
				if($scope.newComponentUnitOfMeasurement){
					$scope.newComponent.idMeasureUnit = $scope.newComponentUnitOfMeasurement.idMeasureUnit;
					$scope.newComponent.measureUnit = $scope.newComponentUnitOfMeasurement.measureUnit;
					$scope.newComponent.measureUnitCategory = $scope.newComponentUnitOfMeasurement.measureUnitType;
				}
				if($scope.newComponentPhenomenom){
					$scope.newComponent.idPhenomenon = $scope.newComponentPhenomenom.idPhenomenon;
					$scope.newComponent.phenomenon = $scope.newComponentPhenomenom.phenomenon;
					$scope.newComponent.phenomenonCategory = $scope.newComponentPhenomenom.phenomenonType;
				}
				if($scope.newComponentDataType){
					$scope.newComponent.idDataType = $scope.newComponentDataType.idDataType;
					$scope.newComponent.dataType = $scope.newComponentDataType.dataType;
				}

				$scope.stream.componenti.element.push($scope.newComponent);
				$scope.newComponent = null;
			}
			else{
				$scope.insertComponentError = 'MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE';
			}
		}
		else
			$scope.insertComponentError = 'MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED';

		return false;
	};

	$scope.removeComponent = function(index){
		$scope.stream.componenti.element.splice(index,1);
		return false;
	};

	$scope.newTag = null;
	$scope.addTag = function(){
		if($scope.newTag){
			var found = false;	
			for (var int = 0; int < $scope.stream.streamTags.tag.length; int++) {
				var existingTag = $scope.stream.streamTags.tag[int];
				if(existingTag.tagCode == $scope.newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.stream.streamTags.tag.push({"tagCode":$scope.newTag});
		}
		$scope.newTag = null;
		return false;

	};

	$scope.removeTag = function(index){
		$scope.stream.streamTags.tag.splice(index,1);
		return false;
	};


	$scope.canInstall = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.canUnistall = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};

	$scope.canEdit = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.canCreateNewVersion = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};


	$scope.cancel = function(){
		$location.path('management/streams');
	};

	$scope.updateStream = function() {
		var newStream = new Object();

		newStream.stream =  $scope.stream;
		newStream.stream.internalQuery=  $scope.streamSiddhiQuery;
	//	newStream.stream.internalQuery = $scope.streamSiddhiQuery;
		newStream.stream.streamInternalChildren={};
		newStream.stream.streamInternalChildren.streamChildren=[];
		for(var i = 0; i< $scope.internalStreams.length; i++){
			newStream.stream.streamInternalChildren.streamChildren.push({
				"aliasChildStream":"input"+i,
				"idChildStream": $scope.internalStreams[i].idStream
			});
		}

		console.log("newStream", newStream);
		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo();
		var promise   = fabricAPIservice.updateStream(newStream);

		promise.then(function(result) {
			$scope.updateInfo = {status: result.status};
			$scope.loadStream();

		}, function(result) {
			$scope.updateError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
			$scope.loadStream();
		}, function(result) {
			console.log('Got notification: ' + result);
		});


	};	

	$scope.requestInstallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_INST);
	};

	$scope.requestUnistallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_UNINST);
	};

	$scope.createNewVersion = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_NEW_VERSION);
	};

	var updateLifecycle = function(action) {
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo();
		var promise   = fabricAPIservice.lifecycleStream(action, $scope.stream);
		promise.then(function(result) {
			console.log("result updateLifecycle ", result);
			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
			$scope.updateInfo = {status: result.status};
			$scope.loadStream();
		}, function(result) {
			$scope.updateError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
			$scope.loadStream();
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};
} ]);



/* VIRTUAL ENTITY */

appControllers.controller('ManagementVirtualentityListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	
	console.log("info.isOwner( $scope.tenantCode);", info.isOwner( $scope.tenantCode));
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.virtualentitiesList = [];
	$scope.filteredVirtualentitiesList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.virtualentitiesList.length;
	$scope.predicate = '';


	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
		// Dig into the responde to get the relevant data
		console.log("response", response);
		if(response.virtualEntities==null)
			response.virtualEntities = {};
		$scope.virtualentitiesList = Helpers.util.initArrayZeroOneElements(response.virtualEntities.virtualEntity);
		$scope.totalItems = $scope.virtualentitiesList.length;
		//$scope.filteredVirtualentitiesList = $scope.virtualentitiesList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		//$scope.filteredVirtualentitiesList = $scope.virtualentitiesList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(virtualentity) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(virtualentity.codeVirtualEntity);
	};

	$scope.searchStatusFilter = function(virtualentity) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(virtualentity.deploymentStatusDesc);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
//		$scope.totalItems = $scope.filteredVirtualentitiesList.length;
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
//		$scope.totalItems = $scope.filteredVirtualentitiesList.length;
	});

	$scope.selectedVirtualentities = [];
	
	$scope.isSelected = function(virtualentity) {
		 return $scope.selectedVirtualentities.indexOf(virtualentity) >= 0;
	};
	
	$scope.isInternal = function(virtualentity) {
		return virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};
		
	$scope.updateSelection = function($event, virtualentity) {
		var checkbox = $event.target;
		 var action = (checkbox.checked ? 'add' : 'remove');
		  updateSelected(action, virtualentity);
	};	
	var updateSelected = function(action, virtualentity) {
		if (action === 'add' && $scope.selectedVirtualentities.indexOf(virtualentity) === -1) {
			$scope.selectedVirtualentities.push(virtualentity);
		}
		if (action === 'remove' && $scope.selectedVirtualentities.indexOf(virtualentity) !== -1) {
			$scope.selectedVirtualentities.splice($scope.selectedVirtualentities.indexOf(virtualentity), 1);
		}
	};
	
	$scope.editVirtualentity = function(){
		if($scope.selectedVirtualentities.length===1){
			$location.path('management/editVirtualentity/'+$scope.selectedVirtualentities[0].codiceTenant +'/'+ $scope.selectedVirtualentities[0].codeVirtualEntity );
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteStream = function(){
		//FIXME forse codice morto!!
//		alert("Funzionalita non ancora abilitata!");
		if($scope.selectedVirtualentities.length>0){
			console.debug("delete Stream");
			//$location.path('management/editStream/'+$scope.selectedVirtualentities[0].codiceTenant +'/'+$scope.selectedVirtualentities[0].codiceVirtualEntity+'/'+$scope.selectedVirtualentities[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
	
	$scope.deleteVirtualentity = function(){
//		alert("Funzionalita non ancora abilitata!");
		if($scope.selectedVirtualentities.length>0){
			console.debug("delete VE");
			//$location.path('management/editStream/'+$scope.selectedVirtualentities[0].codiceTenant +'/'+$scope.selectedVirtualentities[0].codiceVirtualEntity+'/'+$scope.selectedVirtualentities[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);

appControllers.controller('ManagementNewVirtualentityCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info) {
	$scope.tenantCode = $route.current.params.tenant_code;
	
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.categoriesList = [];
	fabricAPIservice.getVirtualentityCategories().success(function(response) {
		$scope.categoriesList = response.categoriaVirtualEntity.element;
	});
	
	$scope.typesList = [];
	fabricAPIservice.getVirtualentityTypes().success(function(response) {
		for (var int = 0; int < response.tipoVirtualEntity.element.length; int++) {
			var virtualentity = response.tipoVirtualEntity.element[int];

			if(virtualentity.idTipoVirtualEntity != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID)
				$scope.typesList.push(virtualentity);
		}

		//$scope.typesList = response.tipoVirtualEntity.element;
	});
	$scope.codeVirtualEntity;
	$scope.generateUUID = function(virtualentity){
		console.log("ui");
		var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
		$scope.codeVirtualEntity = uuid;
	};
	
	//$scope.validationPatternUUID = Constants.VALIDATION_PATTERN_UUID;
	$scope.validationPatternUUID = (function() {
	    return {
	        test: function(value) {
	            if( $scope.selectedType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ) return true;
	            else return Constants.VALIDATION_PATTERN_UUID.test(value);
	        }
	    };
	})();
	
	$scope.selectedType;
	$scope.selectedFeedTweetType=false;
	$scope.selectedCategory = null;
	$scope.creationError = null;
	$scope.isDevice = function() {
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};
	
	$scope.isInternal = function() {
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType.idTipoVirtualEntity == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};
	
	$scope.isCodeRequired = function() {
		console.debug("isCodeRequired function $scope.selectedType ::",$scope.selectedType);
		if(!$scope.selectedType){
			return false;
		}
		//return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ||  $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
		return true;
	};
	
	$scope.enableCodeGeneateButton = function() {
		if(!$scope.selectedType){
			return false;
		}
		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ;
	};
	
	$scope.isCategoryRequired= function() {
		console.debug("isCategoryRequired function $scope.selectedType ::",$scope.selectedType);
		if(!$scope.selectedType){
			return false;
		}
		//return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
		return true;
	};

	
	$scope.selectTypeChange = function() {
		console.debug("selectTypeChange function $scope.selectedType ::", $scope.selectedType);
		$scope.codeVirtualEntity = "";
		$scope.selectedCategory = null;
		return true;
	};
	
	
	
	$scope.createVirtualentity = function(virtualentity) {
		console.log("virtualentity", virtualentity);
		if(!virtualentity)
			virtualentity = new Object();
		
		virtualentity.idTipoVe = $scope.selectedType;
		if($scope.selectedCategory)
			virtualentity.idCategoriaVe = $scope.selectedCategory.idCategoria;
		
		var newVirtualentity = new Object();
		newVirtualentity.codeVirtualEntity = $scope.codeVirtualEntity;
		newVirtualentity.virtualEntity = virtualentity;
		
		console.log("newVirtualentity", newVirtualentity);

		var promise   = fabricAPIservice.createVirtualentity($scope.tenantCode, $scope.codeVirtualEntity,  newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/editVirtualentity/'+$scope.tenantCode +'/'+$scope.codeVirtualEntity);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	
	
	$scope.cancel = function(){    
		$location.path('management/virtualentities'+'/'+$scope.tenantCode);
	};
} ]);

appControllers.controller('ManagementVirtualentityCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'info', function($scope, $routeParams, fabricAPIservice, info) {
	$scope.tenantCode = $routeParams.tenant_code;
	
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.updateInfo = null;
	$scope.updateError = null;

	$scope.virtualentity = null;
	
	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternInteger = Constants.VALIDATION_PATTERN_INTEGER;

	
	$scope.loadVirtualentity = function(){
		fabricAPIservice.getVirtualentity($routeParams.tenant_code, $routeParams.virtualentity_code).success(function(response) {
			$scope.virtualentity = response.virtualEntities.virtualEntity;
			if(!$scope.virtualentity.virtualEntityPositions)
				$scope.virtualentity.virtualEntityPositions = {};
			$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
			if($scope.virtualentity.virtualEntityPositions.position.length == 0){
				$scope.virtualentity.virtualEntityPositions.position.push({});
				$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
			}
			Helpers.util.cleanNilInField($scope.virtualentity);
		});
	};
	
	$scope.loadVirtualentity();

	$scope.initDate = new Date();
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	$scope.cancel = function(){
		$location.path('management/virtualentities');
	};
	
	$scope.isDevice = function() {
		if(!$scope.virtualentity || !$scope.virtualentity.tipoVirtualEntity)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.isInternal = function() {
		if(!$scope.virtualentity || !$scope.virtualentity.tipoVirtualEntity)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	
	$scope.updateVirtualentity = function() {
		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo();

		var newVirtualentity = new Object();
		// FIXME remove when api will be updated
		if($scope.virtualentity.virtualEntityPositions && 
				$scope.virtualentity.virtualEntityPositions.position &&
				$scope.virtualentity.virtualEntityPositions.position.length>0){
			if(!$scope.virtualentity.virtualEntityPositions.position[0].lon)
				$scope.virtualentity.virtualEntityPositions.position[0].lon = 0;
			if(!$scope.virtualentity.virtualEntityPositions.position[0].lat)
				$scope.virtualentity.virtualEntityPositions.position[0].lat = 0;
			if(!$scope.virtualentity.virtualEntityPositions.position[0].elevation)
				$scope.virtualentity.virtualEntityPositions.position[0].elevation = 0;
			if(!$scope.virtualentity.virtualEntityPositions.position[0].floor)
				$scope.virtualentity.virtualEntityPositions.position[0].floor = 0;

		}
		else{
		}
		
		newVirtualentity.virtualEntity =  $scope.virtualentity;
		console.log("newVirtualentity", newVirtualentity);
		var promise   = fabricAPIservice.updateVirtualentity(newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
			$scope.updateInfo = {status: result.status};
		}, function(result) {
			$scope.updateError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});

		
	};	
} ]);



appControllers.controller('ManagementChooseTenantCtrl', [ '$scope', 'fabricAPIservice', function($scope, fabricAPIservice) {
	
	$scope.tenantsList = null;
	
	fabricAPIservice.getTenants().success(function(response) {
		console.log("response",response);
		$scope.tenantsList = response.tenants.tenant;
		console.log("$scope.tenantsList",$scope.tenantsList);

	});
		
} ]);

