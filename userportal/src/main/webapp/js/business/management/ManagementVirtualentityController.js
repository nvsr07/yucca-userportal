appControllers.controller('ManagementVirtualentityListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;


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
		$scope.showLoading = false;

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


appControllers.controller('ManagementVirtualentityWizardCtrl', [ '$scope', function($scope) {
	$scope.currentStep = 'register';
	$scope.wizardSteps = [{'name':'register', 'style':''},
	                      {'name':'position', 'style':''},
	                      {'name':'detail', 'style':''},
	                      ];

	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};

	refreshWizardToolbar();
	$scope.goToRegister  = function(){ $scope.currentStep = 'register'; refreshWizardToolbar();};
	$scope.goToPosition  = function(){ $scope.currentStep = 'position';refreshWizardToolbar();};
	$scope.goToDetail  = function(){ $scope.currentStep = 'detail';refreshWizardToolbar();};
	

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
				if( $scope.selectedType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ){
					return Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY.test(value);
				}
				else 
					return Constants.VALIDATION_PATTERN_UUID.test(value);
			}
		};
	})();

	$scope.validationCodeTooltip = function(){
		if( $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID )
			return 'VALIDATION_PATTERN_UUID_TOOLTIP';
		return 'VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP';
	};
	
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
		$location.path('management/virtualentities/'+$scope.tenantCode);
	};
} ]);

