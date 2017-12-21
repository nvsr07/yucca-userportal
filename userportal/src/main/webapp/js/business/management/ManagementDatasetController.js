appControllers.controller('ManagementDatasetListCtrl', [ '$scope', '$route', '$location', 'fabricAPImanagement', 'adminAPIservice', 'info', '$modal', '$translate',
                                                         function($scope, $route, $location, fabricAPImanagement, adminAPIservice, info, $modal, $translate) {
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
	
	$scope.organizationCode = info.getActiveTenant().organization.organizationcode;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	/*
	 * LOAD DATASETS
	 */
	 $scope.loadDatasets = function(){
		adminAPIservice.loadDatasets(info.getActiveTenant()).success(function(response) {
			console.log("loadDatasets SUCCESS", response);
			$scope.showLoading = false;
			$scope.datasetList = [];
			for (var i = 0; i <response.length; i++) {
//					//da verificare test precedente
//					if(response[i].status && response[i].status.statuscode){
//						
//						//ICONA
////						if(typeof response[i].info.icon == 'undefined' || response[i].info.icon == null)
////							response[i].info.icon  = Constants.API_RESOURCES_URL + "dataset/icon/"+ $scope.tenantCode+"/" +response[i].datasetCode;
////						else
////							response[i].info.icon  = "img/dataset-icon-default.png";
//						//data.datasetIcon = Constants.API_RESOURCES_URL + "dataset/icon/"+data.tenantCode+"/"+data.datasetCode;
//
////						if(response[i].idDataSourceBinary != null)
////							response[i].info.attachment  = true;						
//
				if(response[i].datasetSubtype.datasetSubtype!='binaryDataset')
						$scope.datasetList.push(response[i]);
			}
//				}
	
			$scope.totalItems = $scope.datasetList.length;
		});
	};
	/*$scope.getDatasets = function(){

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
	
	*/
	$scope.loadDatasets();

	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchNameFilter = function(dataset) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || (dataset.datasetname && keyword.test(dataset.datasetname));
	};

	$scope.searchCodeFilter = function(dataset) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || (dataset.datasetcode && keyword.test(dataset.datasetcode));
	};

	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.searchDomainFilter = function(dataset) {
		var keyword = new RegExp($scope.domainFilter, 'i');
		return !$scope.domainFilter || keyword.test(dataset.domain.domaincode);
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
			return dataset.deleted!=1;
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

appControllers.controller('ManagementDatasetModalCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'fabricAPImanagement', 'adminAPIservice', '$location', '$modalInstance', 'selectedDataset', 'info', 'readFilePreview',
                                                     function($scope, $routeParams, fabricAPIservice, fabricAPImanagement, adminAPIservice, $location, $modalInstance, selectedDataset, info, readFilePreview) {
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
//				if(!$scope.datasetModalView.dataset.info.icon || $scope.datasetModalView.dataset.info.icon == null)
//					$scope.datasetModalView.dataset.info.icon  = "img/dataset-icon-default.png";
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


appControllers.controller('ManagementDatasetCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'adminAPIservice',  'fabricAPImanagement', '$location', '$modal', 'info', 'readFilePreview', 'sharedDataset', '$translate','sharedUploadBulkErrors', '$route',
                                                     function($scope, $routeParams, fabricAPIservice, adminAPIservice, fabricAPImanagement, $location, $modal, info, readFilePreview, sharedDataset, $translate,sharedUploadBulkErrors, $route) {
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

	adminAPIservice.loadTenants().success(function(response) {
		console.log("response", response);
		try{
			$scope.tenantsList = [];
			for (var int = 0; int <  response.length; int++) {
				var t = response[int];
				if(t.tenantcode!=$scope.tenantCode)
					$scope.tenantsList.push(t);
			}
		} catch (e) {
			console.error("loadTenants ERROR",e);
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
	adminAPIservice.loadTags().success(function(response) {
		for (var int = 0; int < response.length; int++) {
			var tagLabel = $translate.use()=='it'?response[int].langit:response[int].langen;
			$scope.tagList.push({"tagCode":response[int].tagcode, "tagLabel":tagLabel} );
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
	adminAPIservice.loadDomains().success(function(response) {
		response.sort(function(a, b) { 
		    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
		});
		for (var int = 0; int < response.length; int++) {
			$scope.domainList.push(response[int].domaincode);
		}
	});
	
//	fabricAPIservice.getStreamDomains().success(function(response) {
//		for (var int = 0; int < response.streamDomains.element.length; int++) {
//			$scope.domainList.push(response.streamDomains.element[int].codDomain);
//		}
//	});

	$scope.subDomainList = [];
	$scope.selectSubdomain = function(domain){
		$scope.subDomainList = [];
		adminAPIservice.loadSubDomains(domain).success(function(response) {
			response.sort(function(a, b) { 
			    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
			});
			for (var int = 0; int < response.length; int++) {
				$scope.subdomainList.push(response[int].subdomaincode);
			}
		});
	};

	$scope.dataTypeList = [];
	adminAPIservice.loadDataTypes().success(function(response) {
		$scope.dataTypeList = response;
	});
	
	$scope.measureUnitsList = [];
	adminAPIservice.loadMeasureUnits().success(function(response) {
		$scope.measureUnitsList = response;
	});


	$scope.dataset = null;
	$scope.stream = null;
	//$scope.apiMetdataUrl = "";

	$scope.onDateChange = function() {
        if ($scope.dataset.opendata.datetimez) {
        	$scope.dataset.opendata.datetimez = $scope.dataset.opendata.datetimez.getTime();
        }
    };
    
    /*
     * LOAD DATASET
     */
    
    $scope.loadDataset = function(){
		adminAPIservice.loadDataset(info.getActiveTenant(),$routeParams.id_dataset).success(function(response) {
			console.log("LoadDataset", response);
			try{
				$scope.dataset = response;
				$scope.stream = response.stream;
				$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
			//	if(!$scope.dataset)
			//		$scope.dataset = new Object();
			//	if(!$scope.dataset.info)
			//		$scope.dataset.info = new Object();
			//	if(!$scope.dataset.info.tags)
			//		$scope.dataset.info.tags = [];

			//	if(!$scope.dataset.info.icon || $scope.dataset.info.icon == null)
			//		$scope.dataset.info.icon  = "img/dataset-icon-default.png";

//				if(!$scope.dataset.opendata){
//					$scope.dataset.opendata = {};
//					$scope.dataset.opendata.isOpendata = 'false';
//					$scope.dataset.opendata.language = 'it';
//				}
//				else if($scope.dataset.opendata.isOpendata){
//					$scope.dataset.opendata.isOpendata = 'true';
//					if($scope.dataset.opendata.dataUpdateDate && $scope.dataset.opendata.dataUpdateDate!=null){
//						var dataUpdateDate = new Date($scope.dataset.opendata.dataUpdateDate);
//						$scope.dataset.opendata.dataUpdateDate = Helpers.util.formatDateForInputHtml5(dataUpdateDate);
//					}
//				}
				
//				if(!$scope.dataset.icon|| $scope.dataset.icon == null)
//					$scope.dataset.icon  = "img/stream-icon-default.png";
				
				if(typeof $scope.dataset.idDataset != 'undefined' && $scope.dataset.idDataset !=null)
					$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.datasetCode+"/download/"+$scope.dataset.idDataset+ "/current";  
				
				$scope.newField = {sourcecolumn: $scope.dataset.components.length+1};

//				if(!$scope.canCreatePublicDataset())
//					$scope.dataset.info.visibility = 'private';

			} catch (e) {
				console.error("loadDataset ERROR", e);
			}
		});

	};

	
	/*
	
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
				
				$scope.newField = {sourcecolumn: $scope.dataset.info.fields.length+1};

//				if(!$scope.canCreatePublicDataset())
//					$scope.dataset.info.visibility = 'private';

			} catch (e) {
				console.error("getDataset ERROR", e);
			}
		});

	};
*/
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
	
//	$scope.checkTag = function(){ 
//		var rslt = true;
//		if(typeof $scope.dataset.info.tags != "undefined"){
//			if ($scope.dataset.info.tags.length > 0){ 
//				rslt = false;
//			}
//		}
//		
//		return rslt;
//	};
	
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
								"tenantName": newTenantSharing.name, 
								"tenantDescription": newTenantSharing.description, 
								"tenantCode": newTenantSharing.tenantcode, 
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
	      console.log.info('Modal dismissed at: ' + new Date());
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

		console.log("newField.sourcecolumn",newField.sourcecolumn);

		if(typeof newField.sourcecolumn =='undefined' || newField.sourcecolumn==null || newField.sourcecolumn=="" || isNaN(newField.sourcecolumn))
			$scope.insertColumnErrors .push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN');
		else{
			for (var int = 0; int < $scope.dataset.info.fields.length; int++) {
				if($scope.dataset.info.fields[int].fieldName.toUpperCase() == newField.fieldName.toUpperCase()){
					checkNameDuplicate = true;
				}
				if($scope.dataset.info.fields[int].sourcecolumn == newField.sourcecolumn){
					checkSourceColumnDuplicate = true;
				}
			}
		}
		
		if(checkNameDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME_UNIQUE');
		
		if(checkSourceColumnDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE');
		
		if($scope.insertColumnErrors.length == 0){
			if(!newField.alias || newField.alias == null || newField.alias == ""){
				newField.alias = newField.fieldName;
			}
			
			newField.isNew  = true;
			var dataType = newField.dataType?newField.dataType.dataType:'string';
			var measureUnit = newField.measureUnit?newField.measureUnit.measureUnit:null;
			
			newField.dataType = dataType;
			newField.measureUnit = measureUnit;
			newField.isKey = newField.isKey?1:0, 
			
			
			$scope.dataset.info.fields.push(newField);
			$scope.newField = {sourcecolumn: $scope.dataset.info.fields.length+1};
		}
	};
	
	$scope.removeNewField = function(index){
		$scope.dataset.info.fields.splice(index,1);
		$scope.newField = {sourcecolumn: $scope.dataset.info.fields.length+1};

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


appControllers.controller('ManagementUploadDatasetCtrl', [ '$scope', '$routeParams', 'fabricAPImanagement', 'info', '$upload', 'readFilePreview','$translate', 'sharedAdminResponse', 
                                                           function($scope, $routeParams, fabricAPImanagement, info, $upload, readFilePreview, $translate,sharedAdminResponse) {
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


appControllers.controller('ManagementNewDatasetWizardCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice','adminAPIservice', 'fabricAPImanagement','readFilePreview','info', 'sharedDataset', '$translate','$modal', 'sharedUploadBulkErrors',
                                                              function($scope, $route, $location, fabricAPIservice, adminAPIservice, fabricAPImanagement,readFilePreview, info, sharedDataset,$translate,$modal,sharedUploadBulkErrors) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.currentStep = 'columns';
	$scope.wizardSteps = [{'name':'start', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'metadata', 'style':''},
	                      {'name':'choosetype', 'style':''},
	                     // {'name':'upload', 'style':''},
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

	$scope.choosenDatasetType='bulk_upload';

	refreshWizardToolbar();

	$scope.columnDefinitionType = "import";
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.canCreatePublicDataset = function(){
		return info.getActiveShareInformationType() == "public" &&  $scope.dataset.unpublished!=1;
	}; 

	$scope.canShareDataset = function(){
		return info.getActiveShareInformationType() == "public";
	}; 



	var defaultDataType = null;
	$scope.dataTypeList = [];
	adminAPIservice.loadDataTypes().success(function(response) {
		$scope.dataTypeList = response;
		for (var int = 0; int < $scope.dataTypeList; int++) {
			if($scope.dataTypeList[int].datatypecode == 'string'){
				console.log("$scope.dataTypeList[int].dataType", $scope.dataTypeList[int].datatypecode);
				defaultDataType = $scope.dataTypeList[int].datatypecode;
				break;
			}
		}
	});
	
	$scope.dataset = sharedDataset.getDataset();
	var isClone = false;
	$scope.previewLines = [];
	$scope.previewColumns = [];
	$scope.previewBinaries = [];
	
	$scope.validationPatternSubdomain = Constants.VALIDATION_PATTERN_NO_SPACE;

	if($scope.dataset==null){
		$scope.dataset = {tags: new Array(), unpublished: 0,visibility: 'private', idTenant:info.getActiveTenant().idTenant};
		console.log("new Dataset start", $scope.dataset);
	}
	else{
		isClone = true;
		$scope.metadata.info.datasetName = null;
		if($scope.metadata.configData.deleted)
			delete $scope.metadata.configData.deleted;
		$scope.previewColumns = [];
		$scope.previewBinaries = [];
		if($scope.dataset.components.length>0){
			for (var int = 0; int < $scope.dataset.components.length; int++) {
				var component = $scope.dataset.components[int];
				if(component.idDataType == Constants.COMPONENT_DATA_TYPE_BINARY)
					$scope.previewBinaries.push(component);
				else
					$scope.previewColumns.push(component);
			}
		}
		
	}
	//$scope.metadata.opendata.dataUpdateDate = Helpers.util.formatDateForInputHtml5(new Date());
	$scope.useDomainMulti  = function(useDomainMultiFlag){
		console.log("useDomainMulti", useDomainMultiFlag);
		if(useDomainMultiFlag){
			$scope.selectedDomain = 'MULTI';
			$scope.dataset.visibility = 'private';
		}
		else
			$scope.selectedDomain = null;
		
		$scope.dataset.visibility = null;
	};
	
	$scope.user = info.getInfo().user;
	if($scope.user!=undefined && $scope.user.loggedIn==true){
		$scope.metadata.info.requestorName=$scope.user.firstname;
		$scope.metadata.info.requestorSurname=$scope.user.lastname;
		$scope.metadata.info.requestornEmail=$scope.user.email;
	}


	
	$scope.$on('addTag', function(e, selectedTag) {  
	       console.log("addTag child", e, selectedTag);  
	       addTag(selectedTag);
	    });
		
		$scope.newTag = {};
		var addTag = function(newTag){
			console.log("addTag ", newTag);
			if(newTag){
				var found = false;	
				for (var int = 0; int < $scope.dataset.tags.length; int++) {
					var existingTag = $scope.dataset.tags[int];
					if(existingTag == newTag.idTag){
						found = true;
						break;
					}

				}
				if(!found)
					$scope.dataset.tags.push(newTag.idTag);
				$scope.newTag.value = null;
			}
			return false;
		};
		
		$scope.onTagSelect = function($item, $model, $label){
			console.log("onTagSelect",$item, $model, $label);
			if($item.tagCode!=null)
				addTag($item);
		};

		$scope.removeTag = function(index){
			$scope.dataset.tags.splice(index,1);
			return false;
		};
		
		
		$scope.$on('addTenant', function(e, selectedTenant) {  
		       console.log("addTenant child", e, selectedTenant);  
		       addTenantSharing(selectedTenant);
		 });
		
		$scope.newTenantSharing = {};
		$scope.onTenantSharingSelect = function($item, $model, $label){
			console.log("onTenantSharingSelect",$item, $model, $label);
			addTenantSharing($item);
			$scope.newTenantSharing.value = null;
		};


		
		var addTenantSharing = function(newTenantSharing){
			console.log("addTenantSharing ",newTenantSharing);
			if(newTenantSharing){
				var found = false;	
				if(typeof $scope.dataset.sharingTenants == 'undefined' || $scope.dataset.sharingTenants == null){
					$scope.dataset.sharingTenants = [];
				}
				
				for (var int = 0; int < $scope.dataset.sharingTenants.length; int++) {
					var existingTenantSharing = $scope.dataset.sharingTenants[int];
					console.log("existing",existingTenantSharing);
					if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
						console.log("found");
						found = true;
						break;
					}

				}
				if(!found){
					$scope.dataset.sharingTenants.push({idTenant:newTenantSharing.idTenant, name: newTenantSharing.name});
					console.log("added",$scope.dataset.sharingTenants);
				}
			}

			return false;
		};

		$scope.removeTenantSharing = function(index){
			$scope.dataset.sharingTenants.splice(index,1);
			return false;
		};


	$scope.selectedFile = null;

	$scope.formatList = ["csv"];

	$scope.choosenFileSize = null;
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
					$scope.dataset.icon = contents;
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};
	
	$scope.csvInfo = {"separator":";","fileEncoding":"UTF-8","fileType":"csv", selectedFile: null, skipFirstRow:true};

	$scope.onFileSelect = function($files) {
		$scope.updateWarning = null;
		$scope.selectedFile = $files[0];
		console.log("onFileSelect", $scope.selectedFile );
		if($scope.selectedFile !=null && $scope.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
			$scope.choosenFileSize = $scope.selectedFile.size; 
			$scope.updateWarning = true;
			$scope.selectedFile = null;
			$scope.previewLines = null;
		}
		else
			readPreview($scope.csvInfo.separator);
	};

	$scope.refreshPreview  =function(){
		readPreview($scope.csvInfo.separator);
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

					$scope.dataset.components = [];
					$scope.previewColumns = [];
					console.log("defaultDataType",defaultDataType);
					if($scope.previewLines.length>0){
						for (var int = 0; int < $scope.previewLines[0].length; int++) {
							$scope.previewColumns.push(
									{index: int, 
										sourcecolumn: int+1, 
										name: $scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
										alias: $scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
										dataType: defaultDataType,
										iskey: false, 
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
			$scope.dataset.components = [];
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				var column  = $scope.previewColumns[int];
				column.index = int;
				if(!column.skipColumn){
					//column.sourcecolumn = order;
					var idDataType = column.dataType?column.dataType.idDataType:Constants.COMPONENT_DATA_TYPE_STRING;
					var idMeasureUnit = column.measureUnit?column.measureUnit.idMeasureUnit:null;
					$scope.dataset.components.push(
							{"sourcecolumn":column.sourcecolumn, 
								"name":column.name, 
								"alias":column.alias, 
								"idDataType":idDataType, 
								"iskey":column.iskey?1:0, 
								"idMeasureUnit":idMeasureUnit,
								"inorder":order}
					);
					order++;
				}

			}
			$scope.checkColumnName();
			
			
		}
	};
	
	$scope.columnsDatasetError = {"hasError": false};
	
	$scope.checkColumnName = function(componentName, columnIndex){
		$scope.insertColumnErrors = [];
		$scope.columnsDatasetError.hasError = false;
		var checkNameDuplicate = false;
		if($scope.previewColumns!=null){
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				if(int != columnIndex && !$scope.previewColumns[int].skipColumn &&  typeof $scope.previewColumns[int].componentName!='undefined' && 
						 typeof componentName!='undefined' && $scope.previewColumns[int].componentName.toUpperCase() == componentName.toUpperCase()){
					checkNameDuplicate = true;
				}
			}
		}
		if(checkNameDuplicate){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
			$scope.columnsDatasetError.hasError = true;
		}
		console.log("componentName", componentName);
		if(componentName == ""){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
			$scope.columnsDatasetError.hasError = true;
		}
		else if(componentName.match(Constants.VALIDATION_PATTERN_ALPHANUMERIC)){
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
			$scope.columnsDatasetError.hasError = true;
		}
	};
	
	$scope.columnsDatasetHasError = function(){
		return $scope.columnsDatasetError.hasError; 
	};
	
	$scope.newColumnDefinition = {sourcecolumn: $scope.previewColumns.length+1};
	$scope.addColumnDefinition = function(){
		console.log("addColumnDefinition",$scope.newColumnDefinition);
		//$scope.newColumnDefinition.sourcecolumn = $scope.previewColumns.length+1;
		$scope.insertColumnErrors = [];

		if($scope.newColumnDefinition.name==null || $scope.newColumnDefinition.name=="")
				$scope.insertColumnErrors .push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME');

		console.log("$scope.newColumnDefinition.sourcecolumn",$scope.newColumnDefinition.sourcecolumn);
		console.log("$scope.newColumnDefinition.sourcecolumn",($scope.newColumnDefinition.sourcecolumn==null));
		console.log("$scope.newColumnDefinition.sourcecolumn", ($scope.newColumnDefinition.sourcecolumn==""));
		if($scope.newColumnDefinition.sourcecolumn==null || $scope.newColumnDefinition.sourcecolumn=="" || isNaN($scope.newColumnDefinition.sourcecolumn))
			$scope.insertColumnErrors .push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN');

		var checkNameDuplicate = false;
		var checkSourceColumnDuplicate = false;
		for (var int = 0; int < $scope.previewColumns.length; int++) {
			if($scope.previewColumns[int].name.toUpperCase() == $scope.newColumnDefinition.name.toUpperCase()){
				checkNameDuplicate = true;
			}
			if($scope.previewColumns[int].sourcecolumn == $scope.newColumnDefinition.sourcecolumn){
				checkSourceColumnDuplicate = true;
			}
		}
		
		if(checkNameDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME_UNIQUE');
		
		if(checkSourceColumnDuplicate)
			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE');
		
		if($scope.insertColumnErrors.length == 0){
			if(!$scope.newColumnDefinition.alias || $scope.newColumnDefinition.alias == null || $scope.newColumnDefinition.alias == ""){
				$scope.newColumnDefinition.alias = $scope.newColumnDefinition.name;
			}
			

			$scope.previewColumns.push($scope.newColumnDefinition);
			$scope.newColumnDefinition = {sourcecolumn: $scope.previewColumns.length+1};
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

		if($scope.newBinaryDefinition.name==null || $scope.newBinaryDefinition.name=="")
				$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME');

		var checkNameDuplicate = false;
		//var checkSourceBinaryDuplicate = false;
		for (var int = 0; int < $scope.previewBinaries.length; int++) {
			if($scope.previewBinaries[int].name == $scope.newBinaryDefinition.name){
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
			if(!$scope.newBinaryDefinition.alias || $scope.newBinaryDefinition.alias == null || $scope.newBinaryDefinition.alias == ""){
				$scope.newBinaryDefinition.alias = $scope.newBinaryDefinition.name;
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
		if(field && field.dataType && field.dataType.datatypecode && field.dataType.datatypecode == "dateTime")
			return true;
		return false;
	};
	
	$scope.isCoordinatesField = function(field){
		if(field && field.dataType && field.dataType.datatypecode && (field.dataType.datatypecode == "longitude" || field.dataType.datatypecode == "latitude"))
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
		$scope.dataset.components = [];
		
		
		$scope.currentStep = 'choosetype';refreshWizardToolbar();
	};
	
	//$scope.goToUpload  = function(){  $scope.currentStep = 'upload';refreshWizardToolbar();};
	$scope.goToColumns  = function(){
		//$scope.warningMessages = [];
		//$scope.saveError = null;
		//$scope.saveErrors = null;

		$scope.columnDefinitionType = "import";  
		//readPreview(csvSeparator); 
		//console.log("csvSeparator", $scope.csvSeparator, csvSeparator);
		//$scope.csvSeparator=csvSeparator;
		//$scope.fileEncoding=fileEncoding;
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
			$scope.goToColumns();
		else if(choosen == 'bulk_no_upload'){
			$scope.previewBinaries = [];
			$scope.goToCreateColumns(choosen);
		}
		else{ //if(choosen == 'bulk_no_upload' || choosen == 'binary_no_upload')
			$scope.goToCreateColumns(choosen);
		}
		
	};
	
//	$scope.backFromColumns= function(){
//		if($scope.choosenDatasetType == 'bulk_upload')
//			$scope.goToUpload();
//		else{ //if(choosen == 'bulk_no_upload' || choosen == 'binary_no_upload')
//			$scope.goToChooseType();
//		}
//				
//	};

	
	var addData = function(){
		console.log("addData");
		$scope.updateStatus = 'upload';
		
		adminAPIservice.loadDataset(info.getActiveTenant(),/*$scope.dataset.idDataset*/3018).success(function(response) {
			var componentInfoRequests = new Array();
			var loadedDataset = response;
			for (var cIndex = 0; cIndex < loadedDataset.components.length; cIndex++) {
				for (var pIndex = 0; pIndex < $scope.previewColumns.length; pIndex++) {
					var c = loadedDataset.components[cIndex];
					var p = $scope.previewColumns[pIndex];
					if(p.name == c.name){
						componentInfoRequests.push({"numColumn": p.sourcecolumn, "dateFormat": p.dateTimeFormat, "skipColumn": p.skipColumn, "idComponent": c.idComponent});
						break;
					}
				}
			}
			$scope.updateStatus = 'ready';

			console.log("componentInfoRequests", componentInfoRequests);
			
			adminAPIservice.addDataToDataset(info.getActiveTenant(), $scope.dataset, $scope.csvInfo,componentInfoRequests).progress(function(evt) {
				$scope.isUploading = true;
				console.log('evt');
				console.log(evt);
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function(data, status, headers, config) {
				$scope.updateStatus = 'finish';
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVED_INFO';
				console.log("data loaded", data);
			}).error(function(response){
				$scope.updateStatus = 'ready';
				console.error("createDataset ERROR", response);
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVE_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;

			});
			
			
			if($scope.selectedFile && $scope.selectedFile != null  && $scope.selectedFile.name && $scope.selectedFile.name!=null)
				fileName = $scope.selectedFile.name;
			var createUrl = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), info.getActiveTenant().organizationCode);
			$scope.upload = $upload.upload({
				//url: Constants.API_MANAGEMENT_DATASET_LIST_URL + $scope.tenantCode + '/', 
				url: createUrl,
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
			
			
		}).error(function(result){
			console.error("addData - loadDataset " +result);
		});

		
		
	
	};
	
	
	$scope.updateStatus = 'ready';

	//$scope.warningMessages = [];
	$scope.admin_response = {details: new Array()};
	


	$scope.createDataset = function() {
		$scope.admin_response = {details: new Array()};
		//$scope.warningMessages = [];
		//$scope.saveError = null;
		//$scope.saveErrors = null;
		console.log("createDataset START 1", $scope.metadata);
		$scope.refreshColumnOrder();
		console.log("createDataset START 2", $scope.metadata);

		var hasErrors = false;
		
		if(!$scope.dataset.components || $scope.dataset.components==null || $scope.dataset.components == 0){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_NEW_DATASET_WARNING_TITLE';
			$scope.admin_response.details.push('MANAGEMENT_NEW_DATASET_WARNING_NO_COLUMN');

			//$scope.warningMessages.push('MANAGEMENT_NEW_DATASET_WARNING_NO_COLUMN');
			$scope.dataset.components = [];
			hasErrors =true;
		}
		console.log("$scope.choosenDatasetType ",$scope.choosenDatasetType );
		console.log("$scope.previewBinaries ",$scope.previewBinaries );
		console.log("$scope.previewBinaries.length ",$scope.previewBinaries.length );
		if($scope.choosenDatasetType == 'binary_no_upload' && $scope.previewBinaries.length==0){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_NEW_DATASET_WARNING_TITLE';
			$scope.admin_response.details.push('MANAGEMENT_NEW_DATASET_WARNING_NO_BINARY');
			//$scope.warningMessages.push('MANAGEMENT_NEW_DATASET_WARNING_NO_BINARY');
			hasErrors =true;
		}
		
		var startSourceColumn = $scope.dataset.components.length +1;
		for (var i = 0; i < $scope.previewBinaries.length; i++) {
			var fileDef = $scope.previewBinaries[i];
			$scope.dataset.components.push(
					{"sourcecolumn":(startSourceColumn + i), 
						"name":fileDef.name, 
						"alias":fileDef.alias, 
						"idDataType": Constants.COMPONENT_DATA_TYPE_BINARY, 
						"iskey":0, 
						"inorder":(startSourceColumn + i -1)}
					);
		}
		
		console.log("dataset dopo binary ", $scope.dataset);
//		$scope.openadataDataUpdateDateStyle = "";
//
//		if(typeof newDataset.opendata === 'undefined' || newDataset.opendata==null || newDataset.opendata.isOpendata !='true'){
//			newDataset.opendata = null;
//		}
//		else{
//			if(!newDataset.opendata.language || newDataset.opendata.language == null || newDataset.opendata.language == '')
//				newDataset.opendata.language = 'it';
//
//			if(newDataset.opendata.dataUpdateDate && newDataset.opendata.dataUpdateDate!=null)
//				newDataset.opendata.dataUpdateDate = new Date(newDataset.opendata.dataUpdateDate).getTime();
//
//		}
//
//		console.log("newDataset", newDataset);
		console.log("dataset ready", $scope.dataset);
		hasErrors = true;
		if(!hasErrors){
			$scope.updateStatus = 'update';
			adminAPIservice.createDataset(info.getActiveTenant(), $scope.dataset).success(function(response) {
				console.log("createDataset SUCCESS", response);
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVED_INFO';
				if($scope.columnDefinitionType == "import"){
					addData();
				}
				else{
					sharedAdminResponse.setResponse($scope.admin_response);
					$location.path('/management/viewDataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.idDataset);
					$scope.updateStatus = 'update';
				}

			}).error(function(response){
				$scope.updateStatus = 'ready';
				console.error("createDataset ERROR", response);
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVE_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;

			});

			
			
			
			/*
			
			var fileName = null;
			if($scope.selectedFile && $scope.selectedFile != null  && $scope.selectedFile.name && $scope.selectedFile.name!=null)
				fileName = $scope.selectedFile.name;
			var createUrl = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), info.getActiveTenant().organizationCode);
			$scope.upload = $upload.upload({
				//url: Constants.API_MANAGEMENT_DATASET_LIST_URL + $scope.tenantCode + '/', 
				url: createUrl,
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
	
			}); */
		}
		else{
			addData();
			$scope.updateStatus = 'error';
		}

	};	
} ]);

