

appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info, filterFilter) {
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

	fabricAPIservice.getStreams($scope.tenantCode).success(function(response) {

		$scope.showLoading = false;

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].codiceTenant == $scope.tenantCode){
				if(!responseList[i].deploymentStatusCode || responseList[i].deploymentStatusCode == null)
					responseList[i].deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
				responseList[i].statusIcon = Helpers.stream.statusIcon(responseList[i]);
				
				if(responseList[i].streamIcon || responseList[i].streamIcon == null)
					responseList[i].streamIcon  = "img/stream-icon-default.png";

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
		return !$scope.statusFilter || keyword.test(stream.deploymentStatusDesc);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newCode", newCode);
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newStatus", newStatus);
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
	$scope.currentStep = 'register';
	$scope.wizardSteps = [{'name':'register', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'detail', 'style':''},
	                      {'name':'components', 'style':''},
	                      {'name':'share', 'style':''},
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
	$scope.goToRegister  = function(){ $scope.currentStep = 'register'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToDetail  = function(){ $scope.currentStep = 'detail';refreshWizardToolbar();};
	$scope.goToComponents  = function(){ $scope.currentStep = 'components';refreshWizardToolbar();};
	$scope.goToShare  = function(){$scope.currentStep = 'share';refreshWizardToolbar();};
	

} ]);

appControllers.controller('ManagementNewStreamCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.user = {};
	$scope.validationPatternNoSpace = Constants.VALIDATION_PATTERN_NO_SPACE;



	$scope.stream={};
	fabricAPIservice.getInfo().success(function(result) {
		console.debug("result managementnew stream", result);
		$scope.user = result.user;
		console.debug("info user", $scope.user);
		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.stream.nomeRichiedente=$scope.user.firstname;
			$scope.stream.cognomeRichiedente=$scope.user.lastname;
			$scope.stream.mailRichiedente=$scope.user.email;
		}
	});

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};



	$scope.virtualEntitiesList = [];


	//internal stream
	$scope.virtualentity=null;
//	$scope.internalStreams = [];
	$scope.inputTypeStream = 1;
//	$scope.streamSelectedItem=null;	
//	$scope.streamSiddhiQuery=null;
//	$scope.virtualentityInternal=null;

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



	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});


	$scope.newTag = null;
	$scope.addTag = function(){
		if($scope.newTag){
			var found = false;	
			for (var int = 0; int < $scope.stream.streamTags.tag.length; int++) {
				var existingTag = $scope.stream.streamTags.tag[int];
				if(existingTag.tagCode == $scope.newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.stream.streamTags.tag.push({"tagCode":$scope.newTag});
		}
		$scope.newTag = null;
		return false;

	};

	$scope.removeTag = function(index){
		$scope.stream.streamTags.tag.splice(index,1);
		return false;
	};


	$scope.creationError = null;

	$scope.accettazionePrivacy=0;
	$scope.accettazioneResponsability=0;

	$scope.createStream = function(virtualentity, stream) {
		stream.fps = 0;
		stream.saveData = 0;
		stream.publishStream = 1;
		stream.visibility = 'public';
		stream.accettazionePrivacy=0;
		stream.accettazionePrivacy=$scope.accettazionePrivacy & $scope.accettazioneResponsability;


		var newStream = new Object();
		newStream.stream = stream;

		var promise   = fabricAPIservice.createStream($scope.tenantCode, virtualentity.codeVirtualEntity,  newStream);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/editStream/'+$scope.tenantCode +'/'+virtualentity.codeVirtualEntity+'/'+newStream.stream.codiceStream);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	

	$scope.cancel = function(){
		$location.path('management/streams/'+$scope.tenantCode);
	};
} ]);



appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'info','$timeout',"$filter", 'readFilePreview', '$location',
                                                    function($scope, $routeParams, fabricAPIservice, info,$timeout,$filter,readFilePreview,$location) {
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

	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternNoSpace = Constants.VALIDATION_PATTERN_NO_SPACE;

	
	$scope.defaultQuery = Constants.DEFAULT_SIDDHI;

	$scope.internalStreams = [];
	$scope.inputTypeStream = 1;
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
			}else{
				$scope.validationRes=0;
			}
			console.debug(response);
		});
	};

	fabricAPIservice.getStreams().success(function(response) {

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].deploymentStatusCode && 	responseList[i].deploymentStatusCode == Constants.STREAM_STATUS_INST 
					&& (responseList[i].visibility && responseList[i].visibility=="public" || responseList[i].codiceTenant==$routeParams.tenant_code)){
				$scope.streamsList.push(responseList[i]);					
			}
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
			fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.entity_code, $routeParams.stream_code).success(function(response) {
				$scope.stream = response.streams.stream;
				
				
				
//				if($scope.stream.saveData==1){
//					$scope.saveData=true;
//				}else{
//					$scope.saveData=false;
//				}
	
//				if($scope.stream.publishStream==1){
//					$scope.publish=true;
//				}else{
//					$scope.publish=false;
//				}
				
				
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
			});
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
		}
	};


	$scope.loadStreamComponents = function(existingStream){
		fabricAPIservice.getStream(existingStream.codiceTenant,existingStream.codiceVirtualEntity,existingStream.codiceStream).success(function(response) {
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

//	$scope.newComponent = null;
//	$scope.newComponentUnitOfMeasurement = null;
//	$scope.newComponentPhenomenon = null;
//	$scope.newComponentDataType = null;

	$scope.addComponent = function(newComponent, newComponentUnitOfMeasurement, newComponentPhenomenon,newComponentDataType){
		$scope.validationRes=2;
		$scope.insertComponentErrors = [];
		if(newComponent && newComponent.nome && newComponent.nome!=null){
			var found = false;
			
			if(newComponent.nome.indexOf(' ') >= 0){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_NOSPACE');
			}
			else{

				for (var int = 0; int < $scope.stream.componenti.element.length; int++) {
					if($scope.stream.componenti.element[int].nome == newComponent.nome){
						found = true;
						break;
					}
				}
	
				if(!found){
					if(newComponentUnitOfMeasurement){
						newComponent.idMeasureUnit = newComponentUnitOfMeasurement.idMeasureUnit;
						newComponent.measureUnit = newComponentUnitOfMeasurement.measureUnit;
						newComponent.measureUnitCategory = newComponentUnitOfMeasurement.measureUnitType;
					}  
					if(newComponentPhenomenon){
						newComponent.idPhenomenon = newComponentPhenomenon.idPhenomenon;
						newComponent.phenomenon = newComponentPhenomenon.phenomenon;
						newComponent.phenomenonCategory = newComponentPhenomenon.phenomenonType;
					}
					if(newComponentDataType){
						newComponent.idDataType = newComponentDataType.idDataType;
						newComponent.dataType = newComponentDataType.dataType;
					}
	
				}
				else{
					$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE');
				}
			}
		}
		else
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED');

		console.log("newComponentDataType", newComponentDataType);
		if(newComponentDataType == null || newComponentDataType == ""){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TYPE_REQUIRED');
		}
		

		if(newComponent!=null) {
			console.log("newComponent.tolerance",newComponent.tolerance);
			if(newComponent.tolerance == null || newComponent.tolerance == ""){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED');
			}
			else{
				if( !Helpers.util.isNumber(newComponent.tolerance))
					$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_NOT_NUMBER');
			}
		}
		
		if($scope.insertComponentErrors.length==0){
			$scope.stream.componenti.element.push(newComponent);
			newComponent = null;
		}
		return false;
	};

	$scope.removeComponent = function(index){
		$scope.validationRes=2;
		$scope.stream.componenti.element.splice(index,1);
		return false;
	};

	//$scope.newTag = null;
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
//		$scope.newTag = null;
		return false;

	};

	$scope.removeTag = function(index){
		$scope.stream.streamTags.tag.splice(index,1);
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


	$scope.cancel = function(){
		$location.path('management/streams');
	};
	
	$scope.selectVirtualentity = function(){
		$scope.stream.codiceVirtualEntity = $scope.virtualentitycodeVirtualEntity;
	};

	$scope.save = function(){
		if($scope.isNewStream)
			$scope.createStream($scope.stream);
		else
			$scope.updateStream();
	};
	
	$scope.cancel = function(){    
		$location.path('management/streams/'+$scope.tenantCode);
	};
	
	$scope.updateStream = function() {
		
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
			newStream.stream.internalQuery=  $scope.streamSiddhiQuery;
			//	newStream.stream.internalQuery = $scope.streamSiddhiQuery;
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
	$scope.inputTypeStream = 1;

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
		
		if($scope.validationRes!=0 && $scope.stream.codiceVirtualEntity=="internal"){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			$scope.goToComponents();
			//Helpers.util.scrollTo("validateMsg");
		}else{	

			newStream.stream.internalQuery=  $scope.streamSiddhiQuery;
			//	newStream.stream.internalQuery = $scope.streamSiddhiQuery;
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
				console.log("result.data ", result.data);
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		}
	};	

} ]);

