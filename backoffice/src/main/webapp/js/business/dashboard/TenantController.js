appControllers.controller('TenantCtrl', ['$scope', "$route", 'fabricAPIservice', 'adminAPIservice', 'fabricBuildService', '$translate','$modal', '$location', '$timeout','$window',
                                          function($scope, $route, fabricAPIservice, adminAPIservice, fabricBuildService, $translate, $modal, $location, $timeout,$window) {
	$scope.tenantsList = [];
	$scope.filteredTenantsList = [];
	$scope.ecosystemList = [];
	$scope.nameFilter = null;
	$scope.codeFilter = null;
	$scope.statusFilter = 'installation requested';
	$scope.actions = Constants.TENANT_ACTIONS;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.tenantsList.length;
	$scope.predicate = '';
	$scope.showLoading = true;
	
	$scope.errors = [];
	$scope.warnings = [];
	$scope.infos = [];
	
	//$scope.actions = Constants.STREAM_ACTIONS;
	
	var env = Helpers.util.getEnvirorment($location.host());
	if(env == "" )
		env = 'prod';
	
	/******
	 * LOAD TENANTS
	 ******/
	var loadTenants = function(){
		$scope.tenantsList = [];
		
		//20171023 - Modificata chiamata a nuovo metodo loadTenants per nuove API
		//fabricAPIservice.getTenants().success(function(response) {
		
		adminAPIservice.loadTenants().success(function(response) {
			$scope.showLoading = false;
			console.info("loadTenants - response",response);				
			for (var i = 0; i < response.length; i++) {				
				var row = initRow(response[i]);
				row.rowIndex = i;
				$scope.tenantsList.push(row);					
			}			
			$scope.totalItems = $scope.tenantsList.length;
		});
	}
	
	loadTenants();
	
	/******
	 * LOAD ECOSISTEMS
	 ******/
	var loadEcosistems = function(){
		$scope.ecosystemList = [];
		fabricAPIservice.getEcosystems().success(function(response) {
			$scope.showLoading = false;
			console.debug("loadEcosistems - response",response);
	
			var responseList = Helpers.util.initArrayZeroOneElements(response.ecosystems.ecosystem);
			for (var i = 0; i < responseList.length; i++) {
				$scope.ecosystemList.push(responseList[i]);					
			}
			
		});
	}
	
	loadEcosistems();
	
	/******
	 * LOAD ORGANIZATIONS
	 ******/
	//20171025 - Modifiche per nuove API
	var organizationMap =  {};
	var loadOrganizations = function(){
		$scope.organizationList = [];
		//fabricAPIservice.getOrganizations().success(function(response) {
		adminAPIservice.loadOrganizations().success(function(response) {		
			$scope.showLoading = false;
			console.debug("loadOrganizations - response",response);
	
			//var responseList = Helpers.util.initArrayZeroOneElements(response.oranizations.oranization);
			
			for (var i = 0; i < response.length; i++) {
				$scope.organizationList.push(response[i]);					
				organizationMap[response[i].idOrganization]= response[i];					
			}
			
			$scope.organizationList.sort(function(a, b) {
			    return a.organizationcode.localeCompare(b.organizationcode);
			});
			
		});
	}
	
	loadOrganizations();	
	
	 /******
	 * LOAD TENANT TYPE
	 ******/
	var tenantTypeMap =  {};
	var loadTenantTypes = function(){
		$scope.tenantTypeList = [];
		adminAPIservice.loadTenantTypes().success(function(response) {		
			$scope.showLoading = false;
			console.debug("loadTenantTypes - response",response);
			
			for (var i = 0; i < response.length; i++) {
				$scope.tenantTypeList.push(response[i]);					
				tenantTypeMap[response[i].idTenantType]= response[i];					
			}
					
		});
	}	
	loadTenantTypes();
	
	var initRow = function(tenantIn){
		var row = {};
		row.tenant = tenantIn;		
		//20171024 - NUuove API
		//row.statusIcon = Helpers.tenant.statusIcon(row.tenant);
		//row.codDeploymentStatusTranslated =  $translate.instant(row.tenant.codDeploymentStatus);
		row.statusIcon = Helpers.tenant.statusIcon(row.tenant.tenantStatus.tenantstatuscode);
		//row.codDeploymentStatusTranslated =  $translate.instant(row.tenant.tenantStatus.description);
		row.isSelected = false;
		row.isUpdating = false;
		row.updated = false;
		
		if(!row.tenant.tenantStatus.tenantstatuscode || row.tenant.tenantStatus.tenantstatuscode==null)
			row.tenant.tenantStatus.tenantstatuscode = "draft";
		
		if(row.tenant.tenantStatus.tenantstatuscode=='req_inst'){
			row.action = 'install';
		}
		else if(row.tenant.tenantStatus.tenantstatuscode=='inst'){
			row.action = 'migrate';
		}
		else if(row.tenant.tenantStatus.tenantstatuscode=='req_uninst'){
			row.action = 'delete';
		}

		row.startStep = 0;
		row.endStep = null;
			
		return row;
	}
	
	function stepStyle(step){
		var style = "status_waiting";
		if(step.skipped=='true')
			style =  "status_skipped";
		else if(step.status && step.status!=null)
			style = "status_"+step.status.replace(" ", "_");
	//	else 
	//		style = "status_waiting;
		return style;
	}

	$scope.searchNameFilter = function(row) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || keyword.test(row.tenant.name);
	};

	$scope.$watch('nameFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredTenantsList.length;
	});
	
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(row.tenant.tenantcode);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredTenantsList.length;
	});

	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(row.tenant.tenantStatus.description) || keyword.test(row.tenant.tenantStatus.tenantstatuscode);
	};

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredTenantsList.length;
	});

	
	
	$scope.updateSelection = function($event, rowIndex) {
		$scope.tenantsList[rowIndex].updated = false;
	};	
	
	$scope.clearSelection = function(){
		if($scope.tenantsList && $scope.tenantsList!=null){
			for (var i = 0; i < $scope.tenantsList.length; i++) {
				$scope.tenantsList[i].isSelected=false;
			}
		}
		
	}
	
	var getPageOfRow = function(row){
		var page = 1;
		for (var k = 0; k < $scope.filteredTenantsList.length; k++) {
			if(row.rowIndex == $scope.filteredTenantsList[k].rowIndex){
				page=Math.trunc(page/pageSize)+1;
				break; 
			}
		}
		return page;
	}
	
	$scope.selectAll = function($event){
		console.log("selectAll", $event)
		$scope.clearSelection();
		var checkbox = $event.target;
		console.log("checkbox.checked", checkbox.checked)

		if(checkbox.checked){
			console.log("checkbox.checked in", checkbox.checked)

			if($scope.filteredTenants && $scope.filteredTenants!=null){
				

				for (var i = 0; i < $scope.filteredTenants.length; i++) {
					console.log("$scope.filteredTenants[i].isSelected", $scope.filteredTenants[i].isSelected)

					$scope.filteredTenants[i].isSelected=true;
				}
			}
		}
	}
	
	/*********
	 *EXEC ACTION
	 **********/
	$scope.execActions = function(){
		console.log("execActions");
		$scope.errors = [];
		$scope.warnings = [];
		$scope.infos = [];
		
		var atLeastOneSelected = false;
		if($scope.tenantsList && $scope.tenantsList!=null){
			for (var i = 0; i < $scope.tenantsList.length; i++) {
				if($scope.tenantsList[i].isSelected && !$scope.tenantsList[i].isUpdating){
					console.log("stream",$scope.tenantsList[i].stream);
					console.log("action",$scope.tenantsList[i].action);
					console.log("startStep",$scope.tenantsList[i].startStep);
					console.log("endStep",$scope.tenantsList[i].endStep);
					atLeastOneSelected = true;
					var errorOnStep = false;
					if($scope.tenantsList[i].startStep<0)
						errorOnStep = true;
					if($scope.tenantsList[i].endStep!=null){
						if($scope.tenantsList[i].endStep<0)
							errorOnStep = true;
						if($scope.tenantsList[i].endStep<=$scope.tenantsList[i].startStep)
							errorOnStep = true;
					}
					
					if(errorOnStep)
						$scope.tenantsList[i].errorValidation = "DASHBOARD_STREAM_STEP_VALIDATION_ERROR";
					else{
						$scope.tenantsList[i].errorValidation = null;
						execAction(i);
					}

				}
			}
		}
		if(!atLeastOneSelected)
			$scope.warnings.push('DASHBOARD_WARNING_NO_STREAM');

	}
	
	/*********
	 *EXEC ACTION
	 **********/
	var execAction = function(rowIndex){
		$scope.tenantsList[rowIndex].actionIconClass='fa fa-rocket';
		$scope.tenantsList[rowIndex].actionFeedback='Started';
		$scope.tenantsList[rowIndex].isUpdating = true;

		var operation = $scope.tenantsList[rowIndex].action;
		var tenant = $scope.tenantsList[rowIndex].tenant;
		var startStep = $scope.tenantsList[rowIndex].startStep;
		var endStep = $scope.tenantsList[rowIndex].endStep;
	
		var actionParams = {};
		actionParams.action = operation;
		actionParams.startStep = startStep;
		actionParams.endStep = endStep;
		
		console.log("actionParams",actionParams,"tenantcode",tenant.tenantcode );
		adminAPIservice.execAction(actionParams,tenant.tenantcode).success(function(response) {
			console.log("response",response);
		});
		
		$scope.tenantsList[rowIndex].stepsLogUrl = createStepsLogUrl(operation, tenant);
		chekStepsLog(rowIndex, $scope.tenantsList[rowIndex].stepsLogUrl);
	};
	
	
	var someOneIsUpdating = false;

	var chekStepsLog = function(rowIndex, stepsLogUrl) {
		
		 var checkStepTimeout =  $timeout(function() {
    		var step_width = null;
    		var totalStep = null;
    		if(!someOneIsUpdating || $scope.streamsList[rowIndex].actionFeedback=='Running'){
		    	fabricBuildService.getLogs(stepsLogUrl).success(function(response) {
		        	if(response!=null){
			    			$scope.tenantsList[rowIndex].actionIconClass='fa fa-bolt  blink-img';
			    			$scope.tenantsList[rowIndex].actionFeedback='Running';
		
		        			var lines = response.split('\n');
		        			if(lines!=null && lines.length>0){
		        				
		        				for(var line = 0; line < lines.length; line++){
		        					console.log("line |"  +lines[line] +"|");
		        					if(lines[line] && lines[line]!=null && lines[line]!="" && lines[line].length > 2){
			    						var step = JSON.parse(lines[line]);
			    						
			    						if(step_width == null && step.stepTotal!=null){
			    							step_width = "width:" + ((100-step.stepTotal)/step.stepTotal) + "%";
			    							totalStep = step.stepTotal;
			    						}
			    						if($scope.tenantsList[rowIndex].feedback && $scope.tenantsList[rowIndex].feedback!=null &&
			    							$scope.tenantsList[rowIndex].feedback.lastStep && $scope.tenantsList[rowIndex].feedback.lastStep!=null){
			    							console.log("last", $scope.tenantsList[rowIndex].feedback.lastStep);
			    							console.log("current", step.stepNum);
			    							if($scope.tenantsList[rowIndex].feedback.lastStep.stepNum>step.stepNum){
			    								$scope.tenantsList[rowIndex].feedback = null;
			    							}
			    							else if($scope.tenantsList[rowIndex].feedback.lastStep != step){
				    							console.log("change ", $scope.tenantsList[rowIndex]);
				    							$scope.currentPage = getPageOfRow($scope.tenantsList[rowIndex]);
				    						}
		
			    						}
			    						
			            				if($scope.tenantsList[rowIndex].feedback  == null){
			            					$scope.tenantsList[rowIndex].feedback = {}; 
			            					$scope.tenantsList[rowIndex].feedback.totalStep = step.stepTotal;
			            					$scope.tenantsList[rowIndex].feedback.steps = [];
			            					for (var j = 0; j < step.stepTotal; j++) {
			            						var num = j+1;
			            						var empty_step = {"stepNum": num, "status": "waiting", "style": "status_waiting", "width":step_width};
			            						$scope.tenantsList[rowIndex].feedback.steps.push(empty_step);
											}
			            				}
			    						step.width = step_width;
			    						step.style = stepStyle(step);
			    						
			    						$scope.tenantsList[rowIndex].feedback.steps[step.stepNum-1] = step;
		        					}
		    					}
		        				$scope.tenantsList[rowIndex].feedback.lastStep = $scope.tenantsList[rowIndex].feedback.steps[$scope.tenantsList[rowIndex].feedback.steps.length-1];
		        				
		        				if($scope.tenantsList[rowIndex].feedback.lastStep.stepNum==totalStep && (step.skipped=='true'|| (step.status && step.status!=null && step.status.lastIndexOf('end', 0) === 0))){
		        					$scope.tenantsList[rowIndex].feedback.finish = true;
		        					$scope.tenantsList[rowIndex].actionIconClass='fa fa-flag-checkered';
		        					$scope.tenantsList[rowIndex].actionFeedback='Finish';
		        					$scope.tenantsList[rowIndex].isUpdating = false;
		        					$scope.tenantsList[rowIndex].updated = true;
		        					$scope.tenantsList[rowIndex].isSelected=false;
		        					//refreshStream($scope.tenantsList[rowIndex]);
		        					
		        					someOneIsUpdating = false;
		        				    $timeout.cancel(checkStepTimeout);
		        				}        						
		        			}
		        		}
	        	});
    		}
        	if($scope.tenantsList[rowIndex].feedback==null || !$scope.tenantsList[rowIndex].feedback.finish || $scope.tenantsList[rowIndex].feedback.finish!=true)
        		chekStepsLog(rowIndex,stepsLogUrl);
        }, 1000);
    };     
    
    var refreshStream = function(row){
    	fabricAPIservice.getStream(row.stream.codiceTenant, row.stream.codiceVirtualEntity, row.stream.codiceStream).success(function(response) {
    		console.log("refreshStream - response",response.streams);
    		row.stream = response.streams.stream;
    	});
    }
    
   
    
   function createActionParams(operation, tenant, startStep, endStep ){
		var steps = startStep;
		if(endStep && endStep!=null)
			steps +=":"+endStep;
		//return operation + "|tenant|" + tenant.tenantcode + "|" + tenant.tenantcode + "|" + tenant.tenantPassword+ "|" + env + "-sdnet-esbin|" + steps; 
		return operation + "|tenant|" + tenant.tenantcode + "|" + tenant.tenantcode + "|" + tenant.tenantPassword+ "|" + steps; 
	}

	function createStepsLogUrl(operation, tenant){
		return "installer_" + operation + "_tenant_" +  tenant.tenantcode + ".json"; 
	}
	
    
	$scope.openLog = function (selectedRow) {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'streamInstalLog.html',
	      controller: 'TenantInstallLogCtrl',
	      size: 'lg',
	      resolve: {
	    	  row: function () {
	          return selectedRow;
	        }
	      }
	    });

	};
	
	//$scope.mailLinks = {};
	//$scope.mailLoading = {};
	$scope.tenantMail = {}

	
	$scope.prepareMail = function(selectedRow){
		var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: 'tenantMailPreview.html',
		      controller: 'TenantMailCtrl',
		      size: 'lg',
		      resolve: {
		    	  row: function () {
		          return selectedRow;
		        }
		      }
	    });
	};


	
	$scope.openNewTenant = function () {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'newTenant.html',
	      controller: 'NewTenantCtrl',
	      size: 'lg',
	      resolve: {
	    	  organizationList: function(){return $scope.organizationList;},
	    	  organizationMap: function(){return organizationMap},
	    	  tenantTypeList: function(){return $scope.tenantTypeList;},
	    	  tenantTypeMap: function(){return tenantTypeMap}   	  
	      }
	    });
	    
	    modalInstance.result.then(function (result) {
	    	if("ok" == result){
	    		$scope.infos.push("Tenant created");
	    		loadTenants();
	    	}
	      });

	};
	
} ]);




