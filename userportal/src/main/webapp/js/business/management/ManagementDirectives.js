'use strict';

/* Directives */

/* new dataset */

appDirectives.directive('newDatasetWizardStart', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-start.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-requestor.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardMetadata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-metadata.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardChoosetype', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-choose-type.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardUpload', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-upload.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardColumns', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-columns.html?'+BuildInfo.timestamp,
	};
});

/* stream */
appDirectives.directive('newStreamWizardRegister', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-register.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-requestor.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-detail.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardComponents', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-components.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardTweetdata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-tweetdata.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardShare', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-share.html?'+BuildInfo.timestamp,
	};
});

/* virtual entity */
appDirectives.directive('newVirtualentityWizardRegister', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-register.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newVirtualentityWizardPosition', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-position.html?'+BuildInfo.timestamp,
	};
});
appDirectives.directive('newVirtualentityWizardDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-detail.html?'+BuildInfo.timestamp,
	};
});

/* import database */

appDirectives.directive('importDatabaseWizardStart', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-start.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardDatabase', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-database.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardTables', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-tables.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-requestor.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardMetadata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-metadata.html?'+BuildInfo.timestamp,
	};
});


appDirectives.directive('importDatabaseWizardCustomize', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-customize.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardFinish', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-finish.html?'+BuildInfo.timestamp,
	};
});

app.directive('datasourceIntro', function() {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/datasourceIntro.html?'+BuildInfo.timestamp
	};
});


app.directive('datasourceMainInfo', function(adminAPIservice) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', datasourceDomain: '@', datasourceSubdomain: '@', isNewDatasource: '@'},
	    templateUrl : 'partials/management/forms/mainInfo.html?'+BuildInfo.timestamp,
	    link: function(scope, elem, attrs, formCtrl) {
	    	console.info("datasourceMainInfo.link", scope.datasource);

	    	
	    	
	    	//scope.domainList = scope.$parent.domainList;
	    	//scope.subdomainList = scope.$parent.subdomainList;
	    	scope.validationPatternSubdomain = Constants.VALIDATION_PATTERN_NO_SPACE;
	    	
//	    	scope.checkSubdomain = function(input){
//	    		console.log("checkSubdomain", input);
//	    		if(typeof input != 'undefined' && input!=null && input!="")
//	    			return scope.validationPatternSubdomain.test(input);
//	    		return true;
//	    	};
	    		
	    	scope.useDomainMulti  = function(useDomainMultiFlag){
	    		console.log("useDomainMulti", useDomainMultiFlag);
	    		if(useDomainMultiFlag){
	    			scope.selectedDomain = 'MULTI';
	    			scope.datasource.visibility = 'private';
	    		}
	    		else
	    			scope.selectedDomain = null;
	    		
	    		scope.datasource.visibility = null;
	    	};
	    	
	    	
	    	scope.domainList = [];
	    	var loadDomais = function(){
		    	adminAPIservice.loadDomains().success(function(response) {
		    		console.debug("loadDomains", response);
		    		response.sort(function(a, b) { 
		    		    return ((a.langit < b.langit) ? -1 : ((a.langit > b.langit) ? 1 : 0));
		    		});
		    		for (var int = 0; int < response.length; int++) {
		    			scope.domainList.push(response[int].domaincode);
		    		}
		    	});
	    	};
	    	
	    	if(scope.isNewDatasource)
	    		loadDomais();
	    		
	    	scope.subdomainList = [];
	    	scope.selectSubdomain = function(domain){
	    		scope.subdomainList = [];
	    		adminAPIservice.loadSubDomains(domain).success(function(response) {
	    			response.sort(function(a, b) { 
	    			    return ((a.langit < b.langit) ? -1 : ((a.langit > b.langit) ? 1 : 0));
	    			});
	    			for (var int = 0; int < response.length; int++) {
	    				scope.subdomainList.push(response[int]);
	    			}
	    		});
	    	};
	    	

	    	
	    }
	};
});

