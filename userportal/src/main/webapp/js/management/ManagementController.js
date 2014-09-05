/* Controllers */

appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route", function($scope, $route) {
	$scope.$route = $route;
	$scope.managementTab = $route.current.params.managementTab;
	$scope.tenant = $route.current.params.tenant_code;

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




appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', function($scope, $route, $location, fabricAPIservice, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';

	fabricAPIservice.getStreams(/*$scope.tenantCode*/).success(function(response) {
		// FIXME remove when the new api with tenant parameterwill be ready
		for (var i = 0; i < response.streams.stream.length; i++) {
			if(response.streams.stream[i].codiceTenant == $scope.tenantCode){
				if(!response.streams.stream[i].statoStream || response.streams.stream[i].statoStream == null)
					response.streams.stream[i].statoStream = Constants.STREAM_STATUS_DRAFT;
				$scope.streamsList.push(response.streams.stream[i]);
			}
		}
		//$scope.streamsList = response.streams.stream;
		$scope.totalItems = $scope.streamsList.length;
		$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream);
	};

	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(stream.status);
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
	
	$scope.editStream = function(){
		if($scope.selectedStreams.length===1){
			
			$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteStream = function(){
		if($scope.selectedStreams.length>0){
			
			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);


appControllers.controller('ManagementNewStreamCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', function($scope, $route, $location, fabricAPIservice) {
	$scope.tenantCode = $route.current.params.tenant_code;
	
	$scope.virtualEntitiesList = [];
	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
		console.log(response.virtualEntities.virtualEntity);
		for (var int = 0; int < response.virtualEntities.virtualEntity.length; int++) {
			var virtualentity = response.virtualEntities.virtualEntity[int];
			if(virtualentity.idTipoVe != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID)
				$scope.virtualEntitiesList.push(virtualentity);
		}
		// TODO: manage virtual entity type internal
		//$scope.virtualEntitiesList = response.virtualEntities.virtualEntity;
	});
	$scope.creationError = null;
	$scope.createStream = function(virtualentity, stream) {
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
		$location.path('management/streams');
	};
} ]);



appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', function($scope, $routeParams, fabricAPIservice) {
	
	$scope.unitOfMesaurementList = [
	                                {name:'cm', type: 'Length'},
	                                {name:'m', type: 'Length'},
	                                {name:'km', type: 'Length'},
	                                {name:'mg', type: 'Weight'},
	                                {name:'g', type: 'Weight'},
	                                {name:'kg', type: 'Weight'},
	                               ];
	
	$scope.phenomenomList = [
	                         {name:'Wind Speed', type: 'Type 1'},
	                         {name:'Air Temperature', type: 'Type 1'},
	                         {name:'Measure 03', type: 'Type 1'},
	                         {name:'Measure 01', type: 'Type 2'},
	                         {name:'Measure 02', type: 'Type 2'},
	                         {name:'Measure 03', type: 'Type 2'},
	                         ];

	$scope.updateInfo = null;
	$scope.updateError = null;
	$scope.insertComponentError = null;
	

	$scope.dataTypeList = ['String', 'Number', 'Date'];

	$scope.tagList = [];
	$scope.tagList = fabricAPIservice.getStreamTags();
	
	/*fabricAPIservice.getStreamTags().success(function(response) {
		$scope.tagList = response;
	});*/

	$scope.domainList = [];
	$scope.domainList = fabricAPIservice.getStreamDomains();
	
	$scope.componentJsonExample = "{\"stream\": \"....\",\n \"sensor\": \"....\",\n \"values\":\n  [{\"time\": \"....\",\n    \"components\":\n     {\"wind\":\"1.4\"}\n  }]\n}";
	/*fabricAPIservice.getStreamDomains().success(function(response) {
		$scope.domainList = response;
	});*/

	
	$scope.stream = null;
	$scope.loadStream = function(){
		fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).success(function(response) {
			$scope.stream = response.streams.stream;
			if(!$scope.stream.tags)
				$scope.stream.tags = [];
			if($scope.stream.componenti == null)
				$scope.stream.componenti = new Object();
			console.log("--components");
			$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);
			
			// FIXME remove in future version
			$scope.stream.saveData = 'false';
			$scope.stream.visibiity = 'public';
			$scope.stream.publish = 'false';	
			if(!$scope.stream.statoStream || $scope.stream.statoStream == null)
				$scope.stream.statoStream = Constants.STREAM_STATUS_DRAFT;

		});
		
	};
	
	$scope.loadStream();
	//$scope.virtualEntitiesList = [];
	//fabricAPIservice.getVirtualEntities($routeParams.tenant_code).success(function(response) {
	//	$scope.virtualEntitiesList = response.virtualEntities.virtualEntity;
	//});
	
	
	$scope.newComponent = null;
	$scope.addComponent = function(){
		$scope.insertComponentError = null;
		if($scope.newComponent && $scope.newComponent.nome){
			var found = false;
			//console.log("$scope.stream.componenti.element prima",$scope.stream.componenti.element);
			//$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);
			//console.log("$scope.stream.componenti.element dopo",$scope.stream.componenti.element);

		/*	if(!$scope.stream.componenti.element)
				$scope.stream.componenti.element = [];
			if ($scope.stream.componenti.element !instanceof Array){
				
			}*/
			for (var int = 0; int < $scope.stream.componenti.element.length; int++) {
				if($scope.stream.componenti.element[int].nome == $scope.newComponent.nome){
					found = true;
					break;
				}
			}
			if(!found){
				console.log("$scope.stream.componenti.element ccc",$scope.stream.componenti);
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
		$scope.stream.componenti.splice(index,1);
		return false;
	};

	$scope.newTag = null;
	$scope.addTag = function(){
		if($scope.newTag && $scope.stream.tags.indexOf($scope.newTag)==-1){
			$scope.stream.tags.push($scope.newTag);
		}
		$scope.newTag = null;
		return false;
		
	};
	
	$scope.removeTag = function(index){
		$scope.stream.tags.splice(index,1);
		return false;
	};

	console.debug("$scope.stream", $scope.stream);

	$scope.canInstall = function() {
		if($scope.stream && $scope.stream.statoStream == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.canEdit = function() {
		if($scope.stream && $scope.stream.statoStream == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.cancel = function(){
		$location.path('management/streams');
	};
	
	$scope.updateStream = function() {
		var newStream = new Object();
		newStream.stream =  $scope.stream;
		console.log("newStream", newStream);
		//var promise   = fabricAPIservice.updateStream($scope.tenantCode, $scope.codeVirtualEntity,  newStream);
		var promise   = fabricAPIservice.createComponents(newStream);
		console.log("newStream");
		
		promise.then(function(result) {
			console.log("result qui ", result);
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
	
	$scope.requestInstallation = function(){
		$scope.stream.stato = Constants.STREAM_STATUS_REQ_INST;
		$scope.stream.statoStream = Constants.STREAM_STATUS_REQ_INST;
		
		console.log("requestInstallation", $scope.stream);
		var promise   = fabricAPIservice.updateStream($scope.tenantCode, $scope.codeVirtualEntity,  $scope.stream);
		
		promise.then(function(result) {
			console.log("result qui ", result);
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

appControllers.controller('ManagementVirtualentityListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', function($scope, $route, $location, fabricAPIservice, filterFilter) {
	$scope.tenantCode =  $route.current.params.tenant_code;
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
		$scope.virtualentitiesList = response.virtualEntities.virtualEntity;
		console.log("$scope.virtualentitiesList", $scope.virtualentitiesList);

		$scope.totalItems = $scope.virtualentitiesList.length;
		$scope.filteredVirtualentitiesList = $scope.virtualentitiesList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		$scope.filteredVirtualentitiesList = $scope.virtualentitiesList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(virtualentity) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(virtualentity.codeVirtualEntity);
	};

	$scope.searchStatusFilter = function(virtualentity) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(virtualentity.status);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredVirtualentitiesList.length;
		console.log("newCode", newCode);
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredVirtualentitiesList.length;
		console.log("newStatus", newStatus);
	});

	$scope.selectedVirtualentities = [];
	
	$scope.isSelected = function(virtualentity) {
		 return $scope.selectedVirtualentities.indexOf(virtualentity) >= 0;
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
		if($scope.selectedVirtualentities.length>0){
			
			//$location.path('management/editStream/'+$scope.selectedVirtualentities[0].codiceTenant +'/'+$scope.selectedVirtualentities[0].codiceVirtualEntity+'/'+$scope.selectedVirtualentities[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);

appControllers.controller('ManagementNewVirtualentityCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', function($scope, $route, $location, fabricAPIservice) {
	$scope.tenantCode = $route.current.params.tenant_code;
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
	
	$scope.uuidPattern = (function() {
	    var regexp = '/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/';
	    return {
	        test: function(value) {
	        	console.log("UUID TEST");
	        	console.log("value",value);
	        	console.log("test",regexp.test(value));
	           return regexp.test(value);
	        }
	    };
	})();
	

	
	$scope.selectedType;
	$scope.selectedCategory;
	$scope.creationError = null;

	$scope.isDevice = function() {
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType.idTipoVirtualEntity == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};
	
	$scope.isInternal = function() {
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType.idTipoVirtualEntity == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};
	
	$scope.isCodeRequired = function() {
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType.idTipoVirtualEntity != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};
	

	
	$scope.selectTypeChange = function() {
		if(!$scope.selectedType || $scope.selectedType.idTipoVirtualEntity != 1){
		   $scope.codeVirtualEntity = "";
		   $scope.selectedCategory = "";
	   }
	   return false;
	}
	
	$scope.createVirtualentity = function(virtualentity) {
		console.log("virtualentity", virtualentity);
		if(!virtualentity)
			virtualentity = new Object();
		
		virtualentity.idTipoVe = $scope.selectedType.idTipoVirtualEntity;
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
		$location.path('management/virtualEntities');
	};
} ]);

appControllers.controller('ManagementVirtualentityCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', function($scope, $routeParams, fabricAPIservice) {
	
	$scope.updateInfo = null;
	$scope.updateError = null;

	$scope.virtualentity = null;
	
	$scope.loadVirtualentity = function(){
		fabricAPIservice.getVirtualentity($routeParams.tenant_code, $routeParams.virtualentity_code).success(function(response) {
			$scope.virtualentity = response.virtualEntities.virtualEntity;
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
		if(!$scope.virtualentity.tipoVirtualEntity)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	
	$scope.updateVirtualentity = function() {
		var newVirtualentity = new Object();
		newVirtualentity.virtualentity =  $scope.virtualentity;
		console.log("newVirtualentity", newVirtualentity);
		var promise   = fabricAPIservice.updateVirtualentity($scope.tenantCode, $scope.codeVirtualEntity,  newVirtualentity);
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

