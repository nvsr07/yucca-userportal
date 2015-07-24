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
		console.log("isDevice",$scope.selectedType);
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.isTwitter = function() {
		console.log("isTwitter",$scope.selectedType);
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
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
	
	$scope.changeTwitterUser = false;

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
		};

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
				if($scope.virtualentity.idTipoVe != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ){
					return Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY.test(value);
				}
				else {
					return Constants.VALIDATION_PATTERN_UUID.test(value);
				}
			}
		};
	})();

	$scope.validationCodeTooltip = function(){
		if($scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID )
			return 'VALIDATION_PATTERN_UUID_TOOLTIP';
		return 'VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP';
	};

	//var selectedType = null;
	//$scope.selectedFeedTweetType=false;virtualentity.idTipoVe
	//$scope.selectedCategory = null;
	$scope.creationError = null;
	
	$scope.isDevice = function() {
		if(!$scope.virtualentity || $scope.virtualentity.idTipoVe == null)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.isTwitter = function() {
		//console.log("isTwitter",$scope.virtualentity.idTipoVe);
		if(!$scope.virtualentity || $scope.virtualentity.idTipoVe == null)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
	};
	

	$scope.isInternal = function() {
		if(!$scope.virtualentity || !$scope.virtualentity.idTipoVe == null)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	$scope.isCodeRequired = function() {
		if(!$scope.virtualentity || $scope.virtualentity.idTipoVe==null)
			return !$scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID ||  !$scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
		return true;
	};

	$scope.enableCodeGeneateButton = function() {
		if(!$scope.virtualentity || $scope.virtualentity.idTipoVe==null){
			return false;
		}
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ;
	};

	$scope.isCategoryRequired= function() {
		if(!$scope.virtualentity || $scope.virtualentity.idTipoVe==null){
			return false;
		}
		return true;
	};


	var loadTwitterCredential = function(){
		console.log("loadTwitterCredential");
		$scope.twitterCredentialLoading = true;
		$scope.twitterError = null;
		fabricAPIservice.loadTwitterCredential().success(function(response) {
			console.log("result qui ", response);
			$scope.twitterCredentialLoading = false;
			console.log("[loadTwitterCredential] - result.data", response.result);
			if(response.result=="OK"){
				$scope.twitterCredentialFound = true;
				$scope.virtualentity.twtUsername = response.twitterUser.twtUsername;
				$scope.virtualentity.twtUsertoken = response.twitterUser.twtUsertoken;
				$scope.virtualentity.twtTokenSecret = response.twitterUser.twtTokenSecret;
				$scope.virtualentity.twtName = response.twitterUser.twtName;
				$scope.virtualentity.twtIdUser = response.twitterUser.twtIdUser;
				$scope.twtMiniProfileImageURLHttps = response.twitterUser.twtMiniProfileImageURLHttps;
			}
			else{
				$scope.twitterCredentialFound = false;
				$scope.virtualentity.twtUsername = null;
				$scope.virtualentity.twtUsertoken = null;
				$scope.virtualentity.twtTokenSecret = null;
				$scope.virtualentity.twtName = null;
				$scope.virtualentity.twtIdUser = null;
				$scope.twtMiniProfileImageURLHttps = null;
			}
			console.log("[loadTwitterCredential] - isTwitter", $scope.isTwitter());

		}).error(function(data, status, headers, config) {
			$scope.twitterCredentialLoading = false;
			$scope.twitterError = data.message;
		});
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
		$scope.virtualentity.idTipoVe = selectTypeChange;
		$scope.virtualentity.codeVirtualEntity = "";
		$scope.virtualentity.idCategoriaVe = null;
		if($scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			$scope.virtualentity.idCategoriaVe = Constants.VIRTUALENTITY_CATEGORY_NONE;
			loadTwitterCredential();
		}
		return true;
	};


	var isTwitterOk = function(){
		console.log("isTwitterOk",$scope.virtualentity.idTipoVe);
		console.log("isTwitterOk",$scope.virtualentity.twtUsername);
		console.log("isTwitterOk",$scope.virtualentity.twtUsertoken);
		console.log("isTwitterOk",$scope.virtualentity.twtTokenSecret);
		if($scope.virtualentity && $scope.virtualentity.idTipoVe && $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			if($scope.virtualentity.twtUsername && $scope.virtualentity.twtUsername != null && $scope.virtualentity.twtUsername != "" &&
					$scope.virtualentity.twtUsertoken && $scope.virtualentity.twtUsertoken != null && $scope.virtualentity.twtUsertoken != "" &&
					$scope.virtualentity.twtTokenSecret && $scope.virtualentity.twtTokenSecret != null && $scope.virtualentity.twtTokenSecret != "")
				return true;
			else
				return false;
		}
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
			
			var editVirtualentity = $location.search().virtualEntityInSession;
			
			if(editVirtualentity && editVirtualentity!=null){
				$scope.virtualentity  = JSON.parse(decodeURI(editVirtualentity));
				if($scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
					console.log("loadTwitterCredential",loadTwitterCredential);
					loadTwitterCredential();
				}
				$scope.changeTwitterUser =  true;

			}
			else{
				fabricAPIservice.getVirtualentity($routeParams.tenant_code, $routeParams.entity_code).success(function(response) {
					$scope.virtualentity = response.virtualEntities.virtualEntity;
					if(!$scope.virtualentity.virtualEntityPositions)
						$scope.virtualentity.virtualEntityPositions = {};
					$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
					if($scope.virtualentity.virtualEntityPositions.position.length == 0){
						$scope.virtualentity.virtualEntityPositions.position.push({});
						$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
						$scope.virtualentity.virtualEntityPositions.position[0].floor = 0;
					}
					if($scope.virtualentity.twtIdUser == 0)
						$scope.virtualentity.twtIdUser = null;
						
					Helpers.util.cleanNilInField($scope.virtualentity);
				});
			}

		}
		else {
			var newVirtualentity = $location.search().virtualEntityInSession;
			console.log("newVirtualentity", newVirtualentity);
			if(newVirtualentity && newVirtualentity!=null){
				//var newVirtualentityObj = JSON.parse(decodeURI(newVirtualentity));
				$scope.virtualentity  = JSON.parse(decodeURI(newVirtualentity));
				//$scope.selectTypeChange(newVirtualentityObj.idTipoVe);
				console.log("$scope.virtualentity.idTipoVe: ", $scope.virtualentity.idTipoVe);
				if($scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
					console.log("loadTwitterCredential",loadTwitterCredential);
					loadTwitterCredential();
				}

				//$scope.virtualentity  = newVirtualentityObj;

				//$scope.selectedType = $scope.virtualentity.idTipoVe;
			}
			else{
				$scope.virtualentity = {};
				$scope.virtualentity.virtualEntityPositions = {};
				$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
				$scope.virtualentity.virtualEntityPositions.position.push({});
			}//$scope.virtualentity.virtualEntityPositions.position[0].room = 0;

		};
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

	
	$scope.saveWarning = null;
	$scope.save = function(){
		$scope.saveWarning = null;
		if(!isTwitterOk()){
			$scope.saveWarning = 'MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_NOTLOGGED_ERROR';
		}
		else{
			if($scope.isNewVirtualentity){
				$scope.createVirtualentity($scope.virtualentity);
			}
			else
				$scope.updateVirtualentity();
		}
	};

	$scope.cancel = function(){    
		$location.path('management/virtualentities/'+$scope.tenantCode);
	};

	$scope.createVirtualentity = function(virtualentity) {
		console.log("virtualentity", virtualentity);
		if(!virtualentity)
			virtualentity = new Object();

		//virtualentity.idTipoVe = selectedType;
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
				if($scope.virtualentity.virtualEntityPositions.position[0].floor == "" ||$scope.virtualentity.virtualEntityPositions.position[0].floor ==null )
					$scope.virtualentity.virtualEntityPositions.position[0].floor = 0;
				
			};
			
		}
		
		console.log("virtualentity.codeVirtualEntity", virtualentity.codeVirtualEntity);
		console.log("newVirtualentity", newVirtualentity);

		var promise   = fabricAPIservice.createVirtualentity($scope.tenantCode, virtualentity.codeVirtualEntity,  newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/viewVirtualentity/'+$scope.tenantCode +'/'+virtualentity.codeVirtualEntity);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			$scope.creationError.error_message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if($scope.creationError && $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID)
				$scope.creationError.error_detail =  'MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_ERROR_DETAIL';
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	


	
	
	$scope.updateVirtualentity = function() {
		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo("topForm");

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
		
		if($scope.virtualentity.twtIdUser == 0)
			$scope.virtualentity.twtIdUser = null;

		newVirtualentity.virtualEntity =  $scope.virtualentity;
		console.log("newVirtualentity", newVirtualentity);
		console.log("$scope.changeTwitterUser", $scope.changeTwitterUser);
		var promise   = fabricAPIservice.updateVirtualentity(newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
			$scope.updateInfo = {status: result.status};
			if($scope.changeTwitterUser ){
				$scope.loadStreams();
			}
			else
				$scope.changeTwitterUser = false;

		}, function(result) {
			$scope.updateError = angular.fromJson(result.data);
			$scope.updateError.error_message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if($scope.updateError && $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID)
				$scope.updateError.error_detail =  'MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_ERROR_DETAIL';
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});


	};	

	$scope.twitterAuthUrl =  function() {
		var vitualEntityAction = "new";
		var virtualentityCode = "";
		if(!$scope.isNewVirtualentity){
			vitualEntityAction = "edit";
			virtualentityCode = $routeParams.entity_code;
		}
		
		return Constants.API_SERVICES_TWITTER_AUTH_URL+"?vitualEntityAction="+ vitualEntityAction +"&tenant=" + $scope.tenantCode + "&virtualentityCode=" + virtualentityCode  +
				"&virtualEntityInSession="+encodeURI(JSON.stringify($scope.virtualentity));
	};
	
	$scope.twitterError = null;
	$scope.twitterCredentialLoading = false;
	$scope.twitterCredentialFound = false;


	
	$scope.clearTwitterCredential = function(){
		console.log("clearTwitterCredential");
		$scope.twitterCredentialLoading = true;
		$scope.twitterError = null;
		fabricAPIservice.clearTwitterCredential().success(function(response) {
			$scope.twitterCredentialLoading = false;
			loadTwitterCredential();
		}).error(function(data, status, headers, config) {
			$scope.twitterCredentialLoading = false;
			$scope.twitterError = data.message;
		});
	};
	
	$scope.streamsToReinstall = null;

	$scope.STREAM_STATUS_INST = Constants.STREAM_STATUS_INST;
	$scope.loadStreams = function(){
		$scope.showLoadingStreams = true;
		$scope.streamsToReinstall = [];
		fabricAPIservice.getVisibleStreams().then(function(response) {
			console.log("loadStreams",response);
			$scope.showLoadingStreams = false;
			var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
			for (var i = 0; i < responseList.length; i++) {
				console.log("responseList",responseList[i].deploymentStatusCode,responseList[i].codiceVirtualEntity,$routeParams.entity_code);
				if(responseList[i].deploymentStatusCode && 	responseList[i].deploymentStatusCode == Constants.STREAM_STATUS_INST  && responseList[i].codiceVirtualEntity ==  $routeParams.entity_code){
					responseList[i].statusIcon = Helpers.stream.statusIcon(responseList[i]);
					if(!responseList[i].streamIcon || responseList[i].streamIcon == null){
						responseList[i].streamIcon  = "img/stream-icon-default.png";
					}
					var streamRow = {};
					streamRow.stream = responseList[i];
					streamRow.rowIndex = i;
					streamRow.updateOk = false;
					streamRow.updateKo = false;
					streamRow.isUpdating = false;
					$scope.streamsToReinstall.push(streamRow);					
				}
			}			
		});
	};

	
	
	$scope.unInstallStream = function(streamRow){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_UNINST,streamRow, false);
	};

	$scope.reinstallStream = function(streamRow){
		updateLifecycle(Constants.LIFECYCLE_STREAM_NEW_VERSION,streamRow, true);
	};

	
	var updateLifecycle = function(action,streamRow, install) {
		console.log("updateLifecycle stream", streamRow);
		console.log("updateLifecycle action", action);
		streamRow.isUpdating = true;
		var promise   = fabricAPIservice.lifecycleStream(action, streamRow.stream);
		promise.then(function(result) {
			console.log("result updateLifecycle ", result);
			$scope.updateInfo = {status: result.status};
			streamRow.updateOk=true;
			streamRow.updateKo = false;
			streamRow.isUpdating = false;
			$scope.refreshStream(streamRow, install);
			
		}, function(result) {
			console.log("result error ", result);
			//$scope.updateError = angular.fromJson(result.data);

			streamRow.updateOk=false;
			streamRow.updateKo = true;
			streamRow.isUpdating = false;
			$scope.refreshStream(streamRow);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};
	
	$scope.refreshStream = function(streamRow, install){
			fabricAPIservice.getStream(streamRow.stream.codiceTenant, streamRow.stream.codiceVirtualEntity, streamRow.stream.codiceStream).then(function(response) {
				console.log("loadStream",response.streams.stream);
				
				if(! response.streams.stream.streamIcon ||  response.streams.stream.streamIcon == null)
					 response.streams.stream.streamIcon  = "img/stream-icon-default.png";
	
				if(! response.streams.stream.deploymentStatusCode ||  response.streams.stream.deploymentStatusCode == null)
					 response.streams.stream.deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
				response.streams.stream.statusIcon = Helpers.stream.statusIcon(response.streams.stream);

				streamRow.stream = response.streams.stream;
				$scope.streamsToReinstall[streamRow.rowIndex] =  streamRow;
				if(install)
					updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_INST,streamRow, false);
			});
	};

}]);
