appControllers.controller('TenantCtrl', ['$scope', "$route", 'fabricAPIservice', 'fabricBuildService', '$translate','$modal', '$location', '$timeout',
                                          function($scope, $route, fabricAPIservice, fabricBuildService, $translate, $modal, $location, $timeout) {
	$scope.tenantsList = [];
	$scope.filteredTenantsList = [];
	$scope.ecosystemList = [];
	$scope.nameFilter = null;
	$scope.codeFilter = null;
	$scope.statusFilter = 'Installazione in corso';
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
	
	var loadTenants = function(){
		$scope.tenantsList = [];
		fabricAPIservice.getTenants().success(function(response) {
			$scope.showLoading = false;
			console.log("response",response);
	
			var responseList = Helpers.util.initArrayZeroOneElements(response.tenants.tenant);
			for (var i = 0; i < responseList.length; i++) {
				
				var row = initRow(responseList[i]);
				row.rowIndex = i;
				$scope.tenantsList.push(row);					
			}
			
			$scope.totalItems = $scope.tenantsList.length;
		});
	}
	
	loadTenants();
	
	var loadEcosistems = function(){
		$scope.ecosystemList = [];
		fabricAPIservice.getEcosystems().success(function(response) {
			$scope.showLoading = false;
			console.log("response",response);
	
			var responseList = Helpers.util.initArrayZeroOneElements(response.ecosystems.ecosystem);
			for (var i = 0; i < responseList.length; i++) {
				$scope.ecosystemList.push(responseList[i]);					
			}
			
		});
	}
	
	loadEcosistems();
	
	var initRow = function(tenantIn){
		var row = {};
		row.tenant = tenantIn;
		row.statusIcon = Helpers.tenant.statusIcon(row.tenant);
		row.codDeploymentStatusTranslated =  $translate.instant(row.tenant.codDeploymentStatus);
		row.isSelected = false;
		row.isUpdating = false;
		row.updated = false;
		if(!row.tenant.codDeploymentStatus || row.tenant.codDeploymentStatus==null)
			row.tenant.codDeploymentStatus = "draft";
		
		if(row.tenant.codDeploymentStatus=='req_inst'){
			row.action = 'install';
		}
		else if(row.tenant.codDeploymentStatus=='inst'){
			row.action = 'migrate';
		}
		else if(row.tenant.codDeploymentStatus=='req_uninst'){
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
		return !$scope.nameFilter || keyword.test(row.tenant.tenantName);
	};

	$scope.$watch('nameFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredTenantsList.length;
	});
	
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(row.tenant.tenantCode);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredTenantsList.length;
	});

	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(row.tenant.codDeploymentStatus) || keyword.test(row.codDeploymentStatusTranslated);
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
	
	var execAction = function(rowIndex){
		$scope.tenantsList[rowIndex].actionIconClass='fa fa-rocket';
		$scope.tenantsList[rowIndex].actionFeedback='Started';
		$scope.tenantsList[rowIndex].isUpdating = true;

		var operation = $scope.tenantsList[rowIndex].action;
		var tenant = $scope.tenantsList[rowIndex].tenant;
		var startStep = $scope.tenantsList[rowIndex].startStep;
		var endStep = $scope.tenantsList[rowIndex].endStep;
			
		var actionParams = createActionParams(operation, tenant, startStep, endStep);
		console.log("actionParams",actionParams);
		fabricBuildService.execAction(actionParams).success(function(response) {
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
		        					refreshStream($scope.tenantsList[rowIndex]);
		        					
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
		//return operation + "|tenant|" + tenant.tenantCode + "|" + tenant.tenantCode + "|" + tenant.tenantPassword+ "|" + env + "-sdnet-esbin|" + steps; 
		return operation + "|tenant|" + tenant.tenantCode + "|" + tenant.tenantCode + "|" + tenant.tenantPassword+ "|" + steps; 
	}

	function createStepsLogUrl(operation, tenant){
		return "installer_" + operation + "_tenant_" +  tenant.tenantCode + ".json"; 
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
	
	$scope.mailLinks = {}
	
	$scope.prepareMail = function(selectedRow){
		var mail = {"to":"aleee.it@gmai.com", "subject": "ciao" + selectedRow.tenant.tenantCode, "body":"testo della mail"};
		$scope.mailLinks[selectedRow.tenant.tenantCode] = "mailto:"+mail.to+"?&subject= "+mail.subject+"&body="+mail.body;
	};
	
	$scope.openNewTenant = function () {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'newTenant.html',
	      controller: 'NewTenantCtrl',
	      resolve: {
	    	  ecosystemList: function(){return $scope.ecosystemList;}
	        
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
		return operation + "_tenant_" + tenant.tenantCode + ".log"; 
	}

	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);

appControllers.controller('NewTenantCtrl', [ '$scope', '$modalInstance', 'fabricAPIservice', 'TENANT_CREATE_URL', '$filter',"$http", 'ecosystemList',
                                           function ($scope, $modalInstance, fabricAPIservice, TENANT_CREATE_URL, $filter, $http, ecosystemList) {
		
	$scope.warning = null;
	$scope.newTenant = {};
	$scope.ecosystemList = ecosystemList;
	
	$scope.createNewTenant = function(){
		console.log("new tenant", $scope.newTenant);
			
		$scope.newTenant.status = "draft";
		if(typeof $scope.newTenant.maxDatasetNum == 'undefined' || $scope.newTenant.maxDatasetNum == null || $scope.newTenant.maxDatasetNum == 0)
			$scope.newTenant.maxDatasetNum = -1;
		if(typeof $scope.newTenant.maxStreamsNum == 'undefined' || $scope.newTenant.maxStreamsNum == null || $scope.newTenant.maxStreamsNum == 0)
			$scope.newTenant.maxStreamsNum = -1;
		
		var tenant = {"tenant": $scope.newTenant};
		
		
		var promise   = fabricAPIservice.createTenant(tenant);
		promise.then(function(result) {
			console.log("result qui ", result);
			$scope.info = "Tenant created";
			$scope.newTenant = {};
			$modalInstance.close("ok");
		}, function(result) {
			console.error("createNewTenant - error", result);
	    	$scope.error = "Error: "+ angular.fromJson(result.data);; 
		}, function(result) {
			console.log('Got notification: ' + result);
		});
		
	}
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
	};

} ]);





