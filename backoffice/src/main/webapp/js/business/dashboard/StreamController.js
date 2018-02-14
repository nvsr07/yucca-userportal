appControllers.controller('StreamCtrl', [ '$scope', "$route", 'fabricAPIservice', 'adminAPIservice', 'fabricBuildService', '$translate', '$modal', '$timeout' ,
                                           function($scope, $route, fabricAPIservice, adminAPIservice, fabricBuildService, $translate, $modal,$timeout) {
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
	
	$scope.actions = Constants.STREAM_ACTIONS;
	
	
	/*
	fabricAPIservice.getStreams().success(function(response) {
		$scope.showLoading = false;
		console.log("response",response);

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			
			var row = initRow(responseList[i]);
			row.rowIndex = i;
			$scope.streamsList.push(row);					
		}
		
		$scope.totalItems = $scope.streamsList.length;
	});*/
	
	/*
	 * LOAD STREAMS
	 */
	adminAPIservice.loadStreams().success(function(response) {
		$scope.showLoading = false;
		console.log("loadStreams - response",response);

		var responseList = Helpers.util.initArrayZeroOneElements(response);
		for (var i = 0; i < responseList.length; i++) {
			
			var row = initRow(responseList[i]);
			row.rowIndex = i;
			$scope.streamsList.push(row);					
		}
		$scope.totalItems = $scope.streamsList.length;
	})
	
	
	var initRow = function(streamIn){
		var row = {};
		row.stream = streamIn;
		row.statusIcon = Helpers.stream.statusIcon(row.stream);
		row.deploymentStatusCodeTranslated =  $translate.instant(row.stream.status.statuscode);
		row.isSelected = false;
		row.isUpdating = false;
		row.updated = false;
		row.ellipseNameLimit = 34-row.stream.streamcode.length;
		if(!row.stream.status.statuscode || row.stream.status.statuscode==null)
			row.stream.status.statuscode = "draft";
		
		if(row.stream.status.statuscode=='req_inst'){
			if(row.stream.version === 1)
				row.action = 'install';
			else
				row.action = 'upgrade';
		}
		else if(row.stream.status.statuscode=='inst'){
			row.action = 'migrate';
		}
		else if(row.stream.status.statuscode=='req_uninst'){
			row.action = 'delete';
		}

		row.startStep = 0;
		row.endStep = null;
		
		/*if(!row.stream.streamIcon || row.stream.streamIcon == null)
			row.stream.streamIcon  = "img/stream-icon-default.png";*/
	
		return row;
	}
	
	$scope.streamIconUrl= function(organizationCode, idstream){	
		return Constants.API_ADMIN_STREAMS_URL+"/"+idstream+"/icon?organizationCode="+organizationCode;
	};
	
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
		return !$scope.tenantsFilter || keyword.test(row.stream.tenantManager.tenantcode);
	};

	$scope.$watch('tenantsFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(row.stream.streamcode)|| keyword.test(row.stream.streamname);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(row.stream.status.statuscode) || keyword.test(row.deploymentStatusCodeTranslated);
	};

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});


	$scope.searchVirtualentityFilter = function(row) {
		var keyword = new RegExp($scope.virtualentityFilter, 'i');
		return !$scope.virtualentityFilter || keyword.test(row.stream.smartobject.socode);
	};

	$scope.$watch('virtualentityFilter', function(newVirtualentity) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	
	$scope.updateSelection = function($event, rowIndex) {
		$scope.streamsList[rowIndex].updated = false;
//		var checkbox = $event.target;
//		if(checkbox.checked){
//			$scope.streamsList[rowIndex].isSelected=true;
//			$scope.streamsList[rowIndex].updated = false;
//		}
//		else{
//			$scope.streamsList[rowIndex].isSelected=false;
//		}

	};	
	
	$scope.clearSelection = function(){
		if($scope.streamsList && $scope.streamsList!=null){
			for (var i = 0; i < $scope.streamsList.length; i++) {
				$scope.streamsList[i].isSelected=false;
			}
		}
		
	}
	
	var getPageOfRow = function(row){
		var page = 1;
		for (var k = 0; k < $scope.filteredStreamsList.length; k++) {
			if(row.rowIndex == $scope.filteredStreamsList[k].rowIndex){
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
				if($scope.streamsList[i].isSelected && !$scope.streamsList[i].isUpdating){
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
	
	/*********
	 *EXEC ACTION
	 **********/
	var execAction = function(rowIndex){
		$scope.streamsList[rowIndex].actionIconClass='fa fa-rocket';
		$scope.streamsList[rowIndex].actionFeedback='Started';
		$scope.streamsList[rowIndex].isUpdating = true;

		var operation = $scope.streamsList[rowIndex].action;
		var stream = $scope.streamsList[rowIndex].stream;
		var startStep = $scope.streamsList[rowIndex].startStep;
		var endStep = $scope.streamsList[rowIndex].endStep;
			
		//var actionParams = createActionParams(operation, stream, startStep, endStep);
		var actionParams = {};
		actionParams.action = operation;
		actionParams.startStep = startStep;
		actionParams.endStep = endStep;

		console.log("actionParams",actionParams);
		adminAPIservice.execStreamAction(actionParams,stream.idstream).success(function(response) {
			console.log("response",response);
		});
		
		$scope.streamsList[rowIndex].stepsLogUrl = createStepsLogUrl(operation, stream);
		chekStepsLog(rowIndex, $scope.streamsList[rowIndex].stepsLogUrl);
	};
	
	var someOneIsUpdating = false;
	
	var chekStepsLog = function(rowIndex, stepsLogUrl) {
		console.log("chekStepsLog", someOneIsUpdating, rowIndex, $scope.streamsList[rowIndex].actionFeedback);
        var checkStepTimeout = $timeout(function() {
    		var step_width = null;
    		var totalStep = null;
    		if(!someOneIsUpdating || $scope.streamsList[rowIndex].actionFeedback=='Running'){
    			console.log("chekStepsLog chiamo ", rowIndex);
	        	fabricBuildService.getLogs(stepsLogUrl).success(function(response) {
		        	if(response!=null){
			    			$scope.streamsList[rowIndex].actionIconClass='fa fa-bolt  blink-img';
			    			$scope.streamsList[rowIndex].actionFeedback='Running';
			    			someOneIsUpdating = true;
		        			var lines = response.split('\n');
		        			if(lines!=null && lines.length>0){
		        				
		        				for(var line = 0; line < lines.length; line++){
		        					//console.log("line |"  +lines[line] +"|");
		        					if(lines[line] && lines[line]!=null && lines[line]!="" && lines[line].length > 2){
			    						var step = JSON.parse(lines[line]);
			    						
			    						if(step_width == null && step.stepTotal!=null){
			    							step_width = "width:" + ((100-step.stepTotal)/step.stepTotal) + "%";
			    							totalStep = step.stepTotal;
			    						}
			    						if($scope.streamsList[rowIndex].feedback && $scope.streamsList[rowIndex].feedback!=null &&
			    							$scope.streamsList[rowIndex].feedback.lastStep && $scope.streamsList[rowIndex].feedback.lastStep!=null){
			    							//console.log("last", $scope.streamsList[rowIndex].feedback.lastStep);
			    							//console.log("current", step.stepNum);
			    							if($scope.streamsList[rowIndex].feedback.lastStep.stepNum>step.stepNum){
			    								$scope.streamsList[rowIndex].feedback = null;
			    							}
			    							else if($scope.streamsList[rowIndex].feedback.lastStep != step){
				    							console.log("change ", $scope.streamsList[rowIndex]);
				    							$scope.currentPage = getPageOfRow($scope.streamsList[rowIndex]);
				    						}
		
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
		        					$scope.streamsList[rowIndex].isUpdating = false;
		        					$scope.streamsList[rowIndex].updated = true;
		        					$scope.streamsList[rowIndex].isSelected=false;
		
		        					refreshStream($scope.streamsList[rowIndex]);
		        					someOneIsUpdating = false;
		        				    $timeout.cancel(checkStepTimeout);
		        				}        						
		        			}
		        		}
	        	});
    		}
        	if($scope.streamsList[rowIndex].feedback==null || !$scope.streamsList[rowIndex].feedback.finish || $scope.streamsList[rowIndex].feedback.finish!=true)
        		chekStepsLog(rowIndex,stepsLogUrl);
        }, 1000);
    };     
    
    var refreshStream = function(row){
    	fabricAPIservice.getStream(row.stream.codiceTenant, row.stream.codiceVirtualEntity, row.stream.codiceStream).success(function(response) {
    		console.log("refreshStream - response",response.streams);
    		row.stream = response.streams.stream;
    	});
    }
    
   
   
   function createActionParams(operation, stream, startStep, endStep ){
		var steps = startStep;
		if(endStep && endStep!=null)
			steps +=":"+endStep;
		return operation + "|stream|" + stream.codiceTenant + "|" + stream.codiceVirtualEntity + "|" + stream.codiceStream+ "|" + steps; 
	}
	
   
	function createStepsLogUrl(operation, stream){
		return "installer_" + operation + "_stream_" + stream.idstream+ ".json"; 
	}
	
    
	$scope.openLog = function (selectedRow) {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'streamInstalLog.html',
	      controller: 'StreamInstallLogCtrl',
	      size: 'lg',
	      resolve: {
	    	  row: function () {
	          return selectedRow;
	        }
	      }
	    });

	}
	
	$scope.openTest = function (selectedStream) {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'streamTest.html',
	      controller: 'StreamTestCtrl',
	      size: 'lg',
	      resolve: {
	    	  stream: function () {
	          return selectedStream;
	        }
	      }
	    });

	}
	


	
} ]);

