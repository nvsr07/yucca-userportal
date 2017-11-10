appControllers.controller('ManagementVirtualentityListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'adminAPIservice', 'info', 
                                                               function($scope, $route, $location, fabricAPIservice, adminAPIservice, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;


	console.log("info.isOwner( $scope.tenantCode);", info.isOwner( $scope.tenantCode));
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.soList = [];
	$scope.filteredSoList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.soList.length;
	$scope.predicate = '';

	
	
	adminAPIservice.loadSmartobjects(info.getActiveTenant()).success(function(response) {
		$scope.unexpectedError = false;
		$scope.showLoading = false;
		console.log("response", response);
		if(response==null)
			response = {};
		$scope.soList = response;
		$scope.totalItems = $scope.soList.length;
		//$scope.filteredSoList = $scope.soList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	}).error(function(response) {
		console.error("loadSmartobjects ERROR",response);
		$scope.unexpectedError = true;
	});

	
	
//	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
//		$scope.showLoading = false;
//
//		// Dig into the responde to get the relevant data
//		console.log("response", response);
//		if(response.virtualEntities==null)
//			response.virtualEntities = {};
//		$scope.soList = Helpers.util.initArrayZeroOneElements(response.virtualEntities.virtualEntity);
//		$scope.totalItems = $scope.soList.length;
//		//$scope.filteredSoList = $scope.soList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
//	});

	$scope.selectPage = function() {
		//$scope.filteredSoList = $scope.soList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(so) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(so.socode);
	};

//	$scope.searchStatusFilter = function(virtualentity) {
//		var keyword = new RegExp($scope.statusFilter, 'i');
//		return !$scope.statusFilter || keyword.test(virtualentity.deploymentStatusDesc);
//	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
//		$scope.totalItems = $scope.filteredSoList.length;
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
//		$scope.totalItems = $scope.filteredSoList.length;
	});

	$scope.selectedSo = [];

	$scope.isSelected = function(so) {
		return $scope.selectedSo.indexOf(so) >= 0;
	};

	$scope.isInternal = function(so) {
		return so.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	$scope.updateSelection = function($event, so) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, so);
	};	
	var updateSelected = function(action, so) {
		if (action === 'add' && $scope.selectedSo.indexOf(so) === -1) {
			$scope.selectedSo.push(so);
		}
		if (action === 'remove' && $scope.selectedSo.indexOf(so) !== -1) {
			$scope.selectedSo.splice($scope.selectedSo.indexOf(so), 1);
		}
	};

	$scope.editSo = function(){
		if($scope.selectedSo.length===1){
			$location.path('management/editVirtualentity/'+$scope.selectedSo[0].organization.organizationcode +'/'+ $scope.selectedSo[0].socode );
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

//appControllers.controller('ManagementNewVirtualentityCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'adminAPIservice','info', function($scope, $route, $location, fabricAPIservice, adminAPIservice, info) {
//	$scope.tenantCode = $route.current.params.tenant_code;
//
//	$scope.isOwner = function(){
//		return info.isOwner( $scope.tenantCode);
//	};
//
//
//	$scope.so_categoriesList = [];
//	adminAPIservice.loadSOCategories().success(function(response) {
//		console.log("loadSOCategories", loadSOCategories);
//		$scope.so_categoriesList = response.categoriaVirtualEntity.element;
//	});
////	fabricAPIservice.getVirtualentityCategories().success(function(response) {
////		$scope.so_categoriesList = response.categoriaVirtualEntity.element;
////	});
//
//	
//	$scope.so_typesList = [];
//	fabricAPIservice.loadSOTypes().success(function(response) {
//		for (var int = 0; int < response.length; int++) {
//			if(response[int].idSoType != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID)
//				$scope.so_typesList.push(response[int]);
//		}
//
//	});
////	fabricAPIservice.getVirtualentityTypes().success(function(response) {
////		for (var int = 0; int < response.tipoVirtualEntity.element.length; int++) {
////			var virtualentity = response.tipoVirtualEntity.element[int];
////
////			if(virtualentity.idTipoVirtualEntity != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID)
////				$scope.typesList.push(virtualentity);
////		}
////
////	});
//
//	$scope.codeVirtualEntity;
//	$scope.generateUUID = function(virtualentity){
//		console.log("ui");
//		var d = new Date().getTime();
//		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//			var r = (d + Math.random()*16)%16 | 0;
//			d = Math.floor(d/16);
//			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
//		});
//		$scope.codeVirtualEntity = uuid;
//	};
//
//	//$scope.validationPatternUUID = Constants.VALIDATION_PATTERN_UUID;
//	$scope.validationPatternUUID = (function() {
//		return {
//			test: function(value) {
//				if( $scope.selectedType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ){
//					return Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY.test(value);
//				}
//				else 
//					return Constants.VALIDATION_PATTERN_UUID.test(value);
//			}
//		};
//	})();
//
//	$scope.validationCodeTooltip = function(){
//		if( $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID )
//			return 'VALIDATION_PATTERN_UUID_TOOLTIP';
//		return 'VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP';
//	};
//	
//	$scope.selectedType;
//	$scope.selectedFeedTweetType=false;
//	$scope.selectedCategory = null;
//	$scope.creationError = null;
//	
//	$scope.isDevice = function() {
//		console.log("isDevice",$scope.selectedType);
//		if(!$scope.selectedType)
//			return false;
//		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
//	};
//
//	$scope.isTwitter = function() {
//		console.log("isTwitter",$scope.selectedType);
//		if(!$scope.selectedType)
//			return false;
//		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
//	};
//	
//	$scope.isInternal = function() {
//		if(!$scope.selectedType)
//			return false;
//		return $scope.selectedType.idTipoVirtualEntity == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
//	};
//
//	$scope.isCodeRequired = function() {
//		console.debug("isCodeRequired function $scope.selectedType ::",$scope.selectedType);
//		if(!$scope.selectedType){
//			return false;
//		}
//		//return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ||  $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
//		return true;
//	};
//
//	$scope.enableCodeGeneateButton = function() {
//		if(!$scope.selectedType){
//			return false;
//		}
//		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ;
//	};
//
//	$scope.isCategoryRequired= function() {
//		console.debug("isCategoryRequired function $scope.selectedType ::",$scope.selectedType);
//		if(!$scope.selectedType){
//			return false;
//		}
//		//return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
//		return true;
//	};
//
//
//	$scope.selectTypeChange = function() {
//		console.debug("selectTypeChange function $scope.selectedType ::", $scope.selectedType);
//		$scope.codeVirtualEntity = "";
//		$scope.selectedCategory = null;
//		return true;
//	};
//
//
//
//	$scope.createVirtualentity = function(virtualentity) {
//		console.log("virtualentity", virtualentity);
//		if(!virtualentity)
//			virtualentity = new Object();
//
//		virtualentity.idTipoVe = $scope.selectedType;
//		if($scope.selectedCategory)
//			virtualentity.idCategoriaVe = $scope.selectedCategory.idCategoria;
//
//		var newVirtualentity = new Object();
//		newVirtualentity.codeVirtualEntity = $scope.codeVirtualEntity;
//		newVirtualentity.virtualEntity = virtualentity;
//
//		console.log("newVirtualentity", newVirtualentity);
//
//		$scope.isUpdating = true;
//		var promise   = fabricAPIservice.createVirtualentity($scope.tenantCode, $scope.codeVirtualEntity,  newVirtualentity);
//		promise.then(function(result) {
//			$scope.isUpdating = false;
//			console.log("result qui ", result);
//			$location.path('management/editVirtualentity/'+$scope.tenantCode +'/'+$scope.codeVirtualEntity);
//		}, function(result) {
//			$scope.isUpdating = false;
//			$scope.creationError = angular.fromJson(result.data);
//			console.log("result.data ", result.data);
//		}, function(result) {
//			console.log('Got notification: ' + result);
//		});
//	};	
//
//	$scope.cancel = function(){    
//		$location.path('management/virtualentities/'+$scope.tenantCode);
//	};
//} ]);

appControllers.controller('ManagementVirtualentityCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'adminAPIservice', 'sharedAdminResponse', 'info', '$location', 
                                                           function($scope, $routeParams, fabricAPIservice, adminAPIservice, sharedAdminResponse, info, $location) {
	$scope.tenantCode = $routeParams.tenant_code;
	
	$scope.changeTwitterUser = false;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	$scope.so_categoriesList = [];
	adminAPIservice.loadSOCategories().success(function(response) {
		console.log("loadSOCategories", response);
		$scope.so_categoriesList = response;
	});
//	fabricAPIservice.getVirtualentityCategories().success(function(response) {
//		$scope.so_categoriesList = response.categoriaVirtualEntity.element;
//	});

	$scope.so_typesList = [];
	adminAPIservice.loadSOTypes().success(function(response) {
		for (var int = 0; int < response.length; int++) {

			if(response[int].idSoType != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID)
				$scope.so_typesList.push(response[int]);
		};
	});
	
	$scope.locationTypeList = [];
	adminAPIservice.loadLocationTypes().success(function(response) {
		$scope.locationTypeList = response;
	});
	
	$scope.supplyTypeList = [];
	adminAPIservice.loadSupplyTypes().success(function(response) {
		$scope.supplyTypeList = response;
	});
	
	$scope.exposureTypeList = [];
	adminAPIservice.loadExposureTypes().success(function(response) {
		$scope.exposureTypeList = response;
	});
	
	
	$scope.admin_response = sharedAdminResponse.getResponse();
	
	
	$scope.generateUUID = function(virtualentity){
		console.log("ui");
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		$scope.so.socode= uuid;
	};
		
	$scope.slugDisabled = function(e){
		var rtnBool = false;
		if((typeof $scope.so.name) == 'undefined'){
			rtnBool = true;
		} else {
			if ($scope.so.name.length < 1){
				rtnBool = true;
			}
		}
		if (rtnBool){
			$scope.so.slug = '';
		}
		return rtnBool;	
	};
	
	$scope.isValidSlug = false;
	
	
	$scope.checkSlug = function(slugInput){
		  var validChars = /[^a-zA-Z0-9]/g;
		  if (validChars.test(slugInput)) {
			$scope.isValidSlug = false;
		    return true;
		  } else {
			  $scope.isValidSlug = true;
			  return false;
		  }
	};
	
	var soList = null;
	$scope.clearSlug = function(slugInput){
		$scope.isValidSlug = false;
		var d = new Date().getTime();

		var firstSlug = slugInput.replace(/[^a-zA-Z0-9]/g, '');
		
		var rtnBool = false;
		adminAPIservice.loadSmartobjects(info.getActiveTenant()).success(function(response) {
			console.debug("response", response);
			soList = response;
			soList.forEach(function(item) {
			    if (firstSlug == item.slug){
			    	rtnBool = true;
			    }
			});
	
			if (rtnBool){
				var slug = firstSlug+'xxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random()*16)%16 | 0;
					d = Math.floor(d/16);
					return (c=='x' ? r : (r&0x7|0x8)).toString(16);
				});
				var rtnBool2 = false;
				if ($scope.so.name.length >= 1){
					soList.forEach(function(item) {
					    if (slug == item.slug){
					    	rtnBool2 = true;
					    }
					});
					if (!rtnBool2){
						$scope.so.slug = slug;
					} else {
						console.error("rtnBool2",rtnBool2);
					}
				}
			} else {
				$scope.isValidSlug = true;
				$scope.so.slug = firstSlug;
			}
		
		}).error(function(response) {
			console.error("loadSmartobjects ERROR",response);
		});
		
//		var promise = fabricAPIservice.getVirtualentityByTenant($scope.tenantCode);
//		promise.then(function(result) {
//			var vEntities = Helpers.util.initArrayZeroOneElements(result.data.virtualEntities.virtualEntity);
//			console.log(vEntities);
//			vEntities.forEach(function(item) {
//			    //console.log(item.virtualEntitySlug);
//			    if (firstSlug == item.virtualEntitySlug){
//			    	rtnBool = true;
//			    }
//			});
//	
//			if (rtnBool){
//				var slug = firstSlug+'xxx'.replace(/[xy]/g, function(c) {
//					var r = (d + Math.random()*16)%16 | 0;
//					d = Math.floor(d/16);
//					return (c=='x' ? r : (r&0x7|0x8)).toString(16);
//				});
//				var rtnBool2 = false;
//				if ($scope.virtualentity.virtualEntityName.length >= 1){
//					vEntities.forEach(function(item) {
//					    console.log(item.virtualEntitySlug);
//					    if (slug == item.virtualEntitySlug){
//					    	rtnBool2 = true;
//					    }
//					});
//					if (!rtnBool2){
//						$scope.virtualentity.virtualEntitySlug = slug;
//					} else {
//						console.error("rtnBool2",rtnBool2);
//					}
//				}
//			} else {
//				$scope.isValidSlug = true;
//				$scope.virtualentity.virtualEntitySlug = firstSlug;
//			}
//		}, function(reason) {
//		  console.log('Failed: ');
//		  console.log(reason);
//		}, function(update) {
//		  console.log('Got notification: ');
//		  console.log(update);
//		});
	};
	
	$scope.generateSLUG = function(){
		if(typeof $scope.so.name!='undefined')
			$scope.clearSlug($scope.so.name);
	};


	findDuplicateSlug = function(tenantCode, slugTest){
		var rtn = false;
		if(soList==null){
		
			adminAPIservice.loadSmartobjects(info.getActiveTenant()).success(function(response) {
				soList.forEach(function(item) {
				    console.log(item.virtualEntitySlug);
				    if (slugTest == item.virtualEntitySlug){
				    	rtn = true;
				    }
				});
				return rtn;
			}).error(function(response) {
				console.error("loadSmartobjects ERROR",response);
			});
		}
		else{
			soList.forEach(function(item) {
			    console.log(item.virtualEntitySlug);
			    if (slugTest == item.virtualEntitySlug){
			    	rtn = true;
			    }
			});
			return rtn;
		}
//		var promise = fabricAPIservice.getVirtualentityByTenant(tenantCode);
//		promise.then(function(result) {
//			var vEntities = result.data.virtualEntities.virtualEntity;
//			console.log(vEntities);
//			vEntities.forEach(function(item) {
//			    console.log(item.virtualEntitySlug);
//			    if (slugTest == item.virtualEntitySlug){
//			    	rtn = true;
//			    }
//			});
//
//			return rtn;
//		}, function(result) {
//			console.log("result data ", result.data);
//			return rtn;
//		}, function(result) {
//			console.log('Got notification: ' + result);
//
//			return rtn;
//		});
	};

	//$scope.validationPatternUUID = Constants.VALIDATION_PATTERN_UUID;
	$scope.validationPatternUUID = (function() {
		return {
			test: function(value) {
				if($scope.so.idSoType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ){
					return Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY.test(value);
				}
				else {
					return Constants.VALIDATION_PATTERN_UUID.test(value);
				}
			}
		};
	})();

	$scope.validationCodeTooltip = function(){
		if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID )
			return 'VALIDATION_PATTERN_UUID_TOOLTIP';
		return 'VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP';
	};

	//var selectedType = null;
	//$scope.selectedFeedTweetType=false;virtualentity.idTipoVe
	//$scope.selectedCategory = null;
	$scope.creationError = null;
	
	$scope.isDevice = function() {
		if(!$scope.so || $scope.so.idSoType == null)
			return false;
		return $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.isTwitter = function() {
		//console.log("isTwitter",$scope.so.soType.idSoType);
		if(!$scope.so || $scope.so.idSoType == null)
			return false;
		return $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
	};
	

//	$scope.isInternal = function() {
//		if(!$scope.so || $scope.so.idSoType == null)
//			return false;
//		return $scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
//	};

	$scope.isCodeRequired = function() {
		return !$scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID ||  !$scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.enableCodeGeneateButton = function() {
		if(!$scope.so || $scope.so.idSoType==null){
			return false;
		}
		return $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ;
	};

	$scope.isCategoryRequired= function() {
		if(!$scope.so || $scope.so.idSoType==null){
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
				$scope.so.twtusername = response.twitterUser.twtUsername;
				$scope.so.twtusertoken = response.twitterUser.twtUsertoken;
				$scope.so.twttokensecret = response.twitterUser.twtTokenSecret;
				$scope.so.twtname = response.twitterUser.twtName;
				$scope.so.twtuserid = response.twitterUser.twtIdUser;
				$scope.twtMiniProfileImageURLHttps = response.twitterUser.twtMiniProfileImageURLHttps;
			}
			else{
				$scope.twitterCredentialFound = false;
				$scope.so.twtusername = null;
				$scope.so.twtusertoken = null;
				$scope.so.twttokensecret = null;
				$scope.so.twtname = null;
				$scope.so.twtuserid = null;
				$scope.twtMiniProfileImageURLHttps = null;
			}
			console.log("[loadTwitterCredential] - isTwitter", $scope.isTwitter());

		}).error(function(data, status, headers, config) {
			$scope.twitterCredentialLoading = false;
			$scope.twitterError = data.message;
		});
		
		console.log("[loadTwitterCredential] - tenant 1 = ", $routeParams.tenant_code);
		console.log("[loadTwitterCredential] - tenant 2 = ", $scope.tenantCode);
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
		$scope.so.idSoType = selectTypeChange;
		$scope.so.socode= "";
		$scope.so.idSoCategory = null;
		if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			$scope.so.idSoCategory = Constants.VIRTUALENTITY_CATEGORY_NONE;
			$scope.so.twtmaxstreams = 5;
			loadTwitterCredential();
		}
		$scope.so.slug = '';
		return true;
	};


	var isTwitterOk = function(){
		console.log("isTwitterOk",$scope.so.idSoType);
		console.log("isTwitterOk",$scope.so.twtusername);
		console.log("isTwitterOk",$scope.so.twtusertoken);
		console.log("isTwitterOk",$scope.so.twttokensecret);
		if($scope.so && $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			if($scope.so.twtusername && $scope.so.twtusername != null && $scope.so.twtusername != "" &&
					$scope.so.twtusertoken && $scope.so.twtusertoken != null && $scope.so.twtusertoken != "" &&
					$scope.so.twttokensecret && $scope.so.twttokensecret != null && $scope.so.twttokensecret != "")
				return true;
			else
				return false;
		}
		return true;
	};



	
	//$scope.virtualentity = null;

	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternInteger = Constants.VALIDATION_PATTERN_INTEGER;

	$scope.isNewSo = false;
	if(!$routeParams.entity_code || $routeParams.entity_code == null || $routeParams.entity_code === undefined )
		$scope.isNewSo = true;
	
	var loadSo = function(){
		if(!$scope.isNewSo){
			
			var editSo = $location.search().virtualEntityInSession;
			
			if(editSo && editSo!=null){
				$scope.so  = JSON.parse(decodeURI(editSo));
				if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
					console.log("loadTwitterCredential",loadTwitterCredential);
					loadTwitterCredential();
				}
				$scope.changeTwitterUser =  true;

			}
			else{
				$scope.admin_response = {};		
				sharedAdminResponse.setResponse($scope.admin_response); 
				adminAPIservice.loadSmartobject(info.getActiveTenant(), $routeParams.entity_code).success(function(response) {
					console.log("loadSmartobject", response);
					$scope.so = response;
					if(Helpers.util.has($scope.so, 'exposureType.idExposureType'))
						$scope.so.idExposureType = response.exposureType.idExposureType;
					if(Helpers.util.has($scope.so, 'locationType.idLocationType'))
						$scope.so.idLocationType = response.locationType.idLocationType;
					if(Helpers.util.has($scope.so, 'soType.idSoType'))
						$scope.so.idSoType = response.soType.idSoType;
					if(Helpers.util.has($scope.so, 'soCategory.idSoCategory'))
						$scope.so.idSoCategory = response.soCategory.idSoCategory;
					if(Helpers.util.has($scope.so, 'supplyType.idSupplyType'))
						$scope.so.idSupplyType = response.supplyType.idSupplyType;
					// idTenant ????
					
					
					
					
//					if(!$scope.so.virtualEntityPositions)
//						$scope.virtualentity.virtualEntityPositions = {};
//					$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
//					if($scope.virtualentity.virtualEntityPositions.position.length == 0){
//						$scope.virtualentity.virtualEntityPositions.position.push({});
//						$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
//						$scope.virtualentity.virtualEntityPositions.position[0].floor = 0;
//					}
//					if($scope.virtualentity.twtuserid == 0)
//						$scope.virtualentity.twtuserid = null;
						
//					Helpers.util.cleanNilInField($scope.virtualentity);
				}).error(function(response) {
					console.error("loadSo ERROR", response);
					$scope.admin_response.type = 'danger';
					$scope.admin_response.message = 'Smartobject not loaded';
					if(response && response.errorName)
						$scope.admin_response.detail= response.errorName;
					if(response && response.errorCode)
						$scope.admin_response.code= response.errorCode;
				});
			}
		}
		else {
			var newSo = $location.search().virtualEntityInSession;
			console.log("newSo", newSo);
			if(newSo && newSo!=null){
				$scope.so  = JSON.parse(decodeURI(newSo));
				if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
					console.log("loadTwitterCredential",loadTwitterCredential);
					loadTwitterCredential();
				}
			}
			else{
				$scope.so = {};
//				$scope.virtualentity.virtualEntityPositions = {};
//				$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
//				$scope.virtualentity.virtualEntityPositions.position.push({});
			}

		};
	};
	
	loadSo();

	