app.directive('datasourceTermConditions', function() {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/termConditions.html?'+BuildInfo.timestamp
	};
});

app.directive('datasourceDetailInfo', function($modal, readFilePreview, adminAPIservice, $translate) {
	return {
	    restrict: 'E',
	    scope: {datasource: '='},
	    templateUrl : 'partials/management/forms/detailInfo.html?'+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	
	    	console.debug("datasourceMainInfo.link", scope.datasource);
	    	scope.DEFAULT_DATASET_ICON = Constants.DEFAULT_DATASET_ICON;
	    	scope.DEFAULT_STREAM_ICON = Constants.DEFAULT_STREAM_ICON;

	    	
	    	// tag
	    	scope.tagList = [];
	    	scope.tagMap = [];
	    	var loadTags = function(){
	    		adminAPIservice.loadTags().success(function(response) {
	    			console.debug("loadTags", response);
	    			for (var int = 0; int < response.length; int++) {
	    				var tagLabel = $translate.use()=='it'?response[int].langit:response[int].langen;
	    				scope.tagList.push({"idTag": response[int].idTag, "tagCode":response[int].tagcode, "tagLabel":tagLabel} );
	    				scope.tagMap[response[int].idTag]={"idTag": response[int].idTag, "tagCode":response[int].tagcode, "tagLabel":tagLabel} ;

	    			}
	    			
	    			scope.tagList.sort(function(a, b) { 
	    			    return ((a.tagLabel < b.tagLabel) ? -1 : ((a.tagLabel > b.tagLabel) ? 1 : 0));
	    			});
	    			
	    		});
	    	};
	    	
	    	if(scope.tagList.length==0)
	    		loadTags();
	    	//scope.tagMap = scope.$parent.tagMap;
	    	//scope.tagList = scope.$parent.tagList;
	    	
	    	scope.showChooseTagTable = function(){
	    		var chooseTagDialog = $modal.open({
	    		  templateUrl: 'tagChooerDialog.html',
	    	      controller: 'ManagementChooseTagCtrl',
	    	      size: 'lg',
	    	      scope: scope,
	    	      resolve: {
	    	    	  tagList: function () {return scope.tagList;},
	    	      	}
	        	});
	    		
	    		chooseTagDialog.result.then(function (selectedTag) {
	    			//scope.$broadcast ('addTag', selectedTag);
	    			addTag(selectedTag);
	    	    }, function () {});
	    	};
	    	
	    	scope.$on('addTag', function(e, selectedTag) {  
	 	       console.log("addTag child", e, selectedTag);  
	 	       addTag(selectedTag);
	 	    });
	 		
		 	scope.newTag = {};
		 	var addTag = function(newTag){
		 		console.log("addTag ", newTag);
		 		if(newTag){
		 			var found = false;	
		 			for (var int = 0; int < scope.datasource.tags.length; int++) {
		 				var existingTag = scope.datasource.tags[int];
		 				if(existingTag == newTag.idTag){
		 					found = true;
		 					break;
		 				}
	
		 			}
		 			if(!found)
		 				scope.datasource.tags.push(newTag.idTag);
		 			scope.newTag.value = null;
		 		}
		 		return false;
		 	};
		 	
		 	scope.onTagSelect = function($item, $model, $label){
		 		console.log("onTagSelect",$item, $model, $label);
		 		if($item.tagCode!=null)
		 			addTag($item);
		 	};
	
		 	scope.removeTag = function(index){
		 		scope.datasource.tags.splice(index,1);
		 		return false;
		 	};
		 	
		 	
		 	// icon
			scope.selectedIcon;
			scope.onIconSelect = function($files) {
				scope.selectedIcon = $files[0];
				if(scope.selectedIcon !=null && scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
					scope.choosenIconSize = scope.selectedIcon.size; 
					scope.updateWarning = true;
					scope.selectedIcon = null;
				}
				else{
					readFilePreview.readImageFile(scope.selectedIcon).then(
						function(contents){
							console.log("contents" , contents);
							scope.datasource.icon = contents;
						}, 
						function(error){
							scope.uploadDatasetError = {error_message: error, error_detail: ""};
							Helpers.util.scrollTo();
						}
					);					
				}
			};

	    }
	};
});

