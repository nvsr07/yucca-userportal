appControllers.controller('StreamsCtrl', [ '$scope', "$route", 'fabricAPIservice', 'fabricBuildService', '$translate', '$modal', '$timeout' ,
                                           function($scope, $route, fabricAPIservice, fabricBuildService, $translate, $modal,$timeout) {
	console.log("$modal", $modal);
		
	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.tenantsFilter = null;
	$scope.codeFilter = null;
	$scope.statusFilter = 'Installazione in corso';
	$scope.virtualentityFilter = null;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	$scope.showLoading = true;
	
	$scope.errors = [];
	$scope.warnings = [];
	$scope.infos = [];
	
	$scope.actions = ['install', 'upgrade', 'delete', 'migrate'];
	
	
	fabricAPIservice.getVisibleStreams().success(function(response) {
		$scope.showLoading = false;
		console.log("response",response);

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			var row = {};
			row.rowIndex = i;
			row.stream = responseList[i];
			row.statusIcon = Helpers.stream.statusIcon(row.stream);
			row.deploymentStatusCodeTranslated =  $translate.instant(row.stream.deploymentStatusCode);
			row.isSelected = false;
			row.isUpdating = false;
			row.ellipseNameLimit = 34-row.stream.codiceStream.length;
			if(!row.stream.deploymentStatusCode || row.stream.deploymentStatusCode==null)
				row.stream.deploymentStatusCode = "draft";
			
			if(row.stream.deploymentStatusCode=='req_inst'){
				if(row.stream.deploymentVersion === 1)
					row.action = 'install';
				else
					row.action = 'upgrade';
			}
			else if(row.stream.deploymentStatusCode=='inst'){
				row.action = 'migrate';
			}
			else if(row.stream.deploymentStatusCode=='req_uninst'){
				row.action = 'delete';
			}

			row.startStep = 0;
			row.endStep = null;
			
			if(row.stream.streamIcon || row.stream.streamIcon == null)
				row.stream.streamIcon  = "img/stream-icon-default.png";
			
			$scope.streamsList.push(row);					
		}
		
		$scope.totalItems = $scope.streamsList.length;
	});
	
	
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

	$scope.searchTenantsFilter = function(row) {
		var keyword = new RegExp($scope.tenantsFilter, 'i');
		return !$scope.tenantsFilter || keyword.test(row.stream.codiceTenant);
	};

	$scope.$watch('tenantsFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(row.stream.codiceStream)|| keyword.test(row.stream.nomeStream);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(row.stream.deploymentStatusCode) || keyword.test(row.deploymentStatusCodeTranslated);
	};

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});


	$scope.searchVirtualentityFilter = function(row) {
		var keyword = new RegExp($scope.virtualentityFilter, 'i');
		return !$scope.virtualentityFilter || keyword.test(row.stream.codiceVirtualEntity);
	};

	$scope.$watch('virtualentityFilter', function(newVirtualentity) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	
	$scope.updateSelection = function($event, rowIndex) {
		var checkbox = $event.target;
		if(checkbox.checked)
			$scope.streamsList[rowIndex].isSelected=true;
		else
			$scope.streamsList[rowIndex].isSelected=false;
	};	
	
	$scope.clearSelection = function(){
		if($scope.streamsList && $scope.streamsList!=null){
			for (var i = 0; i < $scope.streamsList.length; i++) {
				$scope.streamsList[i].isSelected=false;
			}
		}
		
	}
	
	$scope.selectAll = function($event){
		console.log("selectAll", $event)
		$scope.clearSelection();
		var checkbox = $event.target;
		console.log("checkbox.checked", checkbox.checked)

		if(checkbox.checked){
			console.log("checkbox.checked in", checkbox.checked)

			if($scope.filteredStreams && $scope.filteredStreams!=null){
				

				for (var i = 0; i < $scope.filteredStreams.length; i++) {
					console.log("$scope.filteredStreams[i].isSelected", $scope.filteredStreams[i].isSelected)

					$scope.filteredStreams[i].isSelected=true;
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
		if($scope.streamsList && $scope.streamsList!=null){
			for (var i = 0; i < $scope.streamsList.length; i++) {
				if($scope.streamsList[i].isSelected){
					console.log("stream",$scope.streamsList[i].stream);
					console.log("action",$scope.streamsList[i].action);
					console.log("startStep",$scope.streamsList[i].startStep);
					console.log("endStep",$scope.streamsList[i].endStep);
					atLeastOneSelected = true;
					var errorOnStep = false;
					if($scope.streamsList[i].startStep<0)
						errorOnStep = true;
					if($scope.streamsList[i].endStep!=null){
						if($scope.streamsList[i].endStep<0)
							errorOnStep = true;
						if($scope.streamsList[i].endStep<=$scope.streamsList[i].startStep)
							errorOnStep = true;
					}
					
					if(errorOnStep)
						$scope.streamsList[i].errorValidation = "DASHBOARD_STREAM_STEP_VALIDATION_ERROR";
					else{
						$scope.streamsList[i].errorValidation = null;
						execAction(i);
					}

				}
			}
		}
		if(!atLeastOneSelected)
			$scope.warnings.push('DASHBOARD_WARNING_NO_STREAM');

	}
	
	var execAction = function(rowIndex){
		$scope.streamsList[rowIndex].actionIconClass='fa fa-rocket';
		$scope.streamsList[rowIndex].actionFeedback='Started';


		var operation = $scope.streamsList[rowIndex].action;
		var stream = $scope.streamsList[rowIndex].stream;
		var startStep = $scope.streamsList[rowIndex].startStep;
		var endStep = $scope.streamsList[rowIndex].endStep;
			
		var actionParams = createActionParams(operation, stream, startStep, endStep);
		console.log("actionParams",actionParams);
		fabricBuildService.execAction(actionParams).success(function(response) {
			console.log("response",response);
		});
		
		$scope.streamsList[rowIndex].stepsLogUrl = createStepsLogUrl(operation, stream);
		chekStepsLog(rowIndex, $scope.streamsList[rowIndex].stepsLogUrl);
	};
	
	var chekStepsLog = function(rowIndex, stepsLogUrl) {
		
        $timeout(function() {
    		var step_width = null;
    		var totalStep = null;
        	fabricBuildService.getLogs(stepsLogUrl).success(function(response) {
        	if(response!=null){
	    			$scope.streamsList[rowIndex].actionIconClass='fa fa-bolt  blink-img';
	    			$scope.streamsList[rowIndex].actionFeedback='Running';

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
	            				if($scope.streamsList[rowIndex].feedback  == null){
	            					$scope.streamsList[rowIndex].feedback = {}; 
	            					$scope.streamsList[rowIndex].feedback.totalStep = step.stepTotal;
	            					$scope.streamsList[rowIndex].feedback.steps = [];
	            					for (var j = 0; j < step.stepTotal; j++) {
	            						var num = j+1;
	            						var empty_step = {"stepNum": num, "status": "waiting", "style": "status_waiting", "width":step_width};
	            						$scope.streamsList[rowIndex].feedback.steps.push(empty_step);
										
									}
	            				}
	    						step.width = step_width;
	    						step.style = stepStyle(step);
	    						
	    						$scope.streamsList[rowIndex].feedback.steps[step.stepNum-1] = step;
        					}
    					}
        				$scope.streamsList[rowIndex].feedback.lastStep = $scope.streamsList[rowIndex].feedback.steps[$scope.streamsList[rowIndex].feedback.steps.length-1];
        				
        				if($scope.streamsList[rowIndex].feedback.lastStep.stepNum==totalStep && (step.skipped=='true'|| (step.status && step.status!=null && step.status.lastIndexOf('end', 0) === 0))){
        					$scope.streamsList[rowIndex].feedback.finish = true;
        					$scope.streamsList[rowIndex].actionIconClass='fa fa-flag-checkered';
        					$scope.streamsList[rowIndex].actionFeedback='Finish';
        				}        				

        			}
        		}
        	});
        	if($scope.streamsList[rowIndex].feedback==null || !$scope.streamsList[rowIndex].feedback.finish || $scope.streamsList[rowIndex].feedback.finish!=true)
        		chekStepsLog(rowIndex,stepsLogUrl);
        }, 1000);
    };     
    
    
   
    
   function createActionParams(operation, stream, startStep, endStep ){
		var steps = startStep;
		if(endStep && endStep!=null)
			steps +=":"+endStep;
		return operation + "|stream|" + stream.codiceTenant + "|" + stream.codiceVirtualEntity + "|" + stream.codiceStream+ "|" + steps; 
	}

	function createStepsLogUrl(operation, stream){
		return "installer_" + operation + "_stream_" + stream.codiceTenant + "_" + stream.codiceVirtualEntity + "_" + stream.codiceStream+ ".json"; 
	}
	
	function createActionLogUrl(operation, stream){
		return operation + "_stream_" + stream.codiceTenant + "_" + stream.codiceVirtualEntity + "_" + stream.codiceStream+ ".log"; 
	}
    
	$scope.openLog = function (selectedStream) {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'streamInstalLog.html',
	      controller: 'StreamInstallLogCtrl',
	      size: 'lg',
	      resolve: {
	    	  logUrl: function () {
	          return createActionLogUrl('install',selectedStream);
	        }
	      }
	    });

	}
	
} ]);

appControllers.controller('StreamInstallLogCtrl', [ '$scope', '$modalInstance', 'logUrl' , 'fabricBuildService', function ($scope, $modalInstance, logUrl, fabricBuildService) {
	$scope.extendedLog = "";
	fabricBuildService.getLogs(logUrl).success(function(response) {
		console.log("response",response);
		$scope.extendedLog = response;
	});
	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);