//	$scope.loadVirtualentity = function(){
//		if(!$scope.isNewSo){
//			
//			var editVirtualentity = $location.search().virtualEntityInSession;
//			
//			if(editVirtualentity && editVirtualentity!=null){
//				$scope.virtualentity  = JSON.parse(decodeURI(editVirtualentity));
//				if($scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
//					console.log("loadTwitterCredential",loadTwitterCredential);
//					loadTwitterCredential();
//				}
//				$scope.changeTwitterUser =  true;
//
//			}
//			else{
//				fabricAPIservice.getVirtualentity($routeParams.tenant_code, $routeParams.entity_code).success(function(response) {
//					$scope.virtualentity = response.virtualEntities.virtualEntity;
//					if(!$scope.virtualentity.virtualEntityPositions)
//						$scope.virtualentity.virtualEntityPositions = {};
//					$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
//					if($scope.virtualentity.virtualEntityPositions.position.length == 0){
//						$scope.virtualentity.virtualEntityPositions.position.push({});
//						$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
//						$scope.virtualentity.virtualEntityPositions.position[0].floor = 0;
//					}
//					if($scope.virtualentity.twtuserid == 0)
//						$scope.virtualentity.twtuserid = null;
//						
//					Helpers.util.cleanNilInField($scope.virtualentity);
//				});
//			}
//
//		}
//		else {
//			var newVirtualentity = $location.search().virtualEntityInSession;
//			console.log("newVirtualentity", newVirtualentity);
//			if(newVirtualentity && newVirtualentity!=null){
//				//var newVirtualentityObj = JSON.parse(decodeURI(newVirtualentity));
//				$scope.virtualentity  = JSON.parse(decodeURI(newVirtualentity));
//				//$scope.selectTypeChange(newVirtualentityObj.idTipoVe);
//				console.log("$scope.so.soType.idSoType: ", $scope.so.soType.idSoType);
//				if($scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
//					console.log("loadTwitterCredential",loadTwitterCredential);
//					loadTwitterCredential();
//				}
//
//				//$scope.virtualentity  = newVirtualentityObj;
//
//				//$scope.selectedType = $scope.so.soType.idSoType;
//			}
//			else{
//				$scope.virtualentity = {};
//				$scope.virtualentity.virtualEntityPositions = {};
//				$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
//				$scope.virtualentity.virtualEntityPositions.position.push({});
//			}//$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
//
//		};
//	};