app.directive('datasourceLegalInfo', function() {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/legalInfo.html?'+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.debug("datasourceLegalInfo.link", scope.datasource);
	    	
	    	scope.selectedLicenseType = "OTHER";
	    	if(scope.datasource.license && scope.datasource.license.idLicense == Constants.LICENSE_CC0_ID)
		    	scope.selectedLicenseType = "CC0";
	    	else if(scope.datasource.license && scope.datasource.license.idLicense == Constants.LICENSE_CCBY_ID)
		    	scope.selectedLicenseType = "CCBY";

	    	// {"idLicense":42,"licensecode":"CC-BY 3.0","description":"CC-BY 3.0"}
	    	scope.selectLicense = function(value){
	    		console.log("selectLicense", value);
	    		if(scope.selectedLicenseType == "CC0")
	    			scope.datasource.license = {"idLicense":Constants.LICENSE_CC0_ID};
	    		else if(scope.selectedLicenseType == "CCBY")
	    			scope.datasource.license = {"idLicense":Constants.LICENSE_CCBY_ID};
	    		else
	    			scope.datasource.license = {};
	    	};
	    }
	    
	};
});

app.directive('datasourceSharing', function($modal, info, adminAPIservice) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/sharing.html?'+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.debug("datasourceSharing.link", scope.datasource);
	    	scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;
	    	//scope.tenantsList = scope.$parent.tenantsList;
	    	
	    	scope.tenantsList = [];
	    	var loadTenants = function(){
	    		adminAPIservice.loadTenants().success(function(response) {
	    			console.debug("loadTenants", response);
	    			try{
	    				scope.tenantsList = [];
	    				for (var int = 0; int <  response.length; int++) {
	    					var t = response[int];
	    					if(t.tenantcode!=scope.tenant)
	    						scope.tenantsList.push(t);
	    				}
	    				
	    				scope.tenantsList.sort(function(a, b) { 
	    				    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
	    				});
	    	
	    			}
	    			catch (e) {
	    				log.error("loadTenants ERROR",e);
	    			}
	    			
	    		}).error(function(response) {
	    			console.error("loadTenants error", response);
	    		});
	    	};
	    	
	    	if(scope.tenantsList.length==0)
	    		loadTenants();
	    	
	    	
	    	scope.canCreatePublicDataset = function(){
	    		return info.getActiveShareInformationType() == "public" && scope.datasource && scope.datasource.unpublished!=1;
	    	}; 

	    	scope.canShareDataset = function(){
	    		return info.getActiveShareInformationType() == "public";
	    	}; 
	    	
	    	// Opendata
	    	scope.formatOpendataUpdateDate = function(dataUpdateDate){
	    		if(typeof dataUpdateDate != 'undefined' && dataUpdateDate != null){
		    		var date =  new Date(dataUpdateDate);	
					var year = (date.getFullYear()).toString();
					var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
					var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
					if(typeof scope.datasource.opendata == 'undefined')
						scope.datasource.opendata =  {};
					scope.datasource.opendata.opendataupdatedate= year+month+day;	
	    		}
	    	};


	    	
	    	// tenant sharing
	    	scope.showChooseTenantTable = function(){
	    		var chooseTenantDialog = $modal.open({
	    	      templateUrl: 'tenantChooerDialog.html',
	    	      controller: 'ManagementChooseTenantCtrl',
	    	      size: 'lg',
	    	      scope: scope,
	    	      resolve: {
	    	    	  tenantsList: function () {return scope.tenantsList;},
	    	      	}
	        	});
	    		
	    		chooseTenantDialog.result.then(function (selectedTenant) {
	    			scope.$broadcast ('addTenant', selectedTenant);
	    	    }, function () {});
	    		
	    	};
	    	
	    	scope.$on('addTenant', function(e, selectedTenant) {  
			       console.log("addTenant child", e, selectedTenant);  
			       addTenantSharing(selectedTenant);
			 });
			
			scope.newTenantSharing = {};
			scope.onTenantSharingSelect = function($item, $model, $label){
				console.log("onTenantSharingSelect",$item, $model, $label);
				addTenantSharing($item);
				scope.newTenantSharing.value = null;
			};


			
			var addTenantSharing = function(newTenantSharing){
				console.log("addTenantSharing ",newTenantSharing);
				if(newTenantSharing){
					var found = false;	
					if(typeof scope.datasource.sharingTenants == 'undefined' || scope.datasource.sharingTenants == null){
						scope.datasource.sharingTenants = [];
					}
					
					for (var int = 0; int < scope.datasource.sharingTenants.length; int++) {
						var existingTenantSharing = scope.datasource.sharingTenants[int];
						console.log("existing",existingTenantSharing);
						if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
							console.log("found");
							found = true;
							break;
						}

					}
					if(!found){
						scope.datasource.sharingTenants.push({idTenant:newTenantSharing.idTenant, name: newTenantSharing.name});
						console.log("added",scope.datasource.sharingTenants);
					}
				}

				return false;
			};

			scope.removeTenantSharing = function(index){
				scope.datasource.sharingTenants.splice(index,1);
				return false;
			};
	    	
	    }

	};
});

