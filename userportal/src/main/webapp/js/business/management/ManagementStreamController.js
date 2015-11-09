

appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', '$translate', 
                                                        function($scope, $route, $location, fabricAPIservice, info,  $translate) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;
	$scope.showLoading = true;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	
	console.log("isOwner", info.isOwner( $scope.tenantCode));

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	fabricAPIservice.getVisibleStreams().then(function(response) {

		$scope.showLoading = false;

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].codiceTenant == $scope.tenantCode){
				if(!responseList[i].deploymentStatusCode || responseList[i].deploymentStatusCode == null)
					responseList[i].deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
				responseList[i].deploymentStatusCodeTranslated =  $translate.instant(responseList[i].deploymentStatusCode);
				
				responseList[i].statusIcon = Helpers.stream.statusIcon(responseList[i]);
				if(!responseList[i].streamIcon || responseList[i].streamIcon == null){
					responseList[i].streamIcon  = "img/stream-icon-default.png";
				}
				$scope.streamsList.push(responseList[i]);
			}

		}
		
		//$scope.streamsList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		$scope.totalItems = $scope.streamsList.length;
		//	$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream);
	};

	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(stream.deploymentStatusDesc) || keyword.test(stream.deploymentStatusCodeTranslated);
	};

	$scope.viewUnistalledFilter = function(stream) {
		if(!$scope.viewUnistalledCheck){
			var keyword = new RegExp(Constants.STREAM_STATUS_UNINST, 'i');
			return !keyword.test(stream.deploymentStatusDesc);
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

	$scope.$watch('statusFilter', function(newStatus) {
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

			$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteStream = function(){
		//alert("Funzionalita non ancora abilitata!");
		if($scope.selectedStreams.length>0){
			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);

appControllers.controller('ManagementStreamWizardCtrl', [ '$scope', function($scope) {
//	$scope.goToShare  = function(){$scope.currentStep = 'share';refreshWizardToolbar();};

} ]);


appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'info','$timeout',"$filter", 'readFilePreview', '$location', 'sharedStream',
                                                    function($scope, $routeParams, fabricAPIservice, info,$timeout,$filter,readFilePreview,$location, sharedStream) {
	$scope.tenantCode = $routeParams.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	$scope.validationRes=2;
	$scope.errorMsg="Errore";
	$scope.successMsg="Successo";
	$scope.updateInfo = null;
	$scope.updateWarning = null;
	$scope.updateError = null;
	$scope.insertComponentErrors = [];
	$scope.wsUrl ="";
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

	refreshWizardToolbar();
	$scope.goToRegister  = function(){ $scope.currentStep = 'register'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToDetail  = function(){ $scope.currentStep = 'detail';refreshWizardToolbar();};
	$scope.goToComponents  = function(){
		console.log("goToComponents",$scope.stream.idTipoVE);
		console.log("Constants.VIRTUALENTITY_TYPE_TWITTER_ID",Constants.VIRTUALENTITY_TYPE_TWITTER_ID);
		if($scope.stream.idTipoVE == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			$scope.currentStep = 'tweetdata';refreshWizardToolbar();
		}
		else
			$scope.currentStep = 'components';refreshWizardToolbar();
	};
	$scope.goToShare  = function(){
		if($scope.stream.idTipoVE != Constants.VIRTUALENTITY_TYPE_TWITTER_ID && (!$scope.stream.componenti.element || $scope.stream.componenti.element.length==0)){
			$scope.updateWarning = true;
			$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
		}
		else{
			$scope.currentStep = 'share';refreshWizardToolbar();
		}

	};

	$scope.defaultQuery = Constants.DEFAULT_SIDDHI;

	$scope.internalStreams = [];
	$scope.extra = {};
	$scope.extra.inputTypeStream = 1;
	//$scope.streamSelectedItem=null;	
	$scope.streamSiddhiQuery="insert query here;";
	$scope.streamSiddhiMirror="";
	$scope.streamsList = [];

	$scope.addStreamToArray = function(streamSelectedItem){
		$scope.validationRes=2;
		
		streamSelectedItem.componenti = new Object();
		$scope.internalStreams.push(streamSelectedItem);
		$scope.loadStreamComponents(streamSelectedItem);		
		//$scope.streamSelectedItem=null;
	};

	$scope.cancelStreamToArray = function(index){
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

		if($scope.stream.componenti==null || $scope.stream.componenti.element==null || $scope.stream.componenti.element.length==0){
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
			if($scope.internalStreams[st].componenti!= null && $scope.internalStreams[st].componenti.element!=null ){
				var componenti = $scope.internalStreams[st].componenti.element;
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
		if($scope.stream.componenti!= null && $scope.stream.componenti.element!=null ){
			var componenti = $scope.stream.componenti.element;
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

	fabricAPIservice.getVisibleStreams().then(function(response) {

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].deploymentStatusCode && 	responseList[i].deploymentStatusCode == Constants.STREAM_STATUS_INST  && responseList[i].tipoVirtualEntity!='Internal'){
				$scope.streamsList.push(responseList[i]);					
			}
		}
		
		$scope.streamsList.sort(function(a,b) { 
				return a.nomeStream.toString().toLowerCase().localeCompare(b.nomeStream.toString().toLowerCase());
				//return (a.nomeStream.toString().toLowerCase() > b.nomeStream.toLowerCase()) - (a.nomeStream.toLowerCase() < b.nomeStream.toLowerCase());
			} );
	});

	fabricAPIservice.getTenants().success(function(response) {
		console.debug("response", response.tenants);
		try{
			$scope.tenantsList = [];
			for (var int = 0; int <  response.tenants.tenant.length; int++) {
				var t = response.tenants.tenant[int];
				if(t.tenantCode!=$scope.tenantCode)
					$scope.tenantsList.push(t);
			}
		}
		catch (e) {
			log.error("getTenants ERROR",e);
		}
		
	});

	$scope.tagList = [];
	$scope.domainList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			$scope.tagList.push(response.streamTags.element[int].tagCode);
		}
	});

	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.unitOfMesaurementList = [];
	fabricAPIservice.getStreamUnitOfMesaurement().success(function(response) {
		$scope.unitOfMesaurementList = response.measureUnit.element;
	});


	$scope.phenomenomList = [];
	fabricAPIservice.getStreamPhenomenom().success(function(response) {
		$scope.phenomenomList = response.Phenomenon.element;
	});

	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
	});

	$scope.componentJsonExample = "{\"stream\": \"....\",\n \"sensor\": \"....\",\n \"values\":\n  [{\"time\": \"....\",\n    \"components\":\n     {\"wind\":\"1.4\"}\n  }]\n}";

	$scope.stream = {};
//	$scope.stream.saveData = '0';
//	$scope.stream.visibility = 'public';
//	$scope.stream.publish = 0;
	
	$scope.isNewStream = false;
	if(!$routeParams.entity_code || $routeParams.entity_code == null || $routeParams.entity_code === undefined ||!$routeParams.stream_code || $routeParams.stream_code == null || $routeParams.stream_code === undefined )
		$scope.isNewStream = true;
	
	$scope.loadStream = function(){
		if(!$scope.isNewStream){
			fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.entity_code, $routeParams.stream_code).then(function(response) {
				$scope.stream = response.streams.stream;
				console.log("loadStream",response.streams.stream);
				
				
				//FIXME publishStream forced to true , delete this line when the radio button is enabled.
				$scope.stream.publishStream=1;
				
	
				if($scope.stream.visibility==null){
					$scope.stream.visibility = 'public';
				}
				console.debug("$scope.stream internal before clean",$scope.stream);
				if(!$scope.stream.streamInternalChildren || !$scope.stream.streamInternalChildren.streamChildren){
					$scope.stream.streamInternalChildren={};
					$scope.stream.streamInternalChildren.streamChildren=[];
				}
	
				$scope.stream.streamInternalChildren.streamChildren=Helpers.util.initArrayZeroOneElements($scope.stream.streamInternalChildren.streamChildren);
	
				for(var i =0 ; i<$scope.stream.streamInternalChildren.streamChildren.length;i++){
					var existingStream =  $scope.stream.streamInternalChildren.streamChildren[i];
	
					$scope.loadStreamComponents(existingStream);
				}
	
				if(!$scope.stream.streamIcon || $scope.stream.streamIcon == null)
					$scope.stream.streamIcon  = "img/stream-icon-default.png";
	
				if( $scope.stream.internalQuery && $scope.stream.internalQuery["@nil"]){
					$scope.stream.internalQuery=null;
				}
				console.debug("$scope.stream.internalQuery ",$scope.stream.internalQuery);
	
				$scope.streamSiddhiMirror= $scope.stream.internalQuery;	
				setTimeout(function(){
							  $scope.$apply(function(){
								  $scope.streamSiddhiQuery=$scope.streamSiddhiMirror;
							  });
						  }, 100);
	
				$scope.internalStreams=$scope.stream.streamInternalChildren.streamChildren;
	
				console.debug("$scope.stream internal",$scope.stream);
				if(!$scope.stream.streamTags)
					$scope.stream.streamTags = new Object();
				$scope.stream.streamTags.tag = Helpers.util.initArrayZeroOneElements($scope.stream.streamTags.tag);
	
				if($scope.stream.componenti == null)
					$scope.stream.componenti = new Object();
				$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);
	
				if(!$scope.stream.deploymentStatusCode || $scope.stream.deploymentStatusCode == null)
					$scope.stream.deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
	
				$scope.stream.domain = $scope.stream.domainStream;
				$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
				
				if($scope.stream.tenantssharing &&  $scope.stream.tenantssharing !=null &&  $scope.stream.tenantssharing.tenantsharing &&  $scope.stream.tenantssharing.tenantsharing !=null
						&& $scope.stream.tenantssharing.tenantsharing.length>0){
					for (var i = 0; i < $scope.stream.tenantssharing.tenantsharing.length; i++) {
						if($scope.stream.tenantssharing.tenantsharing[i].isOwner==0)
							$scope.addTenantSharing($scope.stream.tenantssharing.tenantsharing[i]);
					}
				}
				if($scope.stream.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID && $scope.stream.twtMaxStreamsOfVE){
					$scope.twitterPollingInterval  = $scope.stream.twtMaxStreamsOfVE*5+1;
				}

			});
		} else {
			var streamClone = sharedStream.getStream();
			if(streamClone!=null){
				streamClone.statoStream = null;
				streamClone.codiceStream = null;
				$scope.stream = streamClone;

				console.log("streamClone", streamClone);

				if(streamClone.codiceVirtualEntity == "internal"){
					$scope.extra.inputTypeStream = 0;
					$scope.internalStreams = $scope.stream.streamInternalChildren.streamChildren;
					$scope.streamSiddhiQuery = $scope.stream.internalQuery;
				}

				sharedStream.setStream(null);
			}
			else{
				$scope.stream  = {};
				$scope.stream.visibility = 'public';
				$scope.stream.streamIcon  = "img/stream-icon-default.png";
				$scope.stream.streamTags = {};
				$scope.stream.streamTags.tag = [];
				$scope.stream.componenti = {};
				$scope.stream.componenti.element = [];
				$scope.stream.saveData = 1;
				$scope.stream.publishStream = 1;
				$scope.stream.deploymentVersion = 1;
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

	$scope.selectVirtualEntity = function(virtualEntityCode){
		console.log("selectVirtualEntity", virtualEntityCode);
		console.log("$scope.registerStreamForm", $scope.forms.registerStreamForm);
		for (var k = 0; k < $scope.virtualEntitiesList.length; k++) {
			if($scope.virtualEntitiesList[k].codeVirtualEntity == virtualEntityCode){
				$scope.stream.idTipoVE = $scope.virtualEntitiesList[k].idTipoVe;
				if($scope.stream.idTipoVE == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
					$scope.stream.twtUserToken = $scope.virtualEntitiesList[k].twtUsertoken;
					$scope.stream.twtTokenSecret = $scope.virtualEntitiesList[k].twtTokenSecret;
					$scope.twitterPollingInterval  = $scope.virtualEntitiesList[k].twtMaxStreams*5+1;
				}
				if($scope.stream.idTipoVE == Constants.VIRTUALENTITY_TYPE_TWITTER_ID && $scope.virtualEntitiesList[k].usedStreamCount>=$scope.virtualEntitiesList[k].twtMaxStreams)
					$scope.forms.registerStreamForm.inputVirtualEntity.$setValidity("streamCount", false);
				else
					$scope.forms.registerStreamForm.inputVirtualEntity.$setValidity("streamCount", true);
				break;
			}
		}
		if($scope.stream.idTipoVE == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			$scope.stream.twtRatePercentage = 100;
			$scope.stream.twtLang="it";
			
		}
		//else
		//	$scope.stream.twtRatePercentage = 0;
		console.log("selectVirtualEntity", $scope.stream.idTipoVE);
		console.log("$scope.stream", $scope.stream);
	};

	$scope.loadStreamComponents = function(existingStream){
		fabricAPIservice.getStream(existingStream.codiceTenant,existingStream.codiceVirtualEntity,existingStream.codiceStream).then(function(response) {
			var stream = response.streams.stream;
			for (var i = 0; i < $scope.internalStreams.length; i++) {
				if($scope.internalStreams[i].idStream==stream.idStream){
					$scope.internalStreams[i].componenti = {}; 
					$scope.internalStreams[i].componenti.element = Helpers.util.initArrayZeroOneElements(stream.componenti.element);
				}
			}
		});

	};

	$scope.loadStream();
	$scope.addComponent = function(newComponentName, newComponentUnitOfMeasurement, newComponentTolerance, newComponentPhenomenon,newComponentDataType){
		
		$scope.validationRes=2;
		var newComponentSinceVersion =$scope.stream.deploymentVersion;
		
		var component = validateComponent(-1, newComponentName, newComponentUnitOfMeasurement, newComponentTolerance, newComponentPhenomenon, newComponentDataType, newComponentSinceVersion);
		console.log("newComponent",component);
		if(component!=null){
			if ($scope.stream.componenti.element.length>0)	{
				component.order = $scope.stream.componenti.element[$scope.stream.componenti.element.length-1].order+1;
			}
			else { 
				component.order = 0;
			}
			$scope.stream.componenti.element.push(component);
			component = null;
		}
		
		return false;
	};

	$scope.removeComponent = function(index){
		$scope.validationRes=2;
		$scope.stream.componenti.element.splice(index,1);
		return false;
	};
	
	$scope.startEditComponent = function(index){
		$scope.warningMessages = [];
		$scope.insertComponentErrors = [];
		$scope.editingComponentIndex = index;
		$scope.validationRes=2;
		var c = $scope.stream.componenti.element[index];
		$scope.editComponentName=c.nome;
		$scope.editComponentUnitOfMeasurement = {};
		$scope.editComponentUnitOfMeasurement.idMeasureUnit = c.idMeasureUnit;
		$scope.editComponentUnitOfMeasurement.measureUnit = c.measureUnit;
		$scope.editComponentUnitOfMeasurement.measureUnitCategory = c.measureUnitType;
		$scope.editComponentTolerance = c.tolerance;
		$scope.editComponentPhenomenon = {};
		$scope.editComponentPhenomenon.idPhenomenon = c.idPhenomenon;
		$scope.editComponentPhenomenon.phenomenon = c.phenomenon;
		$scope.editComponentPhenomenon.phenomenonCategory = c.phenomenonType;
	};
	
	$scope.cancelEditComponent = function(index){
		$scope.editingComponentIndex = -1;
	};
	
	$scope.editComponent = function(index, editComponentUnitOfMeasurement, editComponentTolerance, editComponentPhenomenon){
		$scope.validationRes=2;
		var editComponentDataType = {};
		var editComponentName = $scope.stream.componenti.element[index].nome;
		editComponentDataType.idDataType = $scope.stream.componenti.element[index].idDataType;
		editComponentDataType.dataType = $scope.stream.componenti.element[index].dataType;

		editComponentUnitOfMeasurement.measureUnitType = $scope.stream.componenti.element[index].measureUnitCategory;
		editComponentPhenomenon.phenomenonType = $scope.stream.componenti.element[index].phenomenonCategory;
		if(!editComponentTolerance) 
			editComponentTolerance = "0";
		editComponentSinceVersion = $scope.stream.componenti.element[index].sinceVersion;

		
		var component = validateComponent(index, editComponentName, editComponentUnitOfMeasurement, editComponentTolerance, editComponentPhenomenon, editComponentDataType, editComponentSinceVersion);
		
		if(component!=null){
			component.idComponente = $scope.stream.componenti.element[index].idComponente;
			$scope.stream.componenti.element[index] = component;
			$scope.editingComponentIndex = -1;
		}
		
		return false;
	};
	
	var validateComponent = function(index, componentName, componentUnitOfMeasurement, componentTolerance, componentPhenomenon, componentDataType, componentSinceVersion ){
		$scope.updateWarning = false;
		$scope.warningMessages = [];
		$scope.insertComponentErrors = [];
		var component = {};
		console.log("validateComponent componentName",componentName);
		console.log("validateComponent componentUnitOfMeasurement",componentUnitOfMeasurement);
		console.log("validateComponent componentTolerance",componentTolerance);
		console.log("validateComponent componentPhenomenon",componentPhenomenon);
		console.log("validateComponent componentDataType",componentDataType);
		console.log("validateComponent componentSinceVersion",componentSinceVersion);
		if(componentName!=null && componentName!=""){
			var found = false;
			
			if(componentName.indexOf(' ') >= 0){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_NOSPACE');
			} else if(componentName.match(Constants.VALIDATION_PATTERN_ACCENT)){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID');
			} else if(componentName.toLowerCase() === 'time'){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_RESERVED_WORD_TIME');
			} else {

				for (var int = 0; int < $scope.stream.componenti.element.length; int++) {
					if($scope.stream.componenti.element[int].nome == componentName && int!=index){
						found = true;
						break;
					}
				}
	
				if(!found){
					component.nome=componentName;
					
					if(componentUnitOfMeasurement){
						component.idMeasureUnit = componentUnitOfMeasurement.idMeasureUnit;
						component.measureUnit = componentUnitOfMeasurement.measureUnit;
						component.measureUnitCategory = componentUnitOfMeasurement.measureUnitType;
					}  
					component.tolerance = componentTolerance;

					if(componentPhenomenon){
						component.idPhenomenon = componentPhenomenon.idPhenomenon;
						component.phenomenon = componentPhenomenon.phenomenon;
						component.phenomenonCategory = componentPhenomenon.phenomenonType;
					}
					if(componentDataType){
						component.idDataType = componentDataType.idDataType;
						component.dataType = componentDataType.dataType;
					}
					component.sinceVersion = componentSinceVersion;
				} else {
					$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE');
				}
			}
		} else
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED');

		if(componentUnitOfMeasurement == null || componentUnitOfMeasurement == ""){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_UNIT_OF_MEASUREMENT_REQUIRED');
		}
		
		if(componentTolerance == null || componentTolerance == ""){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED');
		} else {
			if( !Helpers.util.isNumber(componentTolerance))
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_NOT_NUMBER');
		}

		if(componentPhenomenon == null || componentPhenomenon == ""){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_PHENOMENON_REQUIRED');
		}
		
		if(componentDataType == null || componentDataType == ""){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TYPE_REQUIRED');
		}

		console.log("newCompoent",component);
		if($scope.insertComponentErrors.length>0) 
			component = null;
		
		return component;
	};
	
	$scope.finishEditComponent = function(index){
		$scope.editingComponentIndex = index;
		return false;
	};

	$scope.addTag = function(newTag){
		console.log("addTag ",newTag);
		if(newTag){
			var found = false;	
			for (var int = 0; int < $scope.stream.streamTags.tag.length; int++) {
				var existingTag = $scope.stream.streamTags.tag[int];
				if(existingTag.tagCode ==newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.stream.streamTags.tag.push({"tagCode":newTag});
		}
		return false;

	};

	$scope.removeTag = function(index){
		$scope.stream.streamTags.tag.splice(index,1);
		return false;
	};
	
	$scope.addTenantSharing = function(newTenantSharing){
		console.log("addTenantSharing ",newTenantSharing);
		if(newTenantSharing){
			var found = false;	
			if(!$scope.stream.tenantsShare || $scope.stream.tenantsShare == null){
				$scope.stream.tenantsShare = {};
			}
			if(!$scope.stream.tenantsShare.tenantList || $scope.stream.tenantsShare.tenantList == null){
				$scope.stream.tenantsShare.tenantList = [];
			}
			
			for (var int = 0; int < $scope.stream.tenantsShare.tenantList.length; int++) {
				var existingTenantSharing = $scope.stream.tenantsShare.tenantList[int];
				console.log("existing",existingTenantSharing);
				if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
					console.log("found");
					found = true;
					break;
				}

			}
			if(!found){
				$scope.stream.tenantsShare.tenantList.push(
							{"idTenant":newTenantSharing.idTenant, 
								"tenantName": newTenantSharing.tenantName, 
								"tenantDescription": newTenantSharing.tenantDescription, 
								"tenantCode": newTenantSharing.tenantCode, 
								"isOwner": 0
							});
				console.log("added",$scope.stream.tenantsShare.tenantList );
			}
		}

		return false;
	};

	$scope.removeTenantSharing = function(index){
		$scope.stream.tenantsShare.tenantList.splice(index,1);
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
					$scope.stream.streamIcon = contents;
				}, 
				function(error){
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

	
	$scope.selectVirtualentity = function(){
		$scope.stream.codiceVirtualEntity = $scope.virtualentitycodeVirtualEntity;
	};

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
		
	$scope.updateStream = function() {
		console.log(" $scope.stream",  $scope.stream);

		if($scope.validationRes!=0 && $scope.stream.codiceVirtualEntity=="internal"){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			Helpers.util.scrollTo("validateMsg");
		}else{	
			$scope.validationRes=2;
			$scope.updateInfo = null;
			$scope.updateWarning = null;
			$scope.warningMessages = [];
			$scope.updateError = null;
	
			var newStream = new Object();
	
			newStream.stream =  $scope.stream;   
			if($scope.stream.codiceVirtualEntity=="internal")
				newStream.stream.internalQuery=  $scope.streamSiddhiQuery;
			
			newStream.stream.streamInternalChildren={};
			newStream.stream.streamInternalChildren.streamChildren=[];
			for(var i = 0; i< $scope.internalStreams.length; i++){
				newStream.stream.streamInternalChildren.streamChildren.push({
					"aliasChildStream":"input"+i,
					"idChildStream": $scope.internalStreams[i].idStream
				});
		}

		console.log("newStream", newStream);
		if(!$scope.stream.componenti.element || $scope.stream.componenti.element.length==0){
			$scope.updateWarning = true;
			$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
		}

		Helpers.util.scrollTo();
		if(!$scope.updateWarning){

			var promise   = fabricAPIservice.updateStream(newStream);

			promise.then(function(result) {
				$scope.updateInfo = {status: result.status};
				$scope.loadStream();

			}, function(result) {
				$scope.updateError = angular.fromJson(result.data);
				console.log("result.data ", result.data);
				if(result.data && result.data.error_code == "YuccaInternaApiFiledNameException")
					result.data.error_message = "MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID";
				$scope.loadStream();
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		};
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
	
	$scope.virtualEntitiesList = [];
	$scope.extra.inputTypeStream = 1;

	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
		console.log(response.virtualEntities.virtualEntity);
		for (var int = 0; int < response.virtualEntities.virtualEntity.length; int++) {
			var virtualentity = response.virtualEntities.virtualEntity[int];
			if(virtualentity.idTipoVe != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
				$scope.virtualEntitiesList.push(virtualentity);
			}else{
				$scope.virtualentityInternal=virtualentity;
			}

		}
	});

	$scope.checkTwitterQuery = function(){
		var twitterQuery = {};
		twitterQuery.twtQuery = $scope.stream.twtQuery;
		if($scope.stream.twtGeolocLat && $scope.stream.twtGeolocLat>0)
			twitterQuery.twtGeolocLat = $scope.stream.twtGeolocLat;
		if($scope.stream.twtGeolocLon && $scope.stream.twtGeolocLon>0)
			twitterQuery.twtGeolocLon = $scope.stream.twtGeolocLon;
		if($scope.stream.twtGeolocRadius && $scope.stream.twtGeolocRadius>0)
			twitterQuery.twtGeolocRadius = $scope.stream.twtGeolocRadius;
		twitterQuery.twtGeolocUnit = $scope.stream.twtUnit;
		twitterQuery.twtLang = $scope.stream.twtLang;
		twitterQuery.twtUserToken = $scope.stream.twtUserToken;
		twitterQuery.twtTokenSecret = $scope.stream.twtTokenSecret;
		twitterQuery.streamCode = $scope.stream.codiceVirtualEntity;
		twitterQuery.streamVersion = $scope.stream.deploymentVersion;
		twitterQuery.tenatcode = $scope.stream.tenantCode;
		twitterQuery.virtualEntityCode = $scope.stream.codiceVirtualEntity;
		
		 
		
		$scope.checkTwitterQueryResult = {};
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
	
	$scope.createStream = function(stream) {
		console.log("createStream", stream);
		//stream.fps = 0;
		//stream.saveData = 0;
		//stream.publishStream = 1;
		//stream.visibility = 'public';
		//stream.accettazionePrivacy=0;
		stream.accettazionePrivacy=$scope.accettazionePrivacy & $scope.accettazioneResponsability;

		var newStream = new Object();
		newStream.stream = stream;
//		if(!newStream.stream.twtGeolocLat || newStream.stream.twtGeolocLat==null || newStream.stream.twtGeolocLat=="") newStream.stream.twtGeolocLat = 0;
//		if(!newStream.stream.twtGeolocLon || newStream.stream.twtGeolocLon==null || newStream.stream.twtGeolocLon=="") newStream.stream.twtGeolocLon = 0;
//		if(!newStream.stream.twtGeolocRadius || newStream.stream.twtGeolocRadius==null || newStream.stream.twtGeolocRadius=="") newStream.stream.twtGeolocRadius = 0;
//		if(!newStream.stream.twtRatePercentage || newStream.stream.twtRatePercentage==null || newStream.stream.twtRatePercentage=="") newStream.stream.twtRatePercentage = 100;

		
		if($scope.validationRes!=0 && $scope.stream.codiceVirtualEntity=="internal"){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			$scope.goToComponents();
			//Helpers.util.scrollTo("validateMsg");
		}else{	

			if($scope.stream.codiceVirtualEntity=="internal")
				newStream.stream.internalQuery=  $scope.streamSiddhiQuery;
			newStream.stream.streamInternalChildren={};
			newStream.stream.streamInternalChildren.streamChildren=[];
			for(var i = 0; i< $scope.internalStreams.length; i++){
				newStream.stream.streamInternalChildren.streamChildren.push({
					"aliasChildStream":"input"+i,
					"idChildStream": $scope.internalStreams[i].idStream
				});
			}

			console.log("createStream - newStream", newStream);
	
			var promise   = fabricAPIservice.createStream($scope.tenantCode, stream.codiceVirtualEntity,  newStream);
			promise.then(function(result) {
				console.log("result qui ", result);
				$location.path('management/viewStream/'+$scope.tenantCode +'/'+stream.codiceVirtualEntity+'/'+newStream.stream.codiceStream);
			}, function(result) {
				$scope.creationError = angular.fromJson(result.data);
				if(result.data && result.data.error_code == "YuccaInternaApiFiledNameException"){
					result.data.error_message = "MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID";
					$scope.goToComponents();
				}
				console.log("result.data ", result.data);
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		}
	};	

	$scope.cloneStream = function(){
		console.log("cloneStream");
		sharedStream.setStream($scope.stream);
		$location.path('management/newStream/'+$scope.tenantCode);
	};
} ]);