appControllers.controller('ManagementVirtualentityCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'info', '$location', function($scope, $routeParams, fabricAPIservice, info, $location) {
	$scope.tenantCode = $routeParams.tenant_code;

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
	
	
	$scope.generateUUID = function(virtualentity){
		console.log("ui");
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		$scope.virtualentity.codeVirtualEntity = uuid;
	};

	//$scope.validationPatternUUID = Constants.VALIDATION_PATTERN_UUID;
	$scope.validationPatternUUID = (function() {
		return {
			test: function(value) {
				if(selectedType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ){
					return Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY.test(value);
				}
				else {
					return Constants.VALIDATION_PATTERN_UUID.test(value);
				}
			}
		};
	})();

	$scope.validationCodeTooltip = function(){
		if(selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID )
			return 'VALIDATION_PATTERN_UUID_TOOLTIP';
		return 'VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP';
	};

	var selectedType = null;
	//$scope.selectedFeedTweetType=false;
	//$scope.selectedCategory = null;
	$scope.creationError = null;
	$scope.isDevice = function() {
		if(selectedType == null)
			return false;
		return selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

//	
//	$scope.isDevice = function() {
//		if(!$scope.virtualentity || !$scope.virtualentity.tipoVirtualEntity)
//			return false;
//		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
//	};


	$scope.isInternal = function() {
		if(!selectedType == null)
			return false;
		return selectedType.idTipoVirtualEntity == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	$scope.isCodeRequired = function() {
		if(selectedType==null){
			return false;
		}
		//return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ||  $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
		return true;
	};

	$scope.enableCodeGeneateButton = function() {
		if(selectedType==null){
			return false;
		}
		return selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ;
	};

	$scope.isCategoryRequired= function() {
		if(selectedType==null){
			return false;
		}
		return true;
	};


	$scope.selectTypeChange = function(selectTypeChange) {
		if($scope.wizardSteps && $scope.wizardSteps!=null){
			if(selectTypeChange != Constants.VIRTUALENTITY_TYPE_DEVICE_ID){
				$scope.wizardSteps[1].style = "step-disabled";
				$scope.wizardSteps[2].style = "step-disabled";
			}
			else{
				$scope.wizardSteps[1].style = "";
				$scope.wizardSteps[2].style = "";
			}
		}
		selectedType = selectTypeChange;
		$scope.virtualentity.codeVirtualEntity = "";
		$scope.virtualentity.idCategoriaVe = null;
		
		//$scope.codeVirtualEntity = "";
		//$scope.selectedCategory = null;
		return true;
	};





	$scope.updateInfo = null;
	$scope.updateError = null;

	$scope.virtualentity = null;

	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternInteger = Constants.VALIDATION_PATTERN_INTEGER;

	$scope.isNewVirtualentity = false;
	if(!$routeParams.entity_code || $routeParams.entity_code == null || $routeParams.entity_code === undefined )
		$scope.isNewVirtualentity = true;
	
	$scope.loadVirtualentity = function(){
		if(!$scope.isNewVirtualentity){
			fabricAPIservice.getVirtualentity($routeParams.tenant_code, $routeParams.entity_code).success(function(response) {
				$scope.virtualentity = response.virtualEntities.virtualEntity;
				if(!$scope.virtualentity.virtualEntityPositions)
					$scope.virtualentity.virtualEntityPositions = {};
				$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
				if($scope.virtualentity.virtualEntityPositions.position.length == 0){
					$scope.virtualentity.virtualEntityPositions.position.push({});
					$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
				}
				Helpers.util.cleanNilInField($scope.virtualentity);
				selectedType = $scope.virtualentity.idTipoVe;
			});
		}
		else {
			$scope.virtualentity = {};
			$scope.virtualentity.virtualEntityPositions = {};
			$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
			$scope.virtualentity.virtualEntityPositions.position.push({});
			//$scope.virtualentity.virtualEntityPositions.position[0].room = 0;

		}
	};

	$scope.loadVirtualentity();

	$scope.initDate = new Date();
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];


	$scope.isInternal = function() {
		if(!$scope.virtualentity || !$scope.virtualentity.tipoVirtualEntity)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	
	$scope.save = function(){
		if($scope.isNewVirtualentity)
			$scope.createVirtualentity($scope.virtualentity);
		else
			$scope.updateVirtualentity();
	};

	$scope.cancel = function(){    
		$location.path('management/virtualentities/'+$scope.tenantCode);
	};

	$scope.createVirtualentity = function(virtualentity) {
		console.log("virtualentity", virtualentity);
		if(!virtualentity)
			virtualentity = new Object();

		virtualentity.idTipoVe = selectedType;
		//if($scope.selectedCategory)
		//	virtualentity.idCategoriaVe = $scope.selectedCategory.idCategoria;

		var newVirtualentity = new Object();
		newVirtualentity.codeVirtualEntity = virtualentity.codeVirtualEntity;
		newVirtualentity.virtualEntity = virtualentity;
		if(newVirtualentity.virtualEntity.idTipoVe != Constants.VIRTUALENTITY_TYPE_DEVICE_ID)
			newVirtualentity.virtualEntity.virtualEntityPositions=null;
		else{
			if(($scope.virtualentity.virtualEntityPositions.position[0].lat == "" ||$scope.virtualentity.virtualEntityPositions.position[0].lat==null)
					&& ($scope.virtualentity.virtualEntityPositions.position[0].lon=="" || $scope.virtualentity.virtualEntityPositions.position[0].lon==null)){
				newVirtualentity.virtualEntity.virtualEntityPositions=null;
			} else {
				if($scope.virtualentity.virtualEntityPositions.position[0].room == "" ||$scope.virtualentity.virtualEntityPositions.position[0].room ==null )
					$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
				if($scope.virtualentity.virtualEntityPositions.position[0].elevation == "" ||$scope.virtualentity.virtualEntityPositions.position[0].elevation ==null )
					$scope.virtualentity.virtualEntityPositions.position[0].elevation = 0;
				
			}
			
		}
		
		console.log("virtualentity.codeVirtualEntity", virtualentity.codeVirtualEntity);
		console.log("newVirtualentity", newVirtualentity);

		var promise   = fabricAPIservice.createVirtualentity($scope.tenantCode, virtualentity.codeVirtualEntity,  newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/viewVirtualentity/'+$scope.tenantCode +'/'+virtualentity.codeVirtualEntity);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
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