app.directive('datasourceDcat', function() {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/dcat.html?'+BuildInfo.timestamp
	};
});


app.directive('uploadDataCsv', function(readFilePreview) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', csvInfo : '=', preview : '='},
	    templateUrl : 'partials/management/forms/uploadDataCsv.html?'+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.debug("uploadDataCsv.link", scope.datasource);
	    	scope.formatList = ["csv"];

	    	scope.choosenFileSize = null;
	    	scope.maxFileSize = Constants.BULK_DATASET_MAX_FILE_SIZE;

	    	scope.readPreview = function(csvSeparator){
	    		scope.uploadDatasetError = null;
	    		readFilePreview.readTextFile(scope.csvInfo.selectedFile, 10000, scope.fileEncoding).then(
	    				function(contents){
	    					var lines = contents.split(/\r\n|\n/);
	    					console.log("nr righe", lines.length);
	    					//console.log(lines);
	    					var firstRows = lines.slice(0, 5);
	    					scope.previewLines = [];
	    					console.log("(firstRows.join",firstRows.join("\n"));
	    					console.log("CSVtoArrayAll",Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator));

	    					scope.previewLines = Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator);
	    					console.log("scope.previewLines",scope.previewLines);

	    					scope.datasource.components = [];
	    					scope.preview.columns=new Array();
	    					if(scope.previewLines.length>0){
	    						for (var int = 0; int < scope.previewLines[0].length; int++) {
	    							scope.preview.components.push(
	    									{index: int, 
	    										sourcecolumn: int+1, 
	    										name: scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
	    										alias: scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'),
	    										dataType: {idDataType: Constants.COMPONENT_DEFAULT_DATA_TYPE},
	    										idDataType: Constants.COMPONENT_DEFAULT_DATA_TYPE,
	    										iskey: false, 
	    										idMeasureUnit: null,
	    										skipColumn: false});
	    						}
	    					}
	    					scope.$parent.$parent.$broadcast('csvPreviewReady', {});
	    					console.log("scope.preview.components",scope.preview.components);
	    				}, 
	    				function(error){
	    					scope.uploadDatasetError = {error_message: error, error_detail: ""};
	    					Helpers.util.scrollTo();
	    				}
	    		);
	    	};
	    	
	    	scope.onFileSelect = function($files) {
	    		scope.updateWarning = null;
	    		scope.csvInfo.selectedFile = $files[0];
	    		console.log("onFileSelect", scope.csvInfo.selectedFile );
	    		if(scope.csvInfo.selectedFile !=null && scope.csvInfo.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
	    			scope.choosenFileSize = scope.csvInfo.selectedFile.size; 
	    			scope.updateWarning = true;
	    			scope.csvInfo.selectedFile = null;
	    			scope.previewLines = null;
	    		}
	    		else
	    			scope.readPreview(scope.csvInfo.separator);
	    	};

	    	scope.refreshPreview  =function(){
	    		scope.readPreview(scope.csvInfo.separator);
	    	};
	    	
	    	
	    }

	};
});

