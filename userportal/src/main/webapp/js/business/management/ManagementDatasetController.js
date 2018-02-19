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
				if(response[i].datasetSubtype.datasetSubtype!='binaryDataset')
						$scope.datasetList.push(response[i]);
			}
	
			$scope.totalItems = $scope.datasetList.length;
		});
	};


	$scope.loadDatasets();

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

	$scope.viewUnistalledCheck = false;
	$scope.viewUnistalledFilter = function(dataset) {
		if(!$scope.viewUnistalledCheck){
			return (dataset.status && dataset.status.idStatus!=5 && dataset.status.idStatus!=4);
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
		//console.log("isSelected", dataset);

		return $scope.selectedDatasets.indexOf(dataset) >= 0;
	};

	$scope.updateSelection = function($event, dataset) {
		//console.log("updateSelection", dataset);
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, dataset);
	};

	var updateSelected = function(action, dataset) {
		//console.log("updateSelected", action, dataset);
		if (action === 'add' && $scope.selectedDatasets.indexOf(dataset) === -1) {
			$scope.selectedDatasets.push(dataset);
		}
		if (action === 'remove' && $scope.selectedDatasets.indexOf(dataset) !== -1) {
			$scope.selectedDatasets.splice($scope.selectedDatasets.indexOf(dataset), 1);
		}
	};

	$scope.canEdit = function() {
		if($scope.selectedDatasets.length==1 && 
				($scope.selectedDatasets[0].datasetType && $scope.selectedDatasets[0].datasetType.datasetType == "dataset" && 
						$scope.selectedDatasets[0].datasetSubtype &&	$scope.selectedDatasets[0].datasetSubtype.datasetSubtype == "bulkDataset")){
			return true;
		}
		return false;
	};

	$scope.canDelete = function() {
		if($scope.selectedDatasets.length==1 && 
				($scope.selectedDatasets[0].datasetType && $scope.selectedDatasets[0].datasetType.datasetType == "dataset" && 
						$scope.selectedDatasets[0].datasetSubtype && $scope.selectedDatasets[0].datasetSubtype.datasetSubtype == "bulkDataset")){
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
		}, function(result) {
			console.error('Got notification 2: ', result);
			
			$scope.datasetModalView.dataset.todo = false;
			$scope.datasetModalView.dataset.okdo = false;
			$scope.datasetModalView.dataset.kodo = true;
		}, function(result) {
			
		});
	};

	$scope.loadDataset();
	
	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
}]);



