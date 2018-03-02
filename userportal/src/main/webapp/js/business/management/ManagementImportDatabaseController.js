appControllers.controller('ManagemenImportDatabasetWizardCtrl', [ '$scope', '$route', '$location', 'adminAPIservice' ,'fabricAPImanagement','readFilePreview','info', '$upload', '$translate','$modal', 'devService',
                                                              function($scope, $route, $location, adminAPIservice, fabricAPImanagement,readFilePreview, info, $upload, $translate, $modal, devService) {
	$scope.tenantCode = $route.current.params.tenant_code;
	
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
	
	refreshWizardToolbar();

	
	$scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;
	
	$scope.importConfig = {};
	
	//$scope.defaultMetadata= {"info":{"visibility":"private","tenantssharing":{"tenantsharing": new Array()},"tags": new Array()}}; 
	$scope.defaultMetadata = {"datasourceType": Constants.DATASOURCE_TYPE_DATASET,tags: new Array(), unpublished: false, visibility: 'private', idTenant:info.getActiveTenant().idTenant};
	//REMOVE
	$scope.datasetReady = true;
	
	$scope.chooseSourceType  = function(sourceType){
		$scope.importConfig.sourceType = sourceType;
		$scope.goToDatabase();
	};
	

	$scope.importConfig.sqlSourcefile;
	$scope.alert = {admin_response:{}};
	
	$scope.onSqlSourceSelect = function($files) {
		$scope.alert.admin_response = {};

		if( $files[0] !=null &&  $files[0].size>Constants.DATABASE_IMPORT_SOURCEFILE_MAX_FILE_SIZE){
			$scope.alert.admin_response.type = 'warning';
			$scope.alert.admin_response.message = 'MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_TOOBIG_WARNING';
			$scope.importConfig.sqlSourcefile = null;
		}
		else{
			$scope.importConfig.sqlSourcefile = $files[0];
		}
	};

	
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	
	$scope.canCreatePublicDataset = function(){
		return info.getActiveShareInformationType() == "public" &&  $scope.defaultMetadata.unpublished!=1;
	}; 

	$scope.canShareDataset = function(){
		return info.getActiveShareInformationType() == "public";
	}; 

	
//	$scope.useDomainMulti  = function(useDomainMultiFlag){
//		console.log("useDomainMulti", useDomainMultiFlag);
//		if(useDomainMultiFlag){
//			$scope.defaultMetadata.info.dataDomain = 'MULTI';
//			$scope.defaultMetadata.info.visibility = 'private';
//		}
//		else
//			$scope.defaultMetadata.info.dataDomain = null;
//		
//		$scope.defaultMetadata.info.codSubDomain = null;
//	};
//
//	
//	$scope.isLicenceVisible = function(){
//		var returnValue = true;
//		if ($scope.metadata){
//			if (($scope.defaultMetadata.info.license == translations_it.DATASET_FIELD_METADATA_LICENCE_CCBY) || ($scope.defaultMetadata.info.license == translations_it.DATASET_FIELD_METADATA_LICENCE_CC0))
//				returnValue = false;
//		}
//		return returnValue;
//	};
//	
	$scope.checkTag = function(){ 
		return !(typeof $scope.defaultMetadata.tags != "undefined" && $scope.defaultMetadata.tags.length > 0);
	};


//	$scope.domainList = [];
//	adminAPIservice.loadDomains().success(function(response) {
//		response.sort(function(a, b) { 
//		    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
//		});
//		for (var int = 0; int < response.length; int++) {
//			$scope.domainList.push(response[int].domaincode);
//		}
//	});
//
//	$scope.subDomainList = [];
//	$scope.selectSubdomain = function(domain){
//		adminAPIservice.loadSubDomains(domain).success(function(response) {
//			response.sort(function(a, b) { 
//			    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
//			});
//			for (var int = 0; int < response.length; int++) {
//				$scope.subdomainList.push(response[int].subdomaincode);
//			}
//		});
//	};
//	
//	
//
//	$scope.tagList = [];
//	adminAPIservice.loadTags().success(function(response) {
//		for (var int = 0; int < response.length; int++) {
//			var tagLabel = $translate.use()=='it'?response[int].langit:response[int].langen;
//			$scope.tagList.push({"tagCode":response[int].tagcode, "tagLabel":tagLabel} );
//		}
//		
//		$scope.tagList.sort(function(a, b) { 
//		    return ((a.tagLabel < b.tagLabel) ? -1 : ((a.tagLabel > b.tagLabel) ? 1 : 0));
//		});
//		
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
//
//	}).error(function(response) {console.error("getStreamTags", response);});	
//	
//	$scope.tenantsList = [];
//	adminAPIservice.loadTenants().success(function(response) {
//		try{
//			
//			for (var int = 0; int <  response.length; int++) {
//				var t = response[int];
//				if(t.tenantcode!=$scope.tenantCode)
//					$scope.tenantsList.push(t);
//			}
//		} catch (e) {
//			console.error("loadTenants ERROR",e);
//		}
//	}).error(function(response) {console.error("erro", response);});
//
//
//	$scope.measureUnitsList = [];
//	adminAPIservice.loadMeasureUnits().success(function(response) {
//		$scope.measureUnitsList = response;
//	});
//
//	var defaultDataType = null;
//	$scope.dataTypeList = [];
//	adminAPIservice.loadDataTypes().success(function(response) {
//		$scope.dataTypeList = response;
//		for (var int = 0; int < $scope.dataTypeList; int++) {
//			if($scope.dataTypeList[int].datatypecode == 'string'){
//				console.log("$scope.dataTypeList[int].dataType", $scope.dataTypeList[int].datatypecode);
//				defaultDataType = $scope.dataTypeList[int].datatypecode;
//				break;
//			}
//		}
//	});
//	


	
	$scope.user = info.getInfo().user;
	if($scope.user!=undefined && $scope.user.loggedIn==true){
		$scope.defaultMetadata.requestername=$scope.user.firstname;
		$scope.defaultMetadata.requestersurname=$scope.user.lastname;
		$scope.defaultMetadata.requestermail=$scope.user.email;
	}
//
//	$scope.newTag = {value:""};
//	$scope.addTag = function(newTag, tags){
//		console.log("addTag", newTag);
//		if(newTag){
//			if(!tags)
//				tags = [];
//
//			var found = false;	
//			for (var int = 0; int <tags.length; int++) {
//				var existingTag = tags[int];
//				if(existingTag.tagCode == newTag){
//					found = true;
//					break;
//				}
//
//			}
//			if(!found)
//				tags.push({"tagCode":newTag});
//		}
//		$scope.newTag.value = "";
//		return false;
//
//	};
//
//	$scope.onTagSelect = function($item, $model, $label){
//		console.log("onTagSelect",$item, $model, $label);
//		if($item.tagCode!=null)
//			$scope.addTag($item.tagCode, $scope.defaultMetadata.info.tags);
//		
//	};
//
//
//	$scope.removeTag = function(index, tags){
//		tags.splice(index,1);
//		return false;
//	};
//	
//	$scope.showChooseTagTable = function(){
//		var chooseTagDialog = $modal.open({
//	      templateUrl: 'tagChooerDialog.html',
//	      controller: 'ManagementDatasetChooseTagControllerCtrl',
//	      size: 'lg',
//	      scope: $scope,
//	      resolve: {
//	    	  tagList: function () {return $scope.tagList;},
//	      	}
//    	});
//		
//		chooseTagDialog.result.then(function (selectedTag) {
//			$scope.addTag(selectedTag.tagCode,$scope.defaultMetadata.info.tags);
//	    }, function () {
//	      $log.info('Modal dismissed at: ' + new Date());
//	    });
//	};
//
//	
//	$scope.addTenantSharing = function(newTenantSharing){
//		console.log("addTenantSharing ",newTenantSharing);
//		if(newTenantSharing){
//			var found = false;	
////			if(!$scope.defaultMetadata.info.tenantssharing || $scope.defaultMetadata.info.tenantssharing == null){
////				$scope.defaultMetadata.info.tenantssharing = {};
////			}defaultMetadata.info.tenantssharing.tenantsharing
//			if(!$scope.defaultMetadata.info.tenantssharing || $scope.defaultMetadata.info.tenantssharing == null){
//				$scope.defaultMetadata.info.tenantssharing = [];
//			}
//			
//			if(!$scope.defaultMetadata.info.tenantssharing.tenantsharing || $scope.defaultMetadata.info.tenantssharing.tenantsharing == null){
//				$scope.defaultMetadata.info.tenantssharing.tenantsharing = [];
//			}
//			
//			
//			for (var int = 0; int < $scope.defaultMetadata.info.tenantssharing.tenantsharing.length; int++) {
//				var existingTenantSharing = $scope.defaultMetadata.info.tenantssharing.tenantsharing[int];
//				console.log("existing",existingTenantSharing);
//				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
//					console.log("found");
//					found = true;
//					break;
//				}
//
//			}
//			if(!found){
//				$scope.defaultMetadata.info.tenantssharing.tenantsharing.push(
//							{"idTenant":newTenantSharing.idTenant, 
//								"tenantName": newTenantSharing.name, 
//								"tenantDescription": newTenantSharing.description, 
//								"tenantCode": newTenantSharing.tenantcode, 
//								"isOwner": 0
//							});
//				console.log("added", $scope.defaultMetadata.info.tenantssharing );
//			}
//		}
//
//		return false;
//	};
//
//	$scope.removeTenantSharing = function(index){
//		$scope.defaultMetadata.info.tenantssharing.tenantsharing.splice(index,1);
//		return false;
//	};
//	
//	$scope.onTenantSharingSelect = function($item, $model, $label){
//		console.log("onTenantSharingSelect",$item, $model, $label);
//		$scope.addTenantSharing($item);
//		
//	};
//
//	
//	$scope.showChooseTenantTable = function(){
//		var chooseTenantDialog = $modal.open({
//	      templateUrl: 'tenantChooerDialog.html',
//	      controller: 'ManagementDatasetChooseTenantControllerCtrl',
//	      size: 'lg',
//	      scope: $scope,
//	      resolve: {
//	    	  tenantsList: function () {return $scope.tenantsList;},
//	      	}
//    	});
//		
//		chooseTenantDialog.result.then(function (selectedTenant) {
//			$scope.addTenantSharing(selectedTenant);
//	    }, function () {
//	      $log.info('Modal dismissed at: ' + new Date());
//	    });
//	};
//	

	$scope.checkDcatFields = function(table){
		var isOk = false;
		if(typeof table != 'undefined' && table !=null && 
		   typeof table.dataset != 'undefined' && table.dataset !=null){
			if( table.dataset.unpublished)
				isOk = true;
			else{
				isOk =  typeof table.dataset.dcat !=  'undefined'  && table.dataset.dcat !=null && 
					typeof table.dataset.dcat.dcatrightsholdername !=  'undefined' && table.dataset.dcat.dcatrightsholdername !=null &&table.dataset.dcat.dcatrightsholdername !='' &&
					typeof table.dataset.dcat.dcatnomeorg !=  'undefined' && table.dataset.dcat.dcatnomeorg !=null &&table.dataset.dcat.dcatnomeorg !='' &&
					typeof table.dataset.dcat.dcatemailorg !=  'undefined' && table.dataset.dcat.dcatemailorg !=null &&table.dataset.dcat.dcatemailorg !='';
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

	//$scope.creationError = null;
	$scope.saveError = null;
	$scope.saveErrors = null;

//
//	$scope.selectedIcon;
//	$scope.onIconSelect = function($files) {
//		$scope.selectedIcon = $files[0];
//		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
//			$scope.choosenIconSize = $scope.selectedIcon.size; 
//			$scope.updateWarning = true;
//			$scope.selectedIcon = null;
//		}
//		else
//			readIconPreview();
//	};
//
//	var readIconPreview = function(){
//		readFilePreview.readImageFile($scope.selectedIcon).then(
//				function(contents){
//					console.log("contents" , contents);
//					$scope.defaultMetadata.info.icon = contents;
//				}, 
//				function(error){
//					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
//					Helpers.util.scrollTo();
//				}
//		);
//	};
//
//	
//	$scope.checkColumnName = function(fieldName, columnIndex){
//		$scope.insertColumnErrors = [];
//		$scope.columnsDatasetError.hasError = false;
//		var checkNameDuplicate = false;
//		if($scope.previewColumns!=null){
//			for (var int = 0; int < $scope.previewColumns.length; int++) {
//				if(int != columnIndex && !$scope.previewColumns[int].skipColumn &&  typeof $scope.previewColumns[int].fieldName!='undefined' && 
//						 typeof fieldName!='undefined' && $scope.previewColumns[int].fieldName.toUpperCase() == fieldName.toUpperCase()){
//					checkNameDuplicate = true;
//				}
//			}
//		}
//		if(checkNameDuplicate){
//			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
//			$scope.columnsDatasetError.hasError = true;
//		}
//		if(fieldName == ""){
//			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
//		$scope.columnsDatasetError.hasError = true;
//		}
//	};
	


	
	
	
	$scope.cancel = function(){
		$location.path('management/datasets/'+$scope.tenantCode);
	};

	$scope.tables = [];
	
	
	$scope.goToStart  = function(){ 
		$scope.importConfig = {};

		$scope.defaultMetadata= {"info":{
			"visibility":"private",
			"tenantssharing":{"tenantsharing": new Array()},
			"tags": new Array()}
		}; 

		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.defaultMetadata.requestername=$scope.user.firstname;
			$scope.defaultMetadata.requestersurname=$scope.user.lastname;
			$scope.defaultMetadata.requestermail=$scope.user.email;
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
		$scope.alert.admin_response = {};
		var oneSelected = false;
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			if($scope.tables[tableIndex].importTable){
				oneSelected = true;
				break;
			}
		}
		if(!oneSelected){
			$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_TABLES_ZERO_SELECTED_WARNING'};
		}
		else
			$scope.currentStep = 'requestor';refreshWizardToolbar();
	};
	
	$scope.goToMetadata  = function(){ $scope.currentStep = 'metadata';refreshWizardToolbar();};
	$scope.goToDatabase  = function(){ $scope.currentStep = 'database';refreshWizardToolbar();};
	
	var isNewField = function(field, newFields){
		var res = false;
		for (var newIndex = 0; newIndex < newFields.length; newIndex++) {
			if(field.sourcecolumnname == newFields[newIndex].sourcecolumnname){
				res = true;
				break;
			}
		}
		
		return res;
	};
	

	
	$scope.loadTables = function(){
		$scope.alert.admin_response = {};
		if($scope.importConfig.dbType == "" || $scope.importConfig.dbType == null)
			$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_DBTYPE_NULL_WARNING'};
		
		if($scope.importConfig.sourceType == "database"){
			if($scope.importConfig.dbType!='HIVE' && 
			    ($scope.importConfig.jdbcHostname == null || $scope.importConfig.jdbcHostname == "" ||
				 $scope.importConfig.jdbcDbname == null || $scope.importConfig.jdbcDbname == ""  ||
				 $scope.importConfig.jdbcUsername == null || $scope.importConfig.jdbcUsername == "" ||
				 $scope.importConfig.jdbcPassword == null || $scope.importConfig.jdbcPassword == "")){
				$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_JDBC_PARAMS_WARNING'};
			}

		}
		else if($scope.importConfig.sourceType == "database"){
			if($scope.importConfig.sqlSourcefile==null){
				$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_NULL_WARNING'};
			}
		}
		
		$scope.importConfig.organizationCode = info.getActiveTenant().organization.organizationcode;
		$scope.importConfig.tenantCode = info.getActiveTenant().tenantcode;

		if(typeof $scope.alert.admin_response.message!='undefined')
			return;
		$scope.isLoadingDB = true;
		
		adminAPIservice.importMetadata(info.getActiveTenant(),$scope.importConfig).success(function(response, status, headers, config) {
			console.log("importDatabase", response);
			$scope.isLoadingDB = false;

			$scope.tables = response;
			$scope.selectTablesFlag = true;
			for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
				if(typeof $scope.tables[tableIndex].warnings != 'undefined' && $scope.tables[tableIndex].warnings!=null && $scope.tables[tableIndex].warnings.length>0)
					$scope.tables[tableIndex].importTable = false;	
				else
					$scope.tables[tableIndex].importTable = true;
				$scope.tables[tableIndex].index = tableIndex;
				$scope.tables[tableIndex].customized = {"name":false,"domain":false,"visibility":false, "dcat":false, "columns":false};
				var completeDatasource =  angular.copy($scope.tables[tableIndex].dataset);
				$scope.tables[tableIndex].dataset = {};
				$scope.tables[tableIndex].dataset =  Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_DATASET,completeDatasource);

				if($scope.tables[tableIndex].status == 'new'){
					for (var columnIndex = 0; columnIndex < $scope.tables[tableIndex].dataset.components.length; columnIndex++) {
						$scope.tables[tableIndex].dataset.components[columnIndex].isNewField = true;
					}
				}
				else if($scope.tables[tableIndex].status == 'existing'){
					
					if(typeof $scope.tables[tableIndex].newFields != 'undefined' &&  $scope.tables[tableIndex].newFields.length>0 && 
							$scope.tables[tableIndex].dataset.components && $scope.tables[tableIndex].dataset.components.length>0){
						for (var columnIndex = 0; columnIndex < $scope.tables[tableIndex].dataset.components.length; columnIndex++) {
							if(isNewField($scope.tables[tableIndex].dataset.components[columnIndex], $scope.tables[tableIndex].newFields)){
								$scope.tables[tableIndex].dataset.components[columnIndex].isNewField = true;
								$scope.tables[tableIndex].dataset.components[columnIndex].skipColumn = true;
							}
							
						}
					}
				}
			}

			$scope.goToTables();

		}).error(function(response, status) {
			console.error("importDatabase error", response);
			$scope.isLoadingDB = false;
			$scope.alert.admin_response.type = 'danger';
			$scope.alert.admin_response.message = 'MANAGEMENT_IMPORT_DATABASE_ERROR_CONNECTION';
			

		});
			
	//if($scope.importConfig.sourceType == 'script'){
		/*
		$scope.upload = $upload.upload({
			url: Constants.Constants.API_ADMIN_DATASET_URL+  $scope.tenantCode, 
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
//							$scope.tables[tableIndex].dataset.info.fields.sourcecolumn = columnIndex;
//						}
//					}
				//$scope.tables[tableIndex].columnsTooltip = createColumnsTooltip($scope.tables[tableIndex].dataset.info.fields);
				
			}

			$scope.goToTables();

		}).error(function(response) {
			console.error("importDatabase error", response);
			$scope.isLoadingDB = false;
			$scope.warningMessages.push("MANAGEMENT_IMPORT_DATABASE_ERROR_CONNECTION");

		});*/
		
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
//				$scope.tables[tableIndex].dataset = angular.copy($scope.defaultMetadata);
				for (var infoProp in $scope.defaultMetadata) {
					
				    if ($scope.defaultMetadata.hasOwnProperty(infoProp) && infoProp != 'datasetname' && infoProp != 'description' && infoProp != 'components'  && infoProp != 'dcat' && infoProp != 'license'
				    	&& infoProp != 'openData'&& infoProp != 'sharingTenants' && infoProp != 'tags') {
				    	$scope.tables[tableIndex].dataset[infoProp] = $scope.defaultMetadata[infoProp];
				    }
				    $scope.tables[tableIndex].dataset.dcat = angular.copy($scope.defaultMetadata.dcat);
				    $scope.tables[tableIndex].dataset.license = angular.copy($scope.defaultMetadata.license);
				    $scope.tables[tableIndex].dataset.openData = angular.copy($scope.defaultMetadata.openData);
				    $scope.tables[tableIndex].dataset.sharingTenants = angular.copy($scope.defaultMetadata.sharingTenants);
				    $scope.tables[tableIndex].dataset.tags = angular.copy($scope.defaultMetadata.tags);

//				    if($scope.defaultMetadata.info.tenantssharing.tenantsharing.length>0){
//				    	$scope.tables[tableIndex].dataset.info.tenantssharing = {};
//				    	$scope.tables[tableIndex].dataset.info.tenantssharing.tenantsharing = $scope.defaultMetadata.info.tenantssharing.tenantsharing.slice();
//				    }
				}
				
//				$scope.tables[tableIndex].dataset.info.tags =  $scope.defaultMetadata.info.tags.slice();
				
//				if(typeof  $scope.defaultMetadata.opendata != 'undefined'){
//					$scope.tables[tableIndex].dataset.opendata = {};
//					for (var opendataProp in $scope.defaultMetadata.opendata) {
//					    if ($scope.defaultMetadata.opendata.hasOwnProperty(opendataProp)) {
//					    	$scope.tables[tableIndex].dataset.opendata[opendataProp] = $scope.defaultMetadata.opendata[opendataProp];
//					    }
//					}
//				}
//				
//				for (var metadataProp in $scope.defaultMetadata  ) {
//				    if ($scope.defaultMetadata.hasOwnProperty(metadataProp) && metadataProp != 'info' && metadataProp != 'opendata') {
//				    	$scope.tables[tableIndex].dataset[metadataProp] = $scope.defaultMetadata[metadataProp];
//				    }
//				}
				
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

//	$scope.checkVCard = function(){
//		var VCARD_PREFIX = 'BEGIN:VCARD \n VERSION:2.1';
//		var VCARD_SUFFIX = 'END:VCARD';
//		var VCARD_N = 'N:';
//		var VCARD_FN = 'FN:';
//		var VCARD_TEL = 'TEL;WORK:';
//		var VCARD_EMAIL = 'EMAIL:';
//		var VCARD_URL = 'URL:';
//		//if (($scope.defaultMetadata.dcat.vcard == null) || ($scope.defaultMetadata.dcat.vcard == '')){
//			$scope.defaultMetadata.dcat.vcard = VCARD_PREFIX + 
//										 VCARD_N + ((($scope.defaultMetadata.dcat.nomeOrg != '') && ($scope.defaultMetadata.dcat.nomeOrg != null)) ? $scope.defaultMetadata.dcat.nomeOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
//										 VCARD_FN + ((($scope.defaultMetadata.dcat.nomeOrg != '') && ($scope.defaultMetadata.dcat.nomeOrg != null)) ? $scope.defaultMetadata.dcat.nomeOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
//										 VCARD_TEL + ((($scope.defaultMetadata.dcat.telOrg != '') && ($scope.defaultMetadata.dcat.telOrg != null)) ? $scope.defaultMetadata.dcat.telOrg.replace(" ",";") : '+39.011.3168111') + 
//										 VCARD_EMAIL + ((($scope.defaultMetadata.dcat.emailOrg != '') && ($scope.defaultMetadata.dcat.emailOrg != null)) ? $scope.defaultMetadata.dcat.emailOrg.replace(" ",";") : 'info@csi.it') + 
//										 VCARD_URL + ((($scope.defaultMetadata.dcat.urlOrg != '') && ($scope.defaultMetadata.dcat.urlOrg != null)) ? $scope.defaultMetadata.dcat.urlOrg.replace(" ",";") : 'CSI;PIEMONTE') + 
//										 VCARD_SUFFIX;
//		//}
//	};
	
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
			if(typeof dataset.components != 'undefined' && dataset.components.length>0){
				for(var componentIndex = dataset.components.length -1; componentIndex >= 0 ; componentIndex--){
		    	    if(dataset.components[componentIndex].skipColumn){
		    	        dataset.components.splice(componentIndex, 1);
		    	    }
				}
			}
			
			$scope.dbImport.currentDatasetName = dataset.datasetname;

			if(dataset.opendata && !(dataset.opendata.opendataupdatedate || dataset.opendata.opendataexternalreference || 
					dataset.opendata.lastupdate || dataset.opendata.opendataauthor || dataset.opendata.opendatalanguage))
				delete dataset['openData'];
		
			if(dataset.license && dataset.license.description==null && dataset.license.licesecode==null)
				delete dataset['license'];

			if(dataset.visibility == 'public')
				delete dataset['sharingTenants'];
			if(dataset.visibility != 'private')
				delete dataset['copyright'];
			else
				delete dataset['license'];
			
			console.log("crate - dataset", dataset);
			$scope.admin_response = {};

//			dataset.configData.tenantCode = $scope.tenantCode;
//			dataset.configData.type = "dataset";
//			dataset.configData.subtype= "bulkDataset";
			
//			if(typeof dataset.opendata != 'undefined' && dataset.opendata!=null && dataset.opendata.dataUpdateDate!=null)
//				dataset.opendata.dataUpdateDate = new Date(dataset.opendata.dataUpdateDate).getTime();
	
			

			
			if(dataset.importStatus == 'new'){
		
				adminAPIservice.createDataset(info.getActiveTenant(), dataset).success(function(response) {
					console.log("createDataset SUCCESS", response);
					$scope.dbImport.totalOk++;
					$scope.dbImport.totalCreate++;
					$scope.dbImport.datasetCreated.push({"datasetcode": response.datasetcode,"iddataset": response.iddataset});
					if($scope.dbImport.datasetList.length==0){
						console.log("finish!");
						$scope.dbImport.status = "finish";
						$scope.dbImport.currentDatasetName ="";
					}
					else{
						console.log("continue");
						if($scope.dbImport.status=="running")
							createDataset(datasetList);
					}
				}).error(function(response){
					console.error("createDataset ERROR: ", response);
					if(response && response.errorName)
						$scope.dbImport.currentError= response.errorName;
					else if(response && response.errorCode)
						$scope.dbImport.currentError= response.errorCode;

					
					//$scope.dbImport.currentError=err;
					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
					$scope.dbImport.status="pause";
					$scope.dbImport.totalKo++;
				});
				
				
				
				
//				$scope.upload = $upload.upload({
//					url: Constants.API_MANAGEMENT_DATASET_LIST_URL + $scope.tenantCode + '/', 
//					method: 'POST',
//					data: {dataset: dataset, formatType: "jdbc"}
//				}).progress(function(evt) {
//					console.log('evt',evt, parseInt(100.0 * evt.loaded / evt.total));
//				}).success(function(data, status, headers, config) {
//					console.log("data loaded", data);
//					if(data.errors && data.errors.length>0){
//						for (var errorIndex = 0; errorIndex < data.errors.length; errorIndex++) {
//							$scope.dbImport.currentError += data.errors[errorIndex].message +"<br>";
//						}
//						$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
//						$scope.dbImport.status="pause";
//						$scope.dbImport.totalKo++;
//					}
//					else{
//						$scope.dbImport.totalOk++;
//						$scope.dbImport.totalCreate++;
//						$scope.dbImport.datasetCreated.push(data.metadata.datasetCode);
//						if($scope.dbImport.datasetList.length==0){
//							console.log("fine!");
//							$scope.dbImport.status = "finish";
//							$scope.dbImport.currentDatasetName ="";
//						}
//						else{
//							console.log("ancora");
//							if($scope.dbImport.status=="running")
//								createDataset(datasetList);
//						}
//					}
//				}).error(function(err, status, headers, config) {
//					$scope.dbImport.currentError=err;
//					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
//					$scope.dbImport.status="pause";
//					$scope.dbImport.totalKo++;
//			        console.log(err);
//				});
			
			}
			else{

				adminAPIservice.updateDataset(info.getActiveTenant(), dataset).success(function(response) {
					console.log("updateDataset SUCCESS", response);
					$scope.dbImport.totalOk++;
					$scope.dbImport.totalUpdate++;
					$scope.dbImport.datasetUpdated.push({"datasetcode": response.datasetcode,"iddataset": response.iddataset});
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

				}).error(function(response){
					console.error("updateDataset ERROR", response);
					console.error("createDataset ERROR: ", response);
					if(response && response.errorName)
						$scope.dbImport.currentError= response.errorName;
					else if(response && response.errorCode)
						$scope.dbImport.currentError= response.errorCode;

					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
					$scope.dbImport.status="pause";
					$scope.dbImport.totalKo++;
				});
				
				
				
//				var promise   = fabricAPImanagement.updateDataset($scope.tenantCode, dataset.datasetCode, dataset);
//		
//				promise.then(function(result) {
//					console.log("data loaded", result);
//					if(result.data.errors && result.data.errors.length>0){
//						for (var errorIndex = 0; errorIndex < result.data.errors.length; errorIndex++) {
//							$scope.dbImport.currentError += result.data.errors[errorIndex].message +"<br>";
//						}
//						$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
//						$scope.dbImport.status="pause";
//						$scope.dbImport.totalKo++;
//					}
//					else{
//						$scope.dbImport.totalOk++;
//						$scope.dbImport.totalUpdate++;
//						$scope.dbImport.datasetUpdated.push(result.data.metadata.datasetCode);
//						if($scope.dbImport.datasetList.length==0){
//							console.log("fine!");
//							$scope.dbImport.status = "finish";
//							$scope.dbImport.currentDatasetName ="";
//						}
//						else{
//							console.log("ancora");
//							if($scope.dbImport.status=="running")
//								createDataset(datasetList);
//						}
//					}			
//			
//				}, function(result) {
//					$scope.dbImport.currentError=err;
//					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
//					$scope.dbImport.status="pause";
//					$scope.dbImport.totalKo++;
//				}, function(result) {
//					console.log('Got notification: ' + result);
//				});
	
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
	columns  = $scope.tables[selectedTableIndex].dataset.components;
	$scope.columnsTable = "No column found";
	if(columns && columns.length>0){
		
		var columnsTable = "<div><table class='table table-supercondensed import-database-customize-table-columns text-left	'><thead><tr><th>Column</th><th>Name</th><th>Type</th><th>Alias</th><th>Keys</th><tr></thead><tbody>";
		for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
			var newBadge = "";
			if(columns[columnIndex].isNewField)
				newBadge="<span class='import-database-column-new' title='"+$translate.instant('MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS_HINT')+"'>"+$translate.instant('MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS')+"</span>&nbsp;&nbsp;";
			columnsTable += "<tr class='import-database-column-row'><td>" +newBadge + columns[columnIndex].sourcecolumnname + "</td><td>" + columns[columnIndex].name + "</td><td>" + columns[columnIndex].datatypecode + "</td><td>" + columns[columnIndex].alias + "</td><td>";
			if(columns[columnIndex].iskey == 1){
				columnsTable += "<i class='fa fa-key primary-key'  title='Primary key'></i> &nbsp;&nbsp;";
				if(typeof columns[columnIndex].foreignkey != 'undefined' && columns[columnIndex].foreignkey != null && columns[columnIndex].foreignkey != "null")
					columnsTable += columns[columnIndex].foreignkey;
			}
			else if(typeof columns[columnIndex].foreignkey != 'undefined' && columns[columnIndex].foreignkey != null && columns[columnIndex].foreignkey != "null"){
				columnsTable += "<i class='fa fa-key foreign-key' title='Foreign key'></i> &nbsp;&nbsp;"+columns[columnIndex].foreignkey;
			}
			else
				columnsTable += "&nbsp;";
			columnsTable += "</td></tr>";
		}
		columnsTable += "</tbody></table></div>";
		$scope.columnsTable = columnsTable;
	}
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementDatasetImportDatabaseEditDatasetNameCtrl', [ '$scope', '$modalInstance',  'selectedTableIndex',
                                                                                  function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	$scope.datasetname = $scope.tables[selectedTableIndex].dataset.datasetname;
	$scope.description = $scope.tables[selectedTableIndex].dataset.description;
	//$scope.externalReference = $scope.tables[selectedTableIndex].dataset.info.externalReference;
	
	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.name = true;
		
		$scope.tables[selectedTableIndex].dataset.datasetName = $scope.datasetname;
		$scope.tables[selectedTableIndex].dataset.description= $scope.description;
		//$scope.tables[selectedTableIndex].dataset.info.externalReference = $scope.externalReference;
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
	
	$scope.dataset = angular.copy($scope.tables[selectedTableIndex].dataset);

//	console.log("qui prima prima", $scope.tables[selectedTableIndex].dataset.info);
//	console.log("qui prima prima i", $scope.info);
	
//	$scope.info = {"dataDomain":$scope.tables[selectedTableIndex].dataset.info.dataDomain,
//		"codSubDomain":$scope.tables[selectedTableIndex].dataset.info.codSubDomain,
//		"tags":$scope.tables[selectedTableIndex].dataset.info.tags.slice(),
//		"visibility":$scope.tables[selectedTableIndex].dataset.info.visibility,
//		"license":$scope.tables[selectedTableIndex].dataset.info.license,
//		"disclaimer":$scope.tables[selectedTableIndex].dataset.info.disclaimer,
//		"copyright":$scope.tables[selectedTableIndex].dataset.info.copyright,
//		"unpublished":$scope.tables[selectedTableIndex].dataset.info.unpublished
//	};
//	
//	$scope.canCreatePublicDataset = function(){
//		return info.getActiveShareInformationType() == "public" &&  !$scope.info.unpublished;
//	}; 

	


//
//	if($scope.tables[selectedTableIndex].dataset.info.tenantssharing && $scope.tables[selectedTableIndex].dataset.info.tenantssharing!=null)
//		$scope.info.tenantsharing = $scope.tables[selectedTableIndex].dataset.info.tenantssharing.tenantsharing;
//	else
//		$scope.info.tenantsharing = new Array();
//
//	if($scope.tables[selectedTableIndex].dataset.opendata && $scope.tables[selectedTableIndex].dataset.opendata!=null){
//		$scope.opendata = {};
//		for (var opendataProp in $scope.tables[selectedTableIndex].dataset.opendata) {
//		    if ($scope.tables[selectedTableIndex].dataset.opendata.hasOwnProperty(opendataProp)) {
//		    	$scope.opendata[opendataProp] = $scope.tables[selectedTableIndex].dataset.opendata[opendataProp];
//		    }
//		}
//	}
//
//	$scope.useDomainMulti  = function(useDomainMultiFlag){
//		if(useDomainMultiFlag){
//			$scope.info.dataDomain = 'MULTI';
//			$scope.info.visibility = 'private';
//		}
//		else{
//			$scope.info.dataDomain = null;
//		}
//		$scope.info.codSubDomain = null;
//	};

	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.publishStore = true;
		
		$scope.tables[selectedTableIndex].dataset.copyright = $scope.dataset.copyright;
		$scope.tables[selectedTableIndex].dataset.disclaimer = $scope.dataset.disclaimer;
		$scope.tables[selectedTableIndex].dataset.externalreference = $scope.dataset.externalreference;
		$scope.tables[selectedTableIndex].dataset.idSubdomain = $scope.dataset.idSubdomain;
		$scope.tables[selectedTableIndex].dataset.multiSubdomain = $scope.dataset.multiSubdomain;
		$scope.tables[selectedTableIndex].dataset.unpublished = $scope.dataset.unpublished;
		$scope.tables[selectedTableIndex].dataset.visibility = $scope.dataset.visibility;
		
		$scope.tables[selectedTableIndex].license = angular.copy($scope.dataset.license);

		$scope.tables[selectedTableIndex].openData = angular.copy($scope.dataset.openData);

		$scope.tables[selectedTableIndex].sharingTenants = angular.copy($scope.dataset.sharingTenants);

		$scope.tables[selectedTableIndex].license = angular.copy($scope.dataset.license);

		$scope.tables[selectedTableIndex].tags = angular.copy($scope.dataset.tags);

		
//		
//		$scope.tables[selectedTableIndex].dataset.info.unpublished = $scope.info.unpublished;
//		$scope.tables[selectedTableIndex].dataset.info.dataDomain = $scope.info.dataDomain; 
//		$scope.tables[selectedTableIndex].dataset.info.codSubDomain = $scope.info.codSubDomain; 
//		$scope.tables[selectedTableIndex].dataset.info.tags = $scope.info.tags.slice(); 
//		
//		$scope.tables[selectedTableIndex].dataset.info.visibility = $scope.info.visibility; 
//		if($scope.info.tenantsharing && $scope.info.tenantsharing!=null && $scope.info.tenantsharing.length>0){
//			if(typeof $scope.tables[selectedTableIndex].dataset.info.tenantssharing == 'undefined')
//				$scope.tables[selectedTableIndex].dataset.info.tenantssharing = {};
//			$scope.tables[selectedTableIndex].dataset.info.tenantssharing.tenantsharing = $scope.info.tenantsharing.slice(); 
//		}
//		
//		if($scope.info.opendata && $scope.info.opendata!=null){
//			$scope.tables[selectedTableIndex].dataset.opendata = {};
//			for (var opendataProp in $scope.info.opendata) {
//			    if ($scope.info.opendata.hasOwnProperty(opendataProp)) {
//			    	$scope.tables[selectedTableIndex].dataset.opendata[opendataProp] = $scope.info.opendata[opendataProp];
//			    }
//			}
//		}
//		
//		$scope.tables[selectedTableIndex].dataset.info.license = $scope.info.license; 
//		$scope.tables[selectedTableIndex].dataset.info.disclaimer = $scope.info.disclaimer; 
//		$scope.tables[selectedTableIndex].dataset.info.copyright = $scope.info.copyright;
//		if($scope.tables[selectedTableIndex].dataset.info.visibility=='private'){
//			$scope.tables[selectedTableIndex].dataset.info.license = "";
//			$scope.tables[selectedTableIndex].dataset.info.disclaimer = "";	
//		}
//		else if($scope.tables[selectedTableIndex].dataset.info.visibility=='public'){
//			$scope.tables[selectedTableIndex].dataset.info.copyright = "";
//		}


		
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
	

//	$scope.onTagSelectInDialog = function($item, $model, $label){
//		console.log("onTagSelect",$item, $model, $label);
//		if($item.tagCode!=null)
//			$scope.addTagInDialog($item.tagCode);
//		
//	};
//	
//	$scope.showChooseTagTableInDialog = function(){
//		var chooseTagDialog = $modal.open({
//	      templateUrl: 'tagChooerDialog.html',
//	      controller: 'ManagementDatasetChooseTagControllerCtrl',
//	      size: 'lg',
//	      scope: $scope,
//	      resolve: {
//	    	  tagList: function () {return $scope.tagList;},
//	      	}
//    	});
//		
//		chooseTagDialog.result.then(function (selectedTag) {
//			$scope.addTagInDialog(selectedTag.tagCode);
//	    }, function () {
//	      $log.info('Modal dismissed at: ' + new Date());
//	    });
//	};
//
//	$scope.newTag = {value:""};
//	$scope.addTagInDialog = function(newTag){
//		console.log("addTag", newTag);
//		if(newTag){
//			if(! $scope.info.tags)
//				$scope.info.tags = [];
//
//			var found = false;	
//			for (var int = 0; int < $scope.info.tags.length; int++) {
//				var existingTag = $scope.info.tags[int];
//				if(existingTag.tagCode == newTag){
//					found = true;
//					break;
//				}
//
//			}
//			if(!found)
//				$scope.info.tags.push({"tagCode":newTag});
//		}
//		$scope.newTag.value = "";
//		return false;
//
//	};
//
//
//	$scope.removeTagInDialog = function(index){
//		$scope.info.tags.splice(index,1);
//		return false;
//	};
//	
//	
//	
//	$scope.addTenantSharingInDialog = function(newTenantSharing){
//		console.log("addTenantSharing ",newTenantSharing);
//		if(newTenantSharing){
//			var found = false;	
//			
//			for (var int = 0; int < $scope.info.tenantsharing.length; int++) {
//				var existingTenantSharing = $scope.info.tenantsharing[int];
//				console.log("existing",existingTenantSharing);
//				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
//					console.log("found");
//					found = true;
//					break;
//				}
//
//			}
//			if(!found){
//				$scope.info.tenantsharing.push(
//							{"idTenant":newTenantSharing.idTenant, 
//								"tenantName": newTenantSharing.name, 
//								"tenantDescription": newTenantSharing.description, 
//								"tenantCode": newTenantSharing.tenantcode, 
//								"isOwner": 0
//							});
//				console.log("added", $scope.info.tenantsharing );
//			}
//		}
//
//		return false;
//	};
//
//	$scope.removeTenantSharingInDialog = function(index, tenantsharing){
//		$scope.info.tenantsharing.splice(index,1);
//		return false;
//	};
//	
//	$scope.onTenantSharingSelectInDialog = function($item, $model, $label){
//		console.log("onTenantSharingSelect",$item, $model, $label);
//		$scope.addTenantSharingInDialog($item);
//		
//	};
//
//	
//	$scope.showChooseTenantTableInDialog = function(){
//		var chooseTenantDialog = $modal.open({
//	      templateUrl: 'tenantChooerDialog.html',
//	      controller: 'ManagementDatasetChooseTenantControllerCtrl',
//	      size: 'lg',
//	      scope: $scope,
//	      resolve: {
//	    	  tenantsList: function () {return $scope.tenantsList;},
//	      	}
//    	});
//		
//		chooseTenantDialog.result.then(function (selectedTenant) {
//			$scope.addTenantSharingInDialog(selectedTenant);
//	    }, function () {
//	      $log.info('Modal dismissed at: ' + new Date());
//	    });
//	};
	
}]);



appControllers.controller('ManagementDatasetImportDatabaseEditDCatCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
                                                                                    function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
		
	$scope.dataset = angular.copy($scope.tables[selectedTableIndex].dataset);

	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.dcat = true;
		$scope.tables[selectedTableIndex].dataset.dcat = angular.copy($scope.dataset.dcat);
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};


	
	
}]);