app.directive('datasourceComponents', function(adminAPIservice) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', preview : '=', isNewDatasource: '@', isImportDatasource: '@'},
	    templateUrl : 'partials/management/forms/components.html?'+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.debug("datasourceComponents.link", scope.datasource, scope.preview);
	    	
	    	//scope.dataTypeList = scope.$parent.dataTypeList;
	    	//scope.measureUnitsList = scope.$parent.measureUnitsList;
	    	scope.measureUnitsList = [];
	    	adminAPIservice.loadMeasureUnits().success(function(response) {
	    		console.debug("loadMeasureUnits",response);
	    		scope.measureUnitsList = response;
	    	});

	    	
	    	scope.dataTypeList = [];
	    	adminAPIservice.loadDataTypes().success(function(response) {
	    		console.debug("loadDataTypes",response);
	    		scope.dataTypeList = response;
	    	});
	    	
	    	
	    	
	    	scope.refreshColumnOrder = function(){
	    		console.log("refreshColumnOrder", scope.preview);
	    		if(scope.preview && scope.preview.components && scope.preview.components.length>0){
	    			var order = 0;
	    			scope.datasource.components = [];
	    			for (var int = 0; int < scope.preview.components.length; int++) {
	    				var column  = scope.preview.components[int];
	    				column.index = int;
	    				column.inorder = int;
	    				if(!column.skipColumn){
	    					//column.sourcecolumn = order;
	    					var idDataType = column.dataType?column.dataType.idDataType:Constants.COMPONENT_DEFAULT_DATA_TYPE;
	    					var idMeasureUnit = column.measureUnit?column.measureUnit.idMeasureUnit:null;
	    					scope.datasource.components.push(
	    							{"sourcecolumn":column.sourcecolumn, 
	    								"name":column.name, 
	    								"alias":column.alias, 
	    								"dataType":column.dataType, 
	    								"idDataType":idDataType, 
	    								"iskey":column.iskey?1:0, 
	    								"measureUnit": column.measureUnit,
	    								"idMeasureUnit":idMeasureUnit,
	    								"inorder":column.inorder,
	    								"foreignkey":column.foreignkey,
	    								"idComponent":column.idComponent,
	    								"idPhenomenon":column.idPhenomenon,
	    								"required":column.required,
	    								"sourcecolumn":column.sourcecolumn,
	    								"sourcecolumnname":column.sourcecolumnname,
	    								"tolerance":column.tolerance
	    							}
	    					);
	    					order++;
	    					scope.checkColumnName(column.name,column.index);
	    				}
	    			}
	    		}
	    	};
	    	
	    	scope.$watch('preview', function() {
		    	scope.refreshColumnOrder();
	    	});
	    	
			scope.$on('csvPreviewReady', function (event, params) {
			  console.log("csvPreviewReady");
		    	scope.refreshColumnOrder();
			});
	    	
	    	scope.columnsDatasetError = {"hasError": false};
	    	
	    	scope.checkColumnName = function(componentName, columnIndex){
	    		scope.insertColumnErrors = [];
	    		scope.columnsDatasetError.hasError = false;
	    		var checkNameDuplicate = false;
	    		if(scope.preview.components!=null){
	    			for (var int = 0; int < scope.preview.components.length; int++) {
	    				if(int != columnIndex && !scope.preview.components[int].skipColumn &&  typeof scope.preview.components[int].name!='undefined' && 
	    						 typeof componentName!='undefined' && scope.preview.components[int].name.toUpperCase() == componentName.toUpperCase()){
	    					checkNameDuplicate = true;
	    				}
	    			}
	    		}
	    		if(checkNameDuplicate){
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
	    			scope.columnsDatasetError.hasError = true;
	    		}
	    		console.log("componentName", componentName);
	    		if(typeof componentName=='undefined' || componentName == ""){
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
	    			scope.columnsDatasetError.hasError = true;
	    		}
	    		else if(componentName.match(Constants.VALIDATION_PATTERN_ALPHANUMERIC)==null){
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_ERROR');
	    			scope.columnsDatasetError.hasError = true;
	    		}
	    	};
	    	
	    	scope.columnsDatasetHasError = function(){
	    		return scope.columnsDatasetError.hasError; 
	    	};
	    	
	    	scope.newComponent = {sourcecolumn: scope.preview.components.length+1};
	    	scope.addComponent = function(){
	    		console.log("addComponent",scope.newComponent);
	    		//scope.newComponent.sourcecolumn = scope.preview.components.length+1;
	    		scope.insertColumnErrors = [];

	    		scope.checkColumnName(scope.newComponent.name, -1);
	    		
	    		if(scope.newComponent.sourcecolumn==null || scope.newComponent.sourcecolumn=="" || isNaN(scope.newComponent.sourcecolumn))
	    			scope.insertColumnErrors .push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN');

	    		var checkSourceColumnDuplicate = false;
	    		for (var int = 0; int < scope.preview.components.length; int++) {
	    			if(scope.preview.components[int].sourcecolumn == scope.newComponent.sourcecolumn){
	    				checkSourceColumnDuplicate = true;
	    			}
	    		}
	    		
	    		if(typeof scope.newComponent.measureUnit != 'undefined' && scope.newComponent.measureUnit != null){
	    			scope.newComponent.measureUnit = scope.newComponent.measureUnit;
	    			//delete scope.newComponent.measureUnit;
	    		}
	    		else{
	    			scope.newComponent.measureUnit = null;
	    		} 

	    		if(typeof scope.newComponent.dataType != 'undefined' && scope.newComponent.dataType != null){
	    			scope.newComponent.idDataType = scope.newComponent.dataType.idDataType;
	    			//delete scope.newComponent.dataType;
	    		}
	    		else{
	    			scope.newComponent.dataType = Constants.COMPONENT_DATA_TYPE_STRING;
	    		}
	    		
	    		if(checkSourceColumnDuplicate)
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE');
	    		
	    		if(scope.insertColumnErrors.length == 0){
	    			if(!scope.newComponent.alias || scope.newComponent.alias == null || scope.newComponent.alias == ""){
	    				scope.newComponent.alias = scope.newComponent.name;
	    			}
	    			

	    			scope.preview.components.push(scope.newComponent);
	    			scope.newComponent = {sourcecolumn: scope.preview.components.length+1};
	    			//scope.refreshColumnOrder();
	    		}
	    	};
	    	
	    			
	    	scope.removeComponent = function(index){
	    		scope.preview.components.splice(index,1);
	    		//scope.refreshColumnOrder();
	    	};
	    	
	    	
	    	scope.onDropColumnComplete=function(fromIndex, toIndex,evt){
	    		var columToMove = scope.preview.components[fromIndex];
	    		columToMove.dragging = false;
	    		scope.preview.components.splice(fromIndex, 1);
	    		scope.preview.components.splice(toIndex, 0, columToMove);
	    		scope.refreshColumnOrder();
	    	};

	    	scope.isDateTimeComponent = function(component){
	    		if(component && component.dataType && component.dataType.datatypecode && component.dataType.datatypecode == "dateTime")
	    			return true;
	    		return false;
	    	};
	    	
	    	scope.isCoordinatesComponent = function(component){
	    		if(component && component.dataType && component.dataType.datatypecode && (component.dataType.datatypecode == "longitude" || component.dataType.datatypecode == "latitude"))
	    			return true;
	    		return false;
	    	};
	    	
	    	scope.isCommonComponent = function(component){
	    		return !scope.isCoordinatesComponent(component) && !scope.isDateTimeComponent(component);
	    	};

	    }
	    
	};
});