appControllers.controller('ManagementDatasetCtrl', [ '$scope', '$route', '$routeParams', '$location', 'fabricAPIservice','adminAPIservice', 'fabricAPImanagement','readFilePreview','info', 'sharedDatasource', '$translate','$modal', 'sharedUploadBulkErrors', 'sharedAdminResponse',
             function($scope, $route, $routeParams, $location, fabricAPIservice, adminAPIservice, fabricAPImanagement,readFilePreview, info, sharedDatasource,$translate,$modal,sharedUploadBulkErrors,sharedAdminResponse) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.currentStep = 'start';
	$scope.wizardSteps = [{'name':'start', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'metadata', 'style':''},
	                      {'name':'choosetype', 'style':''},
	                     // {'name':'upload', 'style':''},
	                      {'name':'columns', 'style':''},
	                      ];


	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};

	$scope.admin_response = {};
	$scope.choosenDatasetType='bulk_upload';

	refreshWizardToolbar();

	$scope.columnDefinitionType = "import";
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.isNewDataset = false;
	if($routeParams.entity_code == null || typeof $routeParams.entity_code == 'undefined' || $routeParams.id_datasource == null || typeof $routeParams.id_datasource  == 'undefined' )
		$scope.isNewDataset = true;
	

	$scope.previewLines = [];
	$scope.preview= {components:new Array(),"type":"csv"};
	$scope.previewBinaries = [];
		
	$scope.showUploadButton = true;
	$scope.loadMoreData = function(){
		$scope.showUploadButton = true;
	};
	$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;

	$scope.admin_response = {};
	var loadDatasource = function(){
		adminAPIservice.loadDatasource(Constants.DATASOURCE_TYPE_DATASET,  info.getActiveTenant(),$routeParams.id_datasource).success(function(response) {
			console.log("LoadDataset", response);
			try{
				$scope.inputDatasource = response;
				$scope.dataset = Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_DATASET,response);
				$scope.datasetDomain = $scope.inputDatasource.domain['lang'+$translate.use()];
				$scope.datasetSubdomain = $scope.inputDatasource.subdomain['lang'+$translate.use()];

				for (var cIndex = 0; cIndex < $scope.dataset.components.length; cIndex++) {
					$scope.preview.components.push($scope.dataset.components[cIndex]);
				}
				$scope.newComponent = {sourcecolumn: $scope.preview.components.length+1};
				console.log("LoadDataset prepared", $scope.dataset);
				if(typeof $scope.dataset.idDataset != 'undefined' && $scope.dataset.idDataset !=null)
					$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.datasetCode+"/download/"+$scope.dataset.idDataset+ "/current";  
				
				//$scope.newField = {sourcecolumn: $scope.dataset.components.length+1};
				$scope.datasetReady = true;
				$scope.updateStatus = 'ready';

			} catch (e) {
				console.error("loadDataset ERROR", e);
			}
		}).error(function(data,status){
			console.error("loadDataset ERROR", data,status);
			$scope.admin_response.type = 'danger';
			if(status==404)
				$scope.admin_response.message = 'MANAGEMENT_VIEW_DATASET_ERROR_NOT_FOUND';
			else
				$scope.admin_response.message = 'UNEXPECTED_ERROR';
		});
	};
	
	var cleanDatasetBeforeUpdate = function(){
		if($scope.dataset.opendata && !($scope.dataset.opendata.opendataupdatedate || $scope.dataset.opendata.opendataexternalreference || 
				$scope.dataset.opendata.lastupdate || $scope.dataset.opendata.opendataauthor || $scope.dataset.opendata.opendatalanguage))
			delete $scope.dataset['openData'];
	
		if($scope.dataset.license && $scope.dataset.license.idLicense==null && $scope.dataset.license.description==null && $scope.dataset.license.licesecode==null)
			delete $scope.dataset['license'];

		if($scope.dataset.visibility == 'public')
			delete $scope.dataset['sharingTenants'];
		if($scope.dataset.visibility != 'private')
			delete $scope.dataset['copyright'];
		else
			delete $scope.dataset['license'];
	};

	$scope.datasetReady = false;
	var isClone = false;
	if(!$scope.isNewDataset){
		loadDatasource();
	}
	else{
		var datasourceClone = sharedDatasource.getDatasource();
		if(datasourceClone==null){				
			isClone = false;
			$scope.dataset = {"datasourceType": Constants.DATASOURCE_TYPE_DATASET,tags: new Array(), unpublished: 0,visibility: 'private', idTenant:info.getActiveTenant().idTenant};
			console.log("new Dataset start", $scope.dataset);
			$scope.datasetReady = true;
		}
		else{
			isClone = true;
			$scope.dataset = Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_DATASET,datasourceClone);
			$scope.datasetDomain = $scope.dataset.domaincode;
			delete $scope.dataset.currentDataSourceVersion;
			delete $scope.dataset.datasetname;
			delete $scope.dataset.datasetcode;
			delete $scope.dataset.iddataset;
			if(Helpers.util.has($scope.dataset, "dcat.idDcat"))
				delete $scope.dataset.dcat.idDcat;
			
			cleanDatasetBeforeUpdate();
			console.log("LoadDataset prepared", $scope.dataset);
			for (var cIndex = 0; cIndex < $scope.dataset.components.length; cIndex++) {
				delete $scope.dataset.components[cIndex].idComponent;
				$scope.preview.components.push($scope.dataset.components[cIndex]);
			}
			$scope.datasetReady = true;
			sharedDatasource.setDatasource(null);

		}
	}
	
	$scope.user = info.getInfo().user;
	if($scope.user!=undefined && $scope.user.loggedIn==true){
		$scope.metadata.info.requestorName=$scope.user.firstname;
		$scope.metadata.info.requestorSurname=$scope.user.lastname;
		$scope.metadata.info.requestornEmail=$scope.user.email;
	}

	
	$scope.showHint = false;
	$scope.showHintToggle = function(){
		$scope.showHint = !$scope.showHint;
	};
	

	$scope.provaDire = function(){
		console.log("Dataset", $scope.dataset);
	};
	
	$scope.newBinaryDefinition = {sourceBinary: $scope.previewBinaries.length+1};
	$scope.addBinaryDefinition = function(){
		console.log("addBinaryDefinition",$scope.newBinaryDefinition);
		$scope.insertBinaryErrors = [];

		if($scope.newBinaryDefinition.name==null || $scope.newBinaryDefinition.name=="")
				$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME');

		var checkNameDuplicate = false;

		for (var int = 0; int < $scope.previewBinaries.length; int++) {
			if($scope.previewBinaries[int].name == $scope.newBinaryDefinition.name){
				checkNameDuplicate = true;
			}
	}
		
		if(checkNameDuplicate)
			$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME_UNIQUE');
		
		if($scope.insertBinaryErrors.length == 0){
			if(!$scope.newBinaryDefinition.alias || $scope.newBinaryDefinition.alias == null || $scope.newBinaryDefinition.alias == ""){
				$scope.newBinaryDefinition.alias = $scope.newBinaryDefinition.name;
			}
			

			$scope.previewBinaries.push($scope.newBinaryDefinition);
			$scope.newBinaryDefinition = {sourceBinary: $scope.previewBinaries.length+1};
		}
	};
	
	$scope.removeBinaryDefinition = function(index){
		$scope.previewBinaries.splice(index,1);
	};
	$scope.cancel = function(){
		$location.path('management/datasets/'+$scope.tenantCode);
	};

	$scope.htmlTooltip = Constants.HELP_HINT_DATE_FORMAT_TABLE;

	$scope.csvInfo = {"separator":";","fileEncoding":"UTF-8","fileType":"csv", selectedFile: null, skipFirstRow:true};

	
	$scope.goToStart  = function(){$scope.currentStep = 'start'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToMetadata  = function(){ $scope.currentStep = 'metadata';refreshWizardToolbar();};
	$scope.goToChooseType  = function(){
		$scope.csvInfo.selectedFile = null;
		$scope.previewLines = [];
		if(isClone)
			isClone = false;
		else{
			$scope.preview.components = [];
			$scope.previewBinaries = [];
		}
		$scope.dataset.components = [];
		
		
		$scope.currentStep = 'choosetype';refreshWizardToolbar();
	};
	
	$scope.goToColumns  = function(){

		$scope.columnDefinitionType = "import";  
		$scope.isImportDataset = true;
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
		$scope.isImportDataset = false;
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
	

	$scope.uploadData = function(){
		addData($scope.inputDatasource);
	};
	
	var addData = function(loadedDatasource){
		console.log("addData", loadedDatasource);

		$scope.updateStatus = 'upload';
		var componentInfoRequests = new Array();
		for (var cIndex = 0; cIndex < loadedDatasource.components.length; cIndex++) {
			for (var pIndex = 0; pIndex < $scope.preview.components.length; pIndex++) {
				var c = loadedDatasource.components[cIndex];
				var p = $scope.preview.components[pIndex];
				if(p.name == c.name){
					componentInfoRequests.push({"numColumn": p.sourcecolumn-1, "dateFormat": p.dateTimeFormat, "skipColumn": p.skipColumn, "idComponent": c.idComponent});
					break;
				}
			}
		}

		console.log("componentInfoRequests", componentInfoRequests);
		
		adminAPIservice.addDataToDataset(info.getActiveTenant(),loadedDatasource.dataset, $scope.csvInfo,componentInfoRequests).progress(function(evt) {
			console.log(evt);
			console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		}).success(function(data, status, headers, config) {
			$scope.updateStatus = 'finish';
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_ADD_DATA_SAVED_INFO';
			console.log("data loaded", data);
		}).error(function(response){
			$scope.updateStatus = 'ready';
			console.error("addDataToDataset ERROR", response);
			if($scope.isNewDataset){
				sharedAdminResponse.setResponse({type:'danger', message: 'MANAGEMENT_EDIT_DATASET_SAVED_OK_ADD_DATA_FAILED'});
				console.warn("redirect to -> " +  "#/management/viewDataset/dataset/"+$scope.tenantCode+"/"+loadedDatasource.dataset.datasetcode +"/" + loadedDatasource.dataset.iddataset);
				$location.path("#/management/viewDatasource/dataset/"+$scope.tenantCode+"/"+loadedDatasource.dataset.datasetcode +"/" + loadedDatasource.dataset.iddataset);
			} else{
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_ADD_DATA_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
			}

		});
		
	};
	
	
	$scope.updateStatus = 'ready';

	$scope.admin_response = {details: new Array()};
	


	$scope.createDataset = function() {
		console.log("create", $scope.dataset);
		$scope.admin_response = {details: new Array()};

		var hasErrors = false;
		
		if(!$scope.dataset.components || $scope.dataset.components==null || $scope.dataset.components == 0){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_NEW_DATASET_WARNING_TITLE';
			$scope.admin_response.details.push('MANAGEMENT_NEW_DATASET_WARNING_NO_COLUMN');

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
		
		cleanDatasetBeforeUpdate();
		
		console.log("dataset dopo binary ", $scope.dataset);
		console.log("dataset ready", $scope.dataset);
		if(!hasErrors){
			$scope.updateStatus = 'update';
			adminAPIservice.createDataset(info.getActiveTenant(), $scope.dataset).success(function(response) {
				console.log("createDataset SUCCESS", response);
				$scope.dataset.iddataset=response.iddataset;
				$scope.dataset.datasetcode=response.datasetcode;
				$scope.dataset.datasetname=response.datasetname;

				$scope.admin_response= {};
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVED_INFO';
				if($scope.columnDefinitionType == "import"){
					console.log("adding data");
					$scope.updateStatus = 'upload'; 

					adminAPIservice.loadDatasource(Constants.DATASOURCE_TYPE_DATASET, info.getActiveTenant(),$scope.dataset.iddataset).success(function(response2) {
						addData(response2);
					}).error(function(result){
						console.error("addData - loadDataset ",result);
						sharedAdminResponse.setResponse({type:'danger', message: 'MANAGEMENT_EDIT_DATASET_SAVED_OK_ADD_DATA_FAILED'});
						$location.path('/management/viewDatasource/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset);
					});
				}
				else{
					sharedAdminResponse.setResponse($scope.admin_response);
					$location.path('/management/viewDatasource/dataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset);

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

			
		}
		else{
			$scope.updateStatus = 'ready';
			Helpers.util.scrollTo();
		}

	};	
	
	/*
	 * UPDATE DATASET
	 */
	$scope.updateDataset = function() {
		
		$scope.dataset.name=$scope.dataset.datasetname;
		if(!$scope.dataset.components || $scope.dataset.components.length==0){
			$scope.updateWarning = true;
			$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
		}
		
		
		cleanDatasetBeforeUpdate();
//		if($scope.dataset.opendata && !($scope.dataset.opendata.opendataupdatedate || $scope.dataset.opendata.opendataexternalreference || 
//				$scope.dataset.opendata.lastupdate || $scope.dataset.opendata.opendataauthor || $scope.dataset.opendata.opendatalanguage))
//			delete $scope.dataset['openData'];
//	
//		if($scope.dataset.license && $scope.dataset.license.description==null && $scope.dataset.license.licesecode==null)
//			delete $scope.dataset['license'];
//
//		if($scope.dataset.visibility == 'public')
//			delete $scope.dataset['sharingTenants'];
//		if($scope.dataset.visibility != 'private')
//			delete $scope.dataset['copyright'];
//		else
//			delete $scope.dataset['license'];
		
		console.log("updateDataset - dataset", $scope.dataset);
		$scope.admin_response = {};
		$scope.updateStatus = 'update';

		adminAPIservice.updateDataset(info.getActiveTenant(), $scope.dataset).success(function(response) {
			console.log("updateDataset SUCCESS", response);
			Helpers.util.scrollTo();
			//$scope.updateStatus = 'finish';
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_DATA_SAVED_INFO';
			sharedAdminResponse.setResponse($scope.admin_response);
			$scope.preview.components = [];
			$scope.previewBinaries = [];
			loadDatasource();

		}).error(function(response){
			console.error("updateDataset ERROR", response);
			$scope.updateStatus = 'start';

			Helpers.util.scrollTo();
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVE_ERROR';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
		});
		
	};
} ]);