appControllers.controller('TenantInstallLogCtrl', [ '$scope', '$modalInstance', 'row' , 'fabricBuildService', function ($scope, $modalInstance, row, fabricBuildService) {
	$scope.extendedLog = null;
	$scope.extendedLogUrl = null;
	console.log("TenantInstallLogCtrl - row", row)
	$scope.streamName = row.tenant.codiceTenant;
	$scope.actions = Constants.TENANT_ACTIONS;
	$scope.error = null;
	// format log
	var formatLog = function(log){
	    var lines = log.split('\n');
	    var formattedLog = "";
	    if(lines!=null && lines.length>0){
	         for(var k = 0; k < lines.length; k++){
	            var lineSplit = lines[k].split(" - ");
	            if(lineSplit && lineSplit!=null && lineSplit.length>1) {
		            var date = "<span class='logDate'>"+lineSplit[0]+"</span>";
		            var level = "<span class='logLevel logLevel"+lineSplit[1]+"'>"+lineSplit[1]+"</span>";
		            var remainingLine = lineSplit.slice(2).join(" - ");
		            var content  = Helpers.render.safeTags(remainingLine);
		            content =  Helpers.render.removeImage(content);
		            content = Helpers.render.linkify(content);
		            content = Helpers.render.colorize(content);
		            formattedLog += "<p class='logLine'>"+date+level+content+"</p>"; 
	            }
	            else
	            	formattedLog += Helpers.render.safeTags(lines[k]);
	        }
	    }
	    return formattedLog
	    //$("#log").html(formattedLog)
	}
	
	$scope.showLog = function(action){
		$scope.showLoading = true;
		var urlParams = createActionLogUrl(row.tenant, action);
		$scope.extendedLogUrl = Constants.API_FABRIC_PROXY_URL + urlParams;
			
			
		$scope.extendedLog = null;
		$scope.error = null;
		fabricBuildService.getLogs(urlParams).success(function(response) {
			console.log("response",response);
			$scope.showLoading = false;
			$scope.error = null;
			$scope.extendedLog = formatLog(response);
		}).error(function(response) {
			console.log("response - error",response);
			$scope.showLoading = false;
			$scope.error = response;
			$scope.extendedLog = null;
		});
	};
	
	if(row.action!=null){
		$scope.logAction =row.action;
		$scope.showLog(row.action);
	}

	function createActionLogUrl(tenant, operation){
		return operation + "_tenant_" + tenant.tenantcode + ".log"; 
	}

	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);



appControllers.controller('TenantMailCtrl', [ '$scope', '$modalInstance', 'row' , 'fabricAPIservice', 'adminAPIservice', '$window', function ($scope, $modalInstance, row, fabricAPIservice, adminAPIservice, $window) {
	console.log("TenantMailCtrl - row", row)
	
	$scope.tenantMail = {};
	$scope.tenantMail.loading = true;
	adminAPIservice.loadTenantInstallationMail(row.tenant.tenantcode).success(function(response) {
		console.log("response",response);
		$scope.tenantMail.loading = false;
		$scope.tenantMail = response;

	
	
	}).error(function(response){
		$scope.tenantMail.loading = false;
		console.error("Mail error", response);
		$scope.tenantMail.error;
	});	
	
	$scope.sendMail = function(){
		var mailBody = $scope.tenantMail.testo.replace(/\n\r?/g, '%0D%0A');
		var mailtoLink  = "mailto:"+$scope.tenantMail.destinatario+"?&subject= "+$scope.tenantMail.soggetto+"&body="+mailBody;
		console.log("mailtoLink",mailtoLink);
		var mailer = $window.open(mailtoLink,'Mailer');
		$scope.close();
	}
	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
	};
}]);



//20171025 - Modifiche per puntamento a nuove API
appControllers.controller('NewTenantCtrl', [ '$scope', '$modalInstance', 'fabricAPIservice', 'adminAPIservice', '$filter',"$http", '$location', 'organizationList', 'organizationMap', 'tenantTypeList', 'tenantTypeMap',
                                           function ($scope, $modalInstance, fabricAPIservice, adminAPIservice,  $filter, $http, $location,  organizationList,organizationMap,tenantTypeList, tenantTypeMap) {
		
	$scope.warning = null;
	
	$scope.newTenant = {
			"usertypeauth":"admin",
			"idEcosystem": 1,};

	$scope.newTenant.dataphoenixtablename = "DATA";
	$scope.newTenant.measuresphoenixtablename = "MEASURES";
	$scope.newTenant.socialphoenixtablename = "SOCIAL";
	$scope.newTenant.mediaphoenixtablename = "MEDIA";
	
	$scope.organizationList = organizationList;
	$scope.tenantTypeList = tenantTypeList;
	
	$scope.tenantTypeChange = function(){
		
		console.log("tenantTypeChange", $scope.newTenant.tenantType.idTenantType);
		if($scope.newTenant.tenantType.tenanttypecode == "plus")
			$scope.newTenant.bundles.maxOdataResultperPage = 10000;
		else 
			$scope.newTenant.bundles.maxOdataResultperPage = 1000;
	};
	var env = Helpers.util.getEnvirorment($location.host());
	//var env = Helpers.util.getEnvirorment('int-userportal.smartdatanet.it');
	if(env!=null && env.length>0)
		env = env.replace("-", "_"); 
	else
		env = "";
	
	$scope.organizationCodeChange = function(){
		
		var organization_code = organizationMap[$scope.newTenant.idOrganization].organizationcode;
		
		$scope.newTenant.datasolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_data";
		$scope.newTenant.measuresolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_measures";
		$scope.newTenant.socialsolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_social";
		$scope.newTenant.mediasolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_media";

		$scope.newTenant.dataphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();
		$scope.newTenant.measuresphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();
		$scope.newTenant.socialphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();
		$scope.newTenant.mediaphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();


	};
		
	//20171025 - Modifiche per nuove API
	$scope.createNewTenant = function(){
		console.log("new tenant", $scope.newTenant);
		$scope.forms.newTenantForm.submitted = true;
		$scope.warning  = null;
		if(!$scope.forms.newTenantForm.$valid) {
			$scope.warning = "Missing required fields or invalid values";
			return;
		}
		else{
			
			/*	- ELIMINATO STATUS DA OGGETTO NEW TENANT
			$scope.newTenant.tenantStatus.tenantstatuscode = "draft";
			if(typeof $scope.newTenant.bundles.maxdatasetnum == 'undefined' || $scope.newTenant.bundles.maxdatasetnum == null || $scope.newTenant.bundles.maxdatasetnum == 0)
				$scope.newTenant.bundles.maxdatasetnum = -1;
			if(typeof $scope.newTenant.bundles.maxstreamsnum == 'undefined' || $scope.newTenant.bundles.maxstreamsnum == null || $scope.newTenant.bundles.maxstreamsnum == 0)
				$scope.newTenant.bundles.maxstreamsnum = -1;
			*/
			//Se ho la check collection a false non ho modificato i campi --> li elimino dall'oggetto tenant
			if(!$scope.checked) {
				delete $scope.newTenant.datasolrcollectionname;
				delete $scope.newTenant.measuresolrcollectionname;
				delete $scope.newTenant.socialsolrcollectionname;
				delete $scope.newTenant.mediasolrcollectionname;
			}	
			//Se ho la check schema a false non ho modificato i campi --> li elimino dall'oggetto tenant
			if(!$scope.checkedPh) {
				delete $scope.newTenant.dataphoenixschemaname;
				delete $scope.newTenant.measuresphoenixschemaname;
				delete $scope.newTenant.socialphoenixschemaname;
				delete $scope.newTenant.mediaphoenixschemaname;
			}	
			//Se ho la check table name a false non ho modificato i campi --> li elimino dall'oggetto tenant
			if(!$scope.checkedPhTable) {
				delete $scope.newTenant.dataphoenixtablename;
				delete $scope.newTenant.measuresphoenixtablename;
				delete $scope.newTenant.socialphoenixtablename;
				delete $scope.newTenant.mediaphoenixtablename;
			}	
			
			//Il campo tenantcode viene valorizzato come il name
			$scope.newTenant.tenantcode = $scope.newTenant.name;		

			var promise   = adminAPIservice.createTenant($scope.newTenant);
			promise.then(function(result) {
				console.log("result qui ", result);
				$scope.info = "Tenant created";
				$scope.newTenant = {};
				$modalInstance.close("ok");
			}, function(result) {
				console.error("createNewTenant - error", result);
				var error  = angular.fromJson(result.data);
		    	$scope.error = error.error_code + "<br><small>" + error.error_detail + "<br>" + error.error_message + "</small>";
		    	
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		}
	}
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
	};

} ]);





