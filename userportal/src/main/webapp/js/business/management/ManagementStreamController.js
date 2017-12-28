appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'adminAPIservice', 'sharedAdminResponse', 'info', '$translate', 
                                                        function($scope, $route, $location, fabricAPIservice, adminAPIservice, sharedAdminResponse, info,  $translate) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.codeFilter = null;
	$scope.nameFilter = null;
	$scope.statusFilter = null;
	$scope.domainFilter = null;
	$scope.showLoading = true;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	
	console.log("isOwner", info.isOwner( $scope.tenantCode));

	$scope.organizationCode = info.getActiveTenant().organization.organizationcode;
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	
	
	$scope.admin_response = {};
	
	console.log("ManagementStreamListCtrl - info", info.getActiveTenant());
	
	adminAPIservice.loadStreams(info.getActiveTenant(), info.getActiveTenant().tenantCode).success(function(response) {
		console.log("loadStreams SUCCESS", response);
		$scope.streamsList = response;
		$scope.showLoading = false;
		$scope.admin_response = {};
	}).error(function(response){
		console.error("loadStreams ERROR", response);
		$scope.showLoading = false;
		$scope.admin_response.type = 'danger';
		$scope.admin_response.message = 'UNEXPECTED_ERROR';
		if(response && response.errorName)
			$scope.admin_response.detail= response.errorName;
		if(response && response.errorCode)
			$scope.admin_response.code= response.errorCode;

	});
	
//	fabricAPIservice.getVisibleStreamsFromTenant($scope.tenantCode).then(
//		function(response) {
//
//			$scope.showLoading = false;
//	
//			var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
//			for (var i = 0; i < responseList.length; i++) {
//				if(!responseList[i].deploymentStatusCode || responseList[i].deploymentStatusCode == null)
//					responseList[i].deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
//				responseList[i].deploymentStatusCodeTranslated =  $translate.instant(responseList[i].deploymentStatusCode);
//				responseList[i].domainStreamTranslated =  $translate.instant(responseList[i].domainStream);
//				
//				responseList[i].statusIcon = Helpers.stream.statusIcon(responseList[i]);
//				if(!responseList[i].streamIcon || responseList[i].streamIcon == null){
//					responseList[i].streamIcon  = "img/stream-icon-default.png";
//				}
//				$scope.streamsList.push(responseList[i]);
//			}
//		
//		$scope.totalItems = $scope.streamsList.length;
//	});

	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.streamcode);
	};
	
	$scope.searchNameFilter = function(stream) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || keyword.test(stream.streamname);
	};

	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test($translate.instant(stream.status.statuscode));
	};
	
	$scope.searchDomainFilter = function(stream) {
		var keyword = new RegExp($scope.domainFilter, 'i');
		return !$scope.domainFilter || keyword.test($translate.instant(stream.domain.domaincode));
	};

	$scope.viewUnistalledFilter = function(stream) {
		if(!$scope.viewUnistalledCheck){
			var keyword = new RegExp(Constants.STREAM_STATUS_UNINST, 'i');
			return !keyword.test(stream.status.statuscode);
		} else
			return true;
	};
	
	$scope.$watch('viewUnistalledCheck', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.$watch('domainFilter', function(newDomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.selectedStreams = [];

	$scope.isSelected = function(stream) {
		return $scope.selectedStreams.indexOf(stream) >= 0;
	};

	$scope.updateSelection = function($event, stream) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, stream);
	};	
	var updateSelected = function(action, stream) {
		if (action === 'add' && $scope.selectedStreams.indexOf(stream) === -1) {
			$scope.selectedStreams.push(stream);
		}
		if (action === 'remove' && $scope.selectedStreams.indexOf(stream) !== -1) {
			$scope.selectedStreams.splice($scope.selectedStreams.indexOf(stream), 1);
		}
	};

	$scope.canEdit = function() {
		if($scope.selectedStreams.length==1 && $scope.selectedStreams[0].deploymentStatusCode == Constants.STREAM_STATUS_DRAFT){
			return true;
		}
		return false;
	};

	$scope.editStream = function(){
		if($scope.selectedStreams.length===1){

			$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].streamcode);
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteStream = function(){
		//alert("Funzionalita non ancora abilitata!");
		if($scope.selectedStreams.length>0){
			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].streamcode);
		}
		else{
			// FIXME error message...
		}
	};
} ]);


appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'adminAPIservice', 'sharedAdminResponse', 'info', '$timeout', "$filter", 'readFilePreview', '$location', 'sharedStream', '$translate',
                                                    function($scope, $routeParams, fabricAPIservice, adminAPIservice, sharedAdminResponse, info, $timeout, $filter, readFilePreview, $location, sharedStream, $translate) {
	$scope.tenantCode = $routeParams.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;
	$scope.validationRes=2;
	$scope.errorMsg="Errore";
	$scope.successMsg="Successo";
	$scope.updateInfo = null;
	$scope.updateWarning = null;
	$scope.updateError = null;
	$scope.insertComponentErrors = [];
	$scope.wsUrl ="";
	$scope.isOpendata =0;
	
	$scope.virtualentity = null;
	$scope.warningMessages = [];
	
	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternNoSpace = Constants.VALIDATION_PATTERN_NO_SPACE;
	$scope.validationPatternStreamCode = Constants.VALIDATION_PATTERN_CODE_STREAM;
	$scope.forms = {};
	
	$scope.Lang_ISO_639_1 = Lang_ISO_639_1;
	$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
	$scope.TWITTER_GEO_SEARCH_RADIUS_UNIT = Constants.TWITTER_GEO_SEARCH_RADIUS_UNIT;

	
	$scope.currentStep = 'register';
	$scope.wizardSteps = [{'name':'register', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'detail', 'style':''},
	                      {'name':'components', 'style':''},
	                      {'name':'tweetdata', 'style':''},
	                      {'name':'share', 'style':''}];

	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};
	
	$scope.extra = {selectedSo:null};
	var isTwitter = function(){
		return $scope.extra.selectedSo !=null && $scope.extra.selectedSo.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
	};

	//load smart object
	$scope.admin_response = {};
	
	refreshWizardToolbar();
	$scope.goToRegister  = function(){ $scope.currentStep = 'register'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToDetail  = function(){ $scope.currentStep = 'detail';refreshWizardToolbar();};
	$scope.goToComponents  = function(){
		console.log("goToComponents",$scope.extra.selectedSo);
		console.log("Constants.VIRTUALENTITY_TYPE_TWITTER_ID",Constants.VIRTUALENTITY_TYPE_TWITTER_ID);
		console.log("ISTWITTER",isTwitter());
		
		if(isTwitter()){
			$scope.currentStep = 'tweetdata';refreshWizardToolbar();
		}
		else
			$scope.currentStep = 'components';refreshWizardToolbar();
	};
	
	$scope.goToShare  = function(){
		if($scope.extra.selectedSo !=null && $scope.extra.selectedSo.soType.idSoType != Constants.VIRTUALENTITY_TYPE_TWITTER_ID 
				&& (!$scope.stream.components || $scope.stream.components.length==0)){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS';
			
			//$scope.updateWarning = true;
			//$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
		}
		else{
			
		$scope.currentStep = 'share';
			refreshWizardToolbar();
		}

	};
	
	$scope.canCreatePublicStream = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";
	}; 
	
	
	$scope.canShareStream = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";
	}; 

	$scope.extra.isInternal = false;
	var soInternal = null;
	
	$scope.selectSoInternal = function(isInternal){
		console.log("selectSoInternal", $scope.extra.isInternal, isInternal);
		if(isInternal)
			$scope.extra.selectedSo = soInternal;
		else
			$scope.extra.selectedSo = null;
		
		console.log("extra.selectedSo", $scope.extra.isInternal, $scope.extra.selectedSo );	
	};
	
	
	$scope.defaultQuery = Constants.DEFAULT_SIDDHI;

	$scope.internalStreams = [];
	//$scope.extra.inputTypeStream = 1;
	//$scope.streamSelectedItem=null;	
	$scope.streamSiddhiQuery="insert query here;";
	$scope.streamSiddhiMirror="";
	$scope.streamsList = [];

	
	$scope.showLoadingAddStream = false;
	
	
	$scope.addStreamToArray = function(index){
		console.log("addStreamToArray", index);
		if(index){
			$scope.validationRes=2;
			var streamSelectedItem = $scope.streamsList[index];
			$scope.showLoadingAddStream = true;
			$scope.admin_response_add_stream = {};
			/*
			adminAPIservice.loadStream(info.getActiveTenant(), $scope.streamsList[index].idstream).success(function(response) {
				console.log("loadStream SUCCESS", response);
				$scope.streamsList = response;
				$scope.showLoadingAddStream = false;
				$scope.admin_response_add_stream = {};
				$scope.internalStreams.push(streamSelectedItem);
			}).error(function(response){
				console.error("loadStream ERROR", response);
				$scope.showLoadingAddStream = false;
				$scope.admin_response_add_stream.type = 'danger';
				$scope.admin_response_add_stream.message = 'UNEXPECTED_ERROR';
				if(response && response.errorName)
					$scope.admin_response_add_stream.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response_add_stream.code= response.errorCode;
	
			});
			
			*/
			$scope.showLoadingAddStream = false;
			$scope.internalStreams.push($scope.streamsList[index]);
		}
		else{
			$scope.admin_response_add_stream = {"type": "warning", "message": "STREAM_INTERNAL_SELECTED_ONE_WARNING"};
		}
		//$scope.streamSelectedItem=null;
	};

	$scope.removeStreamFromArray = function(index){
		$scope.validationRes=2;
		$scope.internalStreams.splice(index,1);
	};

	// The ui-codemirror option
	$scope.cmOption = {
			lineNumbers: true,
			indentWithTabs: true,
			onLoad : function(_cm){
				console.debug(_cm);
				_cm.setOption("mode", 'text/x-sql');
			}
	};

	$scope.$watch('streamSiddhiQuery', function() {
		$scope.validationRes=2;
	});
	
	$scope.valideteSiddhi = function(streamSiddhiQuery){
		$scope.streamSiddhiQuery = streamSiddhiQuery;

		if($scope.stream.components==null || $scope.stream.components.length==0){
			$scope.validationRes=1;
			$scope.errorMsg="STREAM_SIDDHI_INSERT_COMPONENT";
			return;
		}
		if($scope.streamSiddhiQuery==null || $scope.streamSiddhiQuery.indexOf("outputStream")==-1){
			$scope.validationRes=1;
			$scope.errorMsg="STREAM_SIDDHI_PLEASE_OUTPUTSTREAM";
			return;
		}
		
		var siddhiStreamDefinitions = "";
		var siddhiStreamArray = [];
		for(var st in $scope.internalStreams){
			console.debug($scope.internalStreams[st]);

			siddhiStreamDefinitions += "define stream " + "input"+st+" (meta_source string, time string ";
			if($scope.internalStreams[st].componenti!= null && $scope.internalStreams[st].components!=null ){
				var componenti = $scope.internalStreams[st].components;
				for(var comp in componenti){
					var key = componenti[comp].nome;
					var value =  componenti[comp].dataType;
					if (value == "dateTime") {
						value = "string";
					} else if (value == "longitude") {
						value = "double";
					} else if (value == "latitude") {
						value = "double";
					} else if (value == "boolean") {
						value = "bool";
					}
					siddhiStreamDefinitions += " ,"+key +" "+value;
				}
				siddhiStreamDefinitions +=");";
				siddhiStreamArray.push(siddhiStreamDefinitions);
				siddhiStreamDefinitions="";
			}

		}
		
		//OutputStream Definition
		siddhiStreamDefinitions += " define stream " + "outputStream(meta_source string, time string ";
		if($scope.stream.componenti!= null && $scope.stream.components!=null ){
			var componenti = $scope.stream.components;
			for(var comp in componenti){
				var key = componenti[comp].nome;
				var value =  componenti[comp].dataType;
				if (value == "dateTime") {
					value = "string";
				} else if (value == "longitude") {
					value = "double";
				} else if (value == "latitude") {
					value = "double";
				} else if (value == "boolean") {
					value = "bool";
				}
				siddhiStreamDefinitions += " ,"+key +" "+value;
			}
			siddhiStreamDefinitions +=");";
			siddhiStreamArray.push(siddhiStreamDefinitions);
			siddhiStreamDefinitions="";
		}
		
		var validationObj = {
				"inputStreamDefiniitons":siddhiStreamArray,
				"queryExpressions":$scope.streamSiddhiQuery + $scope.defaultQuery		
		};
		console.debug("validationObj : ", validationObj);
		fabricAPIservice.validateSiddhi(validationObj).success(function(response) {
			if(response.faultstring != null){
				$scope.validationRes=1;
				$scope.errorMsg=response.faultstring;
			} else {
				$scope.validationRes=0;
			}
			console.debug(response);
		});
	};
	
	
	adminAPIservice.loadStreams(info.getActiveTenant()).success(function(response) {
		console.log("loadStreams SUCCESS", response);
		$scope.streamsList = [];
		$scope.showLoading = false;
		$scope.admin_response = {};
		
		for (var i = 0; i < response.length; i++) {
			response[i].label = response[i].tenantManager.tenantcode + ' - ' + response[i].streamname + ' - ' + response[i].smartobject.name + ' (' +response[i].smartobject.socode + ')';
			if(response[i].status && response[i].status.statuscode){
				if(response[i].status.statuscode == Constants.STREAM_STATUS_INST  && response[i].smartobject.soType.idSoType!=Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
					$scope.streamsList.push(response[i]);					
				}
				else if(response[i].status.statuscode == Constants.STREAM_STATUS_DRAFT && response[i].version>1 && response[i].smartobject.soType.idSoType!=Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
					response[i].cssClass= 'option-warning';
					response[i].label += "(bozza)";
					$scope.streamsList.push(response[i]);					
				}
			}
		}
		
		
		
		$scope.streamsList.sort(function(a,b) { 
			return a.streamname.toLowerCase().localeCompare(b.streamname.toLowerCase());
		} );
	}).error(function(response){
		console.error("loadStreams ERROR", response);
		$scope.showLoading = false;
		$scope.admin_response.type = 'danger';
		$scope.admin_response.message = 'UNEXPECTED_ERROR';
		if(response && response.errorName)
			$scope.admin_response.detail= response.errorName;
		if(response && response.errorCode)
			$scope.admin_response.code= response.errorCode;

	});

	/*
	fabricAPIservice.getVisibleStreams().then(function(response) {

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			responseList[i].label = responseList[i].nomeTenant + ' - ' + responseList[i].streamname + ' - ' + responseList[i].virtualEntityName 
				+ ' (' +responseList[i].codiceVirtualEntity + ')';
			if(responseList[i].deploymentStatusCode && 	responseList[i].deploymentStatusCode == Constants.STREAM_STATUS_INST  && responseList[i].tipoVirtualEntity!='Internal'){
				$scope.streamsList.push(responseList[i]);					
			}
			else if(responseList[i].deploymentStatusCode && responseList[i].deploymentStatusCode == Constants.STREAM_STATUS_DRAFT && responseList[i].deploymentVersion>1 && responseList[i].tipoVirtualEntity!='Internal'){
				responseList[i].cssClass= 'option-warning';
				responseList[i].label += "(bozza)";
				$scope.streamsList.push(responseList[i]);					
			}

		}
		
		$scope.streamsList.sort(function(a,b) { 
				return a.label.toString().toLowerCase().localeCompare(b.label.toString().toLowerCase());
				//return a.streamname.toString().toLowerCase().localeCompare(b.streamname.toString().toLowerCase());
				//return (a.streamname.toString().toLowerCase() > b.streamname.toLowerCase()) - (a.streamname.toLowerCase() < b.streamname.toLowerCase());
			} );
	});
	
	*/

	adminAPIservice.loadTenants().success(function(response) {
		console.log("loadTenants", response);
		try{
			$scope.tenantsList = [];
			for (var int = 0; int <  response.length; int++) {
				var t = response[int];
				if(t.tenantcode!=$scope.tenantCode)
					$scope.tenantsList.push(t);
			}
		}
		catch (e) {
			log.error("loadTenants ERROR",e);
		}
		
	});

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
//	});

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
//	$scope.subdomainList = [];
//	$scope.selectSubdomain = function(domain){
//		$scope.subdomainList = [];
//		adminAPIservice.loadSubDomains(domain).success(function(response) {
//			response.sort(function(a, b) { 
//			    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
//			});
//			for (var int = 0; int < response.length; int++) {
//				$scope.subdomainList.push(response[int].subdomaincode);
//			}
//		});
//	};
	
	
	
	$scope.measureUnitsList = [];
	//$scope.extra.measureUnitsMap = {};

	adminAPIservice.loadMeasureUnits().success(function(response) {
		console.log("loadMeasureUnits",response);
		$scope.measureUnitsList = response;
//		for (var muIndex = 0; muIndex < response.length; muIndex++) {
//			$scope.extra.measureUnitsMap[response[muIndex].idMeasureUnit] = response[muIndex];
//		}
//		console.warn("scope.measureUnitsMap",$scope.extra.measureUnitsMap);
	});


	$scope.phenomenomList = [];
	
	adminAPIservice.loadPhenomenons().success(function(response) {
		console.log("loadPhenomenons",response);
		$scope.phenomenomList = response;
	});

	$scope.dataTypeList = [];
	adminAPIservice.loadDataTypes().success(function(response) {
		console.log("loadDataTypes",response);
		$scope.dataTypeList = response;
	});

	$scope.componentJsonExample = "{\"stream\": \"....\",\n \"sensor\": \"....\",\n \"values\":\n  [{\"time\": \"....\",\n    \"components\":\n     {\"wind\":\"1.4\"}\n  }]\n}";

	$scope.stream = {};
