appControllers.controller('ManagementDatasetListCtrl', [ '$scope', '$route', '$location', 'fabricAPImanagement', 'info', '$modal', '$translate',
                                                         function($scope, $route, $location, fabricAPImanagement, info, $modal, $translate) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;

	$scope.datasetList = [];
	$scope.filteredDatasetsList = [];
	$scope.nameFilter = null;
	$scope.statusFilter = null;
	$scope.domainFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.datasetList.length;
	$scope.predicate = '';
	$scope.deleteDS = false;

	console.log("isOwner", info.isOwner( $scope.tenantCode));
	console.log("info", info);

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.getDatasets = function(){

		fabricAPImanagement.getDatasets($scope.tenantCode).success(function(response) {
			$scope.showLoading = false;
	
			$scope.datasetList = [];
			if(response!=null){
				for (var i = 0; i <response.length; i++) {
					if(response[i].configData && response[i].configData.subtype && response[i].configData.subtype!='binaryDataset'){
						
						if(!response[i].info  || response[i].info ==null)
							response[i].info ={};
		
						if(typeof response[i].info.icon == 'undefined' || response[i].info.icon == null)
							response[i].info.icon  = Constants.API_RESOURCES_URL + "dataset/icon/"+ $scope.tenantCode+"/" +response[i].datasetCode;
						else
							response[i].info.icon  = "img/dataset-icon-default.png";
						//data.datasetIcon = Constants.API_RESOURCES_URL + "dataset/icon/"+data.tenantCode+"/"+data.datasetCode;

						if(response[i].info.binaryIdDataset || response[i].info.binaryIdDataset != null)
							response[i].info.attachment  = true;
						
						if(response[i].info.dataDomain &&  response[i].info.dataDomain != null)
							response[i].info.dataDomainTranslated =  $translate.instant(response[i].info.dataDomain);
						
						if(response[i].info.codSubDomain &&  response[i].info.codSubDomain != null)
							response[i].info.codSubDomainTranslated =  $translate.instant(response[i].info.codSubDomain);

						$scope.datasetList.push(response[i]);
					}
				}
			}
	
			$scope.totalItems = $scope.datasetList.length;
		});
	};
	$scope.getDatasets();

	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchNameFilter = function(dataset) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || (dataset.info.datasetName && keyword.test(dataset.info.datasetName));
	};

	$scope.searchCodeFilter = function(dataset) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || (dataset.datasetCode && keyword.test(dataset.datasetCode));
	};

	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.searchDomainFilter = function(dataset) {
		var keyword = new RegExp($scope.domainFilter, 'i');
		return !$scope.domainFilter || keyword.test(dataset.info.dataDomain) || keyword.test(dataset.info.dataDomainTranslated);
	};
	
	$scope.searchSubDomainFilter = function(dataset) {
		var keyword = new RegExp($scope.subDomainFilter, 'i');
		return !$scope.subDomainFilter || keyword.test(dataset.info.codSubDomain) || keyword.test(dataset.info.codSubDomainTranslated);
	};
	
	$scope.searchTypeFilter = function(dataset) {
		var keyword = new RegExp($scope.typeFilter, 'i');
		return !$scope.typeFilter || (dataset.configData.type && keyword.test(dataset.configData.type)) || (dataset.configData.subtype && keyword.test(dataset.configData.subtype));
	};

	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.$watch('domainFilter', function(newDomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.$watch('subDomainFilter', function(newSubDomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	$scope.viewUnistalledFilter = function(dataset) {
		if(!$scope.viewUnistalledCheck){
			return dataset.configData.deleted!=1;
		}
		else
			return true;
	};

	$scope.$watch('viewUnistalledCheck', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	$scope.selectedDatasets = [];

	$scope.isSelected = function(dataset) {
		return $scope.selectedDatasets.indexOf(dataset) >= 0;
	};

	$scope.updateSelection = function($event, dataset) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, dataset);
	};

	var updateSelected = function(action, dataset) {
		if (action === 'add' && $scope.selectedDatasets.indexOf(dataset) === -1) {
			$scope.selectedDatasets.push(dataset);
		}
		if (action === 'remove' && $scope.selectedDatasets.indexOf(dataset) !== -1) {
			$scope.selectedDatasets.splice($scope.selectedDatasets.indexOf(dataset), 1);
		}
	};

	$scope.canEdit = function() {
		if($scope.selectedDatasets.length==1 && 
				($scope.selectedDatasets[0].configData && $scope.selectedDatasets[0].configData.type == "dataset" && $scope.selectedDatasets[0].configData.subtype == "bulkDataset")){
			return true;
		}
		return false;
	};

	$scope.canDelete = function() {
		if($scope.selectedDatasets.length==1 && 
				($scope.selectedDatasets[0].configData && $scope.selectedDatasets[0].configData.type == "dataset" && $scope.selectedDatasets[0].configData.subtype == "bulkDataset")){
			$scope.deleteDS = true;
			return true;
		}
		return false;
	};

	$scope.editDataset = function(){
		if($scope.selectedDatasets.length===1){
			$location.path('management/editDataset/'+$scope.tenantCode +'/'+$scope.selectedDatasets[0].datasetCode);
		} else {
			// FIXME error message...
		}
	};

	$scope.deleteDataset = function(){
		if($scope.selectedDatasets.length===1){
			$scope.detailModal($scope.selectedDatasets[0]);
		} else {
			console.error("deleteDataset error selectedDatasets  wrong size: ",$scope.selectedDatasets);
		}
	};
	
	$scope.detailModal = function(ds){
		console.log('ds', ds);
	    var detailModalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'deleteDatasetUninstall.html',
	      controller: 'ManagementDatasetUninstallModalCtrl',
	      size: 'lg',
	      resolve: {
	    	  ds : function(){
	    		console.log('ds 2', ds);
	        	return ds;
	    	  },
	    	  tenant : function(){
	    		console.log('$scope.tenantCode', $scope.tenantCode);
	        	return $scope.tenantCode;
	    	  }
	      }
	    });
	    
	    detailModalInstance.result.then(function (result) {
	    	console.log('result', result);
	        if (result){
	        	//$scope.datasetList = [];
		    	//console.log('fatto');
		    	//$scope.getDatasets();
	        	updateSelected('remove', ds);
	        	$route.reload();
	        }
	      }, function () {
	      	console.log('Modal dismissed at: ' + new Date());
	      });
	};
}]);

appControllers.controller('ManagementDatasetUninstallModalCtrl', [ '$scope', '$location', '$modalInstance', 'fabricAPImanagement', 'ds', 'tenant', 
                                                                   function($scope, $location, $modalInstance, fabricAPImanagement, ds, tenant) {

	console.log("ManagementDatasetUninstallModalCtrl", ds);
	console.log("ManagementDatasetUninstallModalCtrl", tenant);
	$scope.ds = ds; 
	$scope.tenant = tenant; 
	$scope.update = {"loading":false, "status":"", };
	
	$scope.ok = function(){
			
		$scope.update.loading = true;
		var promise = fabricAPImanagement.requestUnistallDataset($scope.tenant, $scope.ds.idDataset);
		
		promise.then(function(result) {
			console.log("result ok ", result);
			if(result.errors && data.errors.length>0){
				$scope.update.status="error";
				$scope.errors = data.errors;
			}
			else{
				$scope.update.status = "success";
			}
			$scope.update.loading = false;
			//$modalInstance.close(true);
		}, function(result) {
			console.log("result ko", result);
			$scope.update.status="error";
			$scope.errors =angular.fromJson(result.data);
			$scope.update.loading = false;
			//$modalInstance.close(true);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};
	
	$scope.cancel = function () {
	    $modalInstance.dismiss(false);
	};
	$scope.close = function () {
	    $modalInstance.dismiss(true);
	};
}]);

appControllers.controller('ManagementDatasetModalCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'fabricAPImanagement', '$location', '$modalInstance', 'selectedDataset', 'info', 'readFilePreview',
                                                     function($scope, $routeParams, fabricAPIservice, fabricAPImanagement, $location, $modalInstance, selectedDataset, info, readFilePreview) {
	
	$scope.tenantCode = $routeParams.tenant_code;
	
	$scope.loadDataset = function(){
		$scope.selectedDataset = selectedDataset;
		
		fabricAPImanagement.getDataset($scope.tenantCode, $scope.selectedDataset.datasetCode).then(function(response) {
			try{
				$scope.datasetModalView = {};
				$scope.datasetModalView.apiMetadataUrl = response.apiMetadataUrl;
				$scope.datasetModalView.dataset = response.metadata;
				$scope.datasetModalView.stream = response.stream;
				$scope.datasetModalView.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
				if(!$scope.datasetModalView.dataset)
					$scope.datasetModalView.dataset = new Object();
				if(!$scope.datasetModalView.dataset.info)
					$scope.datasetModalView.dataset.info = new Object();
				if(!$scope.datasetModalView.dataset.info.tags)
					$scope.datasetModalView.dataset.info.tags = [];
				
				$scope.datasetModalView.dataset.todo = true;
				$scope.datasetModalView.dataset.okdo = false;
				$scope.datasetModalView.dataset.kodo = false;
	
				//$scope.dataset.info.visibility = 'public';
				if(!$scope.datasetModalView.dataset.info.icon || $scope.datasetModalView.dataset.info.icon == null)
					$scope.datasetModalView.dataset.info.icon  = "img/dataset-icon-default.png";
			} catch (e) {
				console.error(">>>>>>>> ManagementDatasetModalCtrl >>>>>>>> getDataset ERROR", e);
			}
		}, function(response){
			console.error(">>>>>>>> ManagementDatasetModalCtrl >>>>>>>> server side getDataset ERROR", response);

		});
	};
	
	$scope.deleteDataset = function(){
		console.log("$scope.selectedDataset in deleteDataset", $scope.selectedDataset);
		
		var promiseForDelete = fabricAPImanagement.deleteDataset($scope.datasetModalView.dataset.configData.tenantCode, $scope.datasetModalView.dataset.idDataset, $scope.datasetModalView.dataset.datasetVersion);
		promiseForDelete.then(function(result) {
			console.log('Got notification 1: ', result);
			
			$scope.datasetModalView.dataset.todo = false;
			$scope.datasetModalView.dataset.okdo = true;
			$scope.datasetModalView.dataset.kodo = false;
			/*if(result.errors && data.errors.length>0){
				$scope.updateError = true;
				$scope.updateErrors = data.errors;
				Helpers.util.scrollTo();
			} else {
				$scope.updateInfo = {status: "Ok"};
				$scope.loadDataset();
			}*/
		}, function(result) {
			console.error('Got notification 2: ', result);
			
			$scope.datasetModalView.dataset.todo = false;
			$scope.datasetModalView.dataset.okdo = false;
			$scope.datasetModalView.dataset.kodo = true;
			/*$scope.updateError = true;
			$scope.updateErrors = angular.fromJson(result.data);
			console.log("result.data ", result.data);
			$scope.loadDataset();*/
		}, function(result) {
			
		});
	};

	$scope.loadDataset();
	
	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
}]);


appControllers.controller('ManagementDatasetCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'fabricAPImanagement', '$location', '$modal', 'info', 'readFilePreview', 'sharedDataset', '$translate','sharedUploadBulkErrors', '$route',
                                                     function($scope, $routeParams, fabricAPIservice, fabricAPImanagement, $location, $modal, info, readFilePreview, sharedDataset, $translate,sharedUploadBulkErrors, $route) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;
	$scope.downloadCsvUrl = null;//Constants.API_MANAGEMENT_DATASET_DOWNLOAD_URL + $scope.tenantCode + '/' + $scope.datasetCode + '/csv';

	$scope.apiMetdataUrl = "api.smartdatanet.it:80/api/";
	$scope.apiMetdataSecureUrl = "api.smartdatanet.it:443/api/";
	$scope.topic = $scope.datasetCode;

	$scope.validationPatternSubdomain = Constants.VALIDATION_PATTERN_NO_SPACE;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	$scope.showHint = false;
	
	$scope.showHintToggle = function(){
		$scope.showHint = !$scope.showHint;

	};

	$scope.canCreatePublicDataset = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";

	}; 
	
	$scope.changeUnpublished = function(){
		if($scope.dataset.info.unpublished){
			$scope.dataset.info.visibility = 'private';
		}
		
	};
	
	$scope.canShareDataset = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";
	}; 

	$scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;
	$scope.updateInfo = null;
	$scope.updateError = null;
	
	$scope.saveErrors = sharedUploadBulkErrors.getErrors();
	$scope.saveError = ($scope.saveErrors!=null);
	
//	
//	if ($routeParams){
//		if ($routeParams.entity_code){
//		var errorStr = $routeParams.entity_code.split("?")[1];
//			if (errorStr){
//				var error = errorStr.split("=");
//				if ((error[0] == 'errorParams') && (error[1] == 2)){
//					$scope.saveError = true; 
//					$scope.saveErrors.push({'message': $translate.instant('MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_TITLE'), 'detail': $translate.instant('MANAGEMENT_NEW_DATASET_UPLOAD_FILE_ERROR_FROM_SERVER')});
//				}
//			}
//		}
//	}

	fabricAPIservice.getTenants().success(function(response) {
		console.debug("response", response.tenants);
		try{
			$scope.tenantsList = [];
			for (var int = 0; int <  response.tenants.tenant.length; int++) {
				var t = response.tenants.tenant[int];
				if(t.tenantCode!=$scope.tenantCode)
					$scope.tenantsList.push(t);
			}
		} catch (e) {
			console.error("getTenants ERROR",e);
		}
	});
	
	$scope.isLicenceVisible = function(){
		var returnValue = true;
		if ($scope.dataset){
			if (($scope.dataset.info.license == $translate.instant('DATASET_FIELD_METADATA_LICENCE_CCBY')) || ($scope.dataset.info.license == $translate.instant('DATASET_FIELD_METADATA_LICENCE_CC0')))
				returnValue = false;
		}
		
		return returnValue;
	};

	$scope.tagList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			//$scope.tagList.push(response.streamTags.element[int].tagCode);
			$scope.tagList.push({"tagCode":response.streamTags.element[int].tagCode, "tagLabel":$translate.instant(response.streamTags.element[int].tagCode)} );
		}
		
		$scope.tagList.sort(function(a, b) { 
		    return ((a.tagLabel < b.tagLabel) ? -1 : ((a.tagLabel > b.tagLabel) ? 1 : 0));
		});
		