appControllers.controller('StreamInstallLogCtrl', [ '$scope', '$modalInstance', 'row' , 'fabricBuildService', function ($scope, $modalInstance, row, fabricBuildService) {
	$scope.extendedLog = null;
	$scope.extendedLogUrl = null;
	console.log("StreamInstallLogCtrl - row", row)
	$scope.streamName = row.stream.streamcode + " - " + row.stream.streamname;
	$scope.actions = Constants.STREAM_ACTIONS;
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
		var urlParams = createActionLogUrl(row.stream, action);
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

	function createActionLogUrl(stream, operation){
		return operation + "_stream_" + stream.idstream+ ".log"; 
	}

	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);

appControllers.controller('StreamTestCtrl', [ '$scope', '$modalInstance', 'stream' , 'fabricAPIservice', 'STREAM_API_INPUT_URL', '$filter',"$http",  'localStorageService',
                                              function ($scope, $modalInstance, stream, fabricAPIservice, STREAM_API_INPUT_URL, $filter, $http, localStorageService ) {
	$scope.streamName = stream.codiceStream + " - " + stream.nomeStream;
	$scope.error = null;
	$scope.stream = null;
	$scope.user = null;
	$scope.components = [];
	$scope.password = null;
	$scope.showLoading = true;
	
	
	$scope.testUrl = STREAM_API_INPUT_URL;
	$scope.paramsJson = "";

	fabricAPIservice.getStream(stream.codiceTenant, stream.codiceVirtualEntity, stream.codiceStream).success(function(response) {
		$scope.showLoading = false;
		console.log("response",response.streams);
		$scope.stream = response.streams.stream;
		$scope.user = response.streams.stream.codiceTenant;
		$scope.password  = localStorageService.get(response.streams.stream.codiceTenant + "-api-input-pwd");
		$scope.warning = null;
		
		if(isValidStream()){
			$scope.createParamsJson();
			$scope.createTestUrl();
		}else{
			var message  = "<h4>Invalid stream</h4>"
			if(!stream || stream== null){
				message +='<div><i class="fa fa-times"></i> stream: <strong>null</strong></div>';
			}
			else{
				message += createWarningMessage('codiceStream', $scope.stream.codiceStream);
				message += createWarningMessage('codiceTenant', $scope.stream.codiceTenant);
				message += createWarningMessage('codiceVirtualEntity', $scope.stream.codiceVirtualEntity);
				
				if($scope.stream.componenti && $scope.stream.componenti!=null){
					message +='<div><i class="fa fa-check"></i> componenti: ';
					for(var j = 0; j < $scope.stream.componenti.length; j++)
						message += $scope.stream.componenti[j] +', ';
					message += '</div>';

				}
				else
					message +='<div><i class="fa fa-times"></i> componenti: <strong>null</strong></div>';

			}
			$scope.warning = message;
		}
	});
	
	var createWarningMessage = function(key, value){
		var message = "";
		if(key && key!=null)
			message +='<div><i class="fa fa-check"></i> '+ key + ': ' + key +'</div>';
		else
			message +='<div><i class="fa fa-times"></i> '+ key + ':  <strong>null</strong></div>';
		return message;
	}
	
	$scope.createTestUrl = function(){
		$scope.testUrl = STREAM_API_INPUT_URL + "/" + $scope.user;
	}
	
	$scope.createParamsJson = function(){
		console.log("createParamsJson components", $scope.components)

		if(isValidStream() &&  $scope.components &&  $scope.components!=null){
			var componentsJson = "";
			console.log("createParamsJson componentsJson start", componentsJson);
			var now = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss') + 'Z';
			
			for(var j = 0; j < $scope.components.length; j++){
				console.log("createParamsJson componentsJson "+j, componentsJson);
				componentsJson += '{"components": {"'+$scope.stream.componenti.element[j].nome+'": "'+$scope.components[j]+'"}, "time": "'+now+'"}';
				if(j<$scope.components.length-1)
					componentsJson += ",";
			}
			console.log("createParamsJson componentsJson end", componentsJson);
			$scope.paramsJson = '{"sensor": "'+$scope.stream.codiceVirtualEntity+'", "values": ['+componentsJson+'], "stream":"'+$scope.stream.codiceStream+'"}';
		}
		else
			$scope.paramsJson = "";
	}
	
	var isValidStream = function(){
		if($scope.stream && $scope.stream!=null 
				&& $scope.stream.codiceTenant && $scope.stream.codiceTenant!=null
				&& $scope.stream.codiceStream && $scope.stream.codiceStream!=null
				&& $scope.stream.codiceVirtualEntity && $scope.stream.codiceVirtualEntity!=null
				&& $scope.stream.componenti && $scope.stream.componenti!=null
				&& $scope.stream.componenti.element &&  $scope.stream.componenti.element!=null &&  $scope.stream.componenti.element.length>0)
			return true;
		else 
			return false;
	}

	$scope.execTest = function(){
		console.log("user", $scope.user);
		console.log("password", $scope.password);
		console.log("components", $scope.components);

		$scope.showLoading = true;
		$scope.createParamsJson();
		$scope.createTestUrl();
		$scope.testResult = null;
		$scope.testError = null;
		if(localStorageService.isSupported) {
			localStorageService.set($scope.user + "-api-input-pwd", $scope.password);
		}

		//$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode($scope.user + ':' + $scope.password);
		$http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.user + ':' + $scope.password);
		console.log("Basic " +  btoa($scope.user + ':' + $scope.password));

		$http({
			method : 'POST',
			data:$scope.paramsJson,
			 headers: {
				   'Content-Type': 'application/json'
				 },
			url : $scope.testUrl
		}).
	    success(function(data, status, headers, config) {
	        console.log('success');
			$scope.showLoading = false;
	        $scope.testResult = "ok";
	        $scope.testResultData = data;
	    }).
	    error(function(data, status, headers, config) {
	        console.log('test error',data);
			$scope.showLoading = false;
	        $scope.testResult = "ko";
	        $scope.testResultData = data;
	    });
		
		
		
		
	}
	

	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);