//	$scope.stream.saveData = '0';
//	$scope.stream.visibility = 'public';
//	$scope.stream.publish = 0;
	
	$scope.isNewStream = false;
	if(!$routeParams.entity_code || $routeParams.entity_code == null || $routeParams.entity_code === undefined ||!$routeParams.stream_code || $routeParams.stream_code == null || $routeParams.stream_code === undefined )
		$scope.isNewStream = true;
	
	/*
	 * LOAD STREAM
	 */
	$scope.loadStream = function(){
		console.log("getActiveTenant",info.getActiveTenant());
		console.log("organizationCode = ",info.getActiveTenant().organization.organizationcode);
		if(!$scope.isNewStream){
			adminAPIservice.loadStream(info.getActiveTenant(),$routeParams.id_stream).success(function(response) {
			console.log("loadStream",response);
			$scope.stream = response;		
			$scope.stream.deploymentStatusCode = $scope.stream.status.statuscode;
						
				
				//FIXME publishStream forced to true , delete this line when the radio button is enabled.
				$scope.stream.publishStream=1;	
				
				if($scope.stream.visibility==null){
					if($scope.canCreatePublicStream())
						$scope.stream.visibility = 'public';
					else
						$scope.stream.visibility = 'private';
				}
				
				$scope.stream.icon  = "img/stream-icon-default.png";
	
				if( $scope.stream.stream.internalquery && $scope.stream.stream.internalquery["@nil"]){
					$scope.stream.stream.internalquery=null;
				}
				console.debug("$scope.stream.internalQuery ",$scope.stream.stream.internalquery);
	
				$scope.streamSiddhiMirror= $scope.stream.stream.internalQuery;	
				setTimeout(function(){
					$scope.$apply(function(){
					  $scope.streamSiddhiQuery=$scope.streamSiddhiMirror;
					});
				}, 100);
	
				
				$scope.internalStreams=$scope.stream.stream.internalStreams;//.streamChildren;
	
				
				console.debug("$scope.stream internal",$scope.internalStreams);
				/*
				if(!$scope.stream.streamTags)
					$scope.stream.streamTags = new Object();
				$scope.stream.streamTags.tag = Helpers.util.initArrayZeroOneElements($scope.stream.streamTags.tag);

				if($scope.stream.componenti == null)
					$scope.stream.componenti = new Object();
				$scope.stream.components = Helpers.util.initArrayZeroOneElements($scope.stream.components);
				*/
	
				if(!$scope.stream.status.statuscode || $scope.stream.status.statuscode == null)
					$scope.stream.status.statuscode = Constants.STREAM_STATUS_DRAFT;
	
				$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
				
				/*
				if($scope.stream.tenantssharing &&  $scope.stream.tenantssharing !=null &&  $scope.stream.tenantssharing.tenantsharing &&  $scope.stream.tenantssharing.tenantsharing !=null
						&& $scope.stream.tenantssharing.tenantsharing.length>0){
					for (var i = 0; i < $scope.stream.tenantssharing.tenantsharing.length; i++) {
						if($scope.stream.tenantssharing.tenantsharing[i].isOwner==0)
							$scope.addTenantSharing($scope.stream.tenantssharing.tenantsharing[i]);
					}
				}*/
				if($scope.stream.stream.smartobject.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID && $scope.stream.stream.smartobject.twtmaxstreams){
					$scope.twitterPollingInterval = $scope.stream.stream.smartobject.twtmaxstreams*5+1;
				}
				
				//if($scope.stream.opendata.isOpendata == 1){ 
				if($scope.stream.opendata && ($scope.stream.opendata.opendataupdatedate || $scope.stream.opendata.opendataexternalreference || $scope.stream.opendata.lastupdate || $scope.stream.opendata.opendataauthor || $scope.stream.opendata.opendatalanguage)){
					$scope.isOpendata=1;
					console.log("isOpendata",$scope.isOpendata);
					if($scope.stream.opendata.opendataupdatedate){
						var d = new Date($scope.stream.opendata.opendataupdatedate);
						console.log("DateOpenData",d);
						var mm = ((d.getMonth()+1) < 10) ? "0" + (d.getMonth()+1) :(d.getMonth()+1);
						var day = ((d.getDate() < 10) ? "0" + d.getDate() : d.getDate()).toString();
						if ($routeParams.managementTab == "editStream")
							$scope.stream.opendata.opendataupdatedate = (d.getFullYear()).toString() + "-" + mm + "-" + day;
						else 
							$scope.stream.opendata.opendataupdatedate = day + "/" + mm + "/" + (d.getFullYear()).toString();
					}
				}
				else {$scope.isOpendata=0;
				console.log("isOpendata",$scope.isOpendata);}
				console.debug("$routeParams = ",$routeParams);
				
			});
		} else {
			var streamClone = sharedStream.getStream();
			if(streamClone!=null){
				streamClone.statoStream = null;
				streamClone.streamcode = null;
				$scope.stream = streamClone;

				console.log("streamClone", streamClone);

				if(streamClone.smartobject.socode == "internal"){
					//$scope.extra.inputTypeStream = 0;
					$scope.internalStreams = $scope.stream.stream.internalStreams;//.streamChildren;
					$scope.streamSiddhiQuery = $scope.stream.stream.internalquery;
				}

				sharedStream.setStream(null);
			} else {
				$scope.stream  = {};
				if($scope.canCreatePublicStream())
					$scope.stream.visibility = 'public';
				else
					$scope.stream.visibility = 'private';
				$scope.stream.icon  = "img/stream-icon-default.png";
				$scope.stream.tags = [];
				$scope.stream.components = [];
				$scope.stream.savedata = true;
				$scope.stream.unpublished = true;
				$scope.stream.isOpendata = false;
				// FIXME serve?		// $scope.stream.deploymentVersion = 1;  
//				$scope.stream.opendata = {};
//				$scope.stream.opendata.isOpendata = 0;
//				$scope.stream.opendata.author = null;
//				$scope.stream.opendata.dataUpdateDate = 0;
//				$scope.stream.opendata.language = null;
//				$scope.stream.externalReference = null;
				// FIXME serve?	//$scope.stream.codeSlug = null;
				//$scope.stream.tenantssharing = {};
				//$scope.stream.tenantssharing.tenantsharing = [];
	//			var ownerTenant = {"idTenant":newTenantSharing.idTenant, 
	//				"tenantName": newTenantSharing.tenantName, 
	//				"tenantDescription": newTenantSharing.tenantDescription, 
	//				"tenantCode": $scope.tenantCode, 
	//				"isOwner": 1
	//			};
	//			$scope.stream.tenantssharing.tenantsharing.push(ownerTenant);
			}
		}
//		if(!$scope.stream.tenantssharing || $scope.stream.tenantssharing == null)
//			 $scope.stream.tenantssharing = {};
//		if(!$scope.stream.tenantssharing.tenantsharing || $scope.stream.tenantssharing.tenantsharing)
//			 $scope.stream.tenantssharing.tenantsharing = [];

	};
	


	$scope.selectSoChange =  function(){
		console.log("selectSoChange", this.extra);
		if(Helpers.util.has(this.extra.selectedSo, 'soType.idSoType') && this.extra.selectedSo.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			$scope.stream.twitterInfoRequest =  {
					"twtratepercentage": 100,
					"twtlang": "it"
			};
			$scope.twitterPollingInterval  = this.extra.selectedSo.twtmaxstreams*5+1;
			var totalStream  = 0;
			if($scope.streamsList){
				for (var streamIndex = 0; streamIndex < $scope.streamsList.length; streamIndex++) {
					if($scope.streamsList[streamIndex].smartobject.socode == this.extra.selectedSo.socode)
						totalStream++;
				}
				
			}
			if(totalStream>= $scope.extra.selectedSo.twtmaxstreams) 
				$scope.forms.registerStreamForm.inputSo.$setValidity("streamCount", false);
			else
				$scope.forms.registerStreamForm.inputSo.$setValidity("streamCount", true);
		
		}
		else if($scope.stream){
			delete $scope.stream["twitterInfoRequest"];
		}
	};
	
	
	