//		var delta = Math.trunc($scope.tagList.length/3);
//		$scope.tagTooltipHtml = "<div class='tag-html-tooltip row'>";
//		$scope.tagTooltipHtml += "<div class='col-sm-12'><h5>" + $translate.instant('MANAGEMENT_EDIT_STREAM_TAG_TOOLTIP_TITLE') + "</h5></div>";
//
//		for (var i = 0; i < delta+1; i++) {
//			$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i].tagLabel +  "</div>";
//			if($scope.tagList.length>i+delta+1)
//				$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i+delta+1].tagLabel  +  "</div>";
//			else
//				$scope.tagTooltipHtml += "<div class='col-sm-4'> &nbsp;</div>";
//			if($scope.tagList.length>i+delta*2+2)
//				$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i+delta*2+2].tagLabel  +  "</div>";
//			else
//				$scope.tagTooltipHtml += "<div class='col-sm-4'> &nbsp;</div>";
//		}
//		$scope.tagTooltipHtml += "</div>";
//		$scope.tagTooltipHtml += "</div>";

	});
	
	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.subDomainList = [];
	fabricAPIservice.getStreamSubDomains().success(function(response) {
		for (var int = 0; int < response.streamSubDomains.element.length; int++) {
			$scope.subDomainList.push(response.streamSubDomains.element[int]);
		}
	});

	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
	});
	
	$scope.unitOfMesaurementList = [];
	fabricAPIservice.getStreamUnitOfMesaurement().success(function(response) {
		$scope.unitOfMesaurementList = response.measureUnit.element;
	});


	$scope.dataset = null;
	$scope.stream = null;
	//$scope.apiMetdataUrl = "";

	$scope.onDateChange = function() {
        if ($scope.dataset.opendata.datetimez) {
        	$scope.dataset.opendata.datetimez = $scope.dataset.opendata.datetimez.getTime();
        }
    };
	
	$scope.loadDataset = function(){
		console.debug("$scope.datasetCode", $scope.datasetCode);
		
		fabricAPImanagement.getDataset($scope.tenantCode, $scope.datasetCode).then(function(response) {
			try{
				console.debug("loadDataset- response",response);
				//$scope.apiMetdataUrl = response.apiMetadataUrl;
				$scope.dataset = response.metadata;
				$scope.stream = response.stream;
				$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
				if(!$scope.dataset)
					$scope.dataset = new Object();
				if(!$scope.dataset.info)
					$scope.dataset.info = new Object();
				if(!$scope.dataset.info.tags)
					$scope.dataset.info.tags = [];

				if(!$scope.dataset.info.icon || $scope.dataset.info.icon == null)
					$scope.dataset.info.icon  = "img/dataset-icon-default.png";

				if(!$scope.dataset.opendata){
					$scope.dataset.opendata = {};
					$scope.dataset.opendata.isOpendata = 'false';
					$scope.dataset.opendata.language = 'it';
				}
				else if($scope.dataset.opendata.isOpendata){
					$scope.dataset.opendata.isOpendata = 'true';
					if($scope.dataset.opendata.dataUpdateDate && $scope.dataset.opendata.dataUpdateDate!=null){
						var dataUpdateDate = new Date($scope.dataset.opendata.dataUpdateDate);
						$scope.dataset.opendata.dataUpdateDate = Helpers.util.formatDateForInputHtml5(dataUpdateDate);
					}
				}
				
				if(typeof $scope.dataset.idDataset != 'undefuned' && $scope.dataset.idDataset !=null)
					$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.datasetCode+"/download/"+$scope.dataset.idDataset+ "/current";  
				
				$scope.newField = {sourceColumn: $scope.dataset.info.fields.length+1};

//				if(!$scope.canCreatePublicDataset())
//					$scope.dataset.info.visibility = 'private';

			} catch (e) {
				console.error("getDataset ERROR", e);
			}
		});

	};

	$scope.loadDataset();

	$scope.newTag = {value:""};
	$scope.addTag = function(newTag){
		if(newTag){
			var found = false;	
			for (var int = 0; int < $scope.dataset.info.tags.length; int++) {
				var existingTag = $scope.dataset.info.tags[int];
				if(existingTag.tagCode == newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.dataset.info.tags.push({"tagCode":newTag});
		}
		$scope.newTag.value = "";
		return false;

	};

	$scope.showChooseTagTable = function(){
		var chooseTagDialog = $modal.open({
	      templateUrl: 'tagChooerDialog.html',
	      controller: 'ManagementDatasetChooseTagControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tagList: function () {return $scope.tagList;},
	      	}
    	});
		
		chooseTagDialog.result.then(function (selectedTag) {
			$scope.addTag(selectedTag.tagCode);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};
	
	$scope.onTagSelect = function($item, $model, $label){
		console.log("onTagSelect",$item, $model, $label);
		if($item.tagCode!=null)
			$scope.addTag($item.tagCode);
		
	};

	$scope.removeTag = function(index){
		$scope.dataset.info.tags.splice(index,1);
		return false;
	};
	
	$scope.checkTag = function(){ 
		var rslt = true;
		if(typeof $scope.dataset.info.tags != "undefined"){
			if ($scope.dataset.info.tags.length > 0){ 
				rslt = false;
			}
		}
		
		return rslt;
	};
	
	$scope.addTenantSharing = function(newTenantSharing){
		console.log("addTenantSharing ",newTenantSharing);
		if(newTenantSharing){
			var found = false;	
			if(!$scope.dataset.info.tenantssharing || $scope.dataset.info.tenantssharing == null){
				$scope.dataset.info.tenantssharing = {};
			}
			if(!$scope.dataset.info.tenantssharing.tenantsharing || $scope.dataset.info.tenantssharing.tenantsharing == null){
				$scope.dataset.info.tenantssharing.tenantsharing = [];
			}
			
			for (var int = 0; int < $scope.dataset.info.tenantssharing.tenantsharing.length; int++) {
				var existingTenantSharing = $scope.dataset.info.tenantssharing.tenantsharing[int];
				console.log("existing",existingTenantSharing);
				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
					console.log("found");
					found = true;
					break;
				}
			}
			if(!found){
				$scope.dataset.info.tenantssharing.tenantsharing.push(
							{"idTenant":newTenantSharing.idTenant, 
								"tenantName": newTenantSharing.tenantName, 
								"tenantDescription": newTenantSharing.tenantDescription, 
								"tenantCode": newTenantSharing.tenantCode, 
								"isOwner": 0
							});
				console.log("added", $scope.dataset.info.tenantssharing.tenantsharing );
			}
		}
		return false;
	};

	$scope.removeTenantSharing = function(index){
		$scope.dataset.info.tenantssharing.tenantsharing.splice(index,1);
		return false;
	};
	
	
	$scope.onTenantSharingSelect = function($item, $model, $label){
		console.log("onTenantSharingSelect",$item, $model, $label);
		$scope.addTenantSharing($item);
		
	};
	
	$scope.showChooseTenantTable = function(){
		var chooseTenantDialog = $modal.open({
	      templateUrl: 'tenantChooerDialog.html',
	      controller: 'ManagementDatasetChooseTenantControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tenantsList: function () {return $scope.tenantsList;},
	      	}
    	});
		
		chooseTenantDialog.result.then(function (selectedTenant) {
			$scope.addTenantSharing(selectedTenant);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.selectedIcon;
	$scope.onIconSelect = function($files) {
		$scope.selectedIcon = $files[0];
		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
			$scope.choosenIconSize = $scope.selectedIcon.size; 
			$scope.updateWarning = true;
			$scope.selectedIcon = null;
		}
		else
			readIconPreview();
	};
	
	var readIconPreview = function(){
		readFilePreview.readImageFile($scope.selectedIcon).then(
				function(contents){
					console.log("contents" , contents);
					$scope.dataset.info.icon = contents;
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};
	
	$scope.isDateTimeField = function(field){
		if(field && field.dataType && ((field.dataType.dataType && field.dataType.dataType == "dateTime") || (field.dataType && field.dataType == "dateTime")))
			return true;
		return false;
	};
	
	$scope.htmlTooltip = Constants.HELP_HINT_DATE_FORMAT_TABLE;
	
	$scope.isCoordinatesField = function(field){
		if(field && field.dataType && field.dataType.dataType && (field.dataType.dataType == "longitude" || field.dataType.dataType == "latitude"))
			return true;
		return false;
	};
	
	$scope.isCommonField = function(field){
		return !$scope.isCoordinatesField(field) && !$scope.isDateTimeField(field);
	};

	
	$scope.showDateFormatHint = function(){
		$modal.open({
	      templateUrl: 'dataFormatHint.html',
	      controller: 'DateFormatHintCtrl',
	      //size: 'lg',
	      //scope: $scope,
	      //resolve: {
	      //	  selectedTableIndex: function () {return tableIndex;},
	      // 	}
    	});
	};
	
	$scope.canEdit = function() {
		return ($scope.dataset && $scope.dataset.configData && $scope.dataset.configData.type == "dataset" && $scope.dataset.configData.subtype == "bulkDataset");
	};

	$scope.canAddData = function() {
		return ($scope.dataset && $scope.dataset.configData && $scope.dataset.configData.type == "dataset" && $scope.dataset.configData.subtype == "bulkDataset");
	};

	$scope.updateDataset = function() {
		var newDataset =  $scope.dataset;
		$scope.updateInfo = null;
		$scope.updateError = false;
		$scope.openadataDataUpdateDateStyle = "";

		if(!newDataset.info.tags && newDataset.info.tags.length==0){
			newDataset.info.tags = null;
		}

		if(typeof newDataset.opendata === 'undefined' || newDataset.opendata==null || newDataset.opendata.isOpendata !='true'){
			newDataset.opendata = null;
		}
		else{
			if(!newDataset.opendata.language || newDataset.opendata.language == null || newDataset.opendata.language == '')
				newDataset.opendata.language = 'it';
			
			if(newDataset.opendata.dataUpdateDate!=null)
				newDataset.opendata.dataUpdateDate = new Date(newDataset.opendata.dataUpdateDate).getTime();

		}


		
		if(!$scope.updateError){
			console.log("updateDataset newDataset ", newDataset);
			$scope.isUploading = true;

			var promise   = fabricAPImanagement.updateDataset($scope.tenantCode, $scope.datasetCode, newDataset);
	
			promise.then(function(result) {
				$scope.isUploading = false;
				Helpers.util.scrollTo();
				if(result.errors && data.errors.length>0){
					$scope.updateError = true;
					$scope.updateErrors = data.errors;
					Helpers.util.scrollTo();
				}
				else{
					$scope.updateInfo = {status: "Ok"};
					$scope.loadDataset();
				}
			}, function(result) {
				Helpers.util.scrollTo();
				$scope.isUploading = false;
				$scope.updateError = true;
				$scope.updateErrors = angular.fromJson(result.data);
				console.log("result.data ", result.data);
				$scope.loadDataset();
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		}
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
//		$scope.updateInfo = null;
//		$scope.updateError = null;
//		Helpers.util.scrollTo();
//		var promise   = fabricAPIservice.lifecycleStream(action, $scope.stream);
//		promise.then(function(result) {
//		console.log("result updateLifecycle ", result);
//		//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
//		$scope.updateInfo = {status: result.status};
//		$scope.loadStream();
//		}, function(result) {
//		$scope.updateError = angular.fromJson(result.data);
//		console.log("result.data ", result.data);
//		$scope.loadStream();
//		}, function(result) {
//		console.log('Got notification: ' + result);
//		});
	};
	
	$scope.animationsEnabled = true;

	$scope.openModalView = function(size) {
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'datasetModalContent.html',
			controller : 'ManagementDatasetModalCtrl',
			size : size,
			resolve : {
				items : function() {
					return $scope.items;
				},
				selectedDataset: function() {
					console.log(">>>>>> $scope.dataset in selectedDataset", $scope.dataset);
					return $scope.dataset;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
					$scope.selected = selectedItem;
					console.log("selected in modalInstance.result.then", selectedItem);
				}, function() {
					console.info('Modal dismissed at: ' + new Date());
		});
	};
	

	$scope.canDelete = function() {
		if ($scope.dataset){
			if ($scope.dataset.configData && 
					$scope.dataset.configData.type == "dataset" &&  
					($scope.dataset.configData.subtype == "bulkDataset" || 
					 $scope.dataset.configData.subtype == "streamDataset" || 
					 $scope.dataset.configData.subtype == "socialDataset") &&
					 $scope.dataset.configData.deleted!=1){
				return true;
			}
		}
		return false;
	};
	$scope.canUnistall = function() {
		if ($scope.dataset){
			if ($scope.dataset.configData && 
					$scope.dataset.configData.type == "dataset" && 
					$scope.dataset.configData.subtype == "bulkDataset" &&
					$scope.dataset.configData.deleted!=1){
				return true;
			}
		}
		return false;
	};
	
	
	
	
	$scope.openUninstalDatasetModal = function(){
		console.log("openUninstalDatasetModal",$scope.dataset);
	    var detailModalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'unistallDatasetModal.html',
	      controller: 'ManagementDatasetUninstallModalCtrl',
	      scope: $scope,
	      size: 'sm',
	      resolve: {
	    	  ds : function(){
	    		  return $scope.dataset;
	    	  },
	    	  tenant : function(){
	    		console.log('$scope.tenantCode', $scope.tenantCode);
	        	return $scope.tenantCode;
	    	  }
	      }
	    });
	    
	    detailModalInstance.result.then(function (result) {
	    	console.log('result', result);
//	        if (result){
//	        	//$scope.datasetList = [];
//		    	//console.log('fatto');
//		    	//$scope.getDatasets();
//	        	updateSelected('remove', ds);
//	        	$route.reload();
//	        }
	      }, function (reload) {
	    	  console.log('Modal dismissed reload: ' + reload);
	    	  if(reload)
	    		  $route.reload();
	      });
	};
	
	
	
	$scope.cloneDataset = function(){
		console.log("cloneDataset");
		sharedDataset.setDataset($scope.dataset);
		$location.path('management/newDataset/'+$scope.tenantCode);
	};
	
	$scope.addNewField = function(newField){
		console.log("addNewField",newField);
		$scope.insertColumnErrors = [];
		
		var checkNameDuplicate = false;
		var checkSourceColumnDuplicate = false;

		if(typeof newField.fieldName == 'undefined' || newField.fieldName==null || newField.fieldName=="")
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME');
		else{
			for (var int = 0; int < $scope.dataset.info.fields.length; int++) {
				if($scope.dataset.info.fields[int].fieldName.toUpperCase() == newField.fieldName.toUpperCase()){
					checkNameDuplicate = true;
				}
			}			
		}

		console.log("newField.sourceColumn",newField.sourceColumn);

		if(typeof newField.sourceColumn =='undefined' || newField.sourceColumn==null || newField.sourceColumn=="" || isNaN(newField.sourceColumn))
			$scope.insertColumnErrors .push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN');
		else{
			for (var int = 0; int < $scope.dataset.info.fields.length; int++) {
				if($scope.dataset.info.fields[int].fieldName.toUpperCase() == newField.fieldName.toUpperCase()){
					checkNameDuplicate = true;
				}
				if($scope.dataset.info.fields[int].sourceColumn == newField.sourceColumn){
					checkSourceColumnDuplicate = true;
				}
			}
		}
		
		if(checkNameDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME_UNIQUE');
		
		if(checkSourceColumnDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE');
		
		if($scope.insertColumnErrors.length == 0){
			if(!newField.fieldAlias || newField.fieldAlias == null || newField.fieldAlias == ""){
				newField.fieldAlias = newField.fieldName;
			}
			
			newField.isNew  = true;
			var dataType = newField.dataType?newField.dataType.dataType:'string';
			var measureUnit = newField.measureUnit?newField.measureUnit.measureUnit:null;
			
			newField.dataType = dataType;
			newField.measureUnit = measureUnit;
			newField.isKey = newField.isKey?1:0, 
			
			
			$scope.dataset.info.fields.push(newField);
			$scope.newField = {sourceColumn: $scope.dataset.info.fields.length+1};
		}
	};
	
	$scope.removeNewField = function(index){
		$scope.dataset.info.fields.splice(index,1);
		$scope.newField = {sourceColumn: $scope.dataset.info.fields.length+1};

		return false;
	};
	
	$scope.onDropColumnComplete=function(fromIndex, toIndex,evt){
		console.log("onDropColumnComplete",fromIndex, toIndex,evt,$scope.dataset.info.fields );
		var columToMove = $scope.dataset.info.fields[fromIndex];
		columToMove.dragging = false;
		$scope.dataset.info.fields.splice(fromIndex, 1);
		$scope.dataset.info.fields.splice(toIndex, 0, columToMove);
	};

	$scope.onDragColumnComplete=function (fromIndex,evt){
		console.log("onDragColumnComplete",fromIndex,evt);
	};



} ]);





appControllers.controller('DateFormatHintCtrl', [ '$scope', '$modalInstance', function($scope, $modalInstance) {
	$scope.dataFormatHintTable = Constants.HELP_HINT_DATE_FORMAT_TABLE;
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementUploadDatasetCtrl', [ '$scope', '$routeParams', 'fabricAPImanagement', 'info', '$upload', 'readFilePreview','$translate',  
                                                           function($scope, $routeParams, fabricAPImanagement, info, $upload, readFilePreview, $translate) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	$scope.maxFileSize = Constants.BULK_DATASET_MAX_FILE_SIZE;
	$scope.choosenFileSize = null;
	$scope.selectedFile = null;
	$scope.updateInfo = null;
	$scope.updateWarning = null;
	$scope.updateError = null;
	$scope.updateErrors = null;
	console.log("uploadData START", $scope.datasetCode);

	$scope.formatList = ["csv"];

	$scope.csvSeparator = ";";
	$scope.fileEncoding = "UTF-8";
	$scope.importFileType = "csv";
	$scope.csvSkipFirstRow = true;

	$scope.dataset = null;

	$scope.loadDataset = function(){
		fabricAPImanagement.getDataset($scope.tenantCode, $scope.datasetCode).then(function(response) {
			console.debug("loadDataset- response",response);
			$scope.dataset = response.metadata;
			if(!$scope.dataset)
				$scope.dataset = new Object();
			if(!$scope.dataset.info)
				$scope.dataset.info = new Object();
			if(!$scope.dataset.info.tags)
				$scope.dataset.info.tags = [];

			$scope.dataset.info.visibility = 'public';
		});

	};

	$scope.loadDataset();

	$scope.onFileSelect = function($files) {
		$scope.selectedFile = $files[0];
		if($scope.selectedFile !=null && $scope.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
			$scope.choosenFileSize = $scope.selectedFile.size; 
			$scope.updateWarning = true;
			$scope.updateWarningMessage = 'MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_FILE_TOO_BIG';
			$scope.selectedFile = null;
			$scope.previewLines = null;
		}
		else
			readPreview($scope.csvSeparator);
	};

	$scope.previewLines = [];

	var readPreview = function(csvSeparator){
		$scope.updateInfo = null;
		$scope.updateError = null;
		$scope.updateErrors = null;
		$scope.updateWarning = null;
		readFilePreview.readTextFile($scope.selectedFile, 10000, $scope.fileEncoding).then(
				function(contents){



					var lines = contents.split(/\r\n|\n/);
					console.log("nr righe", lines.length);
					var firstRows = lines.slice(0, 5);
					$scope.previewLines = [];
					console.log("(firstRows.join",firstRows.join("\n"));

					console.log("CSVtoArrayAll",Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator));

					$scope.previewLines = Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator);
					if($scope.previewLines!=null && $scope.previewLines.length>0 && $scope.previewLines[0].length != $scope.dataset.info.fields.length){
						$scope.updateWarning = true;
						$scope.updateWarningMessage = 'MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_NUM_COLUMN';
						$showUploadButton = false;
						$scope.selectedFile = null;

					}
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};


	$scope.isUploading = false;
	$scope.showUploadButton = true;
	$scope.loadMoreData = function(){
		$scope.showUploadButton = true;
	};


	$scope.uploadData = function() {
		$scope.updateInfo = null;
		$scope.updateError = null;
		$scope.updateErrors = null;
		$scope.updateWarning = null;
		console.log("uploadData START", $scope.csvSeparator);

		$scope.upload = $upload.upload({
			url: Constants.API_MANAGEMENT_DATASET_ADD_DATA_URL + $scope.tenantCode + '/'+ $scope.datasetCode + '/', 

			method: 'POST',
			data: {formatType: $scope.importFileType, 
				csvSeparator: $scope.csvSeparator, encoding: $scope.fileEncoding , skipFirstRow: $scope.csvSkipFirstRow },
				file: $scope.selectedFile, // or list of files ($files) for html5 only
				fileName: $scope.selectedFile.name,

		}).progress(function(evt) {
			$scope.isUploading = true;
			console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		}).success(function(data, status, headers, config) {
			$scope.isUploading = false;
			$scope.showUploadButton = false;
			console.log("upload finish");
			if(data.errors && data.errors.length>0){
				$scope.updateError = true;
				$scope.updateErrors = data.errors;
				Helpers.util.scrollTo();
				$scope.showUploadButton = true;
			}
			else{
				$scope.selectedFile = null;
				$scope.previewLines = [];
				$scope.updateInfo = {status: "Upload OK"};
			}
		});
	};	
}]);


appControllers.controller('ManagementNewDatasetWizardCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice','fabricAPImanagement','readFilePreview','info', '$upload', 'sharedDataset', '$translate','$modal', 'sharedUploadBulkErrors',
                                                              function($scope, $route, $location, fabricAPIservice, fabricAPImanagement,readFilePreview, info, $upload, sharedDataset,$translate,$modal,sharedUploadBulkErrors) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.currentStep = 'start';
	$scope.wizardSteps = [{'name':'start', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'metadata', 'style':''},
	                      {'name':'choosetype', 'style':''},
	                      {'name':'upload', 'style':''},
	                      {'name':'columns', 'style':''},
	                      ];

	$scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;

	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};

	$scope.isLicenceVisible = function(){
		var returnValue = true;
		if ($scope.metadata){
			if (($scope.metadata.info.license == translations_it.DATASET_FIELD_METADATA_LICENCE_CCBY) || ($scope.metadata.info.license == translations_it.DATASET_FIELD_METADATA_LICENCE_CC0))
				returnValue = false;
		}
		
		return returnValue;
	};
	
	$scope.checkTag = function(){ 
		var rslt = true;
		if(typeof $scope.metadata.info.tags != "undefined"){
			if ($scope.metadata.info.tags.length > 0){ 
				rslt = false;
			}
		}
		
		return rslt;
	};

	$scope.choosenDatasetType='bulk_upload';

	refreshWizardToolbar();

	$scope.columnDefinitionType = "import";
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.canCreatePublicDataset = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public" &&  !$scope.metadata.info.unpublished;
	}; 

	$scope.canShareDataset = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";
	}; 


	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		response.streamDomains.element.sort(function(a, b) { 
		    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
		});
		
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.subDomainList = [];
	fabricAPIservice.getStreamSubDomains().success(function(response) {
		response.streamSubDomains.element.sort(function(a, b) { 
		    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
		});
		for (var int = 0; int < response.streamSubDomains.element.length; int++) {
			$scope.subDomainList.push(response.streamSubDomains.element[int]);
		}
	});

//	$scope.tagList = [];
//	fabricAPIservice.getStreamTags().success(function(response) {
//		for (var int = 0; int < response.streamTags.element.length; int++) {
//			$scope.tagList.push(response.streamTags.element[int].tagCode);
//		}
//	});
	$scope.tagList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			//$scope.tagList.push(response.streamTags.element[int].tagCode);
			$scope.tagList.push({"tagCode":response.streamTags.element[int].tagCode, "tagLabel":$translate.instant(response.streamTags.element[int].tagCode)} );
		}
		$scope.tagList.sort(function(a, b) { 
		    return ((a.tagLabel.trim().toUpperCase() < b.tagLabel.trim().toUpperCase()) ? -1 : ((a.tagLabel.trim().toUpperCase() > b.tagLabel.trim().toUpperCase()) ? 1 : 0));
		});
		
//		var delta = Math.trunc($scope.tagList.length/3);
//		$scope.tagTooltipHtml = "<div class='tag-html-tooltip row'>";
//		$scope.tagTooltipHtml += "<div class='col-sm-12'><h5>" + $translate.instant('MANAGEMENT_EDIT_STREAM_TAG_TOOLTIP_TITLE') + "</h5></div>";
//
//		for (var i = 0; i < delta+1; i++) {
//			$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i].tagLabel +  "</div>";
//			if($scope.tagList.length>i+delta+1)
//				$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i+delta+1].tagLabel  +  "</div>";
//			else
//				$scope.tagTooltipHtml += "<div class='col-sm-4'> &nbsp;</div>";
//			if($scope.tagList.length>i+delta*2+2)
//				$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i+delta*2+2].tagLabel  +  "</div>";
//			else
//				$scope.tagTooltipHtml += "<div class='col-sm-4'> &nbsp;</div>";
//		}
//		$scope.tagTooltipHtml += "</div>";
//		$scope.tagTooltipHtml += "</div>";

	});	

	$scope.showChooseTagTable = function(){
		var chooseTagDialog = $modal.open({
	      templateUrl: 'tagChooerDialog.html',
	      controller: 'ManagementDatasetChooseTagControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tagList: function () {return $scope.tagList;},
	      	}
    	});
		
		chooseTagDialog.result.then(function (selectedTag) {
			$scope.addTag(selectedTag.tagCode);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};
	
	$scope.tenantsList = [];
	fabricAPIservice.getTenants().success(function(response) {
		try{
			
			for (var int = 0; int <  response.tenants.tenant.length; int++) {
				var t = response.tenants.tenant[int];
				if(t.tenantCode!=$scope.tenantCode && t.tenantName!=null)
					$scope.tenantsList.push(t);
			}
			
			$scope.tenantsList.sort(function(a, b) { 
			    return ((a.tenantName.trim().toUpperCase() < b.tenantName.trim().toUpperCase()) ? -1 : ((a.tenantName.trim().toUpperCase() > b.tenantName.trim().toUpperCase()) ? 1 : 0));
			});

		} catch (e) {
			console.error("getTenants ERROR",e);
		}
	});
	
	
	$scope.showChooseTenantTable = function(){
		var chooseTenantDialog = $modal.open({
	      templateUrl: 'tenantChooerDialog.html',
	      controller: 'ManagementDatasetChooseTenantControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tenantsList: function () {return $scope.tenantsList;},
	      	}
    	});
		
		chooseTenantDialog.result.then(function (selectedTenant) {
			$scope.addTenantSharing(selectedTenant);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};


	$scope.unitOfMesaurementList = [];
	fabricAPIservice.getStreamUnitOfMesaurement().success(function(response) {
		$scope.unitOfMesaurementList = response.measureUnit.element;
	});

	var defaultDataType = null;
	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
		//$scope.dataTypeList.push(coordinatesDataType);
		for (var int = 0; int < $scope.dataTypeList; int++) {
			if($scope.dataTypeList[int].dataType == 'string'){
				console.log("$scope.dataTypeList[int].dataType", $scope.dataTypeList[int].dataType);
				defaultDataType = $scope.dataTypeList[int].dataType;
				break;
			}
		}
	});
	
	$scope.metadata = sharedDataset.getDataset();
	var isClone = false;
	$scope.previewLines = [];
	$scope.previewColumns = [];
	$scope.previewBinaries = [];
	
	$scope.validationPatternSubdomain = Constants.VALIDATION_PATTERN_NO_SPACE;

	if($scope.metadata==null){
		$scope.metadata = {info:{}, configData: {}, opendata: {}};
		$scope.metadata.info.icon  = "img/dataset-icon-default.png";
		$scope.metadata.info.visibility = "private";
		$scope.metadata.info.importFileType = "csv";
		$scope.metadata.opendata.language = 'it';
		$scope.metadata.opendata.isOpendata = 'false';
		$scope.metadata.info.publish = true;
	}
	else{
		isClone = true;
		$scope.metadata.info.datasetName = null;
		if($scope.metadata.configData.deleted)
			delete $scope.metadata.configData.deleted;
		$scope.previewColumns = [];
		$scope.previewBinaries = [];
		if($scope.metadata.info.fields.length>0){
			for (var int = 0; int < $scope.metadata.info.fields.length; int++) {
				var field = $scope.metadata.info.fields[int];
				if(field.dataType == 'binary')
					$scope.previewBinaries.push(field);
				else
					$scope.previewColumns.push(field);
			}
		}
		
	}
	$scope.metadata.opendata.dataUpdateDate = Helpers.util.formatDateForInputHtml5(new Date());
	$scope.useDomainMulti  = function(useDomainMultiFlag){
		console.log("useDomainMulti", useDomainMultiFlag);
		if(useDomainMultiFlag){
			$scope.metadata.info.dataDomain = 'MULTI';
			$scope.metadata.info.visibility = 'private';
		}
		else
			$scope.metadata.info.dataDomain = null;
		
		$scope.metadata.info.codSubDomain = null;
	};
	
	$scope.user = {};

	fabricAPIservice.getInfo().success(function(result) {
		console.debug("result managementnew stream", result);
		$scope.user = result.user;
		console.debug("info user", $scope.user);
		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.metadata.info.requestorName=$scope.user.firstname;
			$scope.metadata.info.requestorSurname=$scope.user.lastname;
			$scope.metadata.info.requestornEmail=$scope.user.email;
		}
	});

	$scope.newTag = {value:""};
	$scope.addTag = function(newTag){
		console.log("addTag", newTag);
		if(newTag){
			if(! $scope.metadata.info.tags)
				$scope.metadata.info.tags = [];

			var found = false;	
			for (var int = 0; int < $scope.metadata.info.tags.length; int++) {
				var existingTag = $scope.metadata.info.tags[int];
				if(existingTag.tagCode == newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.metadata.info.tags.push({"tagCode":newTag});
		}
		$scope.newTag.value = "";
		return false;

	};

	$scope.onTagSelect = function($item, $model, $label){
		console.log("onTagSelect",$item, $model, $label);
		if($item.tagCode!=null)
			$scope.addTag($item.tagCode);
		
	};


	$scope.removeTag = function(index){
		$scope.metadata.info.tags.splice(index,1);
		return false;
	};
	
	
	$scope.addTenantSharing = function(newTenantSharing){
		console.log("addTenantSharing ",newTenantSharing);
		if(newTenantSharing){
			var found = false;	
			if(!$scope.metadata.info.tenantssharing || $scope.metadata.info.tenantssharing == null){
				$scope.metadata.info.tenantssharing = {};
			}
			if(!$scope.metadata.info.tenantssharing.tenantsharing || $scope.metadata.info.tenantssharing.tenantsharing == null){
				$scope.metadata.info.tenantssharing.tenantsharing = [];
			}
			
			for (var int = 0; int < $scope.metadata.info.tenantssharing.tenantsharing.length; int++) {
				var existingTenantSharing = $scope.metadata.info.tenantssharing.tenantsharing[int];
				console.log("existing",existingTenantSharing);
				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
					console.log("found");
					found = true;
					break;
				}

			}
			if(!found){
				$scope.metadata.info.tenantssharing.tenantsharing.push(
							{"idTenant":newTenantSharing.idTenant, 
								"tenantName": newTenantSharing.tenantName, 
								"tenantDescription": newTenantSharing.tenantDescription, 
								"tenantCode": newTenantSharing.tenantCode, 
								"isOwner": 0
							});
				console.log("added", $scope.metadata.info.tenantssharing.tenantsharing );
			}
		}

		return false;
	};

	$scope.removeTenantSharing = function(index){
		$scope.metadata.info.tenantssharing.tenantsharing.splice(index,1);
		return false;
	};
	
	$scope.onTenantSharingSelect = function($item, $model, $label){
		console.log("onTenantSharingSelect",$item, $model, $label);
		$scope.addTenantSharing($item);
		
	};


	$scope.creationError = null;
	$scope.saveError = null;
	$scope.saveErrors = null;

	$scope.accettazionePrivacy=0;
	$scope.accettazioneResponsability=0;


	$scope.selectedFile = null;
	$scope.uploadDatasetError = null;
	$scope.uploadDatasetInfo = null;

	$scope.formatList = ["csv"];

	$scope.csvSeparator = ";";
	$scope.fileEncoding = "UTF-8";
	$scope.csvSkipFirstRow = true;

	$scope.choosenFileSize = null;
	$scope.updateWarning = null;
	$scope.maxFileSize = Constants.BULK_DATASET_MAX_FILE_SIZE;
	$scope.choosenFileSize = null;
	
	$scope.selectedIcon;
	$scope.onIconSelect = function($files) {
		$scope.selectedIcon = $files[0];
		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
			$scope.choosenIconSize = $scope.selectedIcon.size; 
			$scope.updateWarning = true;
			$scope.selectedIcon = null;
		}
		else
			readIconPreview();
	};

	var readIconPreview = function(){
		readFilePreview.readImageFile($scope.selectedIcon).then(
				function(contents){
					console.log("contents" , contents);
					$scope.metadata.info.icon = contents;
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};

	$scope.onFileSelect = function($files) {
		$scope.updateWarning = null;
		$scope.selectedFile = $files[0];
		if($scope.selectedFile !=null && $scope.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
			$scope.choosenFileSize = $scope.selectedFile.size; 
			$scope.updateWarning = true;
			$scope.selectedFile = null;
			$scope.previewLines = null;
		}
		else
			readPreview($scope.csvSeparator);
	};

	
	var readPreview = function(csvSeparator){
		$scope.uploadDatasetError = null;
		readFilePreview.readTextFile($scope.selectedFile, 10000, $scope.fileEncoding).then(
				function(contents){
					var lines = contents.split(/\r\n|\n/);
					console.log("nr righe", lines.length);
					//console.log(lines);
					var firstRows = lines.slice(0, 5);
					$scope.previewLines = [];
					console.log("(firstRows.join",firstRows.join("\n"));
					console.log("CSVtoArrayAll",Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator));

					$scope.previewLines = Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator);
					console.log("$scope.previewLines",$scope.previewLines);

					$scope.metadata.info.fields = [];
					$scope.previewColumns = [];
					console.log("defaultDataType",defaultDataType);
					if($scope.previewLines.length>0){
						for (var int = 0; int < $scope.previewLines[0].length; int++) {
							$scope.previewColumns.push(
									{index: int, 
										sourceColumn: int+1, 
										fieldName: $scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
										fieldAlias: $scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
										dataType: defaultDataType,
										isKey: false, 
										measureUnit: null,
										skipColumn: false});
						}
						$scope.refreshColumnOrder();
					}
					console.log("$scope.previewColumns",$scope.previewColumns);
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};

	$scope.refreshColumnOrder = function(){
		console.log("refreshColumnOrder");
		if($scope.previewColumns && $scope.previewColumns.length>0){
			var order = 0;
			$scope.metadata.info.fields = [];
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				var column  = $scope.previewColumns[int];
				column.index = int;
				if(!column.skipColumn){
					//column.sourceColumn = order;
					var dataType = column.dataType?column.dataType.dataType:'string';
					var measureUnit = column.measureUnit?column.measureUnit.measureUnit:null;
					$scope.metadata.info.fields.push(
							{"sourceColumn":column.sourceColumn, 
								"fieldName":column.fieldName, 
								"fieldAlias":column.fieldAlias, 
								"dataType":dataType, 
								"isKey":column.isKey?1:0, 
								"measureUnit":measureUnit,
								"dateTimeFormat":column.dateTimeFormat,
								"order":order}
					);
					order++;
				}

			}
			$scope.checkColumnName();
			
			
		}
	};
	
	$scope.columnsDatasetError = {"hasError": false};
	
	$scope.checkColumnName = function(fieldName, columnIndex){
		$scope.insertColumnErrors = [];
		$scope.columnsDatasetError.hasError = false;
		var checkNameDuplicate = false;
		if($scope.previewColumns!=null){
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				if(int != columnIndex && !$scope.previewColumns[int].skipColumn &&  typeof $scope.previewColumns[int].fieldName!='undefined' && 
						 typeof fieldName!='undefined' && $scope.previewColumns[int].fieldName.toUpperCase() == fieldName.toUpperCase()){
					checkNameDuplicate = true;
				}
			}
		}
		if(checkNameDuplicate){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
			$scope.columnsDatasetError.hasError = true;
		}
		if(fieldName == ""){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
		$scope.columnsDatasetError.hasError = true;
		}
	};
	
	$scope.columnsDatasetHasError = function(){
		return $scope.columnsDatasetError.hasError; 
	};
	
	$scope.newColumnDefinition = {sourceColumn: $scope.previewColumns.length+1};
	$scope.addColumnDefinition = function(){
		console.log("addColumnDefinition",$scope.newColumnDefinition);
		//$scope.newColumnDefinition.sourceColumn = $scope.previewColumns.length+1;
		$scope.insertColumnErrors = [];

		if($scope.newColumnDefinition.fieldName==null || $scope.newColumnDefinition.fieldName=="")
				$scope.insertColumnErrors .push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME');

		console.log("$scope.newColumnDefinition.sourceColumn",$scope.newColumnDefinition.sourceColumn);
		console.log("$scope.newColumnDefinition.sourceColumn",($scope.newColumnDefinition.sourceColumn==null));
		console.log("$scope.newColumnDefinition.sourceColumn", ($scope.newColumnDefinition.sourceColumn==""));
		if($scope.newColumnDefinition.sourceColumn==null || $scope.newColumnDefinition.sourceColumn=="" || isNaN($scope.newColumnDefinition.sourceColumn))
			$scope.insertColumnErrors .push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN');

		var checkNameDuplicate = false;
		var checkSourceColumnDuplicate = false;
		for (var int = 0; int < $scope.previewColumns.length; int++) {
			if($scope.previewColumns[int].fieldName.toUpperCase() == $scope.newColumnDefinition.fieldName.toUpperCase()){
				checkNameDuplicate = true;
			}
			if($scope.previewColumns[int].sourceColumn == $scope.newColumnDefinition.sourceColumn){
				checkSourceColumnDuplicate = true;
			}
		}
		
		if(checkNameDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME_UNIQUE');
		
		if(checkSourceColumnDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE');
		
		if($scope.insertColumnErrors.length == 0){
			if(!$scope.newColumnDefinition.fieldAlias || $scope.newColumnDefinition.fieldAlias == null || $scope.newColumnDefinition.fieldAlias == ""){
				$scope.newColumnDefinition.fieldAlias = $scope.newColumnDefinition.fieldName;
			}
			

			$scope.previewColumns.push($scope.newColumnDefinition);
			$scope.newColumnDefinition = {sourceColumn: $scope.previewColumns.length+1};
			$scope.refreshColumnOrder();
		}
	};
	
	$scope.removeColumnDefinition = function(index){
		$scope.previewColumns.splice(index,1);
		$scope.refreshColumnOrder();
	};

	$scope.newBinaryDefinition = {sourceBinary: $scope.previewBinaries.length+1};
	$scope.addBinaryDefinition = function(){
		console.log("addBinaryDefinition",$scope.newBinaryDefinition);
		//$scope.newBinaryDefinition.sourceBinary = $scope.previewBinaries.length+1;
		$scope.insertBinaryErrors = [];

		if($scope.newBinaryDefinition.fieldName==null || $scope.newBinaryDefinition.fieldName=="")
				$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME');

		var checkNameDuplicate = false;
		//var checkSourceBinaryDuplicate = false;
		for (var int = 0; int < $scope.previewBinaries.length; int++) {
			if($scope.previewBinaries[int].fieldName == $scope.newBinaryDefinition.fieldName){
				checkNameDuplicate = true;
			}
//			if($scope.previewBinaries[int].sourceBinary == $scope.newBinaryDefinition.sourceBinary){
//				checkSourceBinaryDuplicate = true;
//			}
//
	}
		
		if(checkNameDuplicate)
			$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME_UNIQUE');
		
//		if(checkSourceBinaryDuplicate)
//			$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE');
		if($scope.insertBinaryErrors.length == 0){
			if(!$scope.newBinaryDefinition.fieldAlias || $scope.newBinaryDefinition.fieldAlias == null || $scope.newBinaryDefinition.fieldAlias == ""){
				$scope.newBinaryDefinition.fieldAlias = $scope.newBinaryDefinition.fieldName;
			}
			

			$scope.previewBinaries.push($scope.newBinaryDefinition);
			$scope.newBinaryDefinition = {sourceBinary: $scope.previewBinaries.length+1};
			//$scope.refreshColumnOrder();
		}
	};
	
	$scope.removeBinaryDefinition = function(index){
		$scope.previewBinaries.splice(index,1);
		//a$scope.refreshBinaryOrder();
	};

	$scope.onDropCsvFieldComplete=function(fromIndex, toIndex,evt){
		var columToMove = $scope.previewColumns[fromIndex];
		columToMove.dragging = false;
		$scope.previewColumns.splice(fromIndex, 1);
		$scope.previewColumns.splice(toIndex, 0, columToMove);
		$scope.refreshColumnOrder();
	};

	$scope.isDateTimeField = function(field){
		if(field && field.dataType && field.dataType.dataType && field.dataType.dataType == "dateTime")
			return true;
		return false;
	};
	
	$scope.isCoordinatesField = function(field){
		if(field && field.dataType && field.dataType.dataType && field.dataType.dataType == "coordinates")
			return true;
		return false;
	};
	
	$scope.isCommonField = function(field){
		return !$scope.isCoordinatesField(field) && !$scope.isDateTimeField(field);
	};
	
	$scope.cancel = function(){
		$location.path('management/datasets/'+$scope.tenantCode);
	};

	$scope.htmlTooltip = Constants.HELP_HINT_DATE_FORMAT_TABLE;
	
	
	$scope.goToStart  = function(){$scope.currentStep = 'start'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToMetadata  = function(){ $scope.currentStep = 'metadata';refreshWizardToolbar();};
	$scope.goToChooseType  = function(){
		$scope.selectedFile = null;
		$scope.previewLines = [];
		if(isClone)
			isClone = false;
		else{
			$scope.previewColumns = [];
			$scope.previewBinaries = [];
		}
		$scope.metadata.info.fields = [];
		
		
		$scope.currentStep = 'choosetype';refreshWizardToolbar();
	};
	$scope.goToUpload  = function(){  $scope.currentStep = 'upload';refreshWizardToolbar();};
	$scope.goToColumns  = function(csvSeparator, fileEncoding){
		$scope.warningMessages = [];
		$scope.saveError = null;
		$scope.saveErrors = null;

		$scope.columnDefinitionType = "import";  
		readPreview(csvSeparator); 
		console.log("csvSeparator", $scope.csvSeparator, csvSeparator);
		$scope.csvSeparator=csvSeparator;
		$scope.fileEncoding=fileEncoding;
		$scope.currentStep = 'columns';
		refreshWizardToolbar();
	};
	
	$scope.setCsvSkipFirstRow = function(csvSkipFirstRow){
		console.log("setCsvSkipFirstRow",csvSkipFirstRow);
		$scope.csvSkipFirstRow = !csvSkipFirstRow;
	};
	
	$scope.goToCreateColumns  = function(choosen){
		$scope.choosenDatasetType = choosen;
		$scope.columnDefinitionType = "create"; 
		$scope.currentStep = 'columns';
		refreshWizardToolbar();
	};

	 
	var choosenDatasetTypeVar = "";
	
	$scope.chooseDatasetType = function(choosen){
		console.log("choosen",choosen);
		$scope.choosenDatasetType = choosen;

		console.log("$scope.choosenDatasetType",$scope.choosenDatasetType);
		choosenDatasetTypeVar = choosen;
		console.log("$scope.choosenDatasetTypeVar",choosenDatasetTypeVar);

		if(choosen == 'bulk_upload')
			$scope.goToUpload();
		else if(choosen == 'bulk_no_upload'){
			$scope.previewBinaries = [];
			$scope.goToCreateColumns(choosen);
		}
		else{ //if(choosen == 'bulk_no_upload' || choosen == 'binary_no_upload')
			$scope.goToCreateColumns(choosen);
		}
		
	};
	
	$scope.backFromColumns= function(){
		if($scope.choosenDatasetType == 'bulk_upload')
			$scope.goToUpload();
		else{ //if(choosen == 'bulk_no_upload' || choosen == 'binary_no_upload')
			$scope.goToChooseType();
		}
				
	};
	
	$scope.checkVCard = function(){
		var VCARD_PREFIX = 'BEGIN:VCARD \n VERSION:2.1';
		var VCARD_SUFFIX = 'END:VCARD';
		var VCARD_N = 'N:';
		var VCARD_FN = 'FN:';
		var VCARD_TEL = 'TEL;WORK:';
		var VCARD_EMAIL = 'EMAIL:';
		var VCARD_URL = 'URL:';
		//if (($scope.metadata.dcat.vcard == null) || ($scope.metadata.dcat.vcard == '')){
			$scope.metadata.dcat.vcard = VCARD_PREFIX + 
										 VCARD_N + ((($scope.metadata.dcat.nomeOrg != '') && ($scope.metadata.dcat.nomeOrg != null)) ? $scope.metadata.dcat.nomeOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
										 VCARD_FN + ((($scope.metadata.dcat.nomeOrg != '') && ($scope.metadata.dcat.nomeOrg != null)) ? $scope.metadata.dcat.nomeOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
										 VCARD_TEL + ((($scope.metadata.dcat.telOrg != '') && ($scope.metadata.dcat.telOrg != null)) ? $scope.metadata.dcat.telOrg.replace(" ",";") : '+39.011.3168111') + 
										 VCARD_EMAIL + ((($scope.metadata.dcat.emailOrg != '') && ($scope.metadata.dcat.emailOrg != null)) ? $scope.metadata.dcat.emailOrg.replace(" ",";") : 'info@csi.it') + 
										 VCARD_URL + ((($scope.metadata.dcat.urlOrg != '') && ($scope.metadata.dcat.urlOrg != null)) ? $scope.metadata.dcat.urlOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
										 VCARD_SUFFIX;
		//}
	};
	
	$scope.isUploading = false;

	$scope.warningMessages = [];
	
	$scope.createDataset = function() {
		$scope.warningMessages = [];
		$scope.saveError = null;
		$scope.saveErrors = null;
		console.log("createDataset START 1", $scope.metadata);
		$scope.refreshColumnOrder();
		console.log("createDataset START 2", $scope.metadata);
		var newDataset = $scope.metadata;
		newDataset.configData.tenantCode=$scope.tenantCode;
		newDataset.configData.type = "dataset";
		newDataset.configData.subtype = "bulkDataset";
		newDataset.idDataset = $scope.metadata.idDataset;
		newDataset.datasetCode = $scope.metadata.datasetCode;
		newDataset.datasetVersion = $scope.metadata.datasetVersion;
		console.log("dataset qui ", newDataset);
		
		var hasErrors = false;
		
		if(!$scope.metadata.info.fields || $scope.metadata.info.fields==null || $scope.metadata.info.fields.length == 0){
			$scope.warningMessages.push('MANAGEMENT_NEW_DATASET_WARNING_NO_COLUMN');
			$scope.metadata.info.fields = [];
			hasErrors =true;
		}
		console.log("$scope.choosenDatasetType ",$scope.choosenDatasetType );
		console.log("$scope.previewBinaries ",$scope.previewBinaries );
		console.log("$scope.previewBinaries.length ",$scope.previewBinaries.length );
		if($scope.choosenDatasetType == 'binary_no_upload' && $scope.previewBinaries.length==0){
			$scope.warningMessages.push('MANAGEMENT_NEW_DATASET_WARNING_NO_BINARY');
			hasErrors =true;
		}
		
		var startSourceColumn = $scope.metadata.info.fields.length +1;
		for (var i = 0; i < $scope.previewBinaries.length; i++) {
			var fileDef = $scope.previewBinaries[i];
			$scope.metadata.info.fields.push(
					{"sourceColumn":(startSourceColumn + i), 
						"fieldName":fileDef.fieldName, 
						"fieldAlias":fileDef.fieldAlias, 
						"dataType":"binary", 
						"isKey":0, 
						"measureUnit":null,
						"dateTimeFormat":null,
						"order":(startSourceColumn + i -1)}
					);
		}
		
		console.log("dataset dopo binary ", newDataset);
		$scope.openadataDataUpdateDateStyle = "";

		if(typeof newDataset.opendata === 'undefined' || newDataset.opendata==null || newDataset.opendata.isOpendata !='true'){
			newDataset.opendata = null;
		}
		else{
			if(!newDataset.opendata.language || newDataset.opendata.language == null || newDataset.opendata.language == '')
				newDataset.opendata.language = 'it';

			if(newDataset.opendata.dataUpdateDate && newDataset.opendata.dataUpdateDate!=null)
				newDataset.opendata.dataUpdateDate = new Date(newDataset.opendata.dataUpdateDate).getTime();

		}

		console.log("newDataset", newDataset);
		if(!hasErrors){
			var fileName = null;
			if($scope.selectedFile && $scope.selectedFile != null  && $scope.selectedFile.name && $scope.selectedFile.name!=null)
				fileName = $scope.selectedFile.name;
			$scope.isUploading = true;
			$scope.upload = $upload.upload({
				url: Constants.API_MANAGEMENT_DATASET_LIST_URL + $scope.tenantCode + '/', 
				//headers: { 'Content-Transfer-Encoding': '8bit' },
				method: 'POST',
				data: {dataset: newDataset, formatType: $scope.metadata.info.importFileType, csvSeparator: $scope.csvSeparator, encoding: $scope.fileEncoding, skipFirstRow: $scope.csvSkipFirstRow },
				file: $scope.selectedFile, // or list of files ($files) for html5 only
				fileName: fileName,
	
			}).progress(function(evt) {
				$scope.isUploading = true;
				console.log('evt');
				console.log(evt);
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function(data, status, headers, config) {
				$scope.isUploading = false;
				console.log("data loaded", data);
				if(data.errors && data.errors.length>0){
					$scope.saveError = true;
					$scope.saveErrors = data.errors;
					if (data.datasetStatus == 0)
						Helpers.util.scrollTo();
					else if ((data.datasetStatus == 1) || (data.datasetStatus == 2)){
						sharedUploadBulkErrors.setErrors(data.errors);
						$location.path('/management/viewDataset/'+$scope.tenantCode+"/"+data.metadata.datasetCode);//+"?errorParams="+data.datasetStatus)
					}
				} else {
					$location.path('/management/viewDataset/'+$scope.tenantCode+"/"+data.metadata.datasetCode);
				}
	
			});
		}

	};	
} ]);


appControllers.controller('ManagemenImportDatabasetWizardCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice','fabricAPImanagement','readFilePreview','info', '$upload', 'sharedDataset', '$translate','$modal', 'devService',
                                                              function($scope, $route, $location, fabricAPIservice, fabricAPImanagement,readFilePreview, info, $upload, sharedDataset,$translate, $modal, devService) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.warningMessages = [];
	
	$scope.validationPatternSubdomain = Constants.VALIDATION_PATTERN_NO_SPACE;


	$scope.currentStep = 'start';
	$scope.wizardSteps = [{'name':'start', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'metadata', 'style':''},
	                      {'name':'database', 'style':''},
	                      {'name':'tables', 'style':''},
	                      {'name':'customize', 'style':''},
	                      ];

	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};
	
	$scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;
	
	$scope.importConfig = {};
	$scope.defaultMetadata= {"info":{"visibility":"private","tenantssharing":{"tenantsharing": new Array()},"tags": new Array()}}; 
	$scope.chooseSourceType  = function(sourceType){
		$scope.importConfig.sourceType = sourceType;
		$scope.goToDatabase();
	};
	

	$scope.importConfig.sqlSourcefile;
	$scope.onSqlSourceSelect = function($files) {
		if( $files[0] !=null &&  $files[0].size>Constants.DATABASE_IMPORT_SOURCEFILE_MAX_FILE_SIZE){
			$scope.warningMessages.push('MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_TOOBIG_WARNING');
			$scope.importConfig.sqlSourcefile = null;
		}
		else{
			$scope.importConfig.sqlSourcefile = $files[0];
		}
	};

	$scope.useDomainMulti  = function(useDomainMultiFlag){
		console.log("useDomainMulti", useDomainMultiFlag);
		if(useDomainMultiFlag){
			$scope.defaultMetadata.info.dataDomain = 'MULTI';
			$scope.defaultMetadata.info.visibility = 'private';
		}
		else
			$scope.defaultMetadata.info.dataDomain = null;
		
		$scope.defaultMetadata.info.codSubDomain = null;
	};

	
	$scope.isLicenceVisible = function(){
		var returnValue = true;
		if ($scope.metadata){
			if (($scope.defaultMetadata.info.license == translations_it.DATASET_FIELD_METADATA_LICENCE_CCBY) || ($scope.defaultMetadata.info.license == translations_it.DATASET_FIELD_METADATA_LICENCE_CC0))
				returnValue = false;
		}
		return returnValue;
	};
	
	$scope.checkTag = function(){ 
		var rslt = true;
		if(typeof $scope.defaultMetadata.info.tags != "undefined"){
			if ($scope.defaultMetadata.info.tags.length > 0){ 
				rslt = false;
			}
		}
		
		return rslt;
	};

	refreshWizardToolbar();

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	
	$scope.canCreatePublicDataset = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public" &&  !$scope.defaultMetadata.info.unpublished;
	}; 

	$scope.canShareDataset = function(){
		// return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";
	}; 
	
	
	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		response.streamDomains.element.sort(function(a, b) { 
		    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
		});
		
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.subDomainList = [];
	fabricAPIservice.getStreamSubDomains().success(function(response) {
		response.streamSubDomains.element.sort(function(a, b) { 
		    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
		});
		for (var int = 0; int < response.streamSubDomains.element.length; int++) {
			$scope.subDomainList.push(response.streamSubDomains.element[int]);
		}
	});
	
	

	$scope.tagList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			//$scope.tagList.push(response.streamTags.element[int].tagCode);
			$scope.tagList.push({"tagCode":response.streamTags.element[int].tagCode, "tagLabel":$translate.instant(response.streamTags.element[int].tagCode)} );
		}
		
		$scope.tagList.sort(function(a, b) { 
		    return ((a.tagLabel < b.tagLabel) ? -1 : ((a.tagLabel > b.tagLabel) ? 1 : 0));
		});
		
		var delta = Math.trunc($scope.tagList.length/3);
		$scope.tagTooltipHtml = "<div class='tag-html-tooltip row'>";
		$scope.tagTooltipHtml += "<div class='col-sm-12'><h5>" + $translate.instant('MANAGEMENT_EDIT_STREAM_TAG_TOOLTIP_TITLE') + "</h5></div>";

		for (var i = 0; i < delta+1; i++) {
			$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i].tagLabel +  "</div>";
			if($scope.tagList.length>i+delta+1)
				$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i+delta+1].tagLabel  +  "</div>";
			else
				$scope.tagTooltipHtml += "<div class='col-sm-4'> &nbsp;</div>";
			if($scope.tagList.length>i+delta*2+2)
				$scope.tagTooltipHtml += "<div class='col-sm-4'>" + $scope.tagList[i+delta*2+2].tagLabel  +  "</div>";
			else
				$scope.tagTooltipHtml += "<div class='col-sm-4'> &nbsp;</div>";
		}
		$scope.tagTooltipHtml += "</div>";
		$scope.tagTooltipHtml += "</div>";

	}).error(function(response) {console.error("getStreamTags", response);});	
	
	$scope.tenantsList = [];
	fabricAPIservice.getTenants().success(function(response) {
		try{
			
			for (var int = 0; int <  response.tenants.tenant.length; int++) {
				var t = response.tenants.tenant[int];
				if(t.tenantCode!=$scope.tenantCode)
					$scope.tenantsList.push(t);
			}
		} catch (e) {
			console.error("getTenants ERROR",e);
		}
	}).error(function(response) {console.error("erro", response);});


	$scope.unitOfMesaurementList = [];
	fabricAPIservice.getStreamUnitOfMesaurement().success(function(response) {
		$scope.unitOfMesaurementList = response.measureUnit.element;
	});

	var defaultDataType = null;
	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
		//$scope.dataTypeList.push(coordinatesDataType);
		for (var int = 0; int < $scope.dataTypeList; int++) {
			if($scope.dataTypeList[int].dataType == 'string'){
				console.log("$scope.dataTypeList[int].dataType", $scope.dataTypeList[int].dataType);
				defaultDataType = $scope.dataTypeList[int].dataType;
				break;
			}
		}
	});
	

	$scope.user = {};
	fabricAPIservice.getInfo().success(function(result) {
		console.debug("result managementnew stream", result);
		$scope.user = result.user;
		console.debug("info user", $scope.user);
		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.defaultMetadata.info.requestorName=$scope.user.firstname;
			$scope.defaultMetadata.info.requestorSurname=$scope.user.lastname;
			$scope.defaultMetadata.info.requestornEmail=$scope.user.email;
		}
	});

	$scope.newTag = {value:""};
	$scope.addTag = function(newTag, tags){
		console.log("addTag", newTag);
		if(newTag){
			if(!tags)
				tags = [];

			var found = false;	
			for (var int = 0; int <tags.length; int++) {
				var existingTag = tags[int];
				if(existingTag.tagCode == newTag){
					found = true;
					break;
				}

			}
			if(!found)
				tags.push({"tagCode":newTag});
		}
		$scope.newTag.value = "";
		return false;

	};

	$scope.onTagSelect = function($item, $model, $label){
		console.log("onTagSelect",$item, $model, $label);
		if($item.tagCode!=null)
			$scope.addTag($item.tagCode, $scope.defaultMetadata.info.tags);
		
	};


	$scope.removeTag = function(index, tags){
		tags.splice(index,1);
		return false;
	};
	
	$scope.showChooseTagTable = function(){
		var chooseTagDialog = $modal.open({
	      templateUrl: 'tagChooerDialog.html',
	      controller: 'ManagementDatasetChooseTagControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tagList: function () {return $scope.tagList;},
	      	}
    	});
		
		chooseTagDialog.result.then(function (selectedTag) {
			$scope.addTag(selectedTag.tagCode,$scope.defaultMetadata.info.tags);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	
	$scope.addTenantSharing = function(newTenantSharing){
		console.log("addTenantSharing ",newTenantSharing);
		if(newTenantSharing){
			var found = false;	
//			if(!$scope.defaultMetadata.info.tenantssharing || $scope.defaultMetadata.info.tenantssharing == null){
//				$scope.defaultMetadata.info.tenantssharing = {};
//			}defaultMetadata.info.tenantssharing.tenantsharing
			if(!$scope.defaultMetadata.info.tenantssharing || $scope.defaultMetadata.info.tenantssharing == null){
				$scope.defaultMetadata.info.tenantssharing = [];
			}
			
			if(!$scope.defaultMetadata.info.tenantssharing.tenantsharing || $scope.defaultMetadata.info.tenantssharing.tenantsharing == null){
				$scope.defaultMetadata.info.tenantssharing.tenantsharing = [];
			}
			
			
			for (var int = 0; int < $scope.defaultMetadata.info.tenantssharing.tenantsharing.length; int++) {
				var existingTenantSharing = $scope.defaultMetadata.info.tenantssharing.tenantsharing[int];
				console.log("existing",existingTenantSharing);
				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
					console.log("found");
					found = true;
					break;
				}

			}
			if(!found){
				$scope.defaultMetadata.info.tenantssharing.tenantsharing.push(
							{"idTenant":newTenantSharing.idTenant, 
								"tenantName": newTenantSharing.tenantName, 
								"tenantDescription": newTenantSharing.tenantDescription, 
								"tenantCode": newTenantSharing.tenantCode, 
								"isOwner": 0
							});
				console.log("added", $scope.defaultMetadata.info.tenantssharing );
			}
		}

		return false;
	};

	$scope.removeTenantSharing = function(index){
		$scope.defaultMetadata.info.tenantssharing.tenantsharing.splice(index,1);
		return false;
	};
	
	$scope.onTenantSharingSelect = function($item, $model, $label){
		console.log("onTenantSharingSelect",$item, $model, $label);
		$scope.addTenantSharing($item);
		
	};

	
	$scope.showChooseTenantTable = function(){
		var chooseTenantDialog = $modal.open({
	      templateUrl: 'tenantChooerDialog.html',
	      controller: 'ManagementDatasetChooseTenantControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tenantsList: function () {return $scope.tenantsList;},
	      	}
    	});
		
		chooseTenantDialog.result.then(function (selectedTenant) {
			$scope.addTenantSharing(selectedTenant);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};
	


	$scope.checkDcatFields = function(table){
		var isOk = false;
		if(typeof table != 'undefined' && table !=null && 
		   typeof table.dataset != 'undefined' && table.dataset !=null){
			if( typeof table.dataset.info != 'undefined' && table.dataset.info !=null  &&
				table.dataset.info.unpublished)
				isOk = true;
			else{
				isOk = typeof table.dataset.dcatRightsHolderName !=  'undefined' && table.dataset.dcatRightsHolderName !=null &&table.dataset.dcatRightsHolderName !='' &&
					typeof table.dataset.dcatNomeOrg !=  'undefined' && table.dataset.dcatNomeOrg !=null &&table.dataset.dcatNomeOrg !='' &&
					typeof table.dataset.dcatEmailOrg !=  'undefined' && table.dataset.dcatEmailOrg !=null &&table.dataset.dcatEmailOrg !='';
			}
			
		} 
			
		return isOk;
	};
	
	$scope.checkAllDcatFields = function(){
		var allOk = true;
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			if($scope.tables[tableIndex].importTable && !$scope.checkDcatFields($scope.tables[tableIndex])){
				allOk = false;
				break;
			}
		}
		return allOk;
	};
	
	$scope.creationError = null;
	$scope.saveError = null;
	$scope.saveErrors = null;

	$scope.accettazionePrivacy=0;
	$scope.accettazioneResponsability=0;


	$scope.selectedIcon;
	$scope.onIconSelect = function($files) {
		$scope.selectedIcon = $files[0];
		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
			$scope.choosenIconSize = $scope.selectedIcon.size; 
			$scope.updateWarning = true;
			$scope.selectedIcon = null;
		}
		else
			readIconPreview();
	};

	var readIconPreview = function(){
		readFilePreview.readImageFile($scope.selectedIcon).then(
				function(contents){
					console.log("contents" , contents);
					$scope.defaultMetadata.info.icon = contents;
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};

	
	$scope.checkColumnName = function(fieldName, columnIndex){
		$scope.insertColumnErrors = [];
		$scope.columnsDatasetError.hasError = false;
		var checkNameDuplicate = false;
		if($scope.previewColumns!=null){
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				if(int != columnIndex && !$scope.previewColumns[int].skipColumn &&  typeof $scope.previewColumns[int].fieldName!='undefined' && 
						 typeof fieldName!='undefined' && $scope.previewColumns[int].fieldName.toUpperCase() == fieldName.toUpperCase()){
					checkNameDuplicate = true;
				}
			}
		}
		if(checkNameDuplicate){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
			$scope.columnsDatasetError.hasError = true;
		}
		if(fieldName == ""){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
		$scope.columnsDatasetError.hasError = true;
		}
	};
	


	
	
	
	$scope.cancel = function(){
		$location.path('management/datasets/'+$scope.tenantCode);
	};

	$scope.tables = [];
	
//	var createColumnsTooltip = function(columns){
//		var tooltip = "No column found";
//		if(columns && columns.length>0){
//			tooltip = "<div><table class='table table-supercondensed table-dateformat-help'><thead><tr><th>Name</th><th>Type</th><th>&nbsp;</th><tr></thead><tbody>";
//			for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
//				tooltip += "<tr><td>" + columns[columnIndex].fieldName + "</td><td>" + columns[columnIndex].dataType + "</td><td>";
//				if(columns[columnIndex].idKey == 1){
//					tooltip += "<i class='fa fa-key primary-key></i>";
//				}
//				else if(typeof columns[columnIndex].foreignKey != 'undefined' && columns[columnIndex].foreignKey != "null"){
//					tooltip += "<i class='fa fa-key foreign-key></i> "+columns[columnIndex].foreignKey;
//				}
//				else
//					tooltip += "&nbsp;";
//				tooltip += "</td></tr>";
//			}
//			tooltip += "</tbody></table></div>";
//			
//		}
//		return tooltip;
//	};
	

	
	$scope.goToStart  = function(){ 
		$scope.importConfig = {};

		$scope.defaultMetadata= {"info":{
			"visibility":"private",
			"tenantssharing":{"tenantsharing": new Array()},
			"tags": new Array()}
		}; 

		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.defaultMetadata.info.requestorName=$scope.user.firstname;
			$scope.defaultMetadata.info.requestorSurname=$scope.user.lastname;
			$scope.defaultMetadata.info.requestornEmail=$scope.user.email;
		}
		
		
		
		$scope.dbImport.currentDatasetName =  ""; 
		$scope.dbImport.status = "ready"; 
		$scope.dbImport.total = 0; 
		$scope.dbImport.totalOk = 0;
		$scope.dbImport.totalUpdate = 0;
		$scope.dbImport.totalCreate = 0;
		$scope.dbImport.totalKo = 0;
		$scope.dbImport.datasetCreated = [],
		$scope.dbImport.datasetUpdated = [],
		$scope.dbImport.datasetWithError = [], 
		$scope.dbImport.currentError = null, 
		$scope.dbImport.datasetList = [], 
		$scope.dbImport.delta = 1;
		$scope.newTenantSharing = false;

		$scope.currentStep = 'start'; refreshWizardToolbar();
	};
	$scope.goToRequestor  = function(){ 
		var oneSelected = false;
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			if($scope.tables[tableIndex].importTable){
				oneSelected = true;
				break;
			}
		}
		if(!oneSelected){
			$scope.warningMessages.push("MANAGEMENT_IMPORT_DATABASE_TABLES_ZERO_SELECTED_WARNING");
		}
		else
			$scope.currentStep = 'requestor';refreshWizardToolbar();
	};
	
	$scope.goToMetadata  = function(){ $scope.currentStep = 'metadata';refreshWizardToolbar();};
	$scope.goToDatabase  = function(){ $scope.currentStep = 'database';refreshWizardToolbar();};
	
	var isNewField = function(field, newFields){
		var res = false;
		for (var newIndex = 0; newIndex < newFields.length; newIndex++) {
			if(field.sourceColumnName == newFields[newIndex].sourceColumnName){
				res = true;
				break;
			}
		}
		
		return res;
	};
	
	$scope.loadTables = function(){
		$scope.warningMessages = [];
		if($scope.importConfig.dbType == "" || $scope.importConfig.dbType == null)
			$scope.warningMessages.push("MANAGEMENT_IMPORT_DATABASE_DBTYPE_NULL_WARNING");
		
		if($scope.importConfig.sourceType == "database"){
			if($scope.importConfig.dbType!='HIVE' && 
			    ($scope.importConfig.jdbc_hostname == null || $scope.importConfig.jdbc_hostname == "" ||
				 $scope.importConfig.jdbc_dbname == null || $scope.importConfig.jdbc_dbname == ""  ||
				 $scope.importConfig.jdbc_username == null || $scope.importConfig.jdbc_username == "" ||
				 $scope.importConfig.jdbc_password == null || $scope.importConfig.jdbc_password == "")){
				 $scope.warningMessages.push("MANAGEMENT_IMPORT_DATABASE_JDBC_PARAMS_WARNING");
			}

		}
		else if($scope.importConfig.sourceType == "database"){
			if($scope.importConfig.sqlSourcefile==null){
				$scope.warningMessages.push("MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_NULL_WARNING");
			}
		}
		
		$scope.importConfig.organizationCode = info.getActiveTenant().organizationCode;
		if($scope.warningMessages.length>0)
			return;
		$scope.isLoadingDB = true;
	//if($scope.importConfig.sourceType == 'script'){
		$scope.upload = $upload.upload({
			url: Constants.API_MANAGEMENT_DATASET_IMPORT_DATABASE_URL+  $scope.tenantCode, 
			method: 'POST',
			data: $scope.importConfig,
			file: $scope.importConfig.sqlSourcefile
		}).progress(function(evt) {
			$scope.isUploading = true;
			console.log('evt');
			console.log(evt);
			console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		}).success(function(response, status, headers, config) {
			console.log("importDatabase", response);
			$scope.isLoadingDB = false;

			$scope.tables = response;
			$scope.selectTablesFlag = true;
			for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
				if(typeof $scope.tables[tableIndex].warnings != 'undefined' && $scope.tables[tableIndex].warnings.length>0)
					$scope.tables[tableIndex].importTable = false;	
				else
					$scope.tables[tableIndex].importTable = true;
				$scope.tables[tableIndex].index = tableIndex;
				$scope.tables[tableIndex].customized = {"name":false,"domain":false,"visibility":false, "dcat":false, "columns":false};
				if($scope.tables[tableIndex].status == 'new'){
					for (var columnIndex = 0; columnIndex < $scope.tables[tableIndex].dataset.info.fields.length; columnIndex++) {
						$scope.tables[tableIndex].dataset.info.fields[columnIndex].isNewField = true;
					}
				}
				else if($scope.tables[tableIndex].status == 'existing'){
					if(typeof $scope.tables[tableIndex].newFields != 'undefined' &&  $scope.tables[tableIndex].newFields.length>0 && 
							$scope.tables[tableIndex].dataset.info.fields && $scope.tables[tableIndex].dataset.info.fields.length>0){
						for (var columnIndex = 0; columnIndex < $scope.tables[tableIndex].dataset.info.fields.length; columnIndex++) {
							if(isNewField($scope.tables[tableIndex].dataset.info.fields[columnIndex], $scope.tables[tableIndex].newFields)){
								$scope.tables[tableIndex].dataset.info.fields[columnIndex].isNewField = true;
								$scope.tables[tableIndex].dataset.info.fields[columnIndex].skipColumn = true;
							}
							
						}
					}
				}
				
					
//					if($scope.tables[tableIndex].dataset.info.fields && $scope.tables[tableIndex].dataset.info.fields.length>0){
//						for (var columnIndex = 0; columnIndex < $scope.tables[tableIndex].dataset.info.fields.length; columnIndex++) {
//							$scope.tables[tableIndex].dataset.info.fields.sourceColumn = columnIndex;
//						}
//					}
				//$scope.tables[tableIndex].columnsTooltip = createColumnsTooltip($scope.tables[tableIndex].dataset.info.fields);
				
			}

			$scope.goToTables();

		}).error(function(response) {
			console.error("importDatabase error", response);
			$scope.isLoadingDB = false;
			$scope.warningMessages.push("MANAGEMENT_IMPORT_DATABASE_ERROR_CONNECTION");

		});
		