//	$scope.loadVirtualentity();

	$scope.initDate = new Date();
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];


	$scope.isInternal = function() {
		console.log("So", $scope.so);
		var isInternal = undefined;
		if(Helpers.util.has($scope, "so.soType.idSoType"))
			isInternal = $scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
		else if(Helpers.util.has($scope, "so.idSoType"))
			isInternal = $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;

		return isInternal;
		//return $scope.so && $scope.so.soType && $scope.so.soType.idSoType && $scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	
	$scope.save = function(){
		if(!isTwitterOk()){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_NOTLOGGED_ERROR';
		}
		else{
			if($scope.isNewSo){
				$scope.createSo();
			}
			else
				$scope.updateSo();
		}
	};

	$scope.cancel = function(){    
		$location.path('management/virtualentities/'+$scope.tenantCode);
	};
	

	$scope.createSo  = function(){
		console.log("createSo", $scope.so);
		$scope.so.idTenant  = info.getActiveTenant().idTenant;
		$scope.admin_response = {};
		sharedAdminResponse.setResponse($scope.admin_response); 

		$scope.isUpdating = true;
		adminAPIservice.createSmartobject(info.getActiveTenant(), $scope.so).success(function(response) {
			console.log("createSo SUCCESS", response);
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO';
			sharedAdminResponse.setResponse($scope.admin_response);
			$scope.isUpdating = false;
			$location.path('management/viewVirtualentity/'+$scope.tenantCode +'/'+response.socode);
		}).error(function(response){
			console.error("createSo ERROR", response);
			$scope.isUpdating = false;
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;

		});
	};
/*
	$scope.createSo_old = function(so) {
		console.log("so", so);
		if(!so)
			so = new Object();



		var newSo = new Object();
		newSo.socode = so.socode;
		newSo.so = so;
		if(newSo.so.idSoType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID)
			newSo.position=null;
		else{
//			if($scope.virtualentity.virtualEntityPositions.position[0].lat == "" || $scope.virtualentity.virtualEntityPositions.position[0].lat ==null )
//				$scope.virtualentity.virtualEntityPositions.position[0].lat = 0;
//			if($scope.virtualentity.virtualEntityPositions.position[0].lon == "" || $scope.virtualentity.virtualEntityPositions.position[0].lon ==null )
//			$scope.virtualentity.virtualEntityPositions.position[0].lon = 0;
//			if($scope.virtualentity.virtualEntityPositions.position[0].elevation == "" || $scope.virtualentity.virtualEntityPositions.position[0].elevation ==null )
//			$scope.virtualentity.virtualEntityPositions.position[0].elevation = 0;
//			if($scope.virtualentity.virtualEntityPositions.position[0].floor == "" || $scope.virtualentity.virtualEntityPositions.position[0].floor ==null )
//			$scope.virtualentity.virtualEntityPositions.position[0].floor = 0;
		}
		
		console.log("virtualentity.codeVirtualEntity", virtualentity.codeVirtualEntity);
		console.log("newSo", newSo);
	
		$scope.isUpdating = false;
		var promise   = fabricAPIservice.createVirtualentity($scope.tenantCode, virtualentity.codeVirtualEntity,  newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			$scope.isUpdating = true;
			$location.path('management/viewVirtualentity/'+$scope.tenantCode +'/'+virtualentity.codeVirtualEntity);
		}, function(result) {
			$scope.isUpdating = true;
			$scope.creationError = angular.fromJson(result.data);
			$scope.creationError.error_message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if($scope.creationError && $scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID)
				$scope.creationError.error_detail =  'MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_ERROR_DETAIL';
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	

*/
	
	
	$scope.updateSo  = function(){
		console.log("updateSo", $scope.so);
		$scope.admin_response = {};
		sharedAdminResponse.setResponse($scope.admin_response); 
		$scope.isUpdating = true;
		adminAPIservice.updateSmartobject(info.getActiveTenant(), $scope.so).success(function(response) {
			console.log("updateSo SUCCESS", response);
			$scope.isUpdating = false;
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO';
			sharedAdminResponse.setResponse($scope.admin_response);
			$location.path('management/editVirtualentity/'+$scope.tenantCode +'/'+response.socode);
			Helpers.util.scrollTo("topForm");
		}).error(function(response){
			console.error("updateSo ERROR", response);
			$scope.isUpdating = false;
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
			Helpers.util.scrollTo("topForm");
		});
	};

	/*
	$scope.updateSo_old = function() {
		$scope.updateInfo = null;
		$scope.updateError = null;

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
		
		if($scope.virtualentity.twtuserid == 0)
			$scope.virtualentity.twtuserid = null;

		newVirtualentity.virtualEntity =  $scope.virtualentity;
		console.log("newVirtualentity", newVirtualentity);
		console.log("$scope.changeTwitterUser", $scope.changeTwitterUser);
		$scope.isUpdating = true;

		var promise   = fabricAPIservice.updateVirtualentity(newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			Helpers.util.scrollTo("topForm");
			$scope.isUpdating = false;
			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
			$scope.updateInfo = {status: result.status};
			if($scope.changeTwitterUser ){
				$scope.loadStreams();
			}
			else
				$scope.changeTwitterUser = false;

		}, function(result) {
			Helpers.util.scrollTo("topForm");
			$scope.isUpdating = false;
			$scope.updateError = angular.fromJson(result.data);
			$scope.updateError.error_message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if($scope.updateError && $scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID)
				$scope.updateError.error_detail =  'MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_ERROR_DETAIL';
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});


	};	*/

	$scope.twitterAuthUrl =  function() {
		var soAction = "new";
		var soCode = "";
		if(!$scope.isNewSo){
			soAction = "edit";
			soCode = $routeParams.entity_code;
		}
		
		return Constants.API_SERVICES_TWITTER_AUTH_URL+"?vitualEntityAction="+ soAction +"&tenant=" + $scope.tenantCode + "&virtualentityCode=" + soCode  +
				"&virtualEntityInSession="+encodeURI(JSON.stringify($scope.so));
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