//	$scope.selectSo_old= function(soCode){
//		console.log("selectSo", soCode);
//		//console.log("$scope.registerStreamForm", $scope.forms.registerStreamForm);
//		for (var k = 0; k < $scope.soList.length; k++) {
//			if($scope.soList[k].soCode == soCode){
//				$scope.stream.idTipoVE = $scope.virtualEntitiesList[k].idTipoVe;
//				if($scope.stream.idTipoVE == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
//					$scope.stream.twtUserToken = $scope.virtualEntitiesList[k].twtUsertoken;
//					$scope.stream.twtTokenSecret = $scope.virtualEntitiesList[k].twtTokenSecret;
//					$scope.twitterPollingInterval  = $scope.virtualEntitiesList[k].twtMaxStreams*5+1;
//				}
//				if($scope.stream.idTipoVE == Constants.VIRTUALENTITY_TYPE_TWITTER_ID && $scope.virtualEntitiesList[k].usedStreamCount>=$scope.virtualEntitiesList[k].twtMaxStreams)
//					$scope.forms.registerStreamForm.inputSo.$setValidity("streamCount", false);
//				else
//					$scope.forms.registerStreamForm.inputSo.$setValidity("streamCount", true);
//				break;
//			}
//		}
//		if($scope.stream.idTipoVE == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
//			$scope.stream.twtratepercentage = 100;
//			$scope.stream.twtlang="it";
//			
//		}
//		//else
//		//	$scope.stream.twtRatePercentage = 0;
//		console.log("selectVirtualEntity", $scope.stream.idTipoVE);
//		console.log("$scope.stream", $scope.stream);
//	};

	
	
	$scope.loadStreamComponents = function(existingStream){
		fabricAPIservice.getStream(existingStream.codiceTenant,existingStream.codiceVirtualEntity,existingStream.streamcode).then(function(response) {
			var stream = response.streams.stream;
			for (var i = 0; i < $scope.internalStreams.length; i++) {
				if($scope.internalStreams[i].idStream==stream.idStream){
					$scope.internalStreams[i].componenti = {}; 
					$scope.internalStreams[i].components = Helpers.util.initArrayZeroOneElements(stream.components);
				}
			}
		});

	};

	$scope.loadStream();
	
	$scope.newComponent = null;
	$scope.addComponent = function(newComponent){
		console.log("addComponent", this.newComponent);
		$scope.validationRes=2;
		//FIXME deployment version???
		//var newComponentSinceVersion =$scope.stream.deploymentVersion;
		if(this.newComponent!=null){
			if(validateComponent(-1,this.newComponent)){
				if ($scope.stream.components.length>0)	{
					this.newComponent.order = $scope.stream.components[$scope.stream.components.length-1].order+1;
				}
				else { 
					this.newComponent.order = 0;
				}
				$scope.stream.components.push(this.newComponent);
				$scope.newComponent = null;
				this.newComponent = null;
			}
		}
		return false;
	};

	
	$scope.addComponent_old = function(newComponentName, newComponentUnitOfMeasurement, newComponentTolerance, newComponentPhenomenon,newComponentDataType){
		
		$scope.validationRes=2;
		var newComponentSinceVersion =$scope.stream.deploymentVersion;
		
		var component = validateComponent(-1, newComponentName, newComponentUnitOfMeasurement, newComponentTolerance, newComponentPhenomenon, newComponentDataType, newComponentSinceVersion);
		console.log("newComponent",component);
		if(component!=null){
			if ($scope.stream.components.length>0)	{
				component.order = $scope.stream.components[$scope.stream.components.length-1].order+1;
			}
			else { 
				component.order = 0;
			}
			$scope.stream.components.push(component);
			component = null;
		}
		
		return false;
	};

	$scope.removeComponent = function(index){
		$scope.validationRes=2;
		$scope.stream.components.splice(index,1);
		return false;
	};
	
	$scope.startEditComponent = function(index){
		$scope.warningMessages = [];
		$scope.insertComponentErrors = [];
		$scope.editingComponentIndex = index;
		$scope.validationRes=2;
		var c = $scope.stream.components[index];
		$scope.editComponentName=c.nome;
		$scope.editComponentUnitOfMeasurement = {};
		$scope.editComponentUnitOfMeasurement.idMeasureUnit = c.idMeasureUnit;
		$scope.editComponentUnitOfMeasurement.measureUnit = c.measureunit;
		$scope.editComponentUnitOfMeasurement.measureUnitCategory = c.measureunitcategory;
		$scope.editComponentTolerance = c.tolerance;
		$scope.editComponentPhenomenon = {};
		$scope.editComponentPhenomenon.idPhenomenon = c.idPhenomenon;
		$scope.editComponentPhenomenon.phenomenon = c.phenomenonname;
		$scope.editComponentPhenomenon.phenomenonCategory = c.phenomenoncetegory;
	};
	
	$scope.cancelEditComponent = function(index){
		$scope.editingComponentIndex = -1;
	};
	
	$scope.editComponent = function(index, editComponentUnitOfMeasurement, editComponentTolerance, editComponentPhenomenon){
		$scope.validationRes=2;
		var editComponentDataType = {};
		var editComponentName = $scope.stream.components[index].nome;
		editComponentDataType.idDataType = $scope.stream.components[index].idDataType;
		editComponentDataType.dataType = $scope.stream.components[index].dataType;

		editComponentUnitOfMeasurement.measureunitcategory = $scope.stream.components[index].measureUnitCategory;
		editComponentPhenomenon.phenomenoncetegory = $scope.stream.components[index].phenomenonCategory;
		if(!editComponentTolerance) 
			editComponentTolerance = "0";
		editComponentSinceVersion = $scope.stream.components[index].sinceVersion;

		
		var component = validateComponent(index, editComponentName, editComponentUnitOfMeasurement, editComponentTolerance, editComponentPhenomenon, editComponentDataType, editComponentSinceVersion);
		
		if(component!=null){
			component.idComponente = $scope.stream.components[index].idComponente;
			
			if(typeof $scope.stream.components[index].order != 'undefuned' && $scope.stream.components[index].order!=null){
				component.order = $scope.stream.components[index].order;
			}else{
				if ($scope.stream.components.length>0)	{
					component.order = $scope.stream.components[$scope.stream.components.length-1].order+1;
				}
				else { 
					component.order = 0;
				}
			}
			$scope.stream.components[index] = component;
			$scope.editingComponentIndex = -1;
		}
		
		return false; 
	};
	
	var validateComponent = function(index, component){
		console.log("validateComponent component",component);
		$scope.updateWarning = false;
		$scope.warningMessages = [];
		$scope.insertComponentErrors = [];

		if(component.name!=null && component.name!=""){
			if(component.name.indexOf(' ') >= 0){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_NOSPACE');
			} else if(component.name.match(Constants.VALIDATION_PATTERN_ACCENT)){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID');
			} else if(component.name.toLowerCase() === 'time'){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_RESERVED_WORD_TIME');
			} else {

				for (var int = 0; int < $scope.stream.components.length; int++) {
					if($scope.stream.components[int].name.toUpperCase() == component.name.toUpperCase() && int!=index){
						$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE');
						break;
					}
				}
	
			}
		} else
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED');

		if(typeof component.measureUnit == 'undefined' || component.measureUnit == null){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_UNIT_OF_MEASUREMENT_REQUIRED');
		}
		else{
			component.idMeasureUnit = component.measureUnit.idMeasureUnit;
		}
		
		if(typeof component.tolerance == 'undefined' || component.tolerance == null){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED');
		} else {
			if( !Helpers.util.isNumber(component.tolerance))
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_NOT_NUMBER');
		}

		if(typeof component.phenomenon == 'undefined' || component.phenomenon == null){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_PHENOMENON_REQUIRED');
		}
		else{
			component.idPhenomenon = component.phenomenon.idPhenomenon;
		}
		
		
		if(typeof component.dataType == 'undefined' || component.dataType == null){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TYPE_REQUIRED');
		}
		else{
			component.idDataType = component.dataType.idDataType;
		}
		
		console.log("validateComponent result ", $scope.insertComponentErrors, $scope.insertComponentErrors.length);

		return $scope.insertComponentErrors.length==0;
	};
	
	$scope.finishEditComponent = function(index){
		$scope.editingComponentIndex = index;
		return false;
	};
	

	$scope.$on('addTag', function(e, selectedTag) {  
       console.log("addTag child", e, selectedTag);  
       addTag(selectedTag);
    });
	
	$scope.newTag = {};
	var addTag = function(newTag){
		console.log("addTag ", newTag);
		if(newTag){
			var found = false;	
			for (var int = 0; int < $scope.stream.tags.length; int++) {
				var existingTag = $scope.stream.tags[int];
				if(existingTag == newTag.idTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.stream.tags.push(newTag.idTag);
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
		$scope.stream.tags.splice(index,1);
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
			if(typeof $scope.stream.sharingTenants == 'undefined' || $scope.stream.sharingTenants == null){
				$scope.stream.sharingTenants = [];
			}
			
			for (var int = 0; int < $scope.stream.sharingTenants.length; int++) {
				var existingTenantSharing = $scope.stream.sharingTenants[int];
				console.log("existing",existingTenantSharing);
				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
					console.log("found");
					found = true;
					break;
				}

			}
			if(!found){
				$scope.stream.sharingTenants.push(newTenantSharing);
				console.log("added",$scope.stream.sharingTenants);
			}
		}

		return false;
	};

	$scope.removeTenantSharing = function(index){
		$scope.stream.sharingTenants.splice(index,1);
		return false;
	};
	
	$scope.selectedIcon;
	$scope.onIconSelect = function($files) {
		$scope.selectedIcon = $files[0];
		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.STREAM_ICON_MAX_FILE_SIZE){
			$scope.choosenIconSize = $scope.selectedIcon.size; 
			$scope.updateWarning = true;
			$scope.selectedIcon = null;
		}
		else
			readPreview();
	};
	
	var readPreview = function(){
		readFilePreview.readImageFile($scope.selectedIcon).then(
				function(contents){
					console.log("contents" , contents);
					$scope.stream.icon = contents;
				}, 
				function(error){ //FIXME ??? icona?
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};

	$scope.canInstall = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.canUnistall = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};

	$scope.canEdit = function() {
	
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};
	

	$scope.canCreateNewVersion = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};

	