//		}
//		else {
//			var promise   = fabricAPImanagement.importDatabase($scope.importConfig);
//			promise.then(function(result) {
//				console.log("ok " + result);
//			}, function(result) {
//				console.error("error " + result);
//			}, function(result) {
//				console.log('Got notification: ' + result);
//			});
//		}
		
		
		//$scope.currentStep = 'tables';refreshWizardToolbar();
	};
	
	$scope.goToTables  = function(){ $scope.currentStep = 'tables';refreshWizardToolbar();};
	
	$scope.showTablesColumns = function(tableIndex){
		$modal.open({
	      templateUrl: 'importDatabaseTablesColumns.html',
	      controller: 'ManagementDatasetImportTablesColumnsCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	      	}
    	});
	};
	
	
	$scope.showTablesWarnings = function(tableIndex){
		$modal.open({
	      templateUrl: 'importDatabaseTablesWarnings.html',
	      controller: 'ManagementDatasetImportTablesWarningsCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	      	}
    	});
	};
	
	
	$scope.goToCustomize  = function(){
		console.log("defaultMetadata", $scope.defaultMetadata);
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			
			if($scope.tables[tableIndex].importTable && !$scope.isTableCustomized(tableIndex) && $scope.tables[tableIndex].status == 'new'){
				for (var infoProp in $scope.defaultMetadata.info) {
					
				    if ($scope.defaultMetadata.info.hasOwnProperty(infoProp) && infoProp != 'datasetName' && infoProp != 'fields'  && infoProp != 'tenantssharing' ) {
				    	$scope.tables[tableIndex].dataset.info[infoProp] = $scope.defaultMetadata.info[infoProp];
				    }

				    if($scope.defaultMetadata.info.tenantssharing.tenantsharing.length>0){
				    	$scope.tables[tableIndex].dataset.info.tenantssharing = {};
				    	$scope.tables[tableIndex].dataset.info.tenantssharing.tenantsharing = $scope.defaultMetadata.info.tenantssharing.tenantsharing.slice();
				    }
				}
				
				$scope.tables[tableIndex].dataset.info.tags =  $scope.defaultMetadata.info.tags.slice();
				
				if(typeof  $scope.defaultMetadata.opendata != 'undefined'){
					$scope.tables[tableIndex].dataset.opendata = {};
					for (var opendataProp in $scope.defaultMetadata.opendata) {
					    if ($scope.defaultMetadata.opendata.hasOwnProperty(opendataProp)) {
					    	$scope.tables[tableIndex].dataset.opendata[opendataProp] = $scope.defaultMetadata.opendata[opendataProp];
					    }
					}
				}
				
				for (var metadataProp in $scope.defaultMetadata  ) {
				    if ($scope.defaultMetadata.hasOwnProperty(metadataProp) && metadataProp != 'info' && metadataProp != 'opendata') {
				    	$scope.tables[tableIndex].dataset[metadataProp] = $scope.defaultMetadata[metadataProp];
				    }
				}
				
			}
		}

		$scope.currentStep = 'customize';refreshWizardToolbar();
	
	};
	var datasetList = [];
	
	
	$scope.dbImport = {"progressBar":function(){return this.delta*(this.total-this.datasetList.length);}, 
			"currentDatasetName": "", 
			"status": "ready", 
			"percent": function(){return this.total==0?0:Math.round((this.total-this.datasetList.length)*100/this.total);}, 
			"currentIndex":function(){return this.total-this.datasetList.length;}, 
			"total": 0, 
			"totalOk": 0,
			"totalUpdate": 0,
			"totalCreate": 0,
			"totalKo": 0,
			"datasetCreated":[],
			"datasetUpdated": [],
			"datasetWithError":[], 
			"currentError": null, 
			"datasetList": [], 
			"delta":1};

	
	$scope.goToFinish  = function(){
		$scope.currentStep = 'finish';
		refreshWizardToolbar();
		var tableIndex = $scope.tables.length;
		$scope.dbImport.datasetList = new Array();
		while (tableIndex--) {
		    if($scope.tables[tableIndex].importTable){
		    	//var dataset = $scope.tables.splice(tableIndex,1)[0].dataset;
		    	var dataset = $scope.tables.slice(tableIndex,tableIndex+1)[0].dataset;
		    	dataset.importStatus = $scope.tables[tableIndex].status;
		    	$scope.dbImport.datasetList.push(dataset);
		     }
		}
		$scope.dbImport.delta = 100/$scope.dbImport.datasetList.length;
		$scope.dbImport.total = $scope.dbImport.datasetList.length;

		//createDataset(datasetList);
	};
	
	$scope.isTableCustomized = function(tableIndex){
		return $scope.tables[tableIndex].customized.name ||
			$scope.tables[tableIndex].customized.publishStore ||
			$scope.tables[tableIndex].customized.visibility ||
			$scope.tables[tableIndex].customized.dcat ||
			$scope.tables[tableIndex].customized.columns;
	};

	$scope.checkVCard = function(){
		var VCARD_PREFIX = 'BEGIN:VCARD \n VERSION:2.1';
		var VCARD_SUFFIX = 'END:VCARD';
		var VCARD_N = 'N:';
		var VCARD_FN = 'FN:';
		var VCARD_TEL = 'TEL;WORK:';
		var VCARD_EMAIL = 'EMAIL:';
		var VCARD_URL = 'URL:';
		//if (($scope.defaultMetadata.dcat.vcard == null) || ($scope.defaultMetadata.dcat.vcard == '')){
			$scope.defaultMetadata.dcat.vcard = VCARD_PREFIX + 
										 VCARD_N + ((($scope.defaultMetadata.dcat.nomeOrg != '') && ($scope.defaultMetadata.dcat.nomeOrg != null)) ? $scope.defaultMetadata.dcat.nomeOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
										 VCARD_FN + ((($scope.defaultMetadata.dcat.nomeOrg != '') && ($scope.defaultMetadata.dcat.nomeOrg != null)) ? $scope.defaultMetadata.dcat.nomeOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
										 VCARD_TEL + ((($scope.defaultMetadata.dcat.telOrg != '') && ($scope.defaultMetadata.dcat.telOrg != null)) ? $scope.defaultMetadata.dcat.telOrg.replace(" ",";") : '+39.011.3168111') + 
										 VCARD_EMAIL + ((($scope.defaultMetadata.dcat.emailOrg != '') && ($scope.defaultMetadata.dcat.emailOrg != null)) ? $scope.defaultMetadata.dcat.emailOrg.replace(" ",";") : 'info@csi.it') + 
										 VCARD_URL + ((($scope.defaultMetadata.dcat.urlOrg != '') && ($scope.defaultMetadata.dcat.urlOrg != null)) ? $scope.defaultMetadata.dcat.urlOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
										 VCARD_SUFFIX;
		//}
	};
	
	$scope.selectAllTableFlag = true;
	$scope.toggleSelectTables = function(selectAllTableFlag){
		if($scope.tables && $scope.tables.length>0){
			for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
				$scope.tables[tableIndex].importTable = !selectAllTableFlag;
			}
		}
	};
	
	
	$scope.selectTables = function(selectionType){
		if($scope.tables && $scope.tables.length>0){
			for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
				if(selectionType == 'all'){
					$scope.tables[tableIndex].importTable = true;
					$scope.selectAllTableFlag = true;
				}
				else if(selectionType == 'none'){
					$scope.tables[tableIndex].importTable = false;
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'invert'){
					$scope.tables[tableIndex].importTable = !$scope.tables[tableIndex].importTable;
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'new'){
					$scope.tables[tableIndex].importTable = $scope.tables[tableIndex].status == 'new';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'existing'){
					$scope.tables[tableIndex].importTable = $scope.tables[tableIndex].status == 'existing';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'tableType_table'){
					$scope.tables[tableIndex].tableType == 'TABLE';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'tableType_view'){
					$scope.tables[tableIndex].tableType == 'VIEW';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'tableType_synonym'){
					$scope.tables[tableIndex].tableType == 'SYNONYM';
					$scope.selectAllTableFlag = false;
				}
			}
		}
	};
	
	$scope.editDatasetName = function(tableIndex){
		$modal.open({
	      templateUrl: 'importDatabaseEditDatasetName.html',
	      controller: 'ManagementDatasetImportDatabaseEditDatasetNameCtrl',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	      	}
    	});
	};
	
	/*
	$scope.editDatasetDomain = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditDatasetDomain.html',
	      controller: 'ManagementDatasetImportDatabaseEditDatasetDomainCtrl',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	      	}
    	});

	};
	
	
	$scope.editDatasetVisibility = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditDatasetVisibility.html',
	      controller: 'ManagementDatasetImportDatabaseEditDatasetVisibilityCtrl',
	      scope: $scope,
	     // size: size,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	    	  
	      	}
    	});

	};

	*/
	
	$scope.editDatasetPublishStore = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditDatasetPublisStore.html',
	      controller: 'ManagementDatasetImportDatabaseEditPublishStoreCtrl',
	      scope: $scope,
	      size: 'lg',
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	    	  
	      	}
    	});

	};
	
	
	
	$scope.editDatasetDCat = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditDCat.html',
	      controller: 'ManagementDatasetImportDatabaseEditDCatCtrl',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	    	  
	      	}
    	});
	};
	
	$scope.editDatasetColumns = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditColumns.html',
	      controller: 'ManagementDatasetImportDatabaseEditColumnsCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	    	  
	      	}
    	});
	};
	
	$scope.createDatasets = function(){
		createDataset($scope.tables);
	};
	
	


	
	var createDataset = function() {
		console.log("createDataset", $scope.dbImport.datasetList);
		if($scope.dbImport.datasetList.length==0){
			$scope.dbImport.status = "finish";
			$scope.dbImport.currentDatasetName ="";
		}
		else{
			$scope.dbImport.status="running";
			var dataset = $scope.dbImport.datasetList.pop();
			if(typeof dataset.info.fields != 'undefined' && dataset.info.fields.length>0){
				for(var fieldIndex = dataset.info.fields.length -1; fieldIndex >= 0 ; fieldIndex--){
		    	    if(dataset.info.fields[fieldIndex].skipColumn){
		    	        dataset.info.fields.splice(fieldIndex, 1);
		    	    }
				}
			}
			
			$scope.dbImport.currentDatasetName = dataset.info.datasetName;
			console.log("dataset", dataset);
	
			if(typeof dataset.configData == 'undefined' || dataset.configData == null)
				dataset.configData = {}
			dataset.configData.tenantCode = $scope.tenantCode;
			dataset.configData.type = "dataset";
			dataset.configData.subtype= "bulkDataset";
			
			if(typeof dataset.opendata != 'undefined' && dataset.opendata!=null && dataset.opendata.dataUpdateDate!=null)
				dataset.opendata.dataUpdateDate = new Date(dataset.opendata.dataUpdateDate).getTime();
	
			

			
			if(dataset.importStatus == 'new'){
		
				
				$scope.upload = $upload.upload({
					url: Constants.API_MANAGEMENT_DATASET_LIST_URL + $scope.tenantCode + '/', 
					method: 'POST',
					data: {dataset: dataset, formatType: "jdbc"}
				}).progress(function(evt) {
					console.log('evt',evt, parseInt(100.0 * evt.loaded / evt.total));
				}).success(function(data, status, headers, config) {
					console.log("data loaded", data);
					if(data.errors && data.errors.length>0){
						for (var errorIndex = 0; errorIndex < data.errors.length; errorIndex++) {
							$scope.dbImport.currentError += data.errors[errorIndex].message +"<br>";
						}
						$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
						$scope.dbImport.status="pause";
						$scope.dbImport.totalKo++;
					}
					else{
						$scope.dbImport.totalOk++;
						$scope.dbImport.totalCreate++;
						$scope.dbImport.datasetCreated.push(data.metadata.datasetCode);
						if($scope.dbImport.datasetList.length==0){
							console.log("fine!");
							$scope.dbImport.status = "finish";
							$scope.dbImport.currentDatasetName ="";
						}
						else{
							console.log("ancora");
							if($scope.dbImport.status=="running")
								createDataset(datasetList);
						}
					}
				}).error(function(err, status, headers, config) {
					$scope.dbImport.currentError=err;
					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
					$scope.dbImport.status="pause";
					$scope.dbImport.totalKo++;
			        console.log(err);
				});
			
			}
			else{
		
				var promise   = fabricAPImanagement.updateDataset($scope.tenantCode, dataset.datasetCode, dataset);
		
				promise.then(function(result) {
					console.log("data loaded", result);
					if(result.data.errors && result.data.errors.length>0){
						for (var errorIndex = 0; errorIndex < result.data.errors.length; errorIndex++) {
							$scope.dbImport.currentError += result.data.errors[errorIndex].message +"<br>";
						}
						$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
						$scope.dbImport.status="pause";
						$scope.dbImport.totalKo++;
					}
					else{
						$scope.dbImport.totalOk++;
						$scope.dbImport.totalUpdate++;
						$scope.dbImport.datasetUpdated.push(result.data.metadata.datasetCode);
						if($scope.dbImport.datasetList.length==0){
							console.log("fine!");
							$scope.dbImport.status = "finish";
							$scope.dbImport.currentDatasetName ="";
						}
						else{
							console.log("ancora");
							if($scope.dbImport.status=="running")
								createDataset(datasetList);
						}
					}			
			
				}, function(result) {
					$scope.dbImport.currentError=err;
					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
					$scope.dbImport.status="pause";
					$scope.dbImport.totalKo++;
				}, function(result) {
					console.log('Got notification: ' + result);
				});
	
			}
			
		}
	};
	
	$scope.breakCreateDataset = function(){
		$scope.dbImport.status = "finish";
	};
	
	$scope.continueCreateDataset = function(){
		$scope.dbImport.status = "running";
		createDataset();
	};
	
} ]);