appControllers.controller('ManagementDatasetImportDatabaseEditColumnsCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
                                                                           function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	$scope.dataset = angular.copy($scope.tables[selectedTableIndex].dataset);

	$scope.preview= {components:new Array(),"type":"importDatabase"};
	$scope.datasetReady = false;
	
	
	for (var cIndex = 0; cIndex < $scope.dataset.components.length; cIndex++) {
		$scope.preview.components.push($scope.dataset.components[cIndex]);
	}
	$scope.datasetReady = true;

//
//	
//	$scope.previewColumns = $scope.table.dataset.info.fields.slice(); 
//	for (var previewColumnIndex = 0; previewColumnIndex < $scope.previewColumns.length; previewColumnIndex++) {
//		$scope.previewColumns[previewColumnIndex].isKey = $scope.previewColumns[previewColumnIndex].isKey==1?true:false;
//	}
//	
//	var fields = [];
//	
//	$scope.columnsDatasetError = {"hasError": false};
//
//	$scope.checkColumnName = function(fieldName, columnIndex){
//		$scope.insertColumnErrors = [];
//		$scope.columnsDatasetError.hasError = false;
//		var checkNameDuplicate = false;
//		if($scope.previewColumns!=null){	
//			for (var int = 0; int < $scope.previewColumns.length; int++) {
//				if(int != columnIndex && !$scope.previewColumns[int].skipColumn &&  typeof $scope.previewColumns[int].fieldName!='undefined' && 
//						 typeof fieldName!='undefined' && $scope.previewColumns[int].fieldName.toUpperCase() == fieldName.toUpperCase()){
//					checkNameDuplicate = true;
//				}
//			}
//		}
//		if(checkNameDuplicate){
//			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
//			$scope.columnsDatasetError.hasError = true;
//		}
//		if(fieldName == ""){
//			$scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
//		$scope.columnsDatasetError.hasError = true;
//		}
//	};
//	
//	$scope.onDropColumnComplete=function(fromIndex, toIndex,evt){
//		var columToMove = $scope.previewColumns[fromIndex];
//		columToMove.dragging = false;
//		$scope.previewColumns.splice(fromIndex, 1);
//		$scope.previewColumns.splice(toIndex, 0, columToMove);
//		$scope.refreshColumnOrder();
//	};
//
//	$scope.onDragColumnComplete=function (fromIndex,evt){
//		console.log("onDragColumnComplete",fromIndex,evt);
//	};
//	
//	
//	$scope.refreshColumnOrder = function(){
//		console.log("refreshColumnOrder");
//		if($scope.previewColumns && $scope.previewColumns.length>0){
//			var order = 0;
//			fields = [];
//			for (var int = 0; int < $scope.previewColumns.length; int++) {
//				var column  = $scope.previewColumns[int];
//				column.index = int;
//				//column.sourcecolumn = order;
//				var dataType = column.dataType?column.dataType:'string';
//				var measureUnit = column.measureUnit?column.measureUnit.measureUnit:null;
//				fields.push(
//						{"sourcecolumn":column.sourcecolumn, 
//							"fieldName":column.fieldName, 
//							"alias":column.alias, 
//							"dataType":dataType, 
//							"isKey":column.isKey?1:0, 
//							"measureUnit":measureUnit,
//							"dateTimeFormat":column.dateTimeFormat,
//							"sourcecolumnname":column.sourcecolumnname,
//							"order":order,
//							"skipColumn": column.skipColumn,
//							"isNewField": column.isNewField}
//				);
//				if(!column.skipColumn){
//					order++;
//				}
//
//			}
//			$scope.checkColumnName();
//		}
//	};
//
//	$scope.isDateTimeField = function(field){
//		if(field && field.dataType && field.dataType && field.dataType == "dateTime")
//			return true;
//		return false;
//	};
//	
//	$scope.isCoordinatesField = function(field){
//		if(field && field.dataType && field.dataType && field.dataType == "coordinates")
//			return true;
//		return false;
//	};
//	
//	$scope.isCommonField = function(field){
//		return !$scope.isCoordinatesField(field) && !$scope.isDateTimeField(field);
//	};
//
//	
	
	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.columns = true;
		$scope.tables[selectedTableIndex].dataset.components = angular.copy($scope.dataset.components);

//		$scope.refreshColumnOrder();
//		$scope.tables[selectedTableIndex].dataset.info.fields =fields.slice(); 
		$modalInstance.close();
	};
	
	$scope.cancel = function () {
//		for(var columnIndex = 0; columnIndex < $scope.tables[selectedTableIndex].dataset.info.fields.length; columnIndex++) 
//			$scope.tables[selectedTableIndex].dataset.info.fields[columnIndex].isKey = $scope.tables[selectedTableIndex].dataset.info.fields[columnIndex].isKey?1:0;
		$modalInstance.dismiss('cancel');
	};
	