//	$scope.selectVirtualentity = function(){
//		$scope.stream.codiceVirtualEntity = $scope.virtualentitycodeVirtualEntity;
//	};

	$scope.save = function(){
		console.log("save stream", $scope.stream);
		if($scope.isNewStream)
			$scope.createStream($scope.stream);
		else
			$scope.updateStream($scope.stream);
	};
	
	$scope.cancel = function(){    
		$location.path('management/streams/'+$scope.tenantCode);
	};
		
	/*
	 * UPDATE STREAM
	 */
	$scope.updateStream = function() {
		
		$scope.stream.name=$scope.stream.streamname;

		//Ciclo per rivalorizzazione dell'array dei tag (l'API di update richiede un array di IdTag)
		//Old tag --> tag precedentemente inseriti in fase di creazione dello stream
		$scope.stream.oldTags= [];
		if ($scope.stream.tags && $scope.stream.tags.length >0 ) {
			for (var int = 0; int < $scope.stream.tags.length; int++)  {
				if ($scope.stream.tags[int].hasOwnProperty('idTag')){
					$scope.stream.oldTags.push($scope.stream.tags[int].idTag);
					$scope.removeTag(int);
					$scope.stream.tags.splice( int, 0, $scope.stream.oldTags[int] );
				}
			}
		}
			
		if($scope.validationRes!=0 && $scope.extra.isInternal){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			Helpers.util.scrollTo("validateMsg");
		}
		else{	
			$scope.validationRes=2;
			$scope.updateInfo = null;
			$scope.updateWarning = null;
			$scope.warningMessages = [];
			$scope.updateError = null;
	
			var newStream = new Object();	
			newStream.stream =  $scope.stream;  

			if($scope.extra.isInternal)
				newStream.stream.internalquery=  $scope.streamSiddhiQuery;
			
			newStream.stream.streamInternalChildren={};
			newStream.stream.streamInternalChildren.streamChildren=[];
			for(var i = 0; i< $scope.internalStreams.length; i++){
				newStream.stream.streamInternalChildren.streamChildren.push({
					"aliasChildStream":"input"+i,
					"idChildStream": $scope.internalStreams[i].idStream
				});
			}

			console.log("newStream", newStream);
			if(!$scope.stream.components || $scope.stream.components.length==0){
				$scope.updateWarning = true;
				$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
			}
			
			if(!$scope.stream.openData && !($scope.stream.openData.opendataupdatedate || $scope.stream.openData.opendataexternalreference || $scope.stream.openData.lastupdate || $scope.stream.openData.opendataauthor || $scope.stream.openData.opendatalanguage)){
				delete newStream.stream['openData'];
			} else {
				if(Helpers.util.has(newStream, 'openData.opendataupdatedate') )	{				
					//$scope.stream.opendata.opendataupdatedate =  new Date($scope.stream.opendata.opendataupdatedate).getTime();
						var date =  new Date(newStream.openData.opendataupdatedate);	
						var year = (date.getFullYear()).toString();
						var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
						var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
						newStream.stream.openData.opendataupdatedate= year+month+day;	
				}
			}
	
			console.log("updateStream - stream",newStream);
			if($scope.stream.license && $scope.stream.license.description==null && $scope.stream.license.licesecode==null)
				delete newStream.stream['license'];

			if($scope.stream.visibility == 'public')
				delete newStream.stream['sharingTenants'];
			if($scope.stream.visibility != 'private')
				delete newStream.stream['copyright'];
				
			adminAPIservice.updateStream(info.getActiveTenant(), newStream.stream.smartobject.socode,newStream.stream).success(function(response) {
				console.log("updateStream SUCCESS", response);
				Helpers.util.scrollTo();
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO';
				sharedAdminResponse.setResponse($scope.admin_response);
				$scope.isUpdating = false;
				//$location.path('management/viewStream/'+$scope.tenantCode +'/'+stream.codiceVirtualEntity+'/'+newStream.stream.streamcode);
	
			}).error(function(response){
				console.error("updateStream ERROR", response);
				Helpers.util.scrollTo();
				$scope.isUpdating = false;
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_SAVE_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
			});
		}
	};
			/*
			$scope.isUpdating = true;

			promise.then(function(result) {
				Helpers.util.scrollTo();
				$scope.isUpdating = false;
				$scope.updateInfo = {status: result.status};
				$scope.loadStream();

			}, function(result) {
				Helpers.util.scrollTo();
				$scope.isUpdating = false;
				$scope.updateError = angular.fromJson(result.data);
				console.log("result.data ", result.data);
				if(result.data && result.data.error_code == "YuccaInternaApiFiledNameException")
					result.data.error_message = "MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID";
				$scope.loadStream();
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		};
		}*/
	

	$scope.requestInstallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_INST);
	};

	$scope.requestUnistallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_UNINST);
	};

	$scope.createNewVersion = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_NEW_VERSION);
	};
	
	$scope.soList = [];
	//$scope.extra.inputTypeStream = 1;

	adminAPIservice.loadSmartobjects(info.getActiveTenant(), info.getActiveTenant().tenantCode).success(function(response) {
		console.log(response);
		for (var int = 0; int < response.length; int++) {
			var so = response[int];
			if(so.soType.idSoType != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
				$scope.soList.push(so);
			}else{
				soInternal=so;
			}

		}
	});