appControllers.controller('ManagementDatasetImportTablesWarningsCtrl', [ '$scope', '$modalInstance',  'selectedTableIndex', '$translate',
                                                                        function($scope, $modalInstance, selectedTableIndex,$translate) {
	$scope.table = $scope.tables[selectedTableIndex];
	var warnings  = $scope.tables[selectedTableIndex].warnings;
	$scope.warningsList = "No warning found";
	if(warnings && warnings.length>0){

		var warningsList = "<ul class='import-database-customize-table-warnings'>";
		for (var warningIndex = 0; warningIndex < warnings.length; warningIndex++) {
			warningsList += "<li>" + warnings[warningIndex] + "</li>";
		}
		warningsList += "</ul>";
		
		$scope.warningsList = warningsList;
}

$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementDatasetImportTablesColumnsCtrl', [ '$scope', '$modalInstance',  'selectedTableIndex', '$translate',
                                                                                  function($scope, $modalInstance, selectedTableIndex,$translate) {
	$scope.table = $scope.tables[selectedTableIndex];
	columns  = $scope.tables[selectedTableIndex].dataset.info.fields;
	$scope.columnsTable = "No column found";
	if(columns && columns.length>0){
		
		var columnsTable = "<div><table class='table table-supercondensed import-database-customize-table-columns text-left	'><thead><tr><th>Column</th><th>Name</th><th>Type</th><th>Alias</th><th>Keys</th><tr></thead><tbody>";
		for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
			var newBadge = "";
			if(columns[columnIndex].isNewField)
				newBadge="<span class='import-database-column-new' title='"+$translate.instant('MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS_HINT')+"'>"+$translate.instant('MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS')+"</span>&nbsp;&nbsp;";
			columnsTable += "<tr class='import-database-column-row'><td>" +newBadge + columns[columnIndex].sourceColumnName + "</td><td>" + columns[columnIndex].fieldName + "</td><td>" + columns[columnIndex].dataType + "</td><td>" + columns[columnIndex].fieldAlias + "</td><td>";
			if(columns[columnIndex].isKey == 1){
				columnsTable += "<i class='fa fa-key primary-key'  title='Primary key'></i> &nbsp;&nbsp;";
				if(typeof columns[columnIndex].foreignKey != 'undefined' && columns[columnIndex].foreignKey != "null")
					columnsTable += columns[columnIndex].foreignKey;
			}
			else if(typeof columns[columnIndex].foreignKey != 'undefined' && columns[columnIndex].foreignKey != "null"){
				columnsTable += "<i class='fa fa-key foreign-key' title='Foreign key'></i> &nbsp;&nbsp;"+columns[columnIndex].foreignKey;
			}
			else
				columnsTable += "&nbsp;";
			columnsTable += "</td></tr>";
		}
		/*
		if(typeof $scope.table.newFields!='undefined' && $scope.table.newFields.length>0){
			columnsTable += "<tr class='import-database-column-row'><td colspan='5' class='import-database-column-row-separator'>"+$translate.instant('MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS')+"</td></tr>";
			for (var columnIndex = 0; columnIndex < $scope.table.newFields.length; columnIndex++) {
				columnsTable += "<tr><td><span class='import-database-column-new'>New</span>&nbsp;&nbsp;" + $scope.table.newFields[columnIndex].sourceColumnName + "</td><td>" + $scope.table.newFields[columnIndex].fieldName + "</td><td>" + $scope.table.newFields[columnIndex].dataType + "</td><td>" + $scope.table.newFields[columnIndex].fieldAlias + "</td><td>";
				if(columns[columnIndex].isKey == 1){
					columnsTable += "<i class='fa fa-key primary-key'></i> &nbsp;&nbsp;&nbsp;&nbsp;";
					if(typeof columns[columnIndex].foreignKey != 'undefined' && columns[columnIndex].foreignKey != "null")
						columnsTable += columns[columnIndex].foreignKey;
				}
				else if(typeof columns[columnIndex].foreignKey != 'undefined' && columns[columnIndex].foreignKey != "null"){
					columnsTable += "<i class='fa fa-key foreign-key'></i> &nbsp;&nbsp;&nbsp;&nbsp;"+columns[columnIndex].foreignKey;
				}
				else
					columnsTable += "&nbsp;";
				columnsTable += "</td></tr>";
			}
		}*/
		columnsTable += "</tbody></table></div>";
		$scope.columnsTable = columnsTable;
	}
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementDatasetImportDatabaseEditDatasetNameCtrl', [ '$scope', '$modalInstance',  'selectedTableIndex',
                                                                                  function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	$scope.datasetName = $scope.tables[selectedTableIndex].dataset.info.datasetName;
	$scope.description = $scope.tables[selectedTableIndex].dataset.info.description;
	$scope.externalReference = $scope.tables[selectedTableIndex].dataset.info.externalReference;
	
	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.name = true;
		
		$scope.tables[selectedTableIndex].dataset.info.datasetName = $scope.datasetName;
		$scope.tables[selectedTableIndex].dataset.info.description= $scope.description;
		$scope.tables[selectedTableIndex].dataset.info.externalReference = $scope.externalReference;
		$modalInstance.close();
	};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


/*


appControllers.controller('ManagementDatasetImportDatabaseEditDatasetDomainCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
                                                                                    function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	
	$scope.dataDomain = $scope.tables[selectedTableIndex].dataset.info.dataDomain; 
	$scope.codSubDomain = $scope.tables[selectedTableIndex].dataset.info.codSubDomain; 
	$scope.tags = $scope.tables[selectedTableIndex].dataset.info.tags.slice(); 


	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.domain = true;
		$scope.tables[selectedTableIndex].dataset.info.dataDomain = $scope.dataDomain; 
		$scope.tables[selectedTableIndex].dataset.info.codSubDomain = $scope.codSubDomain; 
		$scope.tables[selectedTableIndex].dataset.info.tags = $scope.tags.slice(); 
		
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
	$scope.newTag = {value:""};
	$scope.onTagSelect = function($item, $model, $label){
		console.log("onTagSelect",$item, $model, $label);
		if($item.tagCode!=null)
			$scope.addTag($item.tagCode, $scope.tags);
	};

	
	
}]);

appControllers.controller('ManagementDatasetImportDatabaseEditDatasetVisibilityCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
	                                                                                        function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	
	$scope.visibility = $scope.tables[selectedTableIndex].dataset.info.visibility; 
	
	$scope.license = $scope.tables[selectedTableIndex].dataset.info.license;
	$scope.disclaimer = $scope.tables[selectedTableIndex].dataset.info.disclaimer;
	$scope.copyright = $scope.tables[selectedTableIndex].dataset.info.copyright;

	if($scope.tables[selectedTableIndex].dataset.info.tenantssharing && $scope.tables[selectedTableIndex].dataset.info.tenantssharing!=null)
		$scope.tenantsharing = $scope.tables[selectedTableIndex].dataset.info.tenantssharing.tenantsharing;
	else
		$scope.tenantsharing = new Array();

	if($scope.tables[selectedTableIndex].dataset.opendata && $scope.tables[selectedTableIndex].dataset.opendata!=null){
		$scope.opendata = {};
		for (var opendataProp in $scope.tables[selectedTableIndex].dataset.opendata) {
		    if ($scope.tables[selectedTableIndex].dataset.opendata.hasOwnProperty(opendataProp)) {
		    	$scope.opendata[opendataProp] = $scope.tables[selectedTableIndex].dataset.opendata[opendataProp];
		    }
		}
	}
	
	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.visibility = true;

		$scope.tables[selectedTableIndex].dataset.info.visibility = $scope.visibility; 
		if($scope.tenantsharing && $scope.tenantsharing!=null && $scope.tenantsharing.length>0){
			if(typeof $scope.tables[selectedTableIndex].dataset.info.tenantssharing == 'undefined')
				$scope.tables[selectedTableIndex].dataset.info.tenantssharing = {};
			$scope.tables[selectedTableIndex].dataset.info.tenantssharing.tenantsharing = $scope.tenantsharing.slice(); 
		}
		
		if($scope.opendata && $scope.opendata!=null){
			$scope.tables[selectedTableIndex].dataset.opendata = {};
			for (var opendataProp in $scope.opendata) {
			    if ($scope.opendata.hasOwnProperty(opendataProp)) {
			    	$scope.tables[selectedTableIndex].dataset.opendata[opendataProp] = $scope.opendata[opendataProp];
			    }
			}
		}
		
		$scope.tables[selectedTableIndex].dataset.info.license = $scope.license; 
		$scope.tables[selectedTableIndex].dataset.info.disclaimer = $scope.disclaimer; 
		$scope.tables[selectedTableIndex].dataset.info.copyright = $scope.copyright;
		if($scope.tables[selectedTableIndex].dataset.info.visibility=='private'){
			$scope.tables[selectedTableIndex].dataset.info.copyright = "";
		}
		else if($scope.tables[selectedTableIndex].dataset.info.visibility=='public'){
			$scope.tables[selectedTableIndex].dataset.info.license = "";
			$scope.tables[selectedTableIndex].dataset.info.disclaimer = "";	
		}
		
		
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


*/



appControllers.controller('ManagementDatasetImportDatabaseEditPublishStoreCtrl', [ '$scope', '$modalInstance', '$modal', 'info', 'selectedTableIndex', 
                                                                                    function($scope, $modalInstance, $modal, info, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	
	console.log("qui prima prima", $scope.tables[selectedTableIndex].dataset.info);
	console.log("qui prima prima i", $scope.info);
	
	$scope.info = {"dataDomain":$scope.tables[selectedTableIndex].dataset.info.dataDomain,
		"codSubDomain":$scope.tables[selectedTableIndex].dataset.info.codSubDomain,
		"tags":$scope.tables[selectedTableIndex].dataset.info.tags.slice(),
		"visibility":$scope.tables[selectedTableIndex].dataset.info.visibility,
		"license":$scope.tables[selectedTableIndex].dataset.info.license,
		"disclaimer":$scope.tables[selectedTableIndex].dataset.info.disclaimer,
		"copyright":$scope.tables[selectedTableIndex].dataset.info.copyright,
		"unpublished":$scope.tables[selectedTableIndex].dataset.info.unpublished
	};
	
	$scope.canCreatePublicDataset = function(){
		return info.getActiveShareInformationType() == "public" &&  !$scope.info.unpublished;
	}; 

	



	if($scope.tables[selectedTableIndex].dataset.info.tenantssharing && $scope.tables[selectedTableIndex].dataset.info.tenantssharing!=null)
		$scope.info.tenantsharing = $scope.tables[selectedTableIndex].dataset.info.tenantssharing.tenantsharing;
	else
		$scope.info.tenantsharing = new Array();

	if($scope.tables[selectedTableIndex].dataset.opendata && $scope.tables[selectedTableIndex].dataset.opendata!=null){
		$scope.opendata = {};
		for (var opendataProp in $scope.tables[selectedTableIndex].dataset.opendata) {
		    if ($scope.tables[selectedTableIndex].dataset.opendata.hasOwnProperty(opendataProp)) {
		    	$scope.opendata[opendataProp] = $scope.tables[selectedTableIndex].dataset.opendata[opendataProp];
		    }
		}
	}

	$scope.useDomainMulti  = function(useDomainMultiFlag){
		if(useDomainMultiFlag){
			$scope.info.dataDomain = 'MULTI';
			$scope.info.visibility = 'private';
		}
		else{
			$scope.info.dataDomain = null;
		}
		$scope.info.codSubDomain = null;
	};

	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.publishStore = true;
		$scope.tables[selectedTableIndex].dataset.info.unpublished = $scope.info.unpublished;
		$scope.tables[selectedTableIndex].dataset.info.dataDomain = $scope.info.dataDomain; 
		$scope.tables[selectedTableIndex].dataset.info.codSubDomain = $scope.info.codSubDomain; 
		$scope.tables[selectedTableIndex].dataset.info.tags = $scope.info.tags.slice(); 
		
		$scope.tables[selectedTableIndex].dataset.info.visibility = $scope.info.visibility; 
		if($scope.info.tenantsharing && $scope.info.tenantsharing!=null && $scope.info.tenantsharing.length>0){
			if(typeof $scope.tables[selectedTableIndex].dataset.info.tenantssharing == 'undefined')
				$scope.tables[selectedTableIndex].dataset.info.tenantssharing = {};
			$scope.tables[selectedTableIndex].dataset.info.tenantssharing.tenantsharing = $scope.info.tenantsharing.slice(); 
		}
		
		if($scope.info.opendata && $scope.info.opendata!=null){
			$scope.tables[selectedTableIndex].dataset.opendata = {};
			for (var opendataProp in $scope.info.opendata) {
			    if ($scope.info.opendata.hasOwnProperty(opendataProp)) {
			    	$scope.tables[selectedTableIndex].dataset.opendata[opendataProp] = $scope.info.opendata[opendataProp];
			    }
			}
		}
		
		$scope.tables[selectedTableIndex].dataset.info.license = $scope.info.license; 
		$scope.tables[selectedTableIndex].dataset.info.disclaimer = $scope.info.disclaimer; 
		$scope.tables[selectedTableIndex].dataset.info.copyright = $scope.info.copyright;
		if($scope.tables[selectedTableIndex].dataset.info.visibility=='private'){
			$scope.tables[selectedTableIndex].dataset.info.license = "";
			$scope.tables[selectedTableIndex].dataset.info.disclaimer = "";	
		}
		else if($scope.tables[selectedTableIndex].dataset.info.visibility=='public'){
			$scope.tables[selectedTableIndex].dataset.info.copyright = "";
		}


		
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
	

	$scope.onTagSelectInDialog = function($item, $model, $label){
		console.log("onTagSelect",$item, $model, $label);
		if($item.tagCode!=null)
			$scope.addTagInDialog($item.tagCode);
		
	};
	
	$scope.showChooseTagTableInDialog = function(){
		var chooseTagDialog = $modal.open({
	      templateUrl: 'tagChooerDialog.html',
	      controller: 'ManagementDatasetChooseTagControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tagList: function () {return $scope.tagList;},
	      	}
    	});
		
		chooseTagDialog.result.then(function (selectedTag) {
			$scope.addTagInDialog(selectedTag.tagCode);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.newTag = {value:""};
	$scope.addTagInDialog = function(newTag){
		console.log("addTag", newTag);
		if(newTag){
			if(! $scope.info.tags)
				$scope.info.tags = [];

			var found = false;	
			for (var int = 0; int < $scope.info.tags.length; int++) {
				var existingTag = $scope.info.tags[int];
				if(existingTag.tagCode == newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.info.tags.push({"tagCode":newTag});
		}
		$scope.newTag.value = "";
		return false;

	};


	$scope.removeTagInDialog = function(index){
		$scope.info.tags.splice(index,1);
		return false;
	};
	
	
	
	$scope.addTenantSharingInDialog = function(newTenantSharing){
		console.log("addTenantSharing ",newTenantSharing);
		if(newTenantSharing){
			var found = false;	
			
			for (var int = 0; int < $scope.info.tenantsharing.length; int++) {
				var existingTenantSharing = $scope.info.tenantsharing[int];
				console.log("existing",existingTenantSharing);
				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
					console.log("found");
					found = true;
					break;
				}

			}
			if(!found){
				$scope.info.tenantsharing.push(
							{"idTenant":newTenantSharing.idTenant, 
								"tenantName": newTenantSharing.tenantName, 
								"tenantDescription": newTenantSharing.tenantDescription, 
								"tenantCode": newTenantSharing.tenantCode, 
								"isOwner": 0
							});
				console.log("added", $scope.info.tenantsharing );
			}
		}

		return false;
	};

	$scope.removeTenantSharingInDialog = function(index, tenantsharing){
		$scope.info.tenantsharing.splice(index,1);
		return false;
	};
	
	$scope.onTenantSharingSelectInDialog = function($item, $model, $label){
		console.log("onTenantSharingSelect",$item, $model, $label);
		$scope.addTenantSharingInDialog($item);
		
	};

	
	$scope.showChooseTenantTableInDialog = function(){
		var chooseTenantDialog = $modal.open({
	      templateUrl: 'tenantChooerDialog.html',
	      controller: 'ManagementDatasetChooseTenantControllerCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  tenantsList: function () {return $scope.tenantsList;},
	      	}
    	});
		
		chooseTenantDialog.result.then(function (selectedTenant) {
			$scope.addTenantSharingInDialog(selectedTenant);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};
	
}]);



appControllers.controller('ManagementDatasetImportDatabaseEditDCatCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
                                                                                    function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
		
	$scope.dcatRightsHolderName = $scope.tables[selectedTableIndex].dataset.dcatRightsHolderName;
	$scope.dcatRightsHolderType = $scope.tables[selectedTableIndex].dataset.dcatRightsHolderType;
	$scope.dcatRightsHolderId = $scope.tables[selectedTableIndex].dataset.dcatRightsHolderId;
	$scope.dcatCreatorName = $scope.tables[selectedTableIndex].dataset.dcatCreatorName;
	$scope.dcatCreatorType = $scope.tables[selectedTableIndex].dataset.dcatCreatorType;
	$scope.dcatCreatorId = $scope.tables[selectedTableIndex].dataset.dcatCreatorId;
	$scope.dcatNomeOrg = $scope.tables[selectedTableIndex].dataset.dcatNomeOrg;
	$scope.dcatEmailOrg = $scope.tables[selectedTableIndex].dataset.dcatEmailOrg;

	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.dcat = true;

		$scope.tables[selectedTableIndex].dataset.dcatRightsHolderName = $scope.dcatRightsHolderName; 
		$scope.tables[selectedTableIndex].dataset.dcatRightsHolderType = $scope.dcatRightsHolderType; 
		$scope.tables[selectedTableIndex].dataset.dcatRightsHolderId = $scope.dcatRightsHolderId; 
		$scope.tables[selectedTableIndex].dataset.dcatCreatorName = $scope.dcatCreatorName; 
		$scope.tables[selectedTableIndex].dataset.dcatCreatorType = $scope.dcatCreatorType; 
		$scope.tables[selectedTableIndex].dataset.dcatCreatorId = $scope.dcatCreatorId; 
		$scope.tables[selectedTableIndex].dataset.dcatNomeOrg = $scope.dcatNomeOrg; 
		$scope.tables[selectedTableIndex].dataset.dcatEmailOrg = $scope.dcatEmailOrg; 
		
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};


	
	
}]);


appControllers.controller('ManagementDatasetImportDatabaseEditColumnsCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
                                                                           function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	
	$scope.previewColumns = $scope.table.dataset.info.fields.slice(); 
	for (var previewColumnIndex = 0; previewColumnIndex < $scope.previewColumns.length; previewColumnIndex++) {
		$scope.previewColumns[previewColumnIndex].isKey = $scope.previewColumns[previewColumnIndex].isKey==1?true:false;
	}
	
	var fields = [];
	
	$scope.columnsDatasetError = {"hasError": false};

	$scope.checkColumnName = function(fieldName, columnIndex){
		$scope.insertColumnErrors = [];
		$scope.columnsDatasetError.hasError = false;
		var checkNameDuplicate = false;
		if($scope.previewColumns!=null){	
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				if(int != columnIndex && !$scope.previewColumns[int].skipColumn &&  typeof $scope.previewColumns[int].fieldName!='undefined' && 
						 typeof fieldName!='undefined' && $scope.previewColumns[int].fieldName.toUpperCase() == fieldName.toUpperCase()){
					checkNameDuplicate = true;
				}
			}
		}
		if(checkNameDuplicate){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
			$scope.columnsDatasetError.hasError = true;
		}
		if(fieldName == ""){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
		$scope.columnsDatasetError.hasError = true;
		}
	};
	
	$scope.onDropColumnComplete=function(fromIndex, toIndex,evt){
		var columToMove = $scope.previewColumns[fromIndex];
		columToMove.dragging = false;
		$scope.previewColumns.splice(fromIndex, 1);
		$scope.previewColumns.splice(toIndex, 0, columToMove);
		$scope.refreshColumnOrder();
	};

	$scope.onDragColumnComplete=function (fromIndex,evt){
		console.log("onDragColumnComplete",fromIndex,evt);
	};
	
	
	$scope.refreshColumnOrder = function(){
		console.log("refreshColumnOrder");
		if($scope.previewColumns && $scope.previewColumns.length>0){
			var order = 0;
			fields = [];
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				var column  = $scope.previewColumns[int];
				column.index = int;
				//column.sourceColumn = order;
				var dataType = column.dataType?column.dataType:'string';
				var measureUnit = column.measureUnit?column.measureUnit.measureUnit:null;
				fields.push(
						{"sourceColumn":column.sourceColumn, 
							"fieldName":column.fieldName, 
							"fieldAlias":column.fieldAlias, 
							"dataType":dataType, 
							"isKey":column.isKey?1:0, 
							"measureUnit":measureUnit,
							"dateTimeFormat":column.dateTimeFormat,
							"sourceColumnName":column.sourceColumnName,
							"order":order,
							"skipColumn": column.skipColumn,
							"isNewField": column.isNewField}
				);
				if(!column.skipColumn){
					order++;
				}

			}
			$scope.checkColumnName();
		}
	};

	$scope.isDateTimeField = function(field){
		if(field && field.dataType && field.dataType && field.dataType == "dateTime")
			return true;
		return false;
	};
	
	$scope.isCoordinatesField = function(field){
		if(field && field.dataType && field.dataType && field.dataType == "coordinates")
			return true;
		return false;
	};
	
	$scope.isCommonField = function(field){
		return !$scope.isCoordinatesField(field) && !$scope.isDateTimeField(field);
	};

	
	
	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.columns = true;
		$scope.refreshColumnOrder();
		$scope.tables[selectedTableIndex].dataset.info.fields =fields.slice(); 
		$modalInstance.close();
	};
	
	$scope.cancel = function () {
		for(var columnIndex = 0; columnIndex < $scope.tables[selectedTableIndex].dataset.info.fields.length; columnIndex++) 
			$scope.tables[selectedTableIndex].dataset.info.fields[columnIndex].isKey = $scope.tables[selectedTableIndex].dataset.info.fields[columnIndex].isKey?1:0;
		$modalInstance.dismiss('cancel');
	};
	
	$scope.refreshColumnOrder();
	$scope.htmlTooltip = Constants.HELP_HINT_DATE_FORMAT_TABLE;
		
	
	}]);




appControllers.controller('ManagementDatasetChooseTagControllerCtrl', [ '$scope', '$modalInstance', 'tagList',
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


appControllers.controller('ManagementDatasetChooseTenantControllerCtrl', [ '$scope', '$modalInstance', 'tenantsList',
                                                                        function($scope, $modalInstance, tenantsList) {
	console.log("ManagementDatasetChooseTenantControllerCtrl",tenantsList);
	
	$scope.tenantsList = tenantsList;
//	$scope.tenantMap = {};
//	var firstLetter = null;
//	for (var i = 0; i < tenantsList.length; i++) {
//		if(tenantsList[i]!=null && typeof tenantsList[i].tenantName != 'undefined' && tenantsList[i].tenantName!=null)
//		if(firstLetter != tenantsList[i].tenantName.substring(0,1)){
//			firstLetter = tenantsList[i].tenantName.substring(0,1);
//			$scope.tenantMap[firstLetter] = new Array();
//		}
//		$scope.tenantMap[firstLetter].push(tenantsList[i]);
//	}
	
	

	$scope.chooseTenant = function(choosenTenant){
		console.log("choosenTenant",choosenTenant);
		$modalInstance.close(choosenTenant);
	};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);