//	$scope.refreshColumnOrder();
//	$scope.htmlTooltip = Constants.HELP_HINT_DATE_FORMAT_TABLE;
		
	
	}]);



//
//appControllers.controller('ManagementDatasetChooseTagControllerCtrl', [ '$scope', '$modalInstance', 'tagList',
//                                                                        function($scope, $modalInstance, tagList) {
//	
//	$scope.tagMap = {};
//	var firstLetter = null;
//	for (var i = 0; i < tagList.length; i++) {
//		if(firstLetter != tagList[i].tagLabel.substring(0,1)){
//			firstLetter = tagList[i].tagLabel.substring(0,1);
//			$scope.tagMap[firstLetter] = new Array();
//		}
//		$scope.tagMap[firstLetter].push(tagList[i]);
//	}
//	
//	
//	$scope.chooseTag = function(choosenTag){
//		console.log("chooseTag",choosenTag);
//		$modalInstance.close(choosenTag);
//	};
//	
//	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
//}]);


//appControllers.controller('ManagementDatasetChooseTenantControllerCtrl', [ '$scope', '$modalInstance', 'tenantsList',
//                                                                        function($scope, $modalInstance, tenantsList) {
//	console.log("ManagementDatasetChooseTenantControllerCtrl",tenantsList);
//	
//	$scope.tenantsList = tenantsList;
////	$scope.tenantMap = {};
////	var firstLetter = null;
////	for (var i = 0; i < tenantsList.length; i++) {
////		if(tenantsList[i]!=null && typeof tenantsList[i].tenantName != 'undefined' && tenantsList[i].tenantName!=null)
////		if(firstLetter != tenantsList[i].tenantName.substring(0,1)){
////			firstLetter = tenantsList[i].tenantName.substring(0,1);
////			$scope.tenantMap[firstLetter] = new Array();
////		}
////		$scope.tenantMap[firstLetter].push(tenantsList[i]);
////	}
//	
//	
//
//	$scope.chooseTenant = function(choosenTenant){
//		console.log("choosenTenant",choosenTenant);
//		$modalInstance.close(choosenTenant);
//	};
//	
//	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
//}]);