//	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
//		console.log(response.virtualEntities.virtualEntity);
//		for (var int = 0; int < response.virtualEntities.virtualEntity.length; int++) {
//			var virtualentity = response.virtualEntities.virtualEntity[int];
//			if(virtualentity.idTipoVe != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
//				$scope.virtualEntitiesList.push(virtualentity);
//			}else{
//				$scope.virtualentityInternal=virtualentity;
//			}
//
//		}
//	});


		    	
	$scope.checkTwitterQuery = function(){
		var twitterQuery = {};
		twitterQuery.twtQuery = $scope.stream.twitterInfoRequest.twtquery;
		if($scope.stream.twitterInfoRequest.twtgeoloclat && $scope.stream.twitterInfoRequest.twtgeoloclat>0)
			twitterQuery.twtGeolocLat = $scope.stream.twitterInfoRequest.twtgeoloclat;
		if($scope.stream.twitterInfoRequest.twtgeoloclon && $scope.stream.twitterInfoRequest.twtgeoloclon>0)
			twitterQuery.twtGeolocLon = $scope.stream.twitterInfoRequest.twtgeoloclon;
		if($scope.stream.twitterInfoRequest.twtgeolocradius && $scope.stream.twitterInfoRequest.twtgeolocradius>0)
			twitterQuery.twtGeolocRadius = $scope.stream.twitterInfoRequest.twtgeolocradius;
		twitterQuery.twtGeolocunit = $scope.stream.twitterInfoRequest.twtgeolocunit;
		twitterQuery.twtLang = $scope.stream.twitterInfoRequest.twtlang;
		
		twitterQuery.twtUserToken = $scope.extra.selectedSo.twtusertoken;
		twitterQuery.twtTokenSecret = $scope.extra.selectedSo.twttokensecret;
		
		twitterQuery.streamCode = $scope.stream.streamcode;
		twitterQuery.streamVersion = $scope.stream.version?$scope.stream.version:1;
		twitterQuery.tenatcode = $scope.tenantCode;
		twitterQuery.virtualEntityCode = $scope.extra.selectedSo.soCode;
		
		console.log("checkTwitterQueryResult", twitterQuery);
		
		$scope.checkTwitterQueryResult = {};
		$scope.checkTwitterQueryResult.result = 'LOADING';
		fabricAPIservice.checkTwitterQuery(twitterQuery).success(function(response) {
			console.log("checkTwitterQuery - success", response);
			$scope.checkTwitterQueryResult = response;

		}).error(function(data, status, headers, config) {
			console.log("checkTwitterQuery - error", data);
			$scope.checkTwitterQueryResult = data;
		});
	};

	var updateLifecycle = function(action) {
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo();
		var promise   = fabricAPIservice.lifecycleStream(action, $scope.stream);
		promise.then(function(result) {
			console.log("result updateLifecycle ", result);
			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
			$scope.updateInfo = {status: result.status};
			$scope.loadStream();
		}, function(result) {
			$scope.updateError = angular.fromJson(result.data);
			console.log("result.data ", result.data);

			$scope.loadStream();
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};
	
	
	/*
	 * CREATE STREAM
	 */
	$scope.createStream = function(){

		console.log("createStream", $scope.stream);
		$scope.stream.privacyacceptance=$scope.privacyAcceptance & $scope.responsabilityAcceptance;
		$scope.stream.name=$scope.stream.streamname;
		
		if($scope.validationRes!=0 && $scope.stream.codiceVirtualEntity=="internal"){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			$scope.goToComponents();
			//Helpers.util.scrollTo("validateMsg");
		}else{	

			//if($scope.extra.selectedSo.soCode=="internal")
			//	$scoep..internalQuery=  $scope.streamSiddhiQuery;
//			newStream.stream.streamInternalChildren={};
//			newStream.stream.streamInternalChildren.streamChildren=[];
//			for(var i = 0; i< $scope.internalStreams.length; i++){
//				newStream.stream.streamInternalChildren.streamChildren.push({
//					"aliasChildStream":"input"+i,
//					"idChildStream": $scope.internalStreams[i].idStream
//				});
//			}
			//FIXME internal stream da rivedere
			
				if ($scope.stream.visibility=='private' || ($scope.stream.visibility=='public' && !$scope.stream.isOpendata )){
					delete $scope.stream['openData'];
				} else {
					if(Helpers.util.has($scope.stream, 'openData.opendataupdatedate') )	{				
					
						var date =  new Date($scope.stream.openData.opendataupdatedate);	
						var year = (date.getFullYear()).toString();
						var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
						var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
						$scope.stream.openData.opendataupdatedate= year+month+day;	
					}
				}
	
			$scope.isUpdating = true;
			
			//Valorizzazione parametri obbligatori richiesti dall'API
			$scope.stream.idTenant = info.getActiveTenant().idTenant;
			for (var int = 0; int < $scope.stream.components.length; int++) {
				$scope.stream.components[int].alias=$scope.stream.components[int].name;
				$scope.stream.components[int].inorder=int;
				$scope.stream.components[int].required = false;
			}
			
			//VALORIZZAZIONE CAMPI LICENCE - INSERIRE SUGGEST
			$scope.stream.license.description=$scope.stream.license.licensecode;
			$scope.stream.license.idLicense='43';

			console.log("createStream - stream", $scope.stream);
			console.log("createStream - selectedSo", $scope.extra.selectedSo);

			
			adminAPIservice.createStream(info.getActiveTenant(), $scope.extra.selectedSo.socode,$scope.stream).success(function(response) {
				console.log("createStream SUCCESS", response);
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_SAVED_INFO';
				sharedAdminResponse.setResponse($scope.admin_response);
				$scope.isUpdating = false;
				//$location.path('management/viewStream/'+$scope.tenantCode +'/'+stream.codiceVirtualEntity+'/'+newStream.stream.streamcode);

			}).error(function(response){
				console.error("createStream ERROR", response);
				$scope.isUpdating = false;
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_SAVE_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;

			});

			/*
			var promise   = fabricAPIservice.createStream($scope.tenantCode, stream.codiceVirtualEntity,  newStream);
			promise.then(function(result) {
				$scope.isUpdating = false;
				console.log("result qui ", result);
				$location.path('management/viewStream/'+$scope.tenantCode +'/'+stream.codiceVirtualEntity+'/'+newStream.stream.streamcode);
			}, function(result) {
				$scope.isUpdating = false;
				$scope.creationError = angular.fromJson(result.data);
				if(result.data && result.data.error_code == "YuccaInternaApiFiledNameException"){
					result.data.error_message = "MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID";
					$scope.goToComponents();
				}
				console.log("result.data ", result.data);
			}, function(result) {
				console.log('Got notification: ' + result);
			});*/
		}
	
	};
	
//	$scope.createStream_old = function(stream) {
//		console.log("createStream", stream);
//		stream.privacyacceptance=$scope.accettazionePrivacy & $scope.accettazioneResponsability;
//
//		var newStream = new Object();
//		newStream.stream = stream;
////		if(!newStream.stream.twtGeolocLat || newStream.stream.twtGeolocLat==null || newStream.stream.twtGeolocLat=="") newStream.stream.twtGeolocLat = 0;
////		if(!newStream.stream.twtGeolocLon || newStream.stream.twtGeolocLon==null || newStream.stream.twtGeolocLon=="") newStream.stream.twtGeolocLon = 0;
////		if(!newStream.stream.twtGeolocRadius || newStream.stream.twtGeolocRadius==null || newStream.stream.twtGeolocRadius=="") newStream.stream.twtGeolocRadius = 0;
////		if(!newStream.stream.twtRatePercentage || newStream.stream.twtRatePercentage==null || newStream.stream.twtRatePercentage=="") newStream.stream.twtRatePercentage = 100;
//
//		
//		if($scope.validationRes!=0 && $scope.stream.codiceVirtualEntity=="internal"){
//			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
//			$scope.validationRes=1;
//			$scope.goToComponents();
//			//Helpers.util.scrollTo("validateMsg");
//		}else{	
//
//			if($scope.stream.codiceVirtualEntity=="internal")
//				newStream.stream.internalQuery=  $scope.streamSiddhiQuery;
//			newStream.stream.streamInternalChildren={};
//			newStream.stream.streamInternalChildren.streamChildren=[];
//			for(var i = 0; i< $scope.internalStreams.length; i++){
//				newStream.stream.streamInternalChildren.streamChildren.push({
//					"aliasChildStream":"input"+i,
//					"idChildStream": $scope.internalStreams[i].idStream
//				});
//			}
//			
//			if (newStream.stream.visibility=='private'){
//				newStream.stream.opendata = {};
//				newStream.stream.opendata.isOpendata = 0;
//				newStream.stream.opendata.author = null;
//				newStream.stream.opendata.dataUpdateDate = 0;
//				newStream.stream.opendata.language = null;
//			} else {
//				var opendataDate = new Date(newStream.stream.opendata.dataUpdateDate);
//				newStream.stream.opendata.dataUpdateDate = opendataDate.getTime();
//			}
//
//			console.log("createStream - newStream", newStream);
//
//			$scope.isUpdating = true;
//			var promise   = fabricAPIservice.createStream($scope.tenantCode, stream.codiceVirtualEntity,  newStream);
//			promise.then(function(result) {
//				$scope.isUpdating = false;
//				console.log("result qui ", result);
//				$location.path('management/viewStream/'+$scope.tenantCode +'/'+stream.codiceVirtualEntity+'/'+newStream.stream.streamcode);
//			}, function(result) {
//				$scope.isUpdating = false;
//				$scope.creationError = angular.fromJson(result.data);
//				if(result.data && result.data.error_code == "YuccaInternaApiFiledNameException"){
//					result.data.error_message = "MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID";
//					$scope.goToComponents();
//				}
//				console.log("result.data ", result.data);
//			}, function(result) {
//				console.log('Got notification: ' + result);
//			});
//		}
//	};	

	$scope.cloneStream = function(){
		console.log("cloneStream");
		sharedStream.setStream($scope.stream);
		$location.path('management/newStream/'+$scope.tenantCode);
	};

	console.log("Stream - ", $scope.stream);
} ]);